<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    flat
    dense
    :loading="loading"
    :pagination="pagination"
    class="discover-table"
    separator="horizontal"
  >
    <!-- Expand button -->
    <template #body="props">
      <q-tr :props="props" class="cursor-pointer" @click="props.expand = !props.expand">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'expand'">
            <q-icon :name="props.expand ? 'expand_less' : 'expand_more'" size="sm" />
          </template>
          <template v-else-if="col.name === 'level'">
            <q-badge :color="levelColor(props.row.level)" :label="String(props.row.level)" />
          </template>
          <template v-else-if="col.name === 'groups'">
            <q-chip
              v-for="g in (props.row.groups ?? []).slice(0, 3)"
              :key="g"
              dense
              size="sm"
              color="blue-grey-2"
              text-color="blue-grey-9"
              :label="g"
              class="q-mr-xs"
            />
            <span v-if="(props.row.groups ?? []).length > 3" class="text-caption text-grey">
              +{{ props.row.groups.length - 3 }}
            </span>
          </template>
          <template v-else-if="col.name === 'mitre'">
            <template v-if="props.row.mitre?.tactic?.length">
              <q-chip
                v-for="t in props.row.mitre.tactic.slice(0, 2)"
                :key="t"
                dense
                size="sm"
                color="deep-purple-2"
                text-color="deep-purple-9"
                :label="t"
                class="q-mr-xs"
              />
            </template>
            <span v-else class="text-grey">—</span>
          </template>
          <template v-else>
            {{ col.value }}
          </template>
        </q-td>
      </q-tr>
      <!-- Expanded row: full rule JSON -->
      <q-tr v-if="props.expand" :props="props">
        <q-td colspan="100%" class="expanded-row">
          <div class="expanded-content">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="expanded-field" v-if="props.row.description">
                  <span class="field-key">Description:</span>
                  <span>{{ props.row.description }}</span>
                </div>
                <div class="expanded-field" v-if="props.row.filename">
                  <span class="field-key">Filename:</span>
                  <span>{{ props.row.filename }}</span>
                </div>
                <div class="expanded-field" v-if="props.row.status">
                  <span class="field-key">Status:</span>
                  <span>{{ props.row.status }}</span>
                </div>
                <div class="expanded-field" v-if="props.row.groups?.length">
                  <span class="field-key">Groups:</span>
                  <span>{{ props.row.groups.join(', ') }}</span>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="expanded-field" v-if="props.row.mitre?.tactic?.length">
                  <span class="field-key">MITRE Tactics:</span>
                  <span>{{ props.row.mitre.tactic.join(', ') }}</span>
                </div>
                <div class="expanded-field" v-if="props.row.mitre?.technique?.length">
                  <span class="field-key">MITRE Techniques:</span>
                  <span>{{ props.row.mitre.technique.join(', ') }}</span>
                </div>
                <div class="expanded-field" v-if="props.row.pci_dss?.length">
                  <span class="field-key">PCI DSS:</span>
                  <span>{{ props.row.pci_dss.join(', ') }}</span>
                </div>
                <div class="expanded-field" v-if="props.row.gdpr?.length">
                  <span class="field-key">GDPR:</span>
                  <span>{{ props.row.gdpr.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { WazuhRule } from "@/types/wazuh";

defineProps<{
  rows: WazuhRule[];
  loading: boolean;
}>();

const pagination = ref({ rowsPerPage: 50 });

const columns = [
  { name: "expand", label: "", field: "", style: "width: 40px" },
  { name: "level", label: "Level", field: "level", align: "center" as const, sortable: true, style: "width: 70px" },
  { name: "id", label: "Rule ID", field: "id", align: "left" as const, sortable: true, style: "width: 90px" },
  { name: "description", label: "Description", field: "description", align: "left" as const, sortable: true },
  { name: "groups", label: "Groups", field: "groups", align: "left" as const },
  { name: "mitre", label: "MITRE ATT&CK", field: "mitre", align: "left" as const },
];

function levelColor(level: number): string {
  if (level >= 12) return "red";
  if (level >= 10) return "deep-orange";
  if (level >= 7) return "orange";
  if (level >= 4) return "blue";
  return "grey";
}
</script>

<style scoped>
.discover-table :deep(.q-table th) {
  font-size: 12px;
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  text-transform: uppercase;
  padding: 8px 12px;
  background: var(--mdm-bg-sidebar, #fafafa);
  border-bottom: 1px solid var(--mdm-border, #e5e5e5);
}

.discover-table :deep(.q-table td) {
  font-size: 13px;
  color: var(--mdm-text-primary, #1a1a1a);
  padding: 8px 12px;
  border-bottom: 1px solid var(--mdm-border-light, #f0f0f0);
}

.expanded-row {
  background: var(--mdm-bg-sidebar, #fafafa);
  padding: 16px !important;
}

.expanded-content {
  font-size: 13px;
}

.expanded-field {
  margin-bottom: 6px;
}

.field-key {
  font-weight: 600;
  color: var(--mdm-text-secondary, #666);
  margin-right: 6px;
}
</style>
