<template>
  <q-select
    v-model="inner"
    :options="filteredOptions"
    option-label="label"
    option-value="value"
    use-input input-debounce="0"
    emit-value map-options
    @filter="onFilter"
    v-bind="$attrs"
  >
    <!-- Rich option rendering: hostname · shortId · last_user — with copy button -->
    <template #option="scope">
      <q-item v-bind="scope.itemProps" class="agent-picker-opt">
        <q-item-section>
          <q-item-label>
            <strong>{{ scope.opt.hostname || scope.opt.label }}</strong>
            <span v-if="scope.opt.shortId" class="text-caption text-grey q-ml-sm agent-picker-mono">
              · {{ scope.opt.shortId }}
            </span>
            <span v-if="scope.opt.online === true" class="q-ml-xs" :title="$t('devicemanagement.components.AgentPicker.c3e839')">
              <q-icon name="fiber_manual_record" color="positive" size="8px" />
            </span>
            <span v-else-if="scope.opt.online === false" class="q-ml-xs" :title="$t('devicemanagement.components.AgentPicker.e01fa7')">
              <q-icon name="fiber_manual_record" color="grey" size="8px" />
            </span>
          </q-item-label>
          <q-item-label caption v-if="scope.opt.subline">
            {{ scope.opt.subline }}
          </q-item-label>
        </q-item-section>
        <q-item-section side v-if="scope.opt.value">
          <q-btn flat dense round icon="content_copy" size="xs"
                 @click.stop.prevent="copyId(scope.opt.value, scope.opt.hostname)"
                 :title="$t('devicemanagement.components.AgentPicker.4bd238')">
            <q-tooltip>Copy {{ scope.opt.value }}</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </template>

    <!-- Selected value display — include shortId for unambiguous identification -->
    <template #selected-item="scope" v-if="!isMultiple">
      <span class="agent-picker-selected">
        <strong>{{ scope.opt.hostname || scope.opt.label }}</strong>
        <span v-if="scope.opt.shortId" class="text-caption text-grey q-ml-xs agent-picker-mono">
          · {{ scope.opt.shortId }}
        </span>
      </span>
    </template>

    <!-- Chip rendering for multi-select: compact with shortId -->
    <template #selected v-if="isMultiple">
      <q-chip
        v-for="opt in selectedOptions"
        :key="opt.value"
        removable
        dense
        @remove="removeChip(opt.value)"
        class="q-my-xs"
      >
        <strong>{{ opt.hostname || opt.label }}</strong>
        <span v-if="opt.shortId" class="text-caption text-grey q-ml-xs agent-picker-mono">
          {{ opt.shortId }}
        </span>
      </q-chip>
    </template>

    <template #no-option>
      <q-item><q-item-section class="text-grey">{{ $t('devicemanagement.components.AgentPicker.b1da2f') }}</q-item-section></q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuasar, copyToClipboard } from "quasar";

interface AgentOptionRich {
  label: string;
  value: string;
  hostname?: string;
  shortId?: string;
  subline?: string;
  online?: boolean;
}

const props = defineProps<{
  modelValue: string | string[] | null;
  options: AgentOptionRich[];
  multiple?: boolean;
}>();
const emit = defineEmits<{ (e: "update:modelValue", v: string | string[] | null): void }>();

const $q = useQuasar();

const inner = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const isMultiple = computed(() => !!props.multiple);

// Local filter — matches hostname, agent_id (full or short), and subline case-insensitively.
const filterText = ref("");
const filteredOptions = computed(() => {
  const q = filterText.value.trim().toLowerCase();
  if (!q) return props.options;
  return (props.options || []).filter((o) => {
    const hay = [o.label, o.hostname, o.value, o.shortId, o.subline]
      .filter(Boolean).join(" ").toLowerCase();
    return hay.includes(q);
  });
});

function onFilter(val: string, update: (cb: () => void) => void) {
  update(() => { filterText.value = val || ""; });
}

const selectedOptions = computed<AgentOptionRich[]>(() => {
  if (!props.multiple) return [];
  const values = Array.isArray(props.modelValue) ? props.modelValue : [];
  return values
    .map((v) => props.options.find((o) => o.value === v))
    .filter((x): x is AgentOptionRich => !!x);
});

function removeChip(value: string) {
  const current = Array.isArray(props.modelValue) ? props.modelValue : [];
  emit("update:modelValue", current.filter((v) => v !== value));
}

function copyId(value: string, hostname?: string) {
  if (!value) return;
  copyToClipboard(value)
    .then(() => {
      $q.notify({
        message: `Agent ID copied${hostname ? ` (${hostname})` : ""}`,
        caption: value,
        color: "positive",
        icon: "content_copy",
        timeout: 1500,
        position: "top",
      });
    })
    .catch(() => {
      $q.notify({ message: "Clipboard copy failed", color: "negative" });
    });
}
</script>

<style scoped>
.agent-picker-mono {
  font-family: ui-monospace, SFMono-Regular, "Menlo", "Consolas", monospace;
  letter-spacing: 0.2px;
}
.agent-picker-selected {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.agent-picker-opt :deep(.q-item__section--side) {
  padding-left: 8px;
}
</style>
