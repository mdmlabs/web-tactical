<template>
  <div class="mdm-card" style="height: 100%">
    <div class="mdm-card__header">
      <span>Network Topology</span>
      <div class="row items-center q-gutter-xs">
        <q-btn flat dense round icon="remove" size="xs" @click="zoomOut" />
        <q-btn flat dense round icon="add" size="xs" @click="zoomIn" />
      </div>
    </div>
    <div class="mdm-card__content" style="padding: 0; overflow: hidden; height: 350px">
      <svg
        :viewBox="`0 0 ${800 / zoom} ${400 / zoom}`"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Edges -->
        <line
          v-for="(edge, i) in edges"
          :key="'edge-' + i"
          :x1="getNodeById(edge.from)?.x || 0"
          :y1="getNodeById(edge.from)?.y || 0"
          :x2="getNodeById(edge.to)?.x || 0"
          :y2="getNodeById(edge.to)?.y || 0"
          :stroke="getEdgeColor(edge)"
          stroke-width="1.5"
          :stroke-dasharray="getNodeById(edge.to)?.status === 'offline' ? '4,4' : 'none'"
          opacity="0.6"
        />
        <!-- Nodes -->
        <g
          v-for="node in nodes"
          :key="node.id"
          :transform="`translate(${node.x}, ${node.y})`"
          class="topology-node"
        >
          <circle
            v-if="node.type === 'server'"
            r="18"
            :fill="node.status === 'online' ? 'var(--mdm-primary, #2563eb)' : 'var(--mdm-danger, #dc2626)'"
            opacity="0.15"
          />
          <circle
            v-if="node.type === 'server'"
            r="12"
            :fill="node.status === 'online' ? 'var(--mdm-primary, #2563eb)' : 'var(--mdm-danger, #dc2626)'"
          />
          <rect
            v-else-if="node.type === 'router'"
            x="-10" y="-10" width="20" height="20" rx="4"
            :fill="node.status === 'online' ? 'var(--mdm-success, #16a34a)' : 'var(--mdm-danger, #dc2626)'"
          />
          <polygon
            v-else-if="node.type === 'switch'"
            points="-10,0 0,-10 10,0 0,10"
            :fill="node.status === 'online' ? '#ca8a04' : 'var(--mdm-danger, #dc2626)'"
          />
          <circle
            v-else
            r="8"
            :fill="node.status === 'online' ? 'var(--mdm-success, #16a34a)' : '#9ca3af'"
          />
          <text
            dy="24"
            text-anchor="middle"
            :fill="'var(--mdm-text-secondary, #666)'"
            font-size="9"
          >
            {{ node.name.length > 14 ? node.name.slice(0, 12) + '..' : node.name }}
          </text>
        </g>
      </svg>
    </div>
    <!-- Legend -->
    <div class="row q-px-md q-py-sm q-gutter-md" style="border-top: 1px solid var(--mdm-border-light, #f0f0f0)">
      <div class="row items-center q-gutter-xs">
        <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="var(--mdm-primary, #2563eb)" /></svg>
        <span class="text-caption" style="color: var(--mdm-text-secondary)">Server</span>
      </div>
      <div class="row items-center q-gutter-xs">
        <svg width="12" height="12"><rect x="1" y="1" width="10" height="10" rx="2" fill="var(--mdm-success, #16a34a)" /></svg>
        <span class="text-caption" style="color: var(--mdm-text-secondary)">Router</span>
      </div>
      <div class="row items-center q-gutter-xs">
        <svg width="12" height="12"><polygon points="1,6 6,1 11,6 6,11" fill="#ca8a04" /></svg>
        <span class="text-caption" style="color: var(--mdm-text-secondary)">Switch</span>
      </div>
      <div class="row items-center q-gutter-xs">
        <svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="var(--mdm-success, #16a34a)" /></svg>
        <span class="text-caption" style="color: var(--mdm-text-secondary)">Agent</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const zoom = ref(1);

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.2, 2);
}
function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.2, 0.5);
}

// Build nodes from the Vuex tree data
const nodes = computed(() => {
  const tree = store.state.tree || [];
  const result = [];
  const totalWidth = 800;

  // Server node (MDM server)
  result.push({
    id: "main-server",
    type: "server",
    name: "MDM Server",
    status: "online",
    x: totalWidth / 2,
    y: 40,
  });

  // Clients as routers
  const clients = tree;
  const clientSpacing = totalWidth / (clients.length + 1);
  clients.forEach((client, i) => {
    const clientId = `client-${client.id || i}`;
    result.push({
      id: clientId,
      type: "router",
      name: client.label || `Client ${i + 1}`,
      status: "online",
      x: clientSpacing * (i + 1),
      y: 130,
    });

    // Sites as switches
    const sites = client.children || [];
    if (sites.length > 0) {
      const siteGroupWidth = clientSpacing * 0.8;
      const siteSpacing = siteGroupWidth / (sites.length + 1);
      const siteBaseX = clientSpacing * (i + 1) - siteGroupWidth / 2;
      sites.forEach((site, j) => {
        const siteId = `site-${site.id || `${i}-${j}`}`;
        const agentCount = site.site?.agent_count || 0;
        result.push({
          id: siteId,
          type: "switch",
          name: site.label || `Site ${j + 1}`,
          status: agentCount > 0 ? "online" : "offline",
          x: siteBaseX + siteSpacing * (j + 1),
          y: 230,
          parentClient: clientId,
        });

        // Agent nodes
        const siteChildren = site.children || [];
        const agentNodes = siteChildren.filter(
          (c) => c.raw && String(c.raw).startsWith("Agent|"),
        );
        if (agentNodes.length > 0) {
          const agentGroupWidth = siteSpacing * 0.8;
          const agentSpacing = agentGroupWidth / (agentNodes.length + 1);
          const agentBaseX =
            siteBaseX + siteSpacing * (j + 1) - agentGroupWidth / 2;
          agentNodes.forEach((agent, k) => {
            result.push({
              id: `agent-${agent.id || `${i}-${j}-${k}`}`,
              type: "agent",
              name: agent.label || `Agent ${k + 1}`,
              status: agent.color === "positive" ? "online" : "offline",
              x: agentBaseX + agentSpacing * (k + 1),
              y: 330,
              parentSite: siteId,
            });
          });
        }
      });
    }
  });

  // Fallback if no tree data
  if (result.length <= 1) {
    return getStaticTopology();
  }

  return result;
});

const edges = computed(() => {
  const result = [];
  nodes.value.forEach((node) => {
    if (node.type === "router") {
      result.push({ from: "main-server", to: node.id });
    } else if (node.type === "switch" && node.parentClient) {
      result.push({ from: node.parentClient, to: node.id });
    } else if (node.type === "agent" && node.parentSite) {
      result.push({ from: node.parentSite, to: node.id });
    }
  });
  return result;
});

function getNodeById(id) {
  return nodes.value.find((n) => n.id === id);
}

function getEdgeColor(edge) {
  const target = getNodeById(edge.to);
  return target?.status === "online"
    ? "var(--mdm-success, #16a34a)"
    : "var(--mdm-danger, #dc2626)";
}

function getStaticTopology() {
  return [
    {
      id: "main-server",
      type: "server",
      name: "MDM Server",
      status: "online",
      x: 400,
      y: 40,
    },
    {
      id: "router-1",
      type: "router",
      name: "Router 1",
      status: "online",
      x: 200,
      y: 130,
    },
    {
      id: "router-2",
      type: "router",
      name: "Router 2",
      status: "online",
      x: 600,
      y: 130,
    },
    {
      id: "switch-1",
      type: "switch",
      name: "Switch 1",
      status: "online",
      x: 100,
      y: 230,
    },
    {
      id: "switch-2",
      type: "switch",
      name: "Switch 2",
      status: "online",
      x: 300,
      y: 230,
    },
    {
      id: "switch-3",
      type: "switch",
      name: "Switch 3",
      status: "online",
      x: 500,
      y: 230,
    },
    {
      id: "switch-4",
      type: "switch",
      name: "Switch 4",
      status: "offline",
      x: 700,
      y: 230,
    },
  ];
}
</script>

<style scoped>
.topology-node {
  cursor: pointer;
  transition: transform 0.2s;
}
.topology-node:hover {
  transform: scale(1.1);
}
</style>
