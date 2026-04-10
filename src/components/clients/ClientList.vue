<template>
  <q-card class="client-list-card">
    <q-bar>
      <q-icon name="people" />
      Client List
      <q-space />
      <q-badge v-if="clStore.hiddenCount > 0" color="warning" class="q-mr-sm">
        {{ clStore.hiddenCount }} hidden
      </q-badge>
    </q-bar>

    <div class="q-pa-md">
      <!-- Search + controls -->
      <div class="row q-gutter-sm q-mb-md items-center">
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Search clients..."
          class="col"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          v-if="!clStore.showHiddenMode"
          dense
          flat
          no-caps
          icon="visibility"
          :label="`Show hidden (${clStore.hiddenCount})`"
          :disable="clStore.hiddenCount === 0"
          @click="clStore.toggleShowHidden()"
        />
        <q-btn
          v-else
          dense
          flat
          no-caps
          icon="visibility_off"
          label="Show active"
          @click="clStore.toggleShowHidden()"
        />

        <q-btn
          v-if="clStore.hiddenCount > 0"
          dense
          flat
          no-caps
          icon="restart_alt"
          label="Restore all"
          color="positive"
          @click="clStore.showAll()"
        />

        <q-btn
          v-if="filteredVisible.length > 0 && search"
          dense
          flat
          no-caps
          icon="visibility_off"
          label="Hide found"
          color="negative"
          @click="hideSearchResults"
        />
      </div>

      <!-- Active clients list -->
      <q-list v-if="!clStore.showHiddenMode" dense bordered separator class="rounded-borders">
        <TransitionGroup name="client-item">
          <q-item
            v-for="node in filteredVisible"
            :key="node.raw"
            class="client-row"
          >
            <q-item-section avatar>
              <q-icon name="business" :color="node.color || 'primary'" />
            </q-item-section>
            <q-item-section>{{ node.label }}</q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                round
                icon="visibility_off"
                size="sm"
                color="grey"
                @click="clStore.hideClient(node.raw)"
              >
                <q-tooltip>Hide</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </TransitionGroup>

        <q-item v-if="filteredVisible.length === 0">
          <q-item-section class="text-grey text-center">
            {{ search ? "No clients match your search" : "All clients are hidden" }}
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Hidden clients list -->
      <q-list v-else dense bordered separator class="rounded-borders">
        <TransitionGroup name="client-item">
          <q-item
            v-for="node in filteredHidden"
            :key="node.raw"
            class="client-row"
          >
            <q-item-section avatar>
              <q-icon name="business" color="grey" />
            </q-item-section>
            <q-item-section class="text-grey">{{ node.label }}</q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                round
                icon="visibility"
                size="sm"
                color="positive"
                @click="clStore.showClient(node.raw)"
              >
                <q-tooltip>Restore</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </TransitionGroup>

        <q-item v-if="filteredHidden.length === 0">
          <q-item-section class="text-grey text-center">
            {{ search ? "No hidden clients match your search" : "No hidden clients" }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useClientsStore } from "@/stores/clients";
import { useClientListStore } from "@/stores/clientList";

interface TreeNode {
  label: string;
  raw: string;
  color?: string;
  [key: string]: unknown;
}

const clientsStore = useClientsStore();
const clStore = useClientListStore();

const search = ref("");

const filteredVisible = computed(() => {
  const nodes = (clientsStore.clientsTree as TreeNode[]).filter(
    (n) => !clStore.isHidden(n.raw || ""),
  );
  if (!search.value) return nodes;
  const q = search.value.toLowerCase();
  return nodes.filter((n) => n.label.toLowerCase().includes(q));
});

const filteredHidden = computed(() => {
  const nodes = (clientsStore.clientsTree as TreeNode[]).filter((n) =>
    clStore.isHidden(n.raw || ""),
  );
  if (!search.value) return nodes;
  const q = search.value.toLowerCase();
  return nodes.filter((n) => n.label.toLowerCase().includes(q));
});

function hideSearchResults() {
  const raws = filteredVisible.value.map((n) => n.raw);
  clStore.hideMultiple(raws);
  search.value = "";
}
</script>

<style scoped>
.client-list-card {
  min-width: 400px;
  max-width: 600px;
}

/* TransitionGroup animations */
.client-item-enter-active,
.client-item-leave-active {
  transition: all 0.3s ease;
}

.client-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.client-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.client-item-move {
  transition: transform 0.3s ease;
}

.client-row {
  transition: background-color 0.2s ease;
}
</style>
