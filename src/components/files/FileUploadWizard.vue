<template>
  <q-card style="width: 100%; max-width: 900px; height: 90vh">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center justify-between">
        <div class="text-h6">Добавление файла</div>
        <q-btn flat round dense icon="close" @click="$emit('close')" />
      </div>
    </q-card-section>

    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      flat
      header-nav
      style="height: calc(90vh - 60px)"
    >
      <!-- Step 1: Upload -->
      <q-step :name="1" title="Загрузка" icon="cloud_upload" :done="step > 1">
        <div class="q-pa-md">
          <q-card
            flat
            bordered
            class="upload-area"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="cloud_upload" size="80px" color="grey-5" />
              <div class="text-h6 q-mt-md q-mb-sm">
                Перетащите файл сюда или выберите на диске
              </div>
              <div class="text-caption text-grey q-mb-md">
                Поддерживаемые форматы: .msi, .exe, .zip, .ps1, .bat, .txt, .pdf
                и другие
              </div>

              <q-file
                v-model="file"
                outlined
                label="Выбрать файл"
                class="q-mt-md"
                style="max-width: 400px; margin: 0 auto"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <div v-if="file" class="q-mt-lg">
                <q-linear-progress
                  v-if="uploading"
                  :value="uploadProgress / 100"
                  color="primary"
                  size="20px"
                  class="q-mb-md"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      text-color="primary"
                      :label="`${uploadProgress}%`"
                    />
                  </div>
                </q-linear-progress>

                <div v-if="!uploading" class="text-body1">
                  <q-icon name="insert_drive_file" color="primary" />
                  {{ file.name }} ({{ formatFileSize(file.size) }})
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Smart Detection Alert -->
          <q-card
            v-if="detectedMetadata"
            flat
            bordered
            class="q-mt-md bg-blue-1"
          >
            <q-card-section>
              <div class="text-subtitle1 q-mb-sm">
                <q-icon name="lightbulb" color="primary" />
                Обнаружен {{ detectedMetadata.type }}-пакет!
              </div>
              <div class="q-ml-lg">
                <div>
                  <strong>Название:</strong> {{ detectedMetadata.name }}
                </div>
                <div>
                  <strong>Версия:</strong> {{ detectedMetadata.version }}
                </div>
                <div>
                  <strong>Команда установки:</strong>
                  {{ detectedMetadata.install_cmd }}
                </div>
                <div>
                  <strong>Проверка:</strong> {{ detectedMetadata.verification }}
                </div>
              </div>
              <div class="q-mt-md">
                <q-btn
                  color="primary"
                  label="Применить"
                  @click="applyDetectedMetadata"
                />
                <q-btn flat label="Изменить" @click="step = 2" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <q-stepper-navigation>
          <q-btn
            color="primary"
            label="Далее"
            @click="nextStep"
            :disable="!file"
          />
        </q-stepper-navigation>
      </q-step>

      <!-- Step 2: Configuration -->
      <q-step
        :name="2"
        title="Параметры установки"
        icon="settings"
        :done="step > 2"
      >
        <div
          class="q-pa-md"
          style="max-height: calc(90vh - 250px); overflow-y: auto"
        >
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1 q-mb-md">Базовая информация</div>

              <q-input
                v-model="formData.name"
                outlined
                label="Название"
                class="q-mb-md"
              />

              <q-input
                v-model="formData.version"
                outlined
                label="Версия"
                class="q-mb-md"
                hint="Автоматически определена из файла"
              />

              <q-input
                v-model="formData.description"
                outlined
                type="textarea"
                label="Описание"
                rows="2"
                class="q-mb-md"
              />

              <q-select
                v-model="formData.tags"
                outlined
                multiple
                use-chips
                use-input
                new-value-mode="add"
                label="Теги"
                :options="tagOptions"
              />
            </q-card-section>
          </q-card>

          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1 q-mb-md">Установка</div>

              <q-option-group
                v-model="formData.install_type"
                :options="installTypeOptions"
                color="primary"
                class="q-mb-md"
              />

              <q-input
                v-model="formData.install_command"
                outlined
                label="Команда установки"
                class="q-mb-md"
                hint="Использование {file} для пути к файлу"
              />

              <q-input
                v-model.number="formData.timeout"
                outlined
                type="number"
                label="Таймаут (секунды)"
                class="q-mb-md"
              />

              <q-checkbox
                v-model="formData.run_as_user"
                label="Запускать от имени пользователя"
              />
            </q-card-section>
          </q-card>

          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 q-mb-md">Проверка установки</div>

              <q-option-group
                v-model="formData.verification_method"
                :options="verificationOptions"
                color="primary"
                class="q-mb-md"
              />

              <div v-if="formData.verification_method === 'registry'">
                <q-input
                  v-model="formData.registry_path"
                  outlined
                  label="Путь в реестре"
                  class="q-mb-md"
                  hint="Пример: HKLM\SOFTWARE\Google\Chrome"
                />

                <q-input
                  v-model="formData.registry_key"
                  outlined
                  label="Ключ"
                />
              </div>

              <div v-else-if="formData.verification_method === 'file'">
                <q-input
                  v-model="formData.file_path"
                  outlined
                  label="Путь к файлу"
                  hint="Пример: C:\Program Files\App\app.exe"
                />
              </div>

              <div v-else-if="formData.verification_method === 'script'">
                <q-input
                  v-model="formData.verification_script"
                  outlined
                  type="textarea"
                  label="PowerShell скрипт"
                  rows="4"
                  hint="Скрипт должен возвращать $true при успешной установке"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <q-stepper-navigation>
          <q-btn color="primary" label="Далее" @click="nextStep" />
          <q-btn flat label="Назад" @click="step = 1" />
        </q-stepper-navigation>
      </q-step>

      <!-- Step 3: Target Selection -->
      <q-step :name="3" title="Назначение" icon="send">
        <div
          class="q-pa-md"
          style="max-height: calc(90vh - 250px); overflow-y: auto"
        >
          <q-option-group
            v-model="formData.deploy_mode"
            :options="deployModeOptions"
            color="primary"
            class="q-mb-md"
          />

          <q-card
            v-if="formData.deploy_mode === 'deploy_now'"
            flat
            bordered
            class="q-mb-md"
          >
            <q-card-section>
              <div class="text-subtitle1 q-mb-md">Выбор целей</div>

              <q-input
                v-model="targetSearch"
                outlined
                dense
                placeholder="Поиск по имени, отделу, тегам..."
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-tree
                :nodes="agentTree"
                node-key="id"
                tick-strategy="leaf"
                v-model:ticked="selectedAgents"
                default-expand-all
              >
                <template v-slot:default-header="prop">
                  <div class="row items-center">
                    <q-icon
                      :name="prop.node.icon"
                      :color="prop.node.color"
                      class="q-mr-sm"
                    />
                    <div>{{ prop.node.label }}</div>
                    <q-badge
                      v-if="prop.node.count"
                      :label="prop.node.count"
                      class="q-ml-sm"
                    />
                    <q-badge
                      v-if="prop.node.status"
                      :label="prop.node.status"
                      :color="prop.node.statusColor"
                      class="q-ml-sm"
                    />
                  </div>
                </template>
              </q-tree>

              <div class="q-mt-md text-body2">
                Выбрано: <strong>{{ selectedAgents.length }}</strong> агентов
              </div>
            </q-card-section>
          </q-card>

          <q-card v-if="formData.deploy_mode === 'deploy_now'" flat bordered>
            <q-card-section>
              <div class="text-subtitle1 q-mb-md">Дополнительные опции</div>

              <q-checkbox
                v-model="formData.allow_postpone"
                label="Разрешить пользователю отложить"
                class="q-mb-sm"
              />

              <q-input
                v-if="formData.allow_postpone"
                v-model.number="formData.postpone_days"
                outlined
                dense
                type="number"
                label="Максимум дней"
                style="max-width: 150px; margin-left: 30px"
                class="q-mb-md"
              />

              <q-checkbox
                v-model="formData.force_install"
                label="Принудительная установка (игнорировать активность пользователя)"
                class="q-mb-sm"
              />

              <q-checkbox
                v-model="formData.reboot_after"
                label="Перезагрузка после установки"
                class="q-mb-sm"
              />

              <q-checkbox
                v-model="formData.notify_completion"
                label="Уведомить о завершении"
                class="q-mb-sm"
              />

              <q-input
                v-if="formData.notify_completion"
                v-model="formData.notification_email"
                outlined
                dense
                label="Email для уведомления"
                style="max-width: 300px; margin-left: 30px"
              />
            </q-card-section>
          </q-card>
        </div>

        <q-stepper-navigation>
          <q-btn
            color="primary"
            icon="rocket_launch"
            :label="
              formData.deploy_mode === 'library_only'
                ? 'Сохранить в библиотеку'
                : 'Запустить установку'
            "
            @click="submit"
          />
          <q-btn flat label="Назад" @click="step = 2" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "FileUploadWizard",
  emits: ["close", "uploaded"],
  setup(props, { emit }) {
    const step = ref(1);
    const file = ref(null);
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const detectedMetadata = ref(null);
    const targetSearch = ref("");
    const selectedAgents = ref([]);

    const formData = ref({
      name: "",
      version: "",
      description: "",
      tags: [],
      install_type: "auto_msi",
      install_command: "",
      timeout: 900,
      run_as_user: false,
      verification_method: "registry",
      registry_path: "",
      registry_key: "",
      file_path: "",
      verification_script: "",
      deploy_mode: "library_only",
      allow_postpone: false,
      postpone_days: 3,
      force_install: false,
      reboot_after: false,
      notify_completion: false,
      notification_email: "",
    });

    const tagOptions = [
      "дизайн",
      "графика",
      "adobe",
      "офис",
      "безопасность",
      "драйвер",
      "браузер",
    ];

    const installTypeOptions = [
      { label: "Автоматическая (для MSI)", value: "auto_msi" },
      { label: "Ручная настройка параметров", value: "manual" },
      { label: "PowerShell скрипт", value: "script" },
    ];

    const verificationOptions = [
      { label: "Реестр", value: "registry" },
      { label: "Файл существует", value: "file" },
      { label: "Скрипт", value: "script" },
    ];

    const deployModeOptions = [
      {
        label: "Сохранить в библиотеку (назначу позже)",
        value: "library_only",
      },
      { label: "Установить сейчас", value: "deploy_now" },
    ];

    const agentTree = ref([
      {
        id: "client-1",
        label: "Отдел разработки",
        icon: "business",
        color: "blue",
        count: "24 агента",
        children: [
          {
            id: "agent-1",
            label: "dev-01 (Иванов П.)",
            icon: "computer",
            status: "Online",
            statusColor: "positive",
          },
          {
            id: "agent-2",
            label: "dev-02 (Петров В.)",
            icon: "computer",
            status: "Online",
            statusColor: "positive",
          },
          {
            id: "agent-3",
            label: "dev-03 (Сидоров К.)",
            icon: "computer",
            status: "Online",
            statusColor: "positive",
          },
        ],
      },
      {
        id: "client-2",
        label: "Отдел маркетинга",
        icon: "business",
        color: "green",
        count: "12 агентов",
        children: [
          {
            id: "agent-4",
            label: "mrk-01",
            icon: "computer",
            status: "Online",
            statusColor: "positive",
          },
          {
            id: "agent-5",
            label: "mrk-02",
            icon: "computer",
            status: "Offline",
            statusColor: "grey",
          },
        ],
      },
      {
        id: "group-1",
        label: "Все ноутбуки",
        icon: "laptop",
        color: "orange",
        count: "156 агентов",
      },
    ]);

    // Watch file change
    watch(file, (newFile) => {
      if (newFile) {
        formData.value.name = newFile.name.replace(/\.[^/.]+$/, "");
        simulateFileAnalysis(newFile);
      }
    });

    const onDrop = (e) => {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        file.value = droppedFile;
      }
    };

    const simulateFileAnalysis = (uploadedFile) => {
      const ext = uploadedFile.name.split(".").pop().toLowerCase();

      if (ext === "msi") {
        detectedMetadata.value = {
          type: "MSI",
          name: "Adobe Photoshop 2024",
          version: "24.2.1.0",
          install_cmd: 'msiexec /i "{file}" /qn',
          verification: "HKLM\\SOFTWARE\\Adobe\\Photoshop\\24.0",
        };

        formData.value.version = "24.2.1.0";
        formData.value.install_command = 'msiexec /i "{file}" /qn';
        formData.value.registry_path = "HKLM\\SOFTWARE\\Adobe\\Photoshop";
        formData.value.registry_key = "Version";
      } else if (ext === "exe") {
        detectedMetadata.value = {
          type: "EXE",
          name: uploadedFile.name.replace(/\.[^/.]+$/, ""),
          version: "1.0",
          install_cmd: '"{file}" /S',
          verification: "По умолчанию не определено",
        };
      }
    };

    const applyDetectedMetadata = () => {
      if (detectedMetadata.value) {
        formData.value.install_command = detectedMetadata.value.install_cmd;
        step.value = 2;
      }
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const nextStep = () => {
      if (step.value === 1 && file.value) {
        simulateUpload();
      } else {
        step.value++;
      }
    };

    const simulateUpload = () => {
      uploading.value = true;
      uploadProgress.value = 0;

      const interval = setInterval(() => {
        uploadProgress.value += 10;
        if (uploadProgress.value >= 100) {
          clearInterval(interval);
          uploading.value = false;
          step.value = 2;
        }
      }, 200);
    };

    const submit = () => {
      console.log("Submitting:", formData.value);
      emit("uploaded", { file: file.value, formData: formData.value });
      emit("close");
    };

    return {
      step,
      file,
      uploading,
      uploadProgress,
      detectedMetadata,
      targetSearch,
      selectedAgents,
      formData,
      tagOptions,
      installTypeOptions,
      verificationOptions,
      deployModeOptions,
      agentTree,
      onDrop,
      applyDetectedMetadata,
      formatFileSize,
      nextStep,
      submit,
    };
  },
};
</script>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: var(--q-primary);
  background-color: rgba(25, 118, 210, 0.05);
}
</style>
