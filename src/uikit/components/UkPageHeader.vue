<template>
  <div class="uk-page-header">
    <div class="uk-page-header__left">
      <slot />
    </div>
    <div class="uk-page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.uk-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--uk-space-6);
}

.uk-page-header__left {
  display: flex;
  align-items: baseline;
  gap: var(--uk-space-3);
}

.uk-page-header__actions {
  display: flex;
  gap: var(--uk-space-2);
}
</style>
