<template>
  <q-card flat bordered class="q-mt-md">
    <q-card-section>
      <div class="row items-center justify-between q-mb-sm">
        <div>
          <div class="text-subtitle2">{{ $t('devicemanagement.components.SecureFileTransferPanel.70fb2f') }}</div>
          <div class="text-caption text-grey-7">
            Portable encrypted envelopes — a single-file ``.lsc`` you can email,
            drop on a USB stick, or stash on OneDrive. Opening needs the password
            (no plaintext ever leaves the endpoint).
          </div>
        </div>
        <q-btn flat dense icon="refresh" @click="loadTransfers" :loading="loadingTransfers" />
      </div>

      <q-tabs v-model="tab" dense align="left" inline-label class="text-grey-8">
        <q-tab name="pack"   icon="enhanced_encryption" :label="$t('devicemanagement.components.SecureFileTransferPanel.5d61da')" />
        <q-tab name="unpack" icon="lock_open" :label="$t('devicemanagement.components.SecureFileTransferPanel.09315e')" />
        <q-tab name="peek"   icon="visibility" :label="$t('devicemanagement.components.SecureFileTransferPanel.0be2c3')" />
        <q-tab name="tools"  icon="install_desktop" :label="$t('devicemanagement.components.SecureFileTransferPanel.d372eb')" />
        <q-tab name="log"    icon="receipt_long" :label="$t('devicemanagement.components.SecureFileTransferPanel.3cfc5f')" />
      </q-tabs>
      <q-separator />

      <!-- PACK ============================================================== -->
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="pack">
          <div class="q-gutter-md">
            <AgentPicker
              v-model="pack.agent_id"
              :options="agentOptions"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.e49c96')"
              outlined dense />
            <q-input
              v-model="pack.source_path"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.34aef3')"
              outlined dense
              hint="e.g. G:\\docs\\report.pdf — inside a mounted container, or any Windows path" />
            <q-input
              v-model="pack.envelope_path"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.e164cd')"
              outlined dense
              hint="e.g. C:\\LabMDM\\outbox\\report.pdf.lsc — where the shareable envelope is written" />
            <q-input
              v-model="pack.password"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.d6f0d7')"
              type="password"
              outlined dense
              :hint="$t('devicemanagement.components.SecureFileTransferPanel.f498ef')" />
            <q-input
              v-model="pack.vault_name"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.42ec77')"
              outlined dense
              :hint="$t('devicemanagement.components.SecureFileTransferPanel.31fc53')" />
            <div class="row q-gutter-sm items-center">
              <q-select
                v-model="pack.algorithm"
                :options="['MKV256', 'MKV128']"
                :label="$t('devicemanagement.components.SecureFileTransferPanel.02f024')"
                outlined dense style="width: 140px" />
              <q-toggle v-model="pack.keep_recovery_key" :label="$t('devicemanagement.components.SecureFileTransferPanel.646f6a')" />
            </div>
            <div>
              <q-btn color="primary" icon="enhanced_encryption" :label="$t('devicemanagement.components.SecureFileTransferPanel.64a400')"
                     :loading="pack.loading"
                     :disable="!packReady"
                     @click="doPack" />
            </div>
            <q-banner v-if="pack.result && pack.result.ok" rounded dense class="bg-positive text-white">
              Packed in {{ pack.result.elapsed_ms }}ms ·
              envelope {{ fmtBytes(pack.result.envelope_bytes) }} at {{ pack.result.envelope }} ·
              SHA-256 {{ (pack.result.source_sha256 || '').slice(0, 16) }}…
              <span v-if="pack.result.recovery_key_b64">
                · recovery key: <code>{{ pack.result.recovery_key_b64 }}</code>
              </span>
            </q-banner>
            <q-banner v-else-if="pack.result && pack.result.ok === false" rounded dense class="bg-negative text-white">
              {{ pack.result.error || 'Pack failed' }}
            </q-banner>
          </div>
        </q-tab-panel>

        <!-- UNPACK ========================================================== -->
        <q-tab-panel name="unpack">
          <div class="q-gutter-md">
            <AgentPicker v-model="unpack.agent_id" :options="agentOptions" :label="$t('devicemanagement.components.SecureFileTransferPanel.e49c96')" outlined dense />
            <q-input v-model="unpack.envelope_path" :label="$t('devicemanagement.components.SecureFileTransferPanel.e47a97')" outlined dense />
            <q-input v-model="unpack.password" :label="$t('devicemanagement.components.SecureFileTransferPanel.d6f0d7')" type="password" outlined dense />
            <q-input
              v-model="unpack.vault_name"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.0f8427')"
              outlined dense
              :hint="$t('devicemanagement.components.SecureFileTransferPanel.28af59')" />
            <q-input
              v-model="unpack.output_path"
              :label="$t('devicemanagement.components.SecureFileTransferPanel.40cb1d')"
              outlined dense
              hint="Write plaintext here. Point it inside a mounted container (e.g. H:\\inbox\\report.pdf) to re-encrypt on arrival." />
            <div>
              <q-btn color="primary" icon="lock_open" :label="$t('devicemanagement.components.SecureFileTransferPanel.160179')"
                     :loading="unpack.loading"
                     :disable="!unpackReady"
                     @click="doUnpack" />
            </div>
            <q-banner v-if="unpack.result && unpack.result.ok" rounded dense class="bg-positive text-white">
              Unpacked in {{ unpack.result.elapsed_ms }}ms ·
              {{ fmtBytes(unpack.result.output_bytes) }} written to {{ unpack.result.output }} ·
              SHA-256 {{ (unpack.result.output_sha256 || '').slice(0, 16) }}…
            </q-banner>
            <q-banner v-else-if="unpack.result && unpack.result.ok === false" rounded dense class="bg-negative text-white">
              {{ unpack.result.error || 'Unpack failed' }}
            </q-banner>
          </div>
        </q-tab-panel>

        <!-- PEEK ============================================================ -->
        <q-tab-panel name="peek">
          <div class="q-gutter-md">
            <AgentPicker v-model="peek.agent_id" :options="agentOptions" :label="$t('devicemanagement.components.SecureFileTransferPanel.e49c96')" outlined dense />
            <q-input v-model="peek.envelope_path" :label="$t('devicemanagement.components.SecureFileTransferPanel.b75478')" outlined dense />
            <q-input v-model="peek.password" :label="$t('devicemanagement.components.SecureFileTransferPanel.7cc239')" type="password" outlined dense />
            <div>
              <q-btn color="primary" icon="visibility" :label="$t('devicemanagement.components.SecureFileTransferPanel.31c0b0')"
                     :loading="peek.loading"
                     :disable="!peekReady"
                     @click="doPeek" />
            </div>
            <div v-if="peek.result && peek.result.ok">
              <div class="text-caption text-grey-7 q-mt-sm">
                Envelope {{ fmtBytes(peek.result.envelope_bytes) }}: {{ (peek.result.files || []).length }} file(s)
              </div>
              <q-list bordered separator dense class="q-mt-sm">
                <q-item v-for="f in normalizeFiles(peek.result.files)" :key="f.path" dense>
                  <q-item-section avatar><q-icon name="description" /></q-item-section>
                  <q-item-section>
                    <q-item-label>{{ f.path }}</q-item-label>
                    <q-item-label caption>{{ fmtBytes(f.size_bytes) }} · {{ f.sector_count }} sectors</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <q-banner v-else-if="peek.result && peek.result.ok === false" rounded dense class="bg-negative text-white">
              {{ peek.result.error || 'List failed' }}
            </q-banner>
          </div>
        </q-tab-panel>

        <!-- END-USER TOOLS ================================================ -->
        <q-tab-panel name="tools">
          <div class="text-body2 q-mb-md">
            Deploy local pack / unpack GUI helpers to a device. After install the
            end-user sees:
            <ul class="q-my-sm">
              <li><strong>{{ $t('devicemanagement.components.SecureFileTransferPanel.d49f88') }}</strong> → <em>{{ $t('devicemanagement.components.SecureFileTransferPanel.29d62b') }}</em> {{ $t('devicemanagement.components.SecureFileTransferPanel.18b900') }}</li>
              <li>{{ $t('devicemanagement.components.SecureFileTransferPanel.eebb09') }} <strong>{{ $t('devicemanagement.components.SecureFileTransferPanel.d11f74') }}</strong> → <em>{{ $t('devicemanagement.components.SecureFileTransferPanel.6aca02') }}</em></li>
              <li>Double-click any <code>.lsc</code> file → Import dialog opens</li>
            </ul>
            {{ $t('devicemanagement.components.SecureFileTransferPanel.b98277') }}
          </div>
          <div class="q-gutter-md">
            <AgentPicker v-model="tools.agent_id" :options="agentOptions" :label="$t('devicemanagement.components.SecureFileTransferPanel.e49c96')" outlined dense />
            <div class="row q-gutter-sm">
              <q-btn color="primary" icon="install_desktop" :label="$t('devicemanagement.components.SecureFileTransferPanel.a7cf28')"
                     :loading="tools.installing"
                     :disable="!tools.agent_id"
                     @click="doInstallTools" />
              <q-btn flat color="grey-7" icon="search" :label="$t('devicemanagement.components.SecureFileTransferPanel.07adf9')"
                     :loading="tools.checking"
                     :disable="!tools.agent_id"
                     @click="doCheckTools" />
              <q-btn flat color="negative" icon="delete_sweep" :label="$t('devicemanagement.components.SecureFileTransferPanel.a735da')"
                     :loading="tools.uninstalling"
                     :disable="!tools.agent_id"
                     @click="doUninstallTools" />
            </div>
            <q-card v-if="tools.status" flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">{{ $t('devicemanagement.components.SecureFileTransferPanel.aef0bd') }}</div>
                <div class="row q-gutter-sm">
                  <q-chip dense :color="tools.status.sc_exe_present ? 'positive' : 'negative'" text-color="white"
                          :icon="tools.status.sc_exe_present ? 'check_circle' : 'cancel'">
                    {{ $t('devicemanagement.components.SecureFileTransferPanel.c726c3') }}
                  </q-chip>
                  <q-chip dense :color="tools.status.export_ps_present ? 'positive' : 'grey'" text-color="white"
                          :icon="tools.status.export_ps_present ? 'check_circle' : 'radio_button_unchecked'">
                    {{ $t('devicemanagement.components.SecureFileTransferPanel.e28478') }}
                  </q-chip>
                  <q-chip dense :color="tools.status.import_ps_present ? 'positive' : 'grey'" text-color="white"
                          :icon="tools.status.import_ps_present ? 'check_circle' : 'radio_button_unchecked'">
                    {{ $t('devicemanagement.components.SecureFileTransferPanel.f3f8a4') }}
                  </q-chip>
                  <q-chip dense :color="tools.status.start_menu_present ? 'positive' : 'grey'" text-color="white"
                          :icon="tools.status.start_menu_present ? 'check_circle' : 'radio_button_unchecked'">
                    {{ $t('devicemanagement.components.SecureFileTransferPanel.f6585a') }}
                  </q-chip>
                  <q-chip dense :color="tools.status.sendto_present ? 'positive' : 'grey'" text-color="white"
                          :icon="tools.status.sendto_present ? 'check_circle' : 'radio_button_unchecked'">
                    {{ $t('devicemanagement.components.SecureFileTransferPanel.1eb3bc') }}
                  </q-chip>
                </div>
                <div class="text-caption text-grey q-mt-sm" v-if="tools.status.active_user">
                  Active interactive user: {{ tools.status.active_user }}
                </div>
              </q-card-section>
            </q-card>
            <q-banner v-if="tools.lastResult" rounded dense
                      :class="tools.lastResult.ok ? 'bg-positive text-white' : 'bg-negative text-white'">
              {{ tools.lastResult.message }}
            </q-banner>
          </div>
        </q-tab-panel>

        <!-- AUDIT LOG ======================================================= -->
        <q-tab-panel name="log">
          <q-table
            :rows="transfers"
            :columns="transferColumns"
            dense row-key="id"
            :rows-per-page-options="[10, 25, 50]"
            :loading="loadingTransfers">
            <template v-slot:body-cell-operation="props">
              <q-td :props="props">
                <q-chip dense :color="opColor(props.value)" text-color="white" size="sm" :icon="opIcon(props.value)">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip dense :color="statusColor(props.value)" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-size="props">
              <q-td :props="props">{{ fmtBytes(Number(props.value) || 0) }}</q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import AgentPicker from "@/devicemanagement/components/AgentPicker.vue";
import { buildAgentOptions } from "@/devicemanagement/components/agentOptionHelpers";

const props = defineProps<{ agents: any[] }>();
const $q = useQuasar();
const tab = ref<"pack" | "unpack" | "peek" | "log">("pack");

const agentOptions = computed(() => buildAgentOptions(props.agents));

const pack = ref<any>({
  agent_id: "",
  source_path: "",
  envelope_path: "",
  password: "",
  vault_name: "",
  algorithm: "MKV256",
  keep_recovery_key: false,
  loading: false,
  result: null,
});
const packReady = computed(() =>
  pack.value.agent_id && pack.value.source_path && pack.value.envelope_path && pack.value.password
);

const unpack = ref<any>({
  agent_id: "",
  envelope_path: "",
  password: "",
  vault_name: "",
  output_path: "",
  loading: false,
  result: null,
});
const unpackReady = computed(() =>
  unpack.value.agent_id && unpack.value.envelope_path && unpack.value.password && unpack.value.output_path
);

const peek = ref<any>({
  agent_id: "",
  envelope_path: "",
  password: "",
  loading: false,
  result: null,
});
const peekReady = computed(() =>
  peek.value.agent_id && peek.value.envelope_path && peek.value.password
);

const tools = ref<any>({
  agent_id: "",
  installing: false,
  checking: false,
  uninstalling: false,
  status: null,
  lastResult: null,
});

async function doInstallTools() {
  tools.value.installing = true;
  tools.value.lastResult = null;
  try {
    const r = await axios.post("/appmanagement/workspaces/vault-tools/install/",
      { agent_id: tools.value.agent_id }, { timeout: 2 * 60 * 1000 });
    tools.value.lastResult = {
      ok: !!r.data.ok,
      message: r.data.ok
        ? `Installed for user '${r.data.active_user || "(unknown)"}'. Send-To: ${r.data.sendto_installed ? "yes" : "no"}. File assoc: ${r.data.ext_registered ? "yes" : "no"}.`
        : (r.data.error || "Install failed"),
    };
    $q.notify({ color: r.data.ok ? "positive" : "negative",
                message: tools.value.lastResult.message,
                icon: r.data.ok ? "check_circle" : "error" });
    await doCheckTools();
  } catch (e: any) {
    tools.value.lastResult = { ok: false, message: e?.response?.data?.detail || e?.message || "Install failed" };
    $q.notify({ color: "negative", message: tools.value.lastResult.message });
  } finally {
    tools.value.installing = false;
  }
}

async function doCheckTools() {
  tools.value.checking = true;
  try {
    const r = await axios.get("/appmanagement/workspaces/vault-tools/status/",
      { params: { agent_id: tools.value.agent_id }, timeout: 30 * 1000 });
    tools.value.status = r.data;
  } catch (e: any) {
    $q.notify({ color: "negative", message: e?.response?.data?.detail || "Status probe failed" });
  } finally {
    tools.value.checking = false;
  }
}

async function doUninstallTools() {
  $q.dialog({
    title: "Uninstall vault tools from this device?",
    message: "Removes Start Menu shortcuts, Send-To entries, PS scripts and the .lsc file association. Existing envelopes stay intact.",
    ok: { label: "Uninstall", color: "negative" },
    cancel: true,
  }).onOk(async () => {
    tools.value.uninstalling = true;
    tools.value.lastResult = null;
    try {
      const r = await axios.post("/appmanagement/workspaces/vault-tools/uninstall/",
        { agent_id: tools.value.agent_id }, { timeout: 60 * 1000 });
      tools.value.lastResult = {
        ok: !!r.data.ok,
        message: r.data.ok ? `Uninstalled: ${(r.data.removed || []).length} paths.` : (r.data.error || "Uninstall failed"),
      };
      $q.notify({ color: r.data.ok ? "positive" : "negative", message: tools.value.lastResult.message });
      await doCheckTools();
    } catch (e: any) {
      tools.value.lastResult = { ok: false, message: e?.message || "Uninstall failed" };
      $q.notify({ color: "negative", message: tools.value.lastResult.message });
    } finally {
      tools.value.uninstalling = false;
    }
  });
}

const transfers = ref<any[]>([]);
const loadingTransfers = ref(false);
const transferColumns = [
  { name: "created_at", label: "When", field: "created_at", align: "left" as const },
  { name: "operation", label: "Op", field: "operation", align: "center" as const },
  { name: "device_label", label: "Device", field: "device_label", align: "left" as const },
  { name: "file_name", label: "File", field: "file_name", align: "left" as const },
  { name: "envelope_path", label: "Envelope", field: "envelope_path", align: "left" as const },
  { name: "size", label: "Size", field: "size_label", align: "right" as const },
  { name: "status", label: "Status", field: "status", align: "center" as const },
  { name: "duration_ms", label: "Duration (ms)", field: "duration_ms", align: "right" as const },
];

function fmtBytes(n: number): string {
  if (!n || n < 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MiB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GiB`;
}

function opColor(op: string) {
  return { pack: "primary", unpack: "positive", list_envelope: "info", legacy: "grey" }[op] || "grey";
}
function opIcon(op: string) {
  return { pack: "enhanced_encryption", unpack: "lock_open", list_envelope: "visibility" }[op] || "sync_alt";
}
function statusColor(s: string) {
  if (!s) return "grey";
  const low = s.toLowerCase();
  if (low === "success" || low === "completed") return "positive";
  if (low === "failed" || low === "error")     return "negative";
  return "grey";
}
function normalizeFiles(f: any): any[] {
  // PowerShell returns a single-entry array as an object; coerce to array.
  if (!f) return [];
  if (Array.isArray(f)) return f;
  return [f];
}

async function loadTransfers() {
  loadingTransfers.value = true;
  try {
    const r = await axios.get("/appmanagement/workspaces/files/transfers/");
    transfers.value = Array.isArray(r.data) ? r.data : [];
  } catch (e: any) {
    $q.notify({ message: e?.response?.data?.detail || "Failed to load transfers", color: "negative" });
  } finally {
    loadingTransfers.value = false;
  }
}

async function doPack() {
  pack.value.loading = true;
  pack.value.result = null;
  try {
    const r = await axios.post("/appmanagement/workspaces/files/pack/", {
      agent_id: pack.value.agent_id,
      source_path: pack.value.source_path,
      envelope_path: pack.value.envelope_path,
      password: pack.value.password,
      vault_name: pack.value.vault_name || undefined,
      algorithm: pack.value.algorithm,
      keep_recovery_key: pack.value.keep_recovery_key,
    }, { timeout: 5 * 60 * 1000 });
    pack.value.result = r.data;
    $q.notify({ color: r.data.ok ? "positive" : "negative",
                message: r.data.ok ? "Envelope packed" : (r.data.error || "Pack failed"),
                icon: r.data.ok ? "enhanced_encryption" : "error" });
    if (r.data.ok) await loadTransfers();
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.detail || e?.message || "Pack failed";
    pack.value.result = { ok: false, error: msg };
    $q.notify({ color: "negative", message: msg });
  } finally {
    pack.value.loading = false;
  }
}

async function doUnpack() {
  unpack.value.loading = true;
  unpack.value.result = null;
  try {
    const r = await axios.post("/appmanagement/workspaces/files/unpack/", {
      agent_id: unpack.value.agent_id,
      envelope_path: unpack.value.envelope_path,
      password: unpack.value.password,
      vault_name: unpack.value.vault_name || undefined,
      output_path: unpack.value.output_path,
    }, { timeout: 5 * 60 * 1000 });
    unpack.value.result = r.data;
    $q.notify({ color: r.data.ok ? "positive" : "negative",
                message: r.data.ok ? "Envelope unpacked" : (r.data.error || "Unpack failed"),
                icon: r.data.ok ? "lock_open" : "error" });
    if (r.data.ok) await loadTransfers();
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.detail || e?.message || "Unpack failed";
    unpack.value.result = { ok: false, error: msg };
    $q.notify({ color: "negative", message: msg });
  } finally {
    unpack.value.loading = false;
  }
}

async function doPeek() {
  peek.value.loading = true;
  peek.value.result = null;
  try {
    const r = await axios.post("/appmanagement/workspaces/files/envelope-list/", {
      agent_id: peek.value.agent_id,
      envelope_path: peek.value.envelope_path,
      password: peek.value.password,
    }, { timeout: 60 * 1000 });
    peek.value.result = r.data;
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.detail || e?.message || "List failed";
    peek.value.result = { ok: false, error: msg };
    $q.notify({ color: "negative", message: msg });
  } finally {
    peek.value.loading = false;
  }
}

onMounted(loadTransfers);
</script>
