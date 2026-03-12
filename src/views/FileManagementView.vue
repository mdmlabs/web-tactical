<template>
  <div class="q-pa-md">
    <FileLibrary />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import FileLibrary from '@/components/files/FileLibrary.vue';

export default defineComponent({
  name: 'FileManagementView',
  components: {
    FileLibrary,
  },
});
</script>
