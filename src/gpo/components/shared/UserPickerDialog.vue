<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="slide-up"
    transition-hide="slide-down"
    position="standard"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="user-picker-dialog">
      <q-card-section class="user-picker-dialog__header">
        <div class="row items-center no-wrap">
          <q-icon name="person" size="28px" color="primary" class="q-mr-sm" />
          <div class="col">
            <div class="text-h6">{{ title }}</div>
            <div v-if="subtitle" class="text-caption text-grey-7 ellipsis">
              {{ subtitle }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-xs" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="user-picker-dialog__body">
        <q-input
          :model-value="search"
          outlined
          dense
          clearable
          debounce="200"
          placeholder="Search by name..."
          class="q-mb-md"
          @update:model-value="onSearchUpdate"
          @clear="onSearchUpdate('')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div ref="listEl" class="user-picker-dialog__list">
          <div v-if="optionsLoading" class="user-picker-dialog__empty">
            <q-spinner-dots color="primary" size="34px" />
            <div class="text-body2 text-grey-7 q-mt-sm">Loading users...</div>
          </div>

          <div
            v-else-if="filteredRows.length === 0"
            class="user-picker-dialog__empty"
          >
            <q-icon name="person_off" size="42px" color="grey-4" />
            <div class="text-body2 text-grey-6 q-mt-sm">
              {{ search.trim() ? "No matches" : "No users" }}
            </div>
          </div>

          <q-virtual-scroll
            v-else
            :key="virtualKey"
            :items="filteredRows"
            :virtual-scroll-item-size="64"
            :scroll-target="scrollTarget"
            class="user-picker-dialog__virtual"
          >
            <template #default="{ item }">
              <q-item
                clickable
                v-ripple
                :active="item.samAccountName === selectedSam"
                active-class="user-picker-dialog__item--active"
                @click="selectRow(item)"
              >
                <q-item-section avatar>
                  <q-icon :name="itemIcon" size="24px" class="text-grey-7" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium ellipsis">
                    {{ item.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
            </template>
          </q-virtual-scroll>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          :label="confirmLabel"
          :loading="loading"
          :disable="!selectedSam"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

export interface UserPickerRow {
  id: string;
  label: string;
  samAccountName: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    subtitle?: string;
    confirmLabel?: string;
    itemIcon?: string;
    options: UserPickerRow[];
    optionsLoading: boolean;
    loading?: boolean;
  }>(),
  {
    title: "Select user",
    subtitle: "",
    confirmLabel: "Select",
    itemIcon: "person",
    loading: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [samAccountName: string];
}>();

const listEl = ref<HTMLElement | null>(null);
const scrollTarget = computed(() => listEl.value ?? undefined);
const virtualKey = computed(() => (scrollTarget.value ? "ready" : "init"));
const search = ref("");
const selected = ref<UserPickerRow | null>(null);

watch(
  () => props.modelValue,
  () => {
    search.value = "";
    selected.value = null;
  },
);

function onSearchUpdate(val: unknown) {
  search.value = String(val ?? "");
}

const filteredRows = computed(() => {
  const s = search.value.trim().toLowerCase();
  if (!s) return props.options;
  return props.options.filter((u) => {
    const label = u.label?.toLowerCase() ?? "";
    const sam = u.samAccountName?.toLowerCase() ?? "";
    const id = u.id?.toLowerCase() ?? "";
    return label.includes(s) || sam.includes(s) || id.includes(s);
  });
});

const selectedSam = computed(() => selected.value?.samAccountName?.trim() || "");

function selectRow(row: UserPickerRow) {
  selected.value = row;
}

function submit() {
  if (!selectedSam.value) return;
  emit("select", selectedSam.value);
}
</script>

<style scoped>
.user-picker-dialog {
  width: min(920px, 96vw);
  max-width: 96vw;
  max-height: min(780px, 88vh);
  display: flex;
  flex-direction: column;
}

.user-picker-dialog__header {
  padding: 14px 16px;
}

.user-picker-dialog__body {
  padding: 16px;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.user-picker-dialog__list {
  flex: 1 1 auto;
  min-height: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  overflow: auto;
}

.user-picker-dialog__virtual {
  height: 100%;
  overflow: hidden;
}

.user-picker-dialog__empty {
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px;
  text-align: center;
}

.user-picker-dialog__item--active {
  background: rgba(0, 0, 0, 0.04);
}
.text-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

