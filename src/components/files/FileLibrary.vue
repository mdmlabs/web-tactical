<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h5">
            <q-icon name="folder" class="q-mr-sm" />
            Библиотека файлов
          </div>
          <div class="q-gutter-sm">
            <q-btn
              outline
              color="secondary"
              icon="visibility"
              label="Тест монитора"
              @click="openTestMonitor"
            />
            <q-btn
              color="primary"
              icon="add"
              label="Новый файл"
              @click="showUploadWizard = true"
            />
          </div>
        </div>

        <div class="row q-gutter-md q-mb-md">
          <q-input
            v-model="search"
            outlined
            dense
            placeholder="Поиск файлов..."
            style="width: 400px"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="filterType"
            outlined
            dense
            :options="fileTypeOptions"
            label="По типу"
            style="width: 150px"
          />

          <q-select
            v-model="filterTags"
            outlined
            dense
            multiple
            use-chips
            :options="tagOptions"
            label="По тегам"
            style="width: 200px"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        flat
        :rows="filteredFiles"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-icon
                :name="getFileIcon(props.row.file_type)"
                size="sm"
                class="q-mr-sm"
                :color="getFileIconColor(props.row.file_type)"
              />
              <div>
                <div class="text-weight-medium">{{ props.row.name }}</div>
                <div class="text-caption text-grey">
                  {{ props.row.description }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge :color="getTypeBadgeColor(props.row.file_type)">
              {{ props.row.file_type }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-tags="props">
          <q-td :props="props">
            <q-chip v-for="tag in props.row.tags" :key="tag" size="sm" dense>
              {{ tag }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round icon="more_vert">
              <q-menu>
                <q-list dense>
                  <q-item
                    clickable
                    v-close-popup
                    @click="deliverFile(props.row)"
                  >
                    <q-item-section avatar>
                      <q-icon name="send" color="primary" />
                    </q-item-section>
                    <q-item-section>Доставить на агенты</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="editFile(props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" />
                    </q-item-section>
                    <q-item-section>Редактировать</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="downloadFile(props.row)"
                  >
                    <q-item-section avatar>
                      <q-icon name="download" />
                    </q-item-section>
                    <q-item-section>Скачать</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item
                    clickable
                    v-close-popup
                    @click="deleteFile(props.row)"
                  >
                    <q-item-section avatar>
                      <q-icon name="delete" color="negative" />
                    </q-item-section>
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- File Upload Wizard Dialog -->
    <q-dialog v-model="showUploadWizard" persistent maximized>
      <FileUploadWizard
        @close="showUploadWizard = false"
        @uploaded="onFileUploaded"
      />
    </q-dialog>

    <!-- File Delivery Monitor Dialog -->
    <q-dialog v-model="showDeliveryMonitor" persistent full-width>
      <FileDeliveryMonitor
        v-if="currentDeliveryJob"
        :job-id="currentDeliveryJob"
        @close="showDeliveryMonitor = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import FileUploadWizard from "./FileUploadWizard.vue";
import FileDeliveryMonitor from "./FileDeliveryMonitor.vue";

export default {
  name: "FileLibrary",
  components: {
    FileUploadWizard,
    FileDeliveryMonitor,
  },
  setup() {
    const search = ref("");
    const filterType = ref("Все типы");
    const filterTags = ref([]);
    const loading = ref(false);
    const showUploadWizard = ref(false);
    const showDeliveryMonitor = ref(false);
    const currentDeliveryJob = ref(null);

    const fileTypeOptions = [
      "Все типы",
      "MSI",
      "EXE",
      "ZIP",
      "SCRIPT",
      "PDF",
      "OTHER",
    ];
    const tagOptions = [
      "дизайн",
      "графика",
      "adobe",
      "офис",
      "безопасность",
      "драйвер",
    ];

    const pagination = ref({
      rowsPerPage: 15,
    });

    // Mock data
    const files = ref([
      {
        id: 1,
        name: "Photoshop Setup",
        description: "Adobe Photoshop 2024",
        file_type: "EXE",
        size: 2457600000,
        size_human: "2.3 GB",
        version: "24.2.1",
        tags: ["дизайн", "графика", "adobe"],
        installs: 47,
      },
      {
        id: 2,
        name: "company-config",
        description: "Корпоративные настройки",
        file_type: "ZIP",
        size: 12582912,
        size_human: "12 MB",
        version: "1.5",
        tags: ["конфиг"],
        installs: 312,
      },
      {
        id: 3,
        name: "security-patch",
        description: "Патч безопасности",
        file_type: "MSI",
        size: 47185920,
        size_human: "45 MB",
        version: "2.0",
        tags: ["безопасность"],
        installs: 1200,
      },
      {
        id: 4,
        name: "employee-manual",
        description: "Руководство сотрудника",
        file_type: "PDF",
        size: 2097152,
        size_human: "2 MB",
        version: "1.0",
        tags: ["документация"],
        installs: 89,
      },
      {
        id: 5,
        name: "internal-tool",
        description: "Внутренний инструмент",
        file_type: "SCRIPT",
        size: 8192,
        size_human: "8 KB",
        version: "1.4",
        tags: ["автоматизация"],
        installs: 56,
      },
    ]);

    const columns = [
      {
        name: "name",
        label: "Название",
        align: "left",
        field: "name",
        sortable: true,
      },
      {
        name: "type",
        label: "Тип",
        align: "center",
        field: "file_type",
        sortable: true,
      },
      {
        name: "size",
        label: "Размер",
        align: "right",
        field: "size_human",
        sortable: true,
      },
      {
        name: "version",
        label: "Версия",
        align: "center",
        field: "version",
        sortable: true,
      },
      {
        name: "installs",
        label: "Установок",
        align: "center",
        field: "installs",
        sortable: true,
      },
      {
        name: "tags",
        label: "Теги",
        align: "left",
        field: "tags",
      },
      {
        name: "actions",
        label: "Действия",
        align: "center",
      },
    ];

    const filteredFiles = computed(() => {
      let result = files.value;

      if (search.value) {
        const searchLower = search.value.toLowerCase();
        result = result.filter(
          (f) =>
            f.name.toLowerCase().includes(searchLower) ||
            f.description.toLowerCase().includes(searchLower),
        );
      }

      if (filterType.value && filterType.value !== "Все типы") {
        result = result.filter((f) => f.file_type === filterType.value);
      }

      if (filterTags.value.length > 0) {
        result = result.filter((f) =>
          filterTags.value.some((tag) => f.tags.includes(tag)),
        );
      }

      return result;
    });

    const getFileIcon = (type) => {
      const icons = {
        MSI: "inventory_2",
        EXE: "settings_applications",
        ZIP: "folder_zip",
        SCRIPT: "code",
        PDF: "picture_as_pdf",
        OTHER: "insert_drive_file",
      };
      return icons[type] || icons.OTHER;
    };

    const getFileIconColor = (type) => {
      const colors = {
        MSI: "blue",
        EXE: "green",
        ZIP: "orange",
        SCRIPT: "purple",
        PDF: "red",
        OTHER: "grey",
      };
      return colors[type] || colors.OTHER;
    };

    const getTypeBadgeColor = (type) => {
      const colors = {
        MSI: "blue",
        EXE: "green",
        ZIP: "orange",
        SCRIPT: "purple",
        PDF: "red",
        OTHER: "grey",
      };
      return colors[type] || colors.OTHER;
    };

    const deliverFile = (file) => {
      console.log("Deliver file:", file);
      // Open delivery monitor with mock job ID
      currentDeliveryJob.value = file.id;
      showDeliveryMonitor.value = true;
    };

    const openTestMonitor = () => {
      // Open delivery monitor with test data
      currentDeliveryJob.value = "test-job-123";
      showDeliveryMonitor.value = true;
    };

    const editFile = (file) => {
      console.log("Edit file:", file);
      // TODO: Open edit dialog
    };

    const downloadFile = (file) => {
      console.log("Download file:", file);
      // TODO: Get signed URL and download
    };

    const deleteFile = (file) => {
      console.log("Delete file:", file);
      // TODO: Confirm and delete
    };

    const onFileUploaded = (fileData) => {
      console.log("File uploaded:", fileData);
      // TODO: Refresh file list
    };

    onMounted(() => {
      // TODO: Load files from API
    });

    return {
      search,
      filterType,
      filterTags,
      loading,
      showUploadWizard,
      showDeliveryMonitor,
      currentDeliveryJob,
      fileTypeOptions,
      tagOptions,
      pagination,
      files,
      columns,
      filteredFiles,
      getFileIcon,
      getFileIconColor,
      getTypeBadgeColor,
      deliverFile,
      openTestMonitor,
      editFile,
      downloadFile,
      deleteFile,
      onFileUploaded,
    };
  },
};
</script>
