import { defineStore } from "pinia";

import axios from "axios";

interface CheckCredentialsRequest {
  username: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface CheckCredentialsResponse {
  token: string;
  username: string;
  name?: string | null;
  portal?: string | null;
  user_type?: string | null;
  block_dashboard_login?: boolean;
}

const AUTH_KEYS = [
  "access_token",
  "user_name",
  "name",
  "sso_provider",
  "provider_id",
  "next",
  "portal",
  "user_type",
  "block_dashboard_login",
] as const;

function decodeStoredValue(value: string | null): string | null {
  if (value === null || value === "null" || value === "undefined") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed === null || parsed === undefined ? null : String(parsed);
  } catch {
    return value;
  }
}

function readAuthValue(key: (typeof AUTH_KEYS)[number]): string | null {
  return decodeStoredValue(localStorage.getItem(key)) ?? decodeStoredValue(sessionStorage.getItem(key));
}

function writeAuthValue(key: (typeof AUTH_KEYS)[number], value: string | null, remember: boolean) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
  if (value === null || value === undefined) return;

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(key, value);
}

function clearAuthStorage() {
  for (const key of AUTH_KEYS) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    username: readAuthValue("user_name"),
    name: readAuthValue("name"),
    token: readAuthValue("access_token"),
    ssoLoginProvider: readAuthValue("sso_provider"),
    provider_id: readAuthValue("provider_id"),
    next: readAuthValue("next"),
    portal: readAuthValue("portal"),
    userType: readAuthValue("user_type"),
    blockDashboardLogin: readAuthValue("block_dashboard_login") === "true",
    rememberMe: localStorage.getItem("remember_me") === "true",
  }),
  getters: {
    loggedIn: (state) => {
      return state.token !== null;
    },
    displayName: (state) => {
      return state.name ? state.name : state.username;
    },
    isSspOnly: (state) => {
      return state.portal === "ssp" || String(state.userType || "").toUpperCase() === "USER" || state.blockDashboardLogin;
    },
  },
  actions: {
    async checkCredentials(
      credentials: CheckCredentialsRequest,
      remember = false,
    ): Promise<CheckCredentialsResponse> {
      const { data } = await axios.post("/v2/checkcreds/", credentials);
      this.persistSession(data, remember);
      return data;
    },
    async login(credentials: LoginRequest, remember = false) {
      const { data } = await axios.post("/v2/login/", credentials);
      this.persistSession(data, remember);
      this.ssoLoginProvider = null;
      writeAuthValue("sso_provider", null, remember);

      return data;
    },
    persistSession(data: CheckCredentialsResponse, remember: boolean) {
      this.username = data.username;
      this.name = data.name ?? null;
      this.token = data.token;
      this.portal = data.portal ?? null;
      this.userType = data.user_type ?? null;
      this.blockDashboardLogin = Boolean(data.block_dashboard_login);
      this.rememberMe = remember;
      localStorage.setItem("remember_me", remember ? "true" : "false");
      writeAuthValue("user_name", this.username, remember);
      writeAuthValue("name", this.name, remember);
      writeAuthValue("access_token", this.token, remember);
      writeAuthValue("portal", this.portal, remember);
      writeAuthValue("user_type", this.userType, remember);
      writeAuthValue("block_dashboard_login", this.blockDashboardLogin ? "true" : "false", remember);
    },
    async logout() {
      if (this.token !== null) {
        try {
          await axios.post("/logout/");
        } catch {}
      }
      this.token = null;
      this.username = null;
      this.name = null;
      this.ssoLoginProvider = null;
      this.provider_id = null;
      this.next = null;
      this.portal = null;
      this.userType = null;
      this.blockDashboardLogin = false;
      this.rememberMe = false;
      localStorage.removeItem("remember_me");
      clearAuthStorage();
    },
  },
});
