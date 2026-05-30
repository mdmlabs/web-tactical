<template>
  <q-select
    v-model="selectedLocale"
    :options="localeOptions"
    :aria-label="t('language.label')"
    class="language-switcher"
    :class="{ 'language-switcher--contrast': contrast }"
    dense
    borderless
    emit-value
    map-options
    options-dense
  >
    <template #prepend>
      <q-icon name="translate" size="18px" />
    </template>
    <q-tooltip>{{ t("language.label") }}</q-tooltip>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { setLocale } from "@/boot/i18n";
import { SUPPORTED_LOCALES, type LocaleCode } from "@/i18n";

defineProps<{
  contrast?: boolean;
}>();

const { locale, t } = useI18n();

const localeOptions = SUPPORTED_LOCALES.map((item) => ({
  label: item.nativeName,
  value: item.code,
}));

const selectedLocale = computed({
  get: () => locale.value as LocaleCode,
  set: (value: LocaleCode) => {
    void setLocale(value, true);
  },
});
</script>

<style scoped>
.language-switcher {
  min-width: 136px;
}

.language-switcher :deep(.q-field__control) {
  min-height: 36px;
  padding: 0 6px;
}

.language-switcher--contrast :deep(.q-field__native),
.language-switcher--contrast :deep(.q-field__marginal),
.language-switcher--contrast :deep(.q-select__dropdown-icon) {
  color: white;
}
</style>
