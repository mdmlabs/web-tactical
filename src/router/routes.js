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
        path: "agents/map",
        name: "AgentMap",
        component: () => import("@/views/AgentMapView.vue"),
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
      // {
      //   path: "/files",
      //   name: "FileManagement",
      //   component: () => import("@/views/FileManagementView.vue"),
      //   meta: {
      //     requireAuth: true,
      //   },
      // },
      {
        path: "/updates",
        name: "AgentUpdates",
        component: () => import("@/agent-updates/views/AgentUpdatesView.vue"),
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
      {
        path: "/self-service",
        name: "SelfServicePortal",
        component: () => import("@/views/selfservice/SelfServicePortalView.vue"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/security",
        component: () => import("@/views/security/SecurityLayout.vue"),
        meta: { requireAuth: true },
        children: [
          {
            path: "",
            redirect: "/security/agents",
          },
          {
            path: "agents",
            name: "SecurityAgents",
            component: () =>
              import("@/views/security/SecurityAgents.vue"),
          },
          {
            path: "agents/:hostname",
            name: "AgentSecurityDetail",
            component: () =>
              import("@/views/security/AgentSecurityDetail.vue"),
            props: true,
          },
          {
            path: "agents/:agentId/detail",
            name: "AgentEndpointDetail",
            component: () =>
              import("@/views/security/AgentEndpointDetail.vue"),
            props: true,
          },
          {
            path: "discover",
            name: "SecurityDiscover",
            component: () =>
              import("@/views/security/DiscoverView.vue"),
          },
          {
            path: "alerts",
            name: "SecurityAlerts",
            component: () =>
              import("@/views/security/AlertingView.vue"),
          },
          {
            path: "groups",
            name: "SecurityGroups",
            component: () =>
              import("@/views/security/SecurityGroups.vue"),
          },
          {
            path: "groups/:groupName",
            name: "SecurityGroupDetail",
            component: () =>
              import("@/views/security/SecurityGroupDetail.vue"),
            props: true,
          },
          {
            path: "it-hygiene",
            name: "ITHygiene",
            component: () =>
              import("@/views/security/ITHygieneView.vue"),
          },
          {
            path: "fim",
            name: "SecurityFIM",
            component: () =>
              import("@/views/security/FIMView.vue"),
          },
          {
            path: "threat-hunting",
            name: "ThreatHunting",
            component: () =>
              import("@/views/security/ThreatHuntingView.vue"),
          },
          // {
          //   path: "alerting",
          //   name: "SecurityAlerting",
          //   component: () =>
          //     import("@/views/security/AlertingView.vue"),
          // },
          {
            path: "sca",
            redirect: "/security/compliance/sca",
          },
          {
            path: "compliance/:framework?",
            name: "ComplianceHub",
            component: () =>
              import("@/views/security/ComplianceHub.vue"),
          },
          {
            path: "vulnerability-detection",
            name: "VulnerabilityDetection",
            component: () =>
              import("@/views/security/VulnerabilityDetection.vue"),
          },
          {
            path: "reports",
            name: "SecurityReports",
            component: () =>
              import("@/views/security/reporting/ReportsListView.vue"),
          },
          {
            path: "reporting",
            name: "SecurityReporting",
            component: () =>
              import("@/views/security/reporting/ReportingHubView.vue"),
          },
          {
            path: "reporting/reports/:id",
            name: "SecurityReportingInstanceDetails",
            component: () =>
              import("@/views/security/reporting/ReportDetailsView.vue"),
            props: { kind: "report" },
          },
          {
            path: "reporting/definitions/:id",
            name: "SecurityReportingDefinitionDetails",
            component: () =>
              import("@/views/security/reporting/ReportDetailsView.vue"),
            props: { kind: "definition" },
          },
        ],
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
