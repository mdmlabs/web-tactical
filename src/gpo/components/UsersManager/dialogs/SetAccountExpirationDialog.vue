<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 320px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Set Account Expiration</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-grey-7 q-mb-sm">
          User: <strong>{{ userId }}</strong>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-7">
            <q-input
              v-model="expirationDate"
              label="Date"
              outlined
              dense
              readonly
              clearable
              class="cursor-pointer"
              @clear="expirationDate = ''"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="expirationDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="OK" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-input>
          </div>
          <div class="col-5">
            <q-input
              v-model="expirationTime"
              label="Time"
              outlined
              dense
              readonly
              clearable
              class="cursor-pointer"
              @clear="expirationTime = ''"
            >
              <template v-slot:prepend>
                <q-icon name="access_time" />
              </template>
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="expirationTime" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="OK" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Clear"
          color="orange"
          @click="
            expirationDate = '';
            expirationTime = '';
          "
        />
        <q-btn
          color="primary"
          label="Set"
          :loading="loading"
          @click="handleSet"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  userId: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  set: [value: string | undefined];
}>();

const loading = ref(false);
const expirationDate = ref("");
const expirationTime = ref("");

const expirationValue = computed(() => {
  if (!expirationDate.value) return undefined;
  const time = expirationTime.value || "00:00";
  return `${expirationDate.value}T${time}:00.000Z`;
});

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      expirationDate.value = "";
      expirationTime.value = "";
    }
  },
);

function handleSet() {
  emit("set", expirationValue.value);
}

defineExpose({ loading });
</script>
