import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { LoadingBar } from "quasar";

import { useAuthStore } from "@/stores/auth";
import routes from "./routes";
import {
  BUILD_PRODUCT_EDITION,
  lightRouteIsAllowed,
} from "@/config/productEdition";

// useful for importing router outside of vue components
// import {router} from "@/router"
export const router = new createRouter({
  routes,
  history: createWebHistory(process.env.VUE_ROUTER_BASE),
});

export default function (/* { store } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = new createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  });

  Router.beforeEach((to, from, next) => {
    if (to.fullPath !== from.fullPath) {
      LoadingBar.start();
    }

    const auth = useAuthStore();

    if (
      BUILD_PRODUCT_EDITION === "light" &&
      !lightRouteIsAllowed(to.path)
    ) {
      next({ name: auth.loggedIn ? "Dashboard" : "Login" });
    } else if (to.meta.requireAuth) {
      if (!auth.loggedIn) {
        auth.next = to.fullPath;
        next({
          name: "Login",
        });
      } else if (auth.isSspOnly && !to.path.startsWith("/ssp")) {
        next({
          name: "SSPDevices",
        });
      } else {
        next();
      }
    } else if (to.meta.requiresVisitor) {
      if (auth.loggedIn) {
        next({
          name: auth.isSspOnly ? "SSPDevices" : "Dashboard",
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  Router.afterEach(() => {
    LoadingBar.stop();
  });

  Router.onError(() => {
    LoadingBar.stop();
  });

  return Router;
}
