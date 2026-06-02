<template>
  <div class="sts-wrap">
    <div
      class="sts-field"
      :class="{ 'sts-field--open': open }"
    >
      <template v-if="modelValue.length === 0">
        <span class="sts-placeholder">Select categories</span>
      </template>
      <template v-else>
        <div class="sts-chips">
          <q-chip
            v-for="id in modelValue"
            :key="id"
            dense
            removable
            color="blue-1"
            text-color="blue-9"
            class="sts-chip"
            @remove.stop="remove(id)"
          >
            {{ nameOf(id) }}
          </q-chip>
        </div>
      </template>
      <q-icon
        :name="open ? 'expand_less' : 'expand_more'"
        size="18px"
        class="sts-arrow"
      />

      <q-menu
        v-model="open"
        fit
        class="sts-menu"
      >
      <!-- Search -->
      <div class="sts-search-row">
        <q-input
          v-model="q"
          dense
          borderless
          placeholder="Filter…"
          class="sts-search"
          @keydown.stop
        >
          <template #prepend>
            <q-icon name="search" size="15px" color="grey-6" />
          </template>
          <template #append>
            <q-icon
              v-if="q"
              name="close"
              size="13px"
              class="cursor-pointer text-grey-6"
              @click.stop="q = ''"
            />
          </template>
        </q-input>
      </div>

      <q-separator />

      <!-- Tree -->
      <q-scroll-area style="height: 280px">
        <q-tree
          v-if="visibleNodes.length"
          :nodes="visibleNodes"
          node-key="id"
          v-model:ticked="innerValue"
          tick-strategy="strict"
          default-expand-all
          dense
          class="sts-tree"
        >
          <template #default-header="{ node }">
            <div class="sts-node">
              <q-icon
                :name="node.children?.length ? 'folder_open' : 'language'"
                :color="node.children?.length ? 'amber-7' : 'blue-5'"
                size="14px"
                class="q-mr-xs"
              />
              {{ node.label }}
            </div>
          </template>
        </q-tree>
        <div v-else class="sts-empty">No categories match</div>
      </q-scroll-area>

      <q-separator />

      <!-- Footer -->
      <div class="sts-footer">
        <span class="sts-count">{{ modelValue.length }} selected</span>
        <q-btn
          flat dense no-caps size="sm"
          label="Clear"
          :disable="modelValue.length === 0"
          @click="$emit('update:modelValue', [])"
        />
        <q-btn
          flat dense no-caps size="sm"
          color="primary"
          label="Done"
          @click="open = false"
        />
      </div>
      </q-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface FlatSite {
  id: number;
  name: string;
  ancestors?: string | null;
}

interface Node {
  id: number;
  label: string;
  children?: Node[];
}

const props = defineProps<{
  modelValue: number[];
  sites: FlatSite[];
}>();
const emit = defineEmits<{ (e: "update:modelValue", v: number[]): void }>();

const open = ref(false);
const q = ref("");

watch(open, (v) => { if (!v) q.value = ""; });

// Build tree from flat list via ancestors path
const tree = computed<Node[]>(() => {
  const map = new Map<string, Node>();

  const sorted = [...props.sites].sort((a, b) => {
    const ad = a.ancestors ? a.ancestors.split(" / ").length : 0;
    const bd = b.ancestors ? b.ancestors.split(" / ").length : 0;
    return ad - bd;
  });

  for (const s of sorted) {
    const path = s.ancestors ? `${s.ancestors} / ${s.name}` : s.name;
    map.set(path, { id: s.id, label: s.name, children: [] });
  }

  const roots: Node[] = [];
  for (const s of sorted) {
    const path = s.ancestors ? `${s.ancestors} / ${s.name}` : s.name;
    const node = map.get(path)!;
    if (s.ancestors) {
      const parent = map.get(s.ancestors);
      (parent ?? { children: roots }).children!.push(node);
    } else {
      roots.push(node);
    }
  }

  (function trim(nodes: Node[]) {
    for (const n of nodes) {
      if (!n.children?.length) delete n.children;
      else trim(n.children);
    }
  })(roots);

  return roots;
});

// Filter tree by search query
function filterTree(nodes: Node[], lq: string): Node[] {
  return nodes
    .map((n) => {
      const kids = filterTree(n.children ?? [], lq);
      if (n.label.toLowerCase().includes(lq) || kids.length) {
        return { ...n, children: kids.length ? kids : undefined };
      }
      return null;
    })
    .filter(Boolean) as Node[];
}

const visibleNodes = computed(() =>
  q.value ? filterTree(tree.value, q.value.toLowerCase()) : tree.value,
);

// id → name lookup for chips
const nameMap = computed(() => {
  const m = new Map<number, string>();
  for (const s of props.sites) m.set(s.id, s.name);
  return m;
});
const nameOf = (id: number) => nameMap.value.get(id) ?? String(id);

const innerValue = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const remove = (id: number) =>
  emit("update:modelValue", props.modelValue.filter((v) => v !== id));
</script>

<style scoped lang="scss">
.sts-wrap { position: relative; }

.sts-field {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 4px 8px 4px 12px;
  border: 1px solid #c4c9d0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s;
  gap: 4px;

  &:hover { border-color: #9aa0a9; }
  &--open {
    border-color: var(--q-primary);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.12);
  }
}

.sts-placeholder { flex: 1; font-size: 14px; color: #9aa0a9; }

.sts-chips { flex: 1; display: flex; flex-wrap: wrap; gap: 2px; }
.sts-chip { font-size: 12px; height: 22px; }

.sts-arrow { flex-shrink: 0; color: #9aa0a9; }

.sts-menu { border-radius: 6px; }

.sts-search-row { padding: 6px 8px; }
.sts-search { font-size: 13px; }

.sts-tree { padding: 6px 4px; font-size: 13px; }
.sts-node { display: flex; align-items: center; font-size: 13px; }

.sts-empty { text-align: center; padding: 40px 0; font-size: 13px; color: #9aa0a9; }

.sts-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
}
.sts-count { flex: 1; font-size: 12px; color: #69707d; }
</style>
