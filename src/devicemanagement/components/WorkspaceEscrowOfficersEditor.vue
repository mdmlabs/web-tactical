<!--
  Phase-3 follow-up — WorkspaceEscrowOfficersEditor.vue

  CRUD UI for ``WorkspaceEscrowOfficer`` rows. Backed by:
    GET    /appmanagement/workspaces/<ws>/escrow-officers/
    POST   /appmanagement/workspaces/<ws>/escrow-officers/
    DELETE /appmanagement/workspaces/<ws>/escrow-officers/<pk>/

  The ``Add officer`` dialog supports two ways to provide the pubkey:
    1) Paste an externally-generated RSA public key in PEM form.
    2) Generate a fresh RSA-4096 keypair locally via Web Crypto. The
       PRIVATE key is downloaded immediately as a PKCS#8 PEM and is
       NEVER sent to the server. Only the SPKI public key is uploaded.
       The officer is responsible for storing the private key offline
       (ideally on hardware) — losing it means losing the ability to
       contribute Shamir shares for break-glass recovery.

  Component is shown only after the workspace has been saved (we need
  the workspace pk for the URL). For new workspaces the editor renders
  a banner asking the user to save first.
-->
<template>
  <div class="workspace-officers-editor">
    <div v-if="!workspaceId" class="text-caption text-grey-7 q-pa-sm">
      Save the workspace first — escrow officers can be added once it has an ID.
    </div>
    <template v-else>
      <div class="row items-center justify-between q-mb-sm">
        <div>
          <div class="text-subtitle2">Shamir escrow officers</div>
          <div class="text-caption text-grey-7">
            Active officers: <b>{{ activeCount }}</b> /
            workspace expects <b>{{ shamirTotal }}</b>
            (threshold <b>{{ shamirThreshold }}</b>).
            <span v-if="activeCount !== shamirTotal" class="text-negative">
              · init-password will refuse until exactly {{ shamirTotal }} are active.
            </span>
          </div>
        </div>
        <div>
          <q-btn flat dense icon="refresh" label="Reload" :loading="loading" @click="reload" />
          <q-btn color="primary" icon="add" label="Add officer"
                 :disable="loading"
                 @click="openAddDialog" class="q-ml-sm" />
        </div>
      </div>

      <q-table
        :rows="officers"
        :columns="columns"
        row-key="id"
        dense :loading="loading"
        :rows-per-page-options="[10]">
        <template #body-cell-state="props">
          <q-td :props="props">
            <q-badge v-if="props.row.is_active" color="positive">active</q-badge>
            <q-badge v-else color="grey">revoked {{ props.row.revoked_at ? '· ' + shortIso(props.row.revoked_at) : '' }}</q-badge>
          </q-td>
        </template>
        <template #body-cell-fingerprint="props">
          <q-td :props="props">
            <code class="text-caption">{{ props.row.pubkey_fingerprint }}</code>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="props.row.is_active"
                   flat dense size="sm" icon="link_off" color="negative"
                   @click="confirmRevoke(props.row)">
              <q-tooltip>Revoke this officer slot</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>

    <q-dialog v-model="addOpen" persistent>
      <q-card style="min-width:560px;max-width:760px">
        <q-bar>
          <span>Add escrow officer — workspace #{{ workspaceId }}</span>
          <q-space /><q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="addForm.officer_user_id"
            :options="userOptions"
            emit-value map-options outlined dense
            use-input fill-input hide-selected
            input-debounce="200"
            label="Officer (existing platform user)"
            :loading="userLoading"
            @filter="fetchUsers" />
          <q-input
            v-model.number="addForm.share_index"
            type="number" min="1" :max="shamirTotal || 99"
            outlined dense
            label="Share index (1 .. n)"
            :hint="`Workspace n = ${shamirTotal}.`" />
          <q-input
            v-model="addForm.notes"
            outlined dense
            label="Notes (optional)" />

          <q-separator />
          <div class="text-subtitle2">Public key</div>
          <q-tabs v-model="pubkeyMode" dense narrow-indicator
                  active-color="primary" align="left">
            <q-tab name="paste" label="Paste PEM" />
            <q-tab name="generate" label="Generate RSA-4096 locally" />
          </q-tabs>
          <q-tab-panels v-model="pubkeyMode" animated>
            <q-tab-panel name="paste" class="q-pa-none q-pt-sm">
              <q-input
                v-model="addForm.pubkey_pem"
                type="textarea" rows="8" outlined dense
                label="-----BEGIN PUBLIC KEY----- … -----END PUBLIC KEY-----"
                hint="Paste the officer's RSA-4096 SPKI public key in PEM form."
                style="font-family: 'JetBrains Mono', 'Menlo', monospace; font-size: 11px;" />
            </q-tab-panel>
            <q-tab-panel name="generate" class="q-pa-none q-pt-sm">
              <div class="text-caption text-grey-7">
                Generates an RSA-4096 keypair in the browser using
                <code>SubtleCrypto.generateKey</code>. The
                <b>private key is downloaded immediately</b> as a PKCS#8 PEM —
                store it offline (ideally on hardware). The server only
                receives the public key. Lose the private file → lose the
                ability to contribute Shamir shares.
              </div>
              <div class="q-mt-md">
                <q-btn color="warning" icon="key" label="Generate keypair + download private"
                       :disable="generating"
                       @click="generateKeypair" />
                <span v-if="generating" class="text-caption text-grey-7 q-ml-sm">
                  generating (this takes 5-15s for RSA-4096)…
                </span>
                <span v-if="generatedFingerprint" class="text-caption text-positive q-ml-sm">
                  ✔ private downloaded · pubkey ready (fp {{ generatedFingerprint.substring(0, 36) }}…)
                </span>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Add officer" :loading="adding"
                 :disable="!canSubmit"
                 @click="submitAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const props = defineProps<{
  workspaceId: number | null;
  shamirTotal: number;
  shamirThreshold: number;
}>();

const emit = defineEmits<{
  (e: "officers-changed", count: number): void;
}>();

const $q = useQuasar();

interface Officer {
  id: number;
  share_index: number;
  officer_user_id: number;
  officer_username: string;
  pubkey_fingerprint: string;
  pubkey_pem?: string;
  is_active: boolean;
  notes: string;
  created_at: string | null;
  revoked_at: string | null;
}

const officers = ref<Officer[]>([]);
const loading = ref(false);
const activeCount = computed(() => officers.value.filter(o => o.is_active).length);

const columns = [
  { name: "share_index", label: "Slot", field: "share_index", align: "right" as const },
  { name: "officer_username", label: "Officer", field: "officer_username", align: "left" as const },
  { name: "fingerprint", label: "Pubkey fingerprint", field: "pubkey_fingerprint", align: "left" as const },
  { name: "state", label: "Status", field: "is_active", align: "left" as const },
  { name: "notes", label: "Notes", field: "notes", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
];

async function reload() {
  if (!props.workspaceId) return;
  loading.value = true;
  try {
    const { data } = await axios.get(`/appmanagement/workspaces/${props.workspaceId}/escrow-officers/`);
    officers.value = data?.items || [];
    emit("officers-changed", officers.value.filter(o => o.is_active).length);
  } catch (e: any) {
    $q.notify({ color: "negative", message: e?.response?.data?.detail || "Failed to load officers" });
  } finally {
    loading.value = false;
  }
}

watch(() => props.workspaceId, reload, { immediate: true });
onMounted(reload);

function shortIso(iso: string) {
  return (iso || "").replace("T", " ").substring(0, 16);
}

// ---- Add officer dialog ----------------------------------------------

const addOpen = ref(false);
const adding = ref(false);
const addForm = reactive({
  officer_user_id: null as number | null,
  share_index: 1,
  pubkey_pem: "",
  notes: "",
});
const pubkeyMode = ref<"paste" | "generate">("paste");
const generating = ref(false);
const generatedFingerprint = ref<string>("");

const userLoading = ref(false);
const allUsers = ref<{ id: number; username: string }[]>([]);
const userOptions = ref<{ label: string; value: number }[]>([]);

async function ensureUsersLoaded() {
  if (allUsers.value.length) return;
  userLoading.value = true;
  try {
    const { data } = await axios.get("/accounts/users/");
    const items = Array.isArray(data) ? data : (data?.items || []);
    allUsers.value = items.map((u: any) => ({ id: u.id, username: u.username || "" }));
  } catch {
    allUsers.value = [];
  } finally {
    userLoading.value = false;
  }
}

function applyFilter(q: string, update: (cb: () => void) => void) {
  // Quasar's `update(cb)` requires the callback to be SYNCHRONOUS — it
  // wraps the cb in nextTick to refresh options. Passing an async
  // function silently breaks: Quasar receives a Promise (not undefined),
  // and the dropdown freezes with the spinner showing forever. The
  // canonical fix is to await the data BEFORE calling `update`.
  const needle = q.toLowerCase();
  const filtered = needle
    ? allUsers.value.filter(u => u.username.toLowerCase().includes(needle))
    : allUsers.value;
  update(() => {
    userOptions.value = filtered.slice(0, 50).map(u => ({
      label: u.username + " (#" + u.id + ")",
      value: u.id,
    }));
  });
}

function fetchUsers(q: string, update: (cb: () => void) => void, abort: () => void) {
  if (allUsers.value.length === 0) {
    // First call after dialog opens — fetch users, then update options.
    ensureUsersLoaded().then(() => applyFilter(q, update)).catch(() => abort());
    return;
  }
  // Subsequent calls (typing in the search box) — already cached, apply
  // the filter synchronously.
  applyFilter(q, update);
}

function openAddDialog() {
  addForm.officer_user_id = null;
  addForm.share_index = nextFreeSlot();
  addForm.pubkey_pem = "";
  addForm.notes = "";
  pubkeyMode.value = "paste";
  generatedFingerprint.value = "";
  ensureUsersLoaded().then(() => {
    userOptions.value = allUsers.value.slice(0, 50).map(u => ({
      label: u.username + " (#" + u.id + ")",
      value: u.id,
    }));
  });
  addOpen.value = true;
}

function nextFreeSlot(): number {
  const taken = new Set(officers.value.filter(o => o.is_active).map(o => o.share_index));
  for (let i = 1; i <= (props.shamirTotal || 99); i++) {
    if (!taken.has(i)) return i;
  }
  return 1;
}

const canSubmit = computed(() => {
  if (!addForm.officer_user_id) return false;
  if (!addForm.pubkey_pem || !addForm.pubkey_pem.includes("BEGIN PUBLIC KEY")) return false;
  return true;
});

async function submitAdd() {
  if (!props.workspaceId || !canSubmit.value) return;
  adding.value = true;
  try {
    await axios.post(`/appmanagement/workspaces/${props.workspaceId}/escrow-officers/`, {
      officer_user_id: addForm.officer_user_id,
      share_index: addForm.share_index,
      pubkey_pem: addForm.pubkey_pem,
      notes: addForm.notes,
    });
    $q.notify({ color: "positive", icon: "check", message: `Officer added at slot ${addForm.share_index}.` });
    addOpen.value = false;
    await reload();
  } catch (e: any) {
    $q.notify({
      color: "negative",
      message: e?.response?.data?.detail || e?.message || "Add officer failed",
    });
  } finally {
    adding.value = false;
  }
}

function confirmRevoke(row: Officer) {
  $q.dialog({
    title: "Revoke officer?",
    message: `Slot ${row.share_index} (${row.officer_username}) will lose its ability to approve recovery requests. Existing containers' Shamir shares are NOT re-issued automatically — schedule a key-rotation runbook step if you need a fresh share set.`,
    cancel: true,
    ok: { label: "Revoke", color: "negative" },
  }).onOk(async () => {
    try {
      await axios.delete(`/appmanagement/workspaces/${props.workspaceId}/escrow-officers/${row.id}/`);
      $q.notify({ color: "positive", message: `Slot ${row.share_index} revoked.` });
      await reload();
    } catch (e: any) {
      $q.notify({ color: "negative", message: e?.response?.data?.detail || "Revoke failed" });
    }
  });
}

// ---- Web Crypto: RSA-4096 keypair generation -------------------------

async function generateKeypair() {
  if (!window.crypto?.subtle) {
    $q.notify({ color: "negative", message: "SubtleCrypto not available — paste a PEM instead." });
    return;
  }
  generating.value = true;
  generatedFingerprint.value = "";
  try {
    const keypair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"],
    );
    // Export public key (SPKI DER → PEM)
    const spki = await window.crypto.subtle.exportKey("spki", keypair.publicKey);
    const pubPem = derToPem(spki, "PUBLIC KEY");
    addForm.pubkey_pem = pubPem;
    // Fingerprint preview (matches backend SHA256(SPKI bytes) base64)
    const fpBuf = await window.crypto.subtle.digest("SHA-256", spki);
    generatedFingerprint.value = "SHA256:" + b64(new Uint8Array(fpBuf)).replace(/=+$/, "");
    // Export private key (PKCS#8 DER → PEM) and trigger download
    const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", keypair.privateKey);
    const privPem = derToPem(pkcs8, "PRIVATE KEY");
    const username = (allUsers.value.find(u => u.id === addForm.officer_user_id)?.username) || "officer";
    downloadText(privPem, `escrow-officer-${username}-ws${props.workspaceId}-slot${addForm.share_index}-PRIVATE.pem`);
    $q.notify({
      color: "positive", icon: "key", timeout: 8000,
      message: `Private key downloaded. Public key staged for upload (fp ${generatedFingerprint.value.substring(0, 28)}…).`,
    });
  } catch (e: any) {
    $q.notify({ color: "negative", message: "Keypair generation failed: " + (e?.message || e) });
  } finally {
    generating.value = false;
  }
}

function derToPem(der: ArrayBuffer, label: string): string {
  const b = b64(new Uint8Array(der));
  const lines = b.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;
}

function b64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/x-pem-file" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
</script>
