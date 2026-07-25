<!-- Copyright (c) 2026 Laborato MDM. All rights reserved. -->

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 60vw; max-width: 90vw; min-height: 40vh">
      <q-bar>
        {{
          t("Connected Social Accounts for {username}", {
            username: user.username,
          })
        }}
        <q-space />
        <q-btn v-close-popup dense flat icon="close">
          <q-tooltip class="bg-white text-primary">{{ t("Close") }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-table
        dense
        :table-class="{
          'table-bgcolor': !$q.dark.isActive,
          'table-bgcolor-dark': $q.dark.isActive,
        }"
        :style="{ 'max-height': `${$q.screen.height - 24}px` }"
        class="tbl-sticky"
        :rows="user.social_accounts"
        :columns="columns"
        :loading="loading"
        :pagination="{ rowsPerPage: 0, sortBy: 'display', descending: true }"
        row-key="id"
        binary-state-sort
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <template #body="props">
          <q-tr>
            <!-- rows -->
            <td>{{ props.row.display }}</td>
            <td>{{ props.row.provider }}</td>
            <td>{{ formatDate(props.row.last_login) }}</td>
            <td>{{ formatDate(props.row.date_joined) }}</td>
            <td>
              <q-btn
                size="sm"
                @click="removeSSOAccount(props.row)"
                :label="t('Disconnect')"
                color="negative"
              ></q-btn>
            </td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// composition imports
import { computed, ref } from "vue";
import { useDialogPluginComponent, useQuasar, type QTableColumn } from "quasar";
import { useI18n } from "vue-i18n";
import { disconnectSSOAccount } from "@/ee/sso/api/sso";
import { notifySuccess } from "@/utils/notify";
import { useAuthStore } from "@/stores/auth";
import { formatDate } from "@/utils/format";

//types
import type { SSOAccount, SSOUser } from "../types/sso";

// emits
defineEmits([...useDialogPluginComponent.emits]);

// props
const props = defineProps<{
  user: SSOUser;
}>();

const { dialogRef, onDialogHide } = useDialogPluginComponent();
const $q = useQuasar();
const auth = useAuthStore();
const { t } = useI18n();

const loading = ref(false);
const columns = computed<QTableColumn[]>(() => [
  {
    name: "display",
    label: t("Display Name"),
    field: "display",
    align: "left",
    sortable: true,
  },
  {
    name: "provider",
    label: t("Provider"),
    field: "provider",
    align: "left",
    sortable: true,
  },
  {
    name: "last_login",
    label: t("Last Login"),
    field: "last_login",
    align: "left",
    sortable: true,
  },
  {
    name: "date_joined",
    label: t("Date Joined"),
    field: "date_joined",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "",
    field: "action",
    align: "left",
    sortable: true,
  },
]);

function removeSSOAccount(account: SSOAccount) {
  $q.dialog({
    title: t("Disconnect social account: {display}?", {
      display: account.display,
    }),
    cancel: true,
    ok: { label: t("Delete"), color: "negative" },
  }).onOk(async () => {
    loading.value = true;
    try {
      await disconnectSSOAccount(account.provider, account.uid);
      notifySuccess(t("Social account disconnected successfully"));
      if (
        auth.username === props.user.username &&
        auth.ssoLoginProvider === account.provider
      ) {
        await auth.logout();
      }
    } finally {
      loading.value = false;
      onDialogHide();
    }
  });
}
</script>
