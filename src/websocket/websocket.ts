import { ref, watch } from "vue";
import { UseWebSocketReturn, useWebSocket } from "@vueuse/core";
import { getBackendUrl } from "@/boot/axios";
import { useAuthStore } from "@/stores/auth";

export function getWSUrl(path: string, token: string | null) {
  // используем getBackendUrl() вместо getBaseUrl(), так как WebSocket
  // не может работать через HTTP прокси и нужен реальный URL бэкенда
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    console.error(
      "[WebSocket] Не удалось определить URL бэкенда для WebSocket подключения",
    );
    throw new Error("Не удалось определить URL для WebSocket подключения");
  }

  // вытаскиваем протокол и хоста из URL
  const urlMatch = backendUrl.match(/^(https?):\/\/(.+)$/);
  let url: string;
  let proto: string;

  if (urlMatch && urlMatch[2]) {
    proto = urlMatch[1] === "https" ? "wss" : "ws";
    url = urlMatch[2];
  } else {
    const parts = backendUrl.split("://");
    if (parts.length > 1 && parts[1]) {
      url = parts[1];
      proto = parts[0] === "https" ? "wss" : "ws";
    } else {
      // последний fallback - используем window.location
      if (typeof window !== "undefined") {
        proto = window.location.protocol === "https:" ? "wss" : "ws";
        url = window.location.host;
      } else {
        throw new Error("Не удалось определить URL для WebSocket подключения");
      }
    }
  }

  // для продакшина или Docker используем wss
  if (process.env.NODE_ENV === "production" || process.env.DOCKER_BUILD) {
    proto = "wss";
  }

  const wsUrl = `${proto}://${url}/ws/${path}/?access_token=${token}`;
  console.log(
    "[WebSocket] Подключение к:",
    wsUrl.replace(/access_token=[^&]+/, "access_token=***"),
  );

  return wsUrl;
}

interface WSReturn {
  action: string;
  data: unknown;
}

let WSConnection: UseWebSocketReturn<string> | undefined = undefined;
export function useDashWSConnection() {
  const auth = useAuthStore();

  if (WSConnection === undefined) {
    const url = getWSUrl("dashinfo", auth.token);
    WSConnection = useWebSocket(url, {
      autoReconnect: true,
    });
  }

  const { status, data, send, open, close } = WSConnection;
  const parsedData = ref<WSReturn>({ action: "", data: {} });

  watch(data, (newValue) => {
    if (newValue) parsedData.value = JSON.parse(newValue);
  });

  function closeConnection() {
    WSConnection = undefined;
    close();
  }

  return {
    status,
    data: parsedData,
    send,
    open,
    close: closeConnection,
  };
}

let WSCliConnection: UseWebSocketReturn<string> | undefined = undefined;
export function useCliWSConnection() {
  const auth = useAuthStore();

  if (WSCliConnection === undefined) {
    const url = getWSUrl("trmmcli", auth.token);
    WSCliConnection = useWebSocket(url);
  }

  const { status, data, send, open, close } = WSCliConnection;
  const parsedData = ref<WSReturn>({ action: "", data: {} });

  watch(data, (newValue) => {
    if (newValue) parsedData.value = JSON.parse(newValue);
  });

  function closeConnection() {
    WSCliConnection = undefined;
    close();
  }

  return {
    status,
    data: parsedData,
    send,
    open,
    close: closeConnection,
  };
}
