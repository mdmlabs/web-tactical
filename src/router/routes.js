import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "MainLayout",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "agents/:agent_id",
        name: "Agent",
        component: () => import("@/views/AgentView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/gpo",
        name: "GPOManager",
        component: () => import("@/gpo/views/GPOManagerView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/files",
        name: "FileManagement",
        component: () => import("@/views/FileManagementView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/resources",
        name: "Resources",
        component: () => import("@/resources/views/ResourcesView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/resources/scripts/new",
        name: "CreateScript",
        component: () => import("@/resources/views/CreateScriptView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/resources/apps/new",
        name: "CreateApp",
        component: () => import("@/resources/views/CreateAppView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/resources/books/new",
        name: "CreateBook",
        component: () => import("@/resources/views/CreateBookView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/resources/images/new",
        name: "CreateImage",
        component: () => import("@/resources/views/CreateImageView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/resources/certificates/new",
        name: "CreateCertificate",
        component: () => import("@/resources/views/CreateCertificateView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/policies",
        name: "Policies",
        component: () => import("@/policies/views/PoliciesView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/policies/:id",
        name: "PolicyDetail",
        component: () => import("@/policies/views/PolicyDetailView.vue"),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/setup",
    name: "InitialSetup",
    component: () => import("@/views/InitialSetup.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/takecontrol/:agent_id",
    name: "TakeControl",
    component: () => import("@/views/TakeControl.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/webvnc/:agent_id/:port",
    name: "VNC",
    component: () => import("@/views/WebVNC.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/webterm",
    name: "WebTerm",
    component: () => import("@/views/WebTerminal.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/remotebackground/:agent_id",
    name: "RemoteBackground",
    component: () => import("@/views/RemoteBackground.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "/expired",
    name: "SessionExpired",
    component: () => import("@/views/SessionExpired.vue"),
    beforeEnter: (_, from) => {
      const auth = useAuthStore();
      auth.next = from.fullPath;
    },
  },
  { path: "/:catchAll(.*)", component: () => import("@/views/NotFound.vue") },
];

export default routes;
