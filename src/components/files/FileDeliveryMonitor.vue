<template>
  <q-card style="width: 100%; max-width: 1200px">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6">
            <q-icon name="inventory" class="q-mr-sm" />
            Установка: {{ jobInfo.name }}
          </div>
          <div class="text-caption">Запущено: {{ jobInfo.started }} назад</div>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-badge
            :color="getStatusColor(jobInfo.status)"
            :label="getStatusLabel(jobInfo.status)"
            class="text-h6"
          />
          <q-btn flat round dense icon="close" @click="$emit('close')" />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">
        Целевая группа: <strong>{{ jobInfo.target }}</strong> ({{
          results.length
        }}
        устройств)
      </div>

      <!-- Overall Progress -->
      <q-linear-progress
        :value="overallProgress / 100"
        :color="getProgressColor()"
        size="30px"
        class="q-mb-md"
      >
        <div class="absolute-full flex flex-center">
          <q-badge
            color="white"
            :text-color="getProgressColor()"
            :label="`${successCount}/${results.length} (${overallProgress}%)`"
          />
        </div>
      </q-linear-progress>

      <!-- Summary Stats -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Сводка</div>
          <div class="row q-gutter-md">
            <div class="col">
              <q-badge color="positive" icon="check_circle">
                Успешно: {{ successCount }}
              </q-badge>
            </div>
            <div class="col">
              <q-badge color="info" icon="sync">
                В процессе: {{ inProgressCount }}
              </q-badge>
            </div>
            <div class="col">
              <q-badge color="grey" icon="schedule">
                Ожидают: {{ pendingCount }}
              </q-badge>
            </div>
            <div class="col">
              <q-badge color="negative" icon="error">
                Ошибки: {{ failedCount }}
              </q-badge>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Results Table -->
      <q-table
        flat
        bordered
        :rows="results"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        style="max-height: 500px"
      >
        <template v-slot:body-cell-device="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-icon name="computer" class="q-mr-sm" />
              <div>
                <div class="text-weight-medium">{{ props.row.device }}</div>
                <div class="text-caption text-grey">
                  {{ props.row.hostname }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="getStatusColor(props.row.status)"
              :icon="getStatusIcon(props.row.status)"
            >
              {{ getStatusLabel(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-progress="props">
          <q-td :props="props">
            <div style="min-width: 200px">
              <q-linear-progress
                :value="props.row.progress / 100"
                :color="getStatusColor(props.row.status)"
                size="20px"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    :text-color="getStatusColor(props.row.status)"
                    :label="props.row.message || `${props.row.progress}%`"
                  />
                </div>
              </q-linear-progress>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round icon="notes" @click="showLogs(props.row)">
              <q-tooltip>Логи</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'failed'"
              flat
              dense
              round
              icon="refresh"
              color="primary"
              @click="retryAgent(props.row)"
            >
              <q-tooltip>Повторить</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'pending'"
              flat
              dense
              round
              icon="cancel"
              color="negative"
              @click="cancelAgent(props.row)"
            >
              <q-tooltip>Отменить</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <!-- Errors Section -->
      <q-card v-if="errors.length > 0" flat bordered class="q-mt-md bg-red-1">
        <q-card-section>
          <div class="text-subtitle2 q-mb-md">
            <q-icon name="warning" color="negative" />
            Проблемы:
          </div>
          <q-list dense>
            <q-item v-for="(error, index) in errors" :key="index">
              <q-item-section avatar>
                <q-icon name="error_outline" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ error.device }}: {{ error.message }}</q-item-label
                >
                <q-item-label caption>{{ error.details }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        flat
        icon="file_download"
        label="Экспорт отчета"
        @click="exportReport"
      />
      <q-btn
        v-if="failedCount > 0"
        flat
        icon="refresh"
        label="Повторить ошибки"
        color="primary"
        @click="retryFailed"
      />
      <q-btn
        v-if="inProgressCount > 0 || pendingCount > 0"
        flat
        icon="cancel"
        label="Отменить все"
        color="negative"
        @click="cancelAll"
      />
      <q-btn color="primary" label="Закрыть" @click="$emit('close')" />
    </q-card-actions>

    <!-- Logs Dialog -->
    <q-dialog v-model="showLogsDialog" maximized>
      <q-card>
        <q-card-section class="bg-dark text-white">
          <div class="row items-center justify-between">
            <div class="text-h6">
              Логи установки: {{ selectedAgent?.device }}
            </div>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="showLogsDialog = false"
            />
          </div>
        </q-card-section>

        <q-card-section
          class="bg-grey-10 text-white"
          style="font-family: monospace; height: 70vh; overflow-y: auto"
        >
          <div
            v-for="(log, index) in selectedAgent?.logs"
            :key="index"
            class="q-mb-sm"
          >
            <span class="text-grey">[{{ log.timestamp }}]</span>
            <span :class="getLogClass(log.level)"> {{ log.message }}</span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";

export default {
  name: "FileDeliveryMonitor",
  props: {
    jobId: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ["close"],
  setup() {
    const showLogsDialog = ref(false);
    const selectedAgent = ref(null);

    const jobInfo = ref({
      name: "Photoshop 2024",
      target: "Отдел разработки",
      started: "5 минут",
      status: "in_progress",
    });

    // Mock results data
    const results = ref([
      {
        id: 1,
        device: "dev-01",
        hostname: "DESKTOP-001",
        status: "success",
        progress: 100,
        message: "Установлено",
        logs: [
          {
            timestamp: "10:15:23",
            level: "info",
            message: "Начало загрузки файла...",
          },
          { timestamp: "10:15:45", level: "info", message: "Загружено 2.3 GB" },
          {
            timestamp: "10:15:46",
            level: "info",
            message: "Проверка хэша: OK",
          },
          {
            timestamp: "10:15:47",
            level: "info",
            message: "Запуск установки...",
          },
          {
            timestamp: "10:18:12",
            level: "success",
            message: "Установка завершена успешно",
          },
          {
            timestamp: "10:18:13",
            level: "success",
            message: "Проверка: найден в реестре",
          },
        ],
      },
      {
        id: 2,
        device: "dev-02",
        hostname: "DESKTOP-002",
        status: "success",
        progress: 100,
        message: "Установлено",
        logs: [],
      },
      {
        id: 3,
        device: "dev-03",
        hostname: "DESKTOP-003",
        status: "installing",
        progress: 65,
        message: "Установка...",
        logs: [
          {
            timestamp: "10:16:01",
            level: "info",
            message: "Начало загрузки файла...",
          },
          { timestamp: "10:16:23", level: "info", message: "Загружено 2.3 GB" },
          {
            timestamp: "10:16:24",
            level: "info",
            message: "Запуск установки...",
          },
        ],
      },
      {
        id: 4,
        device: "dev-04",
        hostname: "DESKTOP-004",
        status: "downloading",
        progress: 22,
        message: "Загрузка 512 MB / 2.3 GB",
        logs: [
          {
            timestamp: "10:17:45",
            level: "info",
            message: "Начало загрузки файла...",
          },
        ],
      },
      {
        id: 5,
        device: "dev-05",
        hostname: "DESKTOP-005",
        status: "pending",
        progress: 0,
        message: "Ожидание",
        logs: [],
      },
      {
        id: 6,
        device: "server-01",
        hostname: "SERVER-001",
        status: "failed",
        progress: 0,
        message: "Ошибка: Offline",
        logs: [
          {
            timestamp: "10:15:10",
            level: "error",
            message: "Не удалось подключиться к агенту",
          },
          {
            timestamp: "10:15:10",
            level: "error",
            message: "Агент не в сети (последний раз: 2 часа назад)",
          },
        ],
      },
      {
        id: 7,
        device: "server-02",
        hostname: "SERVER-002",
        status: "failed",
        progress: 0,
        message: "Ошибка: Disk full",
        logs: [
          {
            timestamp: "10:15:12",
            level: "info",
            message: "Проверка требований...",
          },
          {
            timestamp: "10:15:13",
            level: "error",
            message: "Недостаточно места на диске",
          },
          {
            timestamp: "10:15:13",
            level: "error",
            message: "Требуется: 5 GB, доступно: 45 MB",
          },
        ],
      },
    ]);

    const columns = [
      {
        name: "device",
        label: "Устройство",
        align: "left",
        field: "device",
        sortable: true,
      },
      {
        name: "status",
        label: "Статус",
        align: "center",
        field: "status",
        sortable: true,
      },
      {
        name: "progress",
        label: "Прогресс",
        align: "center",
        field: "progress",
      },
      {
        name: "actions",
        label: "Действия",
        align: "center",
      },
    ];

    const errors = computed(() => {
      return results.value
        .filter((r) => r.status === "failed")
        .map((r) => ({
          device: r.device,
          message: r.message,
          details: r.hostname,
        }));
    });

    const successCount = computed(() => {
      return results.value.filter((r) => r.status === "success").length;
    });

    const inProgressCount = computed(() => {
      return results.value.filter((r) =>
        ["downloading", "installing", "verifying"].includes(r.status),
      ).length;
    });

    const pendingCount = computed(() => {
      return results.value.filter((r) => r.status === "pending").length;
    });

    const failedCount = computed(() => {
      return results.value.filter((r) => r.status === "failed").length;
    });

    const overallProgress = computed(() => {
      if (results.value.length === 0) return 0;
      return Math.round((successCount.value / results.value.length) * 100);
    });

    const getStatusColor = (status) => {
      const colors = {
        success: "positive",
        downloading: "info",
        installing: "info",
        verifying: "info",
        pending: "grey",
        failed: "negative",
        in_progress: "warning",
        completed: "positive",
      };
      return colors[status] || "grey";
    };

    const getStatusIcon = (status) => {
      const icons = {
        success: "check_circle",
        downloading: "cloud_download",
        installing: "build",
        verifying: "verified",
        pending: "schedule",
        failed: "error",
      };
      return icons[status] || "help";
    };

    const getStatusLabel = (status) => {
      const labels = {
        success: "Готово",
        downloading: "Загрузка",
        installing: "Установка",
        verifying: "Проверка",
        pending: "Ожидает",
        failed: "Ошибка",
        in_progress: "В процессе",
        completed: "Завершено",
      };
      return labels[status] || status;
    };

    const getProgressColor = () => {
      if (overallProgress.value === 100) return "positive";
      if (failedCount.value > 0) return "warning";
      return "info";
    };

    const getLogClass = (level) => {
      const classes = {
        info: "text-blue-3",
        success: "text-green",
        warning: "text-orange",
        error: "text-red",
      };
      return classes[level] || "text-white";
    };

    const showLogs = (agent) => {
      selectedAgent.value = agent;
      showLogsDialog.value = true;
    };

    const retryAgent = (agent) => {
      console.log("Retry agent:", agent);
      agent.status = "pending";
      agent.progress = 0;
      agent.message = "Повторная попытка...";
    };

    const cancelAgent = (agent) => {
      console.log("Cancel agent:", agent);
      agent.status = "failed";
      agent.message = "Отменено";
    };

    const retryFailed = () => {
      console.log("Retry all failed");
      results.value.forEach((r) => {
        if (r.status === "failed") {
          r.status = "pending";
          r.progress = 0;
          r.message = "Повторная попытка...";
        }
      });
    };

    const cancelAll = () => {
      console.log("Cancel all");
      results.value.forEach((r) => {
        if (["pending", "downloading", "installing"].includes(r.status)) {
          r.status = "failed";
          r.message = "Отменено";
        }
      });
    };

    const exportReport = () => {
      console.log("Export report");
      // TODO: Generate CSV/PDF report
    };

    // Simulate real-time updates
    let updateInterval;
    onMounted(() => {
      updateInterval = setInterval(() => {
        results.value.forEach((r) => {
          if (r.status === "downloading") {
            r.progress = Math.min(100, r.progress + 5);
            if (r.progress >= 100) {
              r.status = "installing";
              r.progress = 0;
              r.message = "Установка...";
            }
          } else if (r.status === "installing") {
            r.progress = Math.min(100, r.progress + 3);
            if (r.progress >= 100) {
              r.status = "verifying";
              r.progress = 0;
              r.message = "Проверка...";
            }
          } else if (r.status === "verifying") {
            r.progress = Math.min(100, r.progress + 10);
            if (r.progress >= 100) {
              r.status = "success";
              r.progress = 100;
              r.message = "Установлено";
            }
          }
        });
      }, 2000);
    });

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    });

    return {
      showLogsDialog,
      selectedAgent,
      jobInfo,
      results,
      columns,
      errors,
      successCount,
      inProgressCount,
      pendingCount,
      failedCount,
      overallProgress,
      getStatusColor,
      getStatusIcon,
      getStatusLabel,
      getProgressColor,
      getLogClass,
      showLogs,
      retryAgent,
      cancelAgent,
      retryFailed,
      cancelAll,
      exportReport,
    };
  },
};
</script>
