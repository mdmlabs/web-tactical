<template>
  <q-page class="gpo-manager-page">
    <div class="row gpo-main-row">
      <div class="gpo-sidebar col-2">
        <div class="gpo-sidebar-header">
          <div class="text-h6 q-pa-md">Policy Manager</div>
        </div>

        <q-tabs
          v-model="mainTab"
          vertical
          class="gpo-nav-tabs"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab
            name="dashboard"
            icon="dashboard"
            label="Дэшборд"
            class="gpo-nav-tab"
          />
          <q-tab
            name="network"
            icon="router"
            label="Сеть"
            class="gpo-nav-tab"
          />
          <q-tab
            name="library"
            icon="library_books"
            label="Библиотека политик"
            class="gpo-nav-tab"
          />
          <q-tab
            name="windows"
            icon="windows"
            label="Политики Windows"
            class="gpo-nav-tab"
          />
          <q-tab
            name="devices"
            icon="devices"
            label="Политики по устройствам"
            class="gpo-nav-tab"
          />
        </q-tabs>
      </div>

      <div
        v-if="mainTab !== 'library'"
        :key="`content-${mainTab}`"
        class="gpo-content col-10"
      >
        <div class="row gpo-content-row">
          <div
            :class="
              mainTab === 'dashboard'
                ? 'gpo-main-content col-9'
                : 'gpo-main-content col-12'
            "
          >
            <div
              v-if="mainTab === 'dashboard' && selectedAgent"
              :key="`dashboard-agent-${contentTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <div class="row items-center full-width">
                  <div class="col">
                    <q-tabs
                      v-model="contentTab"
                      dense
                      inline-label
                      class="text-grey"
                      active-color="primary"
                      indicator-color="primary"
                      align="left"
                      narrow-indicator
                      no-caps
                    >
                      <q-tab name="overview" icon="info" label="Overview" />
                      <q-tab
                        name="system"
                        icon="settings"
                        label="System Info"
                      />
                      <q-tab name="users" icon="people" label="Users" />
                    </q-tabs>
                  </div>
                  <div class="col-auto q-pa-sm">
                    <q-btn
                      flat
                      dense
                      icon="arrow_back"
                      label="Назад к дашборду"
                      color="primary"
                      @click="clearAgentSelection"
                    />
                  </div>
                </div>
                <q-separator />
              </div>

              <q-tab-panels v-model="contentTab" class="gpo-content-panels">
                <q-tab-panel name="overview" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <q-card>
                      <q-card-section>
                        <div class="row q-gutter-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">Hostname</div>
                            <div>
                              {{
                                agentDetails?.hostName ||
                                selectedAgent.hostname ||
                                "N/A"
                              }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">Статус</div>
                            <q-badge
                              :color="
                                getAgentStatusColor(
                                  agentDetails?.isOnline !== undefined
                                    ? agentDetails.isOnline
                                      ? 'online'
                                      : 'offline'
                                    : selectedAgent.status,
                                )
                              "
                              :label="
                                getAgentStatusLabel(
                                  agentDetails?.isOnline !== undefined
                                    ? agentDetails.isOnline
                                      ? 'online'
                                      : 'offline'
                                    : selectedAgent.status,
                                )
                              "
                            />
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Последний ответ
                            </div>
                            <div>
                              {{
                                agentDetails?.lastHeartbeatUnix
                                  ? formatDate(
                                      new Date(
                                        (typeof agentDetails.lastHeartbeatUnix ===
                                        "string"
                                          ? Number.parseInt(
                                              agentDetails.lastHeartbeatUnix,
                                              10,
                                            )
                                          : agentDetails.lastHeartbeatUnix) *
                                          1000,
                                      ).toISOString(),
                                    )
                                  : formatDate(selectedAgent.last_seen)
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Операционная система
                            </div>
                            <div>
                              {{
                                agentDetails?.nodeInfo?.systemInfo?.osVersion ||
                                agentDetails?.nodeInfo?.systemInfo
                                  ?.os_version ||
                                selectedAgent.operating_system ||
                                "N/A"
                              }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">Модель</div>
                            <div>
                              {{ agentDetails?.nodeInfo?.model || "N/A" }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Версия прошивки
                            </div>
                            <div>
                              {{
                                agentDetails?.nodeInfo?.firmwareVersion ||
                                agentDetails?.nodeInfo?.firmware_version ||
                                "N/A"
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">В домене</div>
                            <div>
                              {{
                                (
                                  agentDetails?.nodeInfo?.isDomainJoined !==
                                  undefined
                                    ? agentDetails.nodeInfo.isDomainJoined
                                    : agentDetails?.nodeInfo
                                          ?.is_domain_joined !== undefined
                                      ? agentDetails.nodeInfo.is_domain_joined
                                      : false
                                )
                                  ? "Да"
                                  : "Нет"
                              }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-actions>
                        <q-btn
                          color="primary"
                          icon="policy"
                          label="Применить политику"
                          @click="openApplyPolicyDialog"
                          :loading="actionLoading"
                        />
                        <q-btn
                          color="secondary"
                          icon="visibility"
                          label="Примененные политики"
                          @click="openAppliedPoliciesDialog"
                        />
                      </q-card-actions>
                    </q-card>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="system" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">Системная информация</div>
                    <q-card v-if="agentDetails?.nodeInfo">
                      <q-card-section>
                        <q-scroll-area style="height: 600px">
                          <q-list>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Hostname</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.hostName ||
                                  agentDetails.nodeInfo.systemInfo?.host_name ||
                                  agentDetails.hostName ||
                                  selectedAgent.hostname
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label
                                  >Операционная система</q-item-label
                                >
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.osVersion ||
                                  agentDetails.nodeInfo.systemInfo
                                    ?.os_version ||
                                  selectedAgent.operating_system ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>CPU</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.cpu || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>RAM</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo?.ramGb ||
                                  agentDetails.nodeInfo.systemInfo?.ram_gb
                                    ? `${agentDetails.nodeInfo.systemInfo.ramGb || agentDetails.nodeInfo.systemInfo.ram_gb} GB`
                                    : "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Материнская плата</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.systemInfo
                                    ?.motherboard || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (agentDetails.nodeInfo.systemInfo?.disks || [])
                                  ?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>Диски</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(disk, index) in agentDetails
                                      .nodeInfo?.systemInfo?.disks || []"
                                    :key="index"
                                  >
                                    {{ disk }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (agentDetails.nodeInfo.systemInfo?.gpu || [])
                                  ?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>GPU</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(gpu, index) in agentDetails.nodeInfo
                                      ?.systemInfo?.gpu || []"
                                    :key="index"
                                  >
                                    {{ gpu }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (
                                  agentDetails.nodeInfo.systemInfo
                                    ?.ipAddresses ||
                                  agentDetails.nodeInfo.systemInfo?.ip_addresses
                                )?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>IP адреса</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(ip, index) in agentDetails.nodeInfo
                                      .systemInfo.ipAddresses ||
                                    agentDetails.nodeInfo.systemInfo
                                      .ip_addresses ||
                                    []"
                                    :key="index"
                                    class="q-mb-xs"
                                  >
                                    {{ ip }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="
                                (
                                  agentDetails.nodeInfo.systemInfo
                                    ?.macAddresses ||
                                  agentDetails.nodeInfo.systemInfo
                                    ?.mac_addresses
                                )?.length
                              "
                            >
                              <q-item-section>
                                <q-item-label>MAC адреса</q-item-label>
                                <q-item-label caption>
                                  <div
                                    v-for="(mac, index) in agentDetails.nodeInfo
                                      .systemInfo.macAddresses ||
                                    agentDetails.nodeInfo.systemInfo
                                      .mac_addresses ||
                                    []"
                                    :key="index"
                                    class="q-mb-xs"
                                  >
                                    {{ mac || "(пусто)" }}
                                  </div>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item>
                              <q-item-section>
                                <q-item-label>Производитель</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.manufacturer || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Модель</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.model || "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Версия прошивки</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.firmwareVersion ||
                                  agentDetails.nodeInfo.firmware_version ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Сборка ОС</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.osBuild ||
                                  agentDetails.nodeInfo.os_build ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Часовой пояс</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.timeZone ||
                                  agentDetails.nodeInfo.time_zone ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>В домене</q-item-label>
                                <q-item-label caption>{{
                                  (
                                    agentDetails.nodeInfo.isDomainJoined !==
                                    undefined
                                      ? agentDetails.nodeInfo.isDomainJoined
                                      : agentDetails.nodeInfo
                                            .is_domain_joined !== undefined
                                        ? agentDetails.nodeInfo.is_domain_joined
                                        : false
                                  )
                                    ? "Да"
                                    : "Нет"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Статус антивируса</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo.antivirusStatus ||
                                  agentDetails.nodeInfo.antivirus_status ||
                                  "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Онлайн статус</q-item-label>
                                <q-item-label caption>{{
                                  (
                                    agentDetails.nodeInfo.isOnline !== undefined
                                      ? agentDetails.nodeInfo.isOnline
                                      : agentDetails.nodeInfo.is_online !==
                                          undefined
                                        ? agentDetails.nodeInfo.is_online
                                        : false
                                  )
                                    ? "Онлайн"
                                    : "Офлайн"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label>Последняя загрузка</q-item-label>
                                <q-item-label caption>{{
                                  agentDetails.nodeInfo?.lastBootTimeUnix ||
                                  agentDetails.nodeInfo?.last_boot_time_unix
                                    ? (() => {
                                        const bootTime =
                                          agentDetails.nodeInfo
                                            ?.lastBootTimeUnix ||
                                          agentDetails.nodeInfo
                                            ?.last_boot_time_unix;
                                        if (!bootTime) return "N/A";
                                        const bootTimeValue =
                                          typeof bootTime === "string"
                                            ? Number.parseInt(bootTime, 10)
                                            : bootTime;
                                        return formatDate(
                                          new Date(
                                            bootTimeValue * 1000,
                                          ).toISOString(),
                                        );
                                      })()
                                    : "N/A"
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </q-card-section>
                    </q-card>
                    <q-card v-else>
                      <q-card-section>
                        <div class="text-center text-grey-6">
                          Загрузка системной информации...
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="users" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">Пользователи</div>
                    <q-table
                      :rows="usersList"
                      :columns="usersColumns"
                      row-key="sid"
                      :loading="usersLoading"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-type="props">
                        <q-td :props="props">
                          <q-badge
                            :color="
                              props.value === 'Local' ? 'primary' : 'secondary'
                            "
                            :label="props.value"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'dashboard'"
              :key="`dashboard-${subTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="subTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab name="status" icon="info" label="Общий статус" />
                  <q-tab name="events" icon="event" label="Последние события" />
                  <q-tab
                    name="agents"
                    icon="computer"
                    label="Активные агенты"
                  />
                  <q-tab name="errors" icon="error" label="Ошибки политик" />
                  <q-tab name="overview" icon="visibility" label="Обзор" />
                  <q-tab name="metrics" icon="bar_chart" label="Метрики" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="subTab" class="gpo-content-panels">
                <q-tab-panel name="status" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Общий статус</div>
                  <div class="row q-gutter-md">
                    <q-card class="col-4">
                      <q-card-section>
                        <div class="text-h6">{{ agentsList.length }}</div>
                        <div class="text-caption text-grey-7">
                          Всего устройств
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-card class="col-4">
                      <q-card-section>
                        <div class="text-h6 text-positive">
                          {{
                            agentsList.filter((a) => a.status === "online")
                              .length
                          }}
                        </div>
                        <div class="text-caption text-grey-7">Онлайн</div>
                      </q-card-section>
                    </q-card>
                    <q-card class="col-4">
                      <q-card-section>
                        <div class="text-h6 text-negative">
                          {{
                            agentsList.filter((a) => a.status === "overdue")
                              .length
                          }}
                        </div>
                        <div class="text-caption text-grey-7">Просрочено</div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <q-card class="q-mt-md">
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">
                        Статистика по устройствам
                      </div>
                      <q-list>
                        <q-item>
                          <q-item-section>
                            <q-item-label>Всего политик</q-item-label>
                            <q-item-label caption>
                              {{ policiesStore.policies.value.length }} политик
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>Активных назначений</q-item-label>
                            <q-item-label caption>Загрузка...</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="events" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Последние события</div>
                  <q-card>
                    <q-card-section>
                      <q-timeline color="primary">
                        <q-timeline-entry
                          v-for="(event, index) in recentEvents"
                          :key="index"
                          :title="event.title"
                          :subtitle="event.date"
                          :icon="event.icon"
                          :color="event.color"
                        >
                          <div>{{ event.description }}</div>
                        </q-timeline-entry>
                        <q-timeline-entry
                          v-if="recentEvents.length === 0"
                          title="Нет событий"
                          subtitle="События появятся здесь"
                          icon="info"
                        >
                          <div>
                            События будут отображаться здесь после их появления
                          </div>
                        </q-timeline-entry>
                      </q-timeline>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="agents" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Активные агенты</div>
                  <q-table
                    :rows="agentsList"
                    :columns="agentTableColumns"
                    row-key="id"
                    :loading="agentsLoading"
                    flat
                    bordered
                  >
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <q-badge
                          :color="getAgentStatusColor(props.value)"
                          :label="getAgentStatusLabel(props.value)"
                          rounded
                        >
                          <q-tooltip>
                            {{ getAgentStatusTooltip(props.value) }}
                          </q-tooltip>
                        </q-badge>
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="errors" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Ошибки политик</div>
                  <q-card>
                    <q-card-section>
                      <div class="text-center q-pa-lg text-grey-6">
                        <q-icon
                          name="check_circle"
                          size="3em"
                          class="q-mb-md"
                        />
                        <div>Ошибок не обнаружено</div>
                        <div class="text-caption q-mt-sm">
                          Все политики применяются корректно
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="overview" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Обзор</div>
                  <div class="row q-gutter-md">
                    <q-card class="col-6">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-sm">Устройства</div>
                        <div class="text-h4">{{ agentsList.length }}</div>
                        <div class="text-caption text-grey-7">
                          Всего устройств в системе
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-card class="col-6">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-sm">Политики</div>
                        <div class="text-h4">
                          {{ policiesStore.policies.value.length }}
                        </div>
                        <div class="text-caption text-grey-7">
                          Доступных политик
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <q-card class="q-mt-md">
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">Быстрый доступ</div>
                      <div class="row q-gutter-sm">
                        <q-btn
                          color="primary"
                          label="Библиотека политик"
                          icon="library_books"
                          @click="mainTab = 'library'"
                        />
                        <q-btn
                          color="secondary"
                          label="Политики Windows"
                          icon="windows"
                          @click="mainTab = 'windows'"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="metrics" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Метрики</div>
                  <div class="row q-gutter-md">
                    <q-card class="col-12">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-md">
                          Статистика применения политик
                        </div>
                        <q-list>
                          <q-item>
                            <q-item-section>
                              <q-item-label>Политик применено</q-item-label>
                              <q-item-label caption
                                >Загрузка данных...</q-item-label
                              >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label>Успешных применений</q-item-label>
                              <q-item-label caption
                                >Загрузка данных...</q-item-label
                              >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label>Ошибок применения</q-item-label>
                              <q-item-label caption>0</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'network'"
              :key="`network-${networkTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="networkTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab name="agents" icon="computer" label="Агенты" />
                  <q-tab name="management" icon="settings" label="Управление" />
                  <q-tab name="network" icon="router" label="Сеть" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="networkTab" class="gpo-content-panels">
                <q-tab-panel name="agents" class="q-pa-md">
                  <div class="row q-mb-md items-center">
                    <div class="col-auto">
                      <div class="text-h6">Агенты</div>
                    </div>
                    <q-space />
                    <div class="col-auto">
                      <q-btn-toggle
                        v-model="networkStatusFilter"
                        :options="[
                          { label: 'Все', value: 'all' },
                          { label: 'Онлайн', value: 'online' },
                          { label: 'Офлайн', value: 'offline' },
                        ]"
                        color="primary"
                        dense
                      />
                    </div>
                  </div>
                  <q-table
                    :rows="filteredNetworkAgents"
                    :columns="agentTableColumns"
                    row-key="id"
                    :loading="agentsLoading"
                    flat
                    bordered
                    @row-click="(evt, row) => selectAgent(row)"
                  >
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <q-badge
                          :color="getAgentStatusColor(props.value)"
                          :label="getAgentStatusLabel(props.value)"
                          rounded
                        >
                          <q-tooltip>
                            {{ getAgentStatusTooltip(props.value) }}
                          </q-tooltip>
                        </q-badge>
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>

                <q-tab-panel name="management" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Управление</div>
                  <div v-if="selectedAgent" class="q-mb-md">
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-sm">
                          {{ selectedAgent.hostname }}
                        </div>
                        <div class="row q-gutter-md">
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Общий статус
                            </div>
                            <q-badge
                              :color="getAgentStatusColor(selectedAgent.status)"
                              :label="getAgentStatusLabel(selectedAgent.status)"
                              class="q-mt-xs"
                            />
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">
                              Последний ответ
                            </div>
                            <div class="q-mt-xs">
                              {{ formatDate(selectedAgent.last_seen) }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="text-caption text-grey-7">ОС</div>
                            <div class="q-mt-xs">
                              {{ selectedAgent.operating_system || "N/A" }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-actions>
                        <q-btn
                          color="primary"
                          icon="refresh"
                          label="Перезагрузить"
                          @click="handleReboot"
                          :loading="actionLoading"
                        />
                        <q-btn
                          color="warning"
                          icon="power_settings_new"
                          label="Выключить"
                          @click="handleShutdown"
                          :loading="actionLoading"
                        />
                        <q-btn
                          color="negative"
                          icon="delete"
                          label="Удалить"
                          @click="handleDelete"
                          :loading="actionLoading"
                        />
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Выберите агента из списка для управления
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="network" class="q-pa-md">
                  <div class="text-h6 q-mb-md">Сеть</div>
                  <div v-if="selectedAgent">
                    <q-card class="q-mb-md">
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-md">
                          IP-конфигурация
                        </div>
                        <q-list>
                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="fas fa-network-wired" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>LAN IP</q-item-label>
                              <q-item-label caption>
                                {{ networkInfo.local_ips || "Загрузка..." }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="fas fa-globe-americas" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>Public IP</q-item-label>
                              <q-item-label caption>
                                {{ networkInfo.public_ip || "Загрузка..." }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle1 q-mb-md">Ping</div>
                        <div class="row q-gutter-md items-center">
                          <div class="col-auto">
                            <q-btn
                              color="primary"
                              icon="network_check"
                              label="Выполнить Ping"
                              @click="handlePing"
                              :loading="pingLoading"
                            />
                          </div>
                          <div class="col" v-if="pingResult">
                            <q-badge
                              :color="
                                pingResult.status === 'online'
                                  ? 'positive'
                                  : 'negative'
                              "
                              :label="
                                pingResult.status === 'online'
                                  ? 'Онлайн'
                                  : 'Офлайн'
                              "
                            />
                            <div
                              class="text-caption q-mt-xs"
                              v-if="pingResult.message"
                            >
                              {{ pingResult.message }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Выберите агента из списка для просмотра сетевой информации
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'devices'"
              :key="`devices-${devicesTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="devicesTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab
                    name="assignment"
                    icon="assignment"
                    label="Назначение"
                  />
                  <q-tab name="history" icon="history" label="История" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="devicesTab" class="gpo-content-panels">
                <q-tab-panel name="assignment" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">
                      Назначение политик для {{ selectedAgent.hostname }}
                    </div>
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle2 q-mb-md">
                          Доступные политики
                        </div>
                        <q-scroll-area class="policy-assignment-scroll-area">
                          <q-table
                            :rows="policiesStore.policies.value"
                            :columns="policyAssignmentColumns"
                            row-key="id"
                            :loading="policiesStore.isLoading.value"
                            flat
                            bordered
                            :filter="policyFilter"
                            selection="multiple"
                            v-model:selected="selectedPoliciesForAssignment"
                            class="policy-assignment-table"
                          >
                            <template v-slot:top>
                              <q-input
                                v-model="policyFilter"
                                placeholder="Поиск политик..."
                                dense
                                outlined
                                class="col-4"
                              >
                                <template v-slot:append>
                                  <q-icon name="search" />
                                </template>
                              </q-input>
                              <q-space />
                              <q-btn
                                color="primary"
                                icon="add"
                                label="Назначить выбранные"
                                :disable="
                                  selectedPoliciesForAssignment.length === 0
                                "
                                @click="assignPolicies"
                                :loading="assignmentLoading"
                              />
                            </template>
                          </q-table>
                        </q-scroll-area>
                      </q-card-section>
                    </q-card>
                    <q-card class="q-mt-md">
                      <q-card-section>
                        <div class="text-subtitle2 q-mb-md">
                          Назначенные политики
                        </div>
                        <q-scroll-area class="policy-assignment-scroll-area">
                          <q-table
                            :rows="assignedPolicies"
                            :columns="assignedPolicyColumns"
                            row-key="id"
                            flat
                            bordered
                            class="policy-assignment-table"
                          >
                            <template v-slot:body-cell-actions="props">
                              <q-td :props="props">
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="delete"
                                  color="negative"
                                  size="sm"
                                  @click="removePolicyAssignment(props.row)"
                                >
                                  <q-tooltip>Удалить назначение</q-tooltip>
                                </q-btn>
                              </q-td>
                            </template>
                          </q-table>
                        </q-scroll-area>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Выберите устройство для назначения политик
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="history" class="q-pa-md">
                  <div v-if="selectedAgent">
                    <div class="text-h6 q-mb-md">
                      История действий для {{ selectedAgent.hostname }}
                    </div>
                    <q-card>
                      <q-card-section>
                        <div class="row q-gutter-md">
                          <q-btn
                            color="primary"
                            icon="refresh"
                            label="Применить повторно"
                            @click="reapplyPolicies"
                            :loading="actionLoading"
                            :disable="!selectedAgent"
                          />
                          <q-btn
                            color="warning"
                            icon="undo"
                            label="Откатить"
                            @click="rollbackPolicies"
                            :loading="actionLoading"
                            :disable="!selectedAgent"
                          />
                          <q-btn
                            color="secondary"
                            icon="sync"
                            label="Синхронизировать"
                            @click="synchronizePolicies"
                            :loading="actionLoading"
                            :disable="!selectedAgent"
                          />
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-card class="q-mt-md">
                      <q-card-section>
                        <div class="text-subtitle2 q-mb-md">
                          История действий
                        </div>
                        <q-timeline color="primary">
                          <q-timeline-entry
                            v-for="(action, index) in deviceActionHistory"
                            :key="index"
                            :title="action.title"
                            :subtitle="action.date"
                            :icon="action.icon"
                            :color="action.color"
                          >
                            <div>{{ action.description }}</div>
                          </q-timeline-entry>
                          <q-timeline-entry
                            v-if="deviceActionHistory.length === 0"
                            title="Нет действий"
                            subtitle="История действий пуста"
                            icon="info"
                          >
                            <div>История действий будет отображаться здесь</div>
                          </q-timeline-entry>
                        </q-timeline>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div v-else class="text-center q-pa-xl">
                    <q-icon
                      name="info"
                      size="3em"
                      class="q-mb-md text-grey-7"
                    />
                    <div class="text-grey-7">
                      Выберите устройство для просмотра истории действий
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div
              v-else-if="mainTab === 'windows'"
              :key="`windows-${windowsTab}`"
              class="gpo-content-panels"
            >
              <div class="gpo-content-header">
                <q-tabs
                  v-model="windowsTab"
                  dense
                  inline-label
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  no-caps
                >
                  <q-tab name="security" icon="security" label="Безопасность" />
                  <q-tab name="system" icon="computer" label="Система" />
                </q-tabs>
                <q-separator />
              </div>

              <q-tab-panels v-model="windowsTab" class="gpo-content-panels">
                <q-tab-panel name="security" class="q-pa-md">
                  <div class="gpo-content-header q-mb-md">
                    <q-tabs
                      v-model="securitySubTab"
                      dense
                      inline-label
                      class="text-grey"
                      active-color="primary"
                      indicator-color="primary"
                      align="left"
                      narrow-indicator
                      no-caps
                    >
                      <q-tab name="passwords" icon="lock" label="Пароли" />
                      <q-tab
                        name="bitlocker"
                        icon="vpn_key"
                        label="BitLocker"
                      />
                      <q-tab name="firewall" icon="security" label="Firewall" />
                    </q-tabs>
                    <q-separator />
                  </div>

                  <q-tab-panels
                    v-model="securitySubTab"
                    class="gpo-windows-sub-panels"
                  >
                    <q-tab-panel name="passwords" class="q-pa-md">
                      <div class="text-h6 q-mb-md">Политики паролей</div>
                      <q-card>
                        <q-card-section>
                          <div class="text-center q-pa-lg text-grey-6">
                            <q-icon name="lock" size="3em" class="q-mb-md" />
                            <div>Настройки политик паролей</div>
                            <div class="text-caption q-mt-sm">
                              Здесь будут отображаться настройки политик паролей
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-tab-panel>

                    <q-tab-panel name="bitlocker" class="q-pa-md">
                      <div class="text-h6 q-mb-md">BitLocker</div>
                      <q-card>
                        <q-card-section>
                          <div class="text-center q-pa-lg text-grey-6">
                            <q-icon name="vpn_key" size="3em" class="q-mb-md" />
                            <div>Настройки BitLocker</div>
                            <div class="text-caption q-mt-sm">
                              Здесь будут отображаться настройки BitLocker
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-tab-panel>

                    <q-tab-panel name="firewall" class="q-pa-md">
                      <div class="text-h6 q-mb-md">Firewall</div>
                      <q-card>
                        <q-card-section>
                          <div class="text-center q-pa-lg text-grey-6">
                            <q-icon
                              name="security"
                              size="3em"
                              class="q-mb-md"
                            />
                            <div>Настройки Firewall</div>
                            <div class="text-caption q-mt-sm">
                              Здесь будут отображаться настройки Firewall
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-tab-panel>

                <!-- Вкладка Система -->
                <q-tab-panel name="system" class="q-pa-md">
                  <div class="gpo-content-header q-mb-md">
                    <q-tabs
                      v-model="systemSubTab"
                      dense
                      inline-label
                      class="text-grey"
                      active-color="primary"
                      indicator-color="primary"
                      align="left"
                      narrow-indicator
                      no-caps
                    >
                      <q-tab
                        name="services"
                        icon="settings_applications"
                        label="Службы"
                      />
                      <q-tab name="registry" icon="storage" label="Реестр" />
                    </q-tabs>
                    <q-separator />
                  </div>

                  <q-tab-panels
                    v-model="systemSubTab"
                    class="gpo-windows-sub-panels"
                  >
                    <!-- Службы -->
                    <q-tab-panel name="services" class="q-pa-md">
                      <div class="text-h6 q-mb-md">Службы</div>
                      <q-card>
                        <q-card-section>
                          <div class="text-center q-pa-lg text-grey-6">
                            <q-icon
                              name="settings_applications"
                              size="3em"
                              class="q-mb-md"
                            />
                            <div>Настройки служб</div>
                            <div class="text-caption q-mt-sm">
                              Здесь будут отображаться настройки служб Windows
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-tab-panel>

                    <q-tab-panel name="registry" class="q-pa-md">
                      <div class="text-h6 q-mb-md">Реестр</div>
                      <q-card>
                        <q-card-section>
                          <div class="text-center q-pa-lg text-grey-6">
                            <q-icon name="storage" size="3em" class="q-mb-md" />
                            <div>Настройки реестра</div>
                            <div class="text-caption q-mt-sm">
                              Здесь будут отображаться настройки реестра Windows
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>

          <div
            v-if="mainTab === 'devices' || mainTab === 'dashboard'"
            :key="`devices-${mainTab}`"
            class="gpo-devices-panel col-3"
          >
            <div class="gpo-devices-header q-pa-sm">
              <div class="text-subtitle2 text-weight-medium">
                Устройства
                <q-badge
                  v-if="agentsList.length > 0"
                  color="primary"
                  :label="agentsList.length"
                  rounded
                  class="q-ml-sm"
                />
              </div>
            </div>
            <q-scroll-area class="gpo-devices-scroll">
              <div v-if="agentsLoading" class="text-center q-pa-md">
                <q-spinner color="primary" size="2em" />
                <div class="q-mt-sm text-caption">Загрузка устройств...</div>
              </div>

              <div
                v-else-if="agentsError && agentsList.length === 0"
                class="text-center q-pa-md text-negative"
              >
                <q-icon name="error" size="2em" />
                <div class="q-mt-sm text-caption">Ошибка загрузки</div>
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Повторить"
                  @click="loadAgents"
                  class="q-mt-xs"
                />
              </div>

              <div
                v-else-if="!agentsLoading && agentsList.length === 0"
                class="text-center q-pa-md text-grey-6"
              >
                <q-icon name="devices_other" size="2em" />
                <div class="q-mt-sm text-caption">нет агентов</div>
              </div>

              <q-list
                v-else-if="!agentsLoading && agentsList.length > 0"
                dense
                class="gpo-agents-list-items"
              >
                <q-item
                  v-for="agent in agentsList"
                  :key="agent.id"
                  clickable
                  v-ripple
                  :active="selectedAgent?.id === agent.id"
                  @click="selectAgent(agent)"
                  class="gpo-agent-item"
                >
                  <q-item-section avatar>
                    <q-icon
                      name="computer"
                      :color="getAgentStatusColor(agent.status)"
                      size="24px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ agent.hostname }}</q-item-label>
                    <q-item-label caption>
                      {{ formatDate(agent.last_seen) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      :color="getAgentStatusColor(agent.status)"
                      :label="getAgentStatusLabel(agent.status)"
                      rounded
                    >
                      <q-tooltip>
                        {{ getAgentStatusTooltip(agent.status) }}
                      </q-tooltip>
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
      </div>

      <div
        v-if="mainTab === 'library'"
        :key="`library-${libraryTab}`"
        class="gpo-content col-10 gpo-library-content"
      >
        <div class="gpo-content-header">
          <div class="text-h6 q-pa-md">Библиотека политик</div>
        </div>
        <div class="gpo-content-panels q-pa-md">
          <q-tabs
            v-model="libraryTab"
            dense
            inline-label
            class="text-grey q-mb-md"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            no-caps
          >
            <q-tab name="policies" icon="rule" label="Политики" />
            <q-tab name="management" icon="settings" label="Управление" />
          </q-tabs>

          <q-tab-panels v-model="libraryTab" class="gpo-library-panels">
            <q-tab-panel name="policies" class="q-pa-none">
              <q-tabs
                v-model="policiesSubTab"
                dense
                inline-label
                class="text-grey q-mb-md"
                active-color="primary"
                indicator-color="primary"
                align="left"
                narrow-indicator
                no-caps
              >
                <q-tab name="all" icon="list" label="Все политики" />
                <q-tab name="templates" icon="description" label="Шаблоны" />
                <q-tab name="archive" icon="archive" label="Архив" />
              </q-tabs>

              <q-tab-panels
                v-model="policiesSubTab"
                class="gpo-policies-sub-panels"
              >
                <q-tab-panel name="all" class="q-pa-none">
                  <div class="row q-mb-md">
                    <q-input
                      v-model="policyFilter"
                      placeholder="Поиск политик..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div
                    v-if="policiesStore.isLoading.value"
                    class="text-center q-pa-lg"
                  >
                    <q-spinner color="primary" size="3em" />
                    <div class="q-mt-md">Загрузка политик...</div>
                  </div>
                  <div
                    v-else-if="policiesStore.isError.value"
                    class="text-center q-pa-lg"
                  >
                    <q-icon name="error" color="negative" size="3em" />
                    <div class="q-mt-md text-negative">
                      Ошибка загрузки политик
                    </div>
                    <div
                      v-if="policiesStore.errorMessage.value"
                      class="q-mt-sm text-caption"
                    >
                      {{ policiesStore.errorMessage.value }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Повторить"
                      @click="policiesStore.fetchPolicies()"
                      class="q-mt-md"
                    />
                  </div>
                  <div v-else class="table-container">
                    <q-table
                      :rows="filteredPoliciesByCategory('all')"
                      :columns="policyColumns"
                      row-key="id"
                      :loading="policiesStore.isLoading.value"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            @click="onEditPolicy(props.row)"
                            class="q-mr-xs"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="onDeletePolicy(props.row)"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="templates" class="q-pa-none">
                  <div class="row q-mb-md">
                    <q-input
                      v-model="policyFilter"
                      placeholder="Поиск шаблонов..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div
                    v-if="policiesStore.isLoading.value"
                    class="text-center q-pa-lg"
                  >
                    <q-spinner color="primary" size="3em" />
                    <div class="q-mt-md">Загрузка шаблонов...</div>
                  </div>
                  <div
                    v-else-if="policiesStore.isError.value"
                    class="text-center q-pa-lg"
                  >
                    <q-icon name="error" color="negative" size="3em" />
                    <div class="q-mt-md text-negative">
                      Ошибка загрузки шаблонов
                    </div>
                    <div
                      v-if="policiesStore.errorMessage.value"
                      class="q-mt-sm text-caption"
                    >
                      {{ policiesStore.errorMessage.value }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Повторить"
                      @click="policiesStore.fetchPolicies()"
                      class="q-mt-md"
                    />
                  </div>
                  <div v-else class="table-container">
                    <q-table
                      :rows="filteredPoliciesByCategory('templates')"
                      :columns="policyColumns"
                      row-key="id"
                      :loading="policiesStore.isLoading.value"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            @click="onEditPolicy(props.row)"
                            class="q-mr-xs"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="onDeletePolicy(props.row)"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>

                <!-- Архив -->
                <q-tab-panel name="archive" class="q-pa-none">
                  <div class="row q-mb-md">
                    <q-input
                      v-model="policyFilter"
                      placeholder="Поиск в архиве..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div
                    v-if="policiesStore.isLoading.value"
                    class="text-center q-pa-lg"
                  >
                    <q-spinner color="primary" size="3em" />
                    <div class="q-mt-md">Загрузка архива...</div>
                  </div>
                  <div
                    v-else-if="policiesStore.isError.value"
                    class="text-center q-pa-lg"
                  >
                    <q-icon name="error" color="negative" size="3em" />
                    <div class="q-mt-md text-negative">
                      Ошибка загрузки архива
                    </div>
                    <div
                      v-if="policiesStore.errorMessage.value"
                      class="q-mt-sm text-caption"
                    >
                      {{ policiesStore.errorMessage.value }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Повторить"
                      @click="policiesStore.fetchPolicies()"
                      class="q-mt-md"
                    />
                  </div>
                  <div v-else class="table-container">
                    <q-table
                      :rows="filteredPoliciesByCategory('archive')"
                      :columns="policyColumns"
                      row-key="id"
                      :loading="policiesStore.isLoading.value"
                      flat
                      bordered
                    >
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn
                            flat
                            dense
                            round
                            icon="edit"
                            size="sm"
                            @click="onEditPolicy(props.row)"
                            class="q-mr-xs"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="onDeletePolicy(props.row)"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-tab-panel>

            <q-tab-panel name="management" class="q-pa-md">
              <div class="text-h6 q-mb-md">Управление политиками</div>

              <div class="row q-gutter-md q-mb-md">
                <q-btn
                  color="primary"
                  icon="add"
                  label="Создать"
                  @click="onCreatePolicy"
                  class="col-auto"
                />
                <q-btn
                  color="secondary"
                  icon="edit"
                  label="Редактировать"
                  @click="onEditSelectedPolicy"
                  :disable="!selectedPolicyForManagement"
                  class="col-auto"
                />
                <q-btn
                  color="accent"
                  icon="content_copy"
                  label="Клонировать"
                  @click="onClonePolicy"
                  :disable="!selectedPolicyForManagement"
                  class="col-auto"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  label="Удалить"
                  @click="onDeleteSelectedPolicy"
                  :disable="!selectedPolicyForManagement"
                  class="col-auto"
                />
              </div>

              <div class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">
                  Выберите политику для управления:
                </div>
                <q-table
                  :rows="filteredPolicies"
                  :columns="policyManagementColumns"
                  row-key="id"
                  :loading="policiesStore.isLoading.value"
                  flat
                  bordered
                  v-model:selected="selectedPoliciesForManagement"
                >
                  <template v-slot:top>
                    <q-input
                      v-model="policyFilter"
                      placeholder="Поиск политик..."
                      dense
                      outlined
                      class="col-4"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <GPOPolicyForm
        v-model="showPolicyDialog"
        :policy="policyForForm"
        :is-loading="policiesStore.isLoading.value"
        @submit="onPolicyFormSubmit"
      />

      <GPOPolicySettingsDialog
        v-model="showApplyPolicyDialog"
        :agent="selectedAgent"
        @applied="onPolicySettingsApplied"
        @disabled="onPolicySettingsDisabled"
      />

      <AppliedPoliciesDialog
        v-model="showAppliedPoliciesDialog"
        :agent="selectedAgent"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { formatDate } from "@/utils/format";
import { useGPOPolicies, useGPOPolicyTree } from "../api/gpo";
import {
  agentServiceClient,
  userServiceClient,
  createGrpcMetadata,
  operator_pb,
  policyAssignmentClient,
  policyCatalogClient,
} from "../api/grpc-client";
import GPOPolicyForm from "../components/GPOPolicyForm.vue";
import GPOPolicySettingsDialog from "../components/GPOPolicySettingsDialog.vue";
import AppliedPoliciesDialog from "../components/AppliedPoliciesDialog.vue";
import type {
  GPOPolicy,
  CreateGPOPolicyRequest,
  UpdateGPOPolicyRequest,
} from "../types/gpo";
import {
  agentRebootNow,
  agentShutdown,
  sendAgentPing,
  removeAgent,
} from "@/api/agents";
import { useQuasar, QTableColumn } from "quasar";
import { notifySuccess, notifyError } from "@/utils/notify";
import DOMPurify from "dompurify";

interface Agent {
  id: string;
  hostname: string;
  last_seen: string;
  status: string;
  operating_system?: string;
  version?: string;
  ip_address?: string;
}

interface User {
  name: string;
  sid: string;
  type: string;
  lastLogon?: string;
  groups?: string;
}

const $q = useQuasar();

const policiesStore = useGPOPolicies();
const treeStore = useGPOPolicyTree();

const mainTab = ref("dashboard");
const subTab = ref("status");
const contentTab = ref("overview");
const libraryTab = ref("policies");
const policiesSubTab = ref("all");
const networkTab = ref("agents");
const devicesTab = ref("assignment");
const windowsTab = ref("security");
const securitySubTab = ref("passwords");
const systemSubTab = ref("services");
const selectedAgent = ref<Agent | null>(null);
const usersLoading = ref(false);
const policyFilter = ref("");
const networkStatusFilter = ref<"all" | "online" | "offline">("all");
const selectedPolicyForManagement = ref<GPOPolicy | null>(null);
const selectedPoliciesForManagement = ref<GPOPolicy[]>([]);
const showPolicyDialog = ref(false);
const policyDialogMode = ref<"create" | "edit" | "clone">("create");
const policyToEdit = ref<GPOPolicy | null>(null);
const showApplyPolicyDialog = ref(false);
const showAppliedPoliciesDialog = ref(false);

const policyForForm = computed(() => {
  return policyToEdit.value || undefined;
});

const agentsLoading = ref(false);
const agentsError = ref(false);
const gpoAgents = ref<Agent[]>([]);

const selectedPoliciesForAssignment = ref<GPOPolicy[]>([]);
const assignedPolicies = ref<GPOPolicy[]>([]);
const assignmentLoading = ref(false);
const actionLoading = ref(false);

interface DeviceAction {
  title: string;
  date: string;
  icon: string;
  color: string;
  description: string;
}

const deviceActionHistory = ref<DeviceAction[]>([]);

const agentsList = computed<Agent[]>(() => {
  return gpoAgents.value;
});

async function loadAgents() {
  agentsLoading.value = true;
  agentsError.value = false;

  try {
    const metadata = createGrpcMetadata();

    if (!operator_pb.ListAgentsRequest) {
      throw new Error("ListAgentsRequest class not found in operator_pb");
    }

    const request = new operator_pb.ListAgentsRequest();
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("gRPC request timeout after 10 seconds")),
        10000,
      );
    });

    const response = (await Promise.race([
      agentServiceClient.listAgents(request, metadata),
      timeoutPromise,
    ])) as {
      getAgentsList?: () => Array<{
        getAgentId?: () => string;
        getHostName?: () => string;
        getIpAddress?: () => string;
        getIsOnline?: () => boolean;
        getLastHeartbeatUnix?: () => number | string;
      }>;
      toObject?: (options?: {
        longs?: typeof String;
        enums?: typeof String;
        bytes?: typeof String;
        defaults?: boolean;
        arrays?: boolean;
        objects?: boolean;
        oneofs?: boolean;
      }) => {
        agents?: Array<{
          agent_id?: string;
          host_name?: string;
          ip_address?: string;
          is_online?: boolean;
          last_heartbeat_unix?: number | string;
        }>;
      };
    };

    let agents: Array<{
      agent_id?: string;
      agentId?: string;
      host_name?: string;
      hostName?: string;
      ip_address?: string;
      ipAddress?: string;
      is_online?: boolean;
      isOnline?: boolean;
      last_heartbeat_unix?: number | string;
      lastHeartbeatUnix?: number | string;
    }> = [];

    if (response && typeof response === "object") {
      if (
        typeof (response as { getAgentsList?: () => unknown[] })
          .getAgentsList === "function"
      ) {
        const agentsList = (
          response as {
            getAgentsList: () => Array<{
              getAgentId?: () => string;
              getHostName?: () => string;
              getIpAddress?: () => string;
              getIsOnline?: () => boolean;
              getLastHeartbeatUnix?: () => number | string;
              toObject?: (options?: {
                longs?: typeof String;
                enums?: typeof String;
                bytes?: typeof String;
                defaults?: boolean;
                arrays?: boolean;
                objects?: boolean;
                oneofs?: boolean;
              }) => {
                agentId?: string;
                hostName?: string;
                ipAddress?: string;
                isOnline?: boolean;
                lastHeartbeatUnix?: number | string;
              };
            }>;
          }
        ).getAgentsList();

        agents = agentsList.map((agent) => {
          if (agent.toObject) {
            return agent.toObject({
              longs: String,
              enums: String,
              bytes: String,
              defaults: true,
            });
          }
          return {
            agentId: agent.getAgentId?.(),
            hostName: agent.getHostName?.(),
            ipAddress: agent.getIpAddress?.(),
            isOnline: agent.getIsOnline?.(),
            lastHeartbeatUnix: agent.getLastHeartbeatUnix?.(),
          };
        });
      } else if (
        typeof (response as { toObject?: () => unknown }).toObject ===
        "function"
      ) {
        const obj = (
          response as {
            toObject: (options?: {
              longs?: typeof String;
              enums?: typeof String;
              bytes?: typeof String;
              defaults?: boolean;
              arrays?: boolean;
              objects?: boolean;
              oneofs?: boolean;
            }) => { agents?: unknown[] };
          }
        ).toObject({
          longs: String,
          enums: String,
          bytes: String,
          defaults: true,
          arrays: true,
          objects: true,
          oneofs: true,
        });
        agents = (obj.agents || []) as Array<{
          agentId?: string;
          hostName?: string;
          ipAddress?: string;
          isOnline?: boolean;
          lastHeartbeatUnix?: number | string;
        }>;
      } else if ((response as { agents?: unknown[] }).agents) {
        agents = (
          response as {
            agents: Array<{
              agentId?: string;
              hostName?: string;
              ipAddress?: string;
              isOnline?: boolean;
              lastHeartbeatUnix?: number | string;
            }>;
          }
        ).agents;
      }
    }

    if (agents && agents.length > 0) {
      gpoAgents.value = agents.map((agent) => {
        const agentId = agent.agent_id || agent.agentId || "";
        const hostName = agent.host_name || agent.hostName || "Unknown";
        const ipAddress = agent.ip_address || agent.ipAddress || "";
        let isOnline = false;
        if (agent.is_online !== undefined) {
          isOnline = agent.is_online;
        } else if (agent.isOnline !== undefined) {
          isOnline = agent.isOnline;
        }
        let lastHeartbeatUnix: number | string | undefined;
        if (agent.last_heartbeat_unix !== undefined) {
          lastHeartbeatUnix = agent.last_heartbeat_unix;
        } else if (agent.lastHeartbeatUnix !== undefined) {
          lastHeartbeatUnix = agent.lastHeartbeatUnix;
        }

        return {
          id: agentId,
          hostname: hostName,
          last_seen: (() => {
            if (!lastHeartbeatUnix) return "";
            const timestamp =
              typeof lastHeartbeatUnix === "string"
                ? Number.parseInt(lastHeartbeatUnix, 10)
                : lastHeartbeatUnix;
            return new Date(timestamp * 1000).toISOString();
          })(),
          status: isOnline ? "online" : "offline",
          operating_system: undefined,
          version: undefined,
          ip_address: ipAddress || undefined,
        };
      });
    } else {
      gpoAgents.value = [];
    }
  } catch (error) {
    console.error("[GPO] Error loading agents from gRPC:", error);
    agentsError.value = true;
    gpoAgents.value = [];
  } finally {
    agentsLoading.value = false;
  }
}

const usersList = ref<User[]>([]);

const usersColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "sid",
    label: "SID",
    align: "left",
    field: "sid",
    sortable: true,
  },
  {
    name: "type",
    label: "Type",
    align: "center",
    field: "type",
    sortable: true,
  },
  {
    name: "lastLogon",
    label: "Last Logon",
    align: "left",
    field: "lastLogon",
    sortable: true,
  },
  {
    name: "groups",
    label: "Groups",
    align: "left",
    field: "groups",
  },
];

const agentTableColumns: QTableColumn[] = [
  {
    name: "hostname",
    required: true,
    label: "Имя устройства",
    align: "left",
    field: "hostname",
    sortable: true,
  },
  {
    name: "status",
    label: "Статус",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "last_seen",
    label: "Последний ответ",
    align: "left",
    field: "last_seen",
    format: (val: string) => formatDate(val),
    sortable: true,
  },
  {
    name: "operating_system",
    label: "ОС",
    align: "left",
    field: "operating_system",
    sortable: true,
  },
];

const recentEvents = ref<
  Array<{
    title: string;
    date: string;
    description: string;
    icon: string;
    color: string;
  }>
>([]);

const policyColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Отображаемое имя",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "path",
    label: "Путь",
    align: "left",
    field: "path",
  },
  {
    name: "description",
    label: "Описание",
    align: "left",
    field: "description",
  },
  {
    name: "actions",
    label: "Действия",
    align: "center",
    field: "actions",
  },
];

const policyManagementColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Отображаемое имя",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "path",
    label: "Путь",
    align: "left",
    field: "path",
  },
  {
    name: "enabled",
    label: "Статус",
    align: "center",
    field: "enabled",
    format: (val: boolean) => (val ? "Включена" : "Отключена"),
  },
];

const filteredPolicies = computed(() => {
  if (!policyFilter.value) {
    return policiesStore.policies.value;
  }
  const filter = policyFilter.value.toLowerCase();
  return policiesStore.policies.value.filter(
    (policy) =>
      policy.name.toLowerCase().includes(filter) ||
      policy.displayName?.toLowerCase().includes(filter) ||
      policy.description?.toLowerCase().includes(filter),
  );
});

const filteredPoliciesByCategory = (
  category: "all" | "templates" | "archive",
) => {
  let policies = filteredPolicies.value;

  // фильтр по категориям пока по простому
  // TODO: добавить реальную логику определения шаблонов и архива
  if (category === "templates") {
    policies = policies.filter(
      (policy) =>
        policy.name.toLowerCase().includes("template") ||
        policy.path?.toLowerCase().includes("template") ||
        policy.displayName?.toLowerCase().includes("шаблон"),
    );
  } else if (category === "archive") {
    policies = policies.filter(
      (policy) =>
        !policy.enabled ||
        policy.path?.toLowerCase().includes("archive") ||
        policy.path?.toLowerCase().includes("архив"),
    );
  }

  return policies;
};

const filteredNetworkAgents = computed(() => {
  if (networkStatusFilter.value === "all") {
    return agentsList.value;
  }
  return agentsList.value.filter(
    (agent) => agent.status === networkStatusFilter.value,
  );
});

const policyAssignmentColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Отображаемое имя",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "description",
    label: "Описание",
    align: "left",
    field: "description",
  },
];

const assignedPolicyColumns: QTableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "displayName",
    label: "Отображаемое имя",
    align: "left",
    field: "displayName",
    sortable: true,
  },
  {
    name: "assignedDate",
    label: "Дата назначения",
    align: "left",
    field: "assignedDate",
    format: (val: string) => formatDate(val),
  },
  {
    name: "actions",
    label: "Действия",
    align: "center",
    field: "actions",
  },
];

const pingLoading = ref(false);
const networkInfo = ref<{
  local_ips?: string;
  public_ip?: string;
}>({});
const pingResult = ref<{
  status: string;
  message?: string;
} | null>(null);

interface AgentDetails {
  agentId?: string;
  hostName?: string;
  ipAddress?: string;
  isOnline?: boolean;
  lastHeartbeatUnix?: number | string;
  nodeInfo?: {
    systemInfo?: {
      hostName?: string;
      host_name?: string;
      osVersion?: string;
      os_version?: string;
      cpu?: string;
      ramGb?: number;
      ram_gb?: number;
      motherboard?: string;
      manufacturer?: string;
      model?: string;
      firmwareVersion?: string;
      firmware_version?: string;
      disks?: string[];
      gpu?: string[];
      ipAddresses?: string[];
      ip_addresses?: string[];
      macAddresses?: string[];
      mac_addresses?: string[];
    };
    lastBootTimeUnix?: number | string;
    last_boot_time_unix?: number | string;
    osBuild?: string;
    os_build?: string;
    isDomainJoined?: boolean;
    is_domain_joined?: boolean;
    antivirusStatus?: string;
    antivirus_status?: string;
    timeZone?: string;
    time_zone?: string;
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
    firmware_version?: string;
    isOnline?: boolean;
    is_online?: boolean;
  };
}

const agentDetails = ref<AgentDetails | null>(null);

async function loadUsersForAgent(agentId: string) {
  usersLoading.value = true;
  usersList.value = [];

  try {
    const metadata = createGrpcMetadata();

    if (!operator_pb.ListUsersForAgentRequest) {
      throw new Error(
        "ListUsersForAgentRequest class not found in operator_pb",
      );
    }

    const request = new operator_pb.ListUsersForAgentRequest();
    request.setAgentId(agentId);

    const response = await userServiceClient.listUsersForAgent(
      request,
      metadata,
    );

    type GroupInfo = {
      name?: string;
      displayName?: string;
      displayname?: string;
      distinguishedName?: string;
      distinguishedname?: string;
      samAccountName?: string;
      samaccountname?: string;
      UserPrincipalName?: string;
      userprincipalname?: string;
      description?: string;
      structuralObjectClass?: string;
      structuralobjectclass?: string;
      sid?: string;
    };

    let users: Array<{
      name?: string;
      userName?: string;
      sid?: string;
      account_type?: number;
      accountType?: number;
      is_enabled?: boolean;
      isEnabled?: boolean;
      last_logon_unix?: number | string;
      lastLogonUnix?: number | string;
      groups?: GroupInfo[] | string[];
      groupsList?: GroupInfo[] | string[];
    }> = [];

    if (response && typeof response === "object") {
      if (
        typeof (response as { getUsersList?: () => unknown[] }).getUsersList ===
        "function"
      ) {
        const usersList = (
          response as {
            getUsersList: () => Array<{
              getName?: () => string;
              getUserName?: () => string;
              getSid?: () => string;
              getAccountType?: () => number;
              getIsEnabled?: () => boolean;
              getLastLogonUnix?: () => number | string;
              getGroupsList?: () => GroupInfo[] | string[];
              toObject?: (options?: {
                longs?: typeof String;
                enums?: typeof String;
                bytes?: typeof String;
                defaults?: boolean;
                arrays?: boolean;
                objects?: boolean;
                oneofs?: boolean;
              }) => {
                name?: string;
                userName?: string;
                sid?: string;
                accountType?: number;
                isEnabled?: boolean;
                lastLogonUnix?: number | string;
                groups?: GroupInfo[] | string[];
                groupsList?: GroupInfo[] | string[];
              };
            }>;
          }
        ).getUsersList();

        users = usersList.map((user) => {
          if (user.toObject) {
            const userObj = user.toObject({
              longs: String,
              enums: String,
              bytes: String,
              defaults: true,
              arrays: true,
              objects: true,
              oneofs: true,
            });
            if (
              userObj.groups &&
              Array.isArray(userObj.groups) &&
              userObj.groups.length > 0
            )
              if (
                (userObj as { groupsList?: unknown[] }).groupsList &&
                Array.isArray(
                  (userObj as { groupsList: unknown[] }).groupsList,
                ) &&
                (userObj as { groupsList: unknown[] }).groupsList.length > 0
              ) {
                // console.log(
                //   "[GPO] First group from groupsList toObject:",
                //   (userObj as { groupsList: unknown[] }).groupsList[0],
                // );
              }
            return userObj;
          }

          let groups: GroupInfo[] | undefined;
          const groupsList = user.getGroupsList?.();
          if (groupsList && groupsList.length > 0) {
            groups = groupsList.map(
              (group: {
                toObject?: (options?: {
                  longs?: typeof String;
                  enums?: typeof String;
                  bytes?: typeof String;
                  defaults?: boolean;
                  arrays?: boolean;
                  objects?: boolean;
                  oneofs?: boolean;
                }) => GroupInfo;
                getName?: () => string;
                getDisplayName?: () => string;
                getSamAccountName?: () => string;
              }) => {
                if (group.toObject) {
                  return group.toObject({
                    longs: String,
                    enums: String,
                    bytes: String,
                    defaults: true,
                    arrays: true,
                    objects: true,
                    oneofs: true,
                  }) as GroupInfo;
                }

                return {
                  name: group.getName?.(),
                  displayName: group.getDisplayName?.(),
                  samAccountName: group.getSamAccountName?.(),
                } as GroupInfo;
              },
            );
          }

          const userData = {
            name: user.getName?.() || user.getUserName?.(),
            userName: user.getName?.() || user.getUserName?.(),
            sid: user.getSid?.(),
            accountType: user.getAccountType?.(),
            isEnabled: user.getIsEnabled?.(),
            lastLogonUnix: user.getLastLogonUnix?.(),
            groups,
          };

          return userData;
        });
      } else if (
        typeof (response as { toObject?: () => unknown }).toObject ===
        "function"
      ) {
        const obj = (
          response as {
            toObject: (options?: {
              longs?: typeof String;
              enums?: typeof String;
              bytes?: typeof String;
              defaults?: boolean;
              arrays?: boolean;
              objects?: boolean;
              oneofs?: boolean;
            }) => { users?: unknown[] };
          }
        ).toObject({
          longs: String,
          enums: String,
          bytes: String,
          defaults: true,
          arrays: true,
          objects: true,
          oneofs: true,
        });

        users = (obj.users || []) as Array<{
          name?: string;
          userName?: string;
          sid?: string;
          accountType?: number;
          account_type?: number;
          isEnabled?: boolean;
          is_enabled?: boolean;
          lastLogonUnix?: number | string;
          last_logon_unix?: number | string;
          groups?: GroupInfo[] | string[];
          groupsList?: GroupInfo[] | string[];
        }>;
      } else if ((response as { users?: unknown[] }).users) {
        const responseUsers = (
          response as {
            users?: Array<{
              name?: string;
              sid?: string;
              account_type?: number;
              is_enabled?: boolean;
              last_logon_unix?: number | string;
              groups?: GroupInfo[] | string[];
              groupsList?: GroupInfo[] | string[];
            }>;
          }
        ).users;
        if (responseUsers) {
          users = responseUsers.map((user) => {
            const mapped = {
              userName: user.name,
              sid: user.sid,
              accountType: user.account_type,
              isEnabled: user.is_enabled,
              lastLogonUnix: user.last_logon_unix,
              groups: user.groups,
            };

            return mapped;
          });
        }
      } else if (Array.isArray(response)) {
        users = response as Array<{
          name?: string;
          userName?: string;
          sid?: string;
          account_type?: number;
          accountType?: number;
          is_enabled?: boolean;
          isEnabled?: boolean;
          last_logon_unix?: number | string;
          lastLogonUnix?: number | string;
          groups?: GroupInfo[] | string[];
          groupsList?: GroupInfo[] | string[];
        }>;
      }
    }

    if (users && users.length > 0) {
      usersList.value = users.map((user) => {
        const userName = user.name || user.userName || "Unknown";
        let accountTypeNum = 0;
        if (user.account_type !== undefined) {
          accountTypeNum = user.account_type;
        } else if (user.accountType !== undefined) {
          accountTypeNum = user.accountType;
        }
        let lastLogonUnix: number | string | undefined;
        if (user.last_logon_unix !== undefined) {
          lastLogonUnix = user.last_logon_unix;
        } else if (user.lastLogonUnix !== undefined) {
          lastLogonUnix = user.lastLogonUnix;
        }

        let accountType = "Unknown";
        if (accountTypeNum === 1) {
          accountType = "Local";
        } else if (accountTypeNum === 2) {
          accountType = "System";
        }

        let groupsData: GroupInfo[] | string[] | undefined;

        if ((user as { groupsList?: unknown[] }).groupsList) {
          const groupsList = (user as { groupsList: unknown[] }).groupsList;

          if (Array.isArray(groupsList) && groupsList.length > 0) {
            groupsData = groupsList.map((group: unknown) => {
              const groupObj = group as {
                toObject?: (options?: {
                  longs?: typeof String;
                  enums?: typeof String;
                  bytes?: typeof String;
                  defaults?: boolean;
                  arrays?: boolean;
                  objects?: boolean;
                  oneofs?: boolean;
                }) => GroupInfo;
                name?: string;
                displayname?: string;
                samaccountname?: string;
              };
              if (groupObj && typeof groupObj === "object") {
                if (
                  groupObj.toObject &&
                  typeof groupObj.toObject === "function"
                ) {
                  return groupObj.toObject({
                    longs: String,
                    enums: String,
                    bytes: String,
                    defaults: true,
                    arrays: true,
                    objects: true,
                    oneofs: true,
                  }) as GroupInfo;
                }

                return groupObj as GroupInfo;
              }
              return groupObj as GroupInfo;
            });
          }
        } else if (user.groups && user.groups.length > 0) {
          groupsData = user.groups;
        }

        let groupsString: string | undefined;
        if (groupsData && groupsData.length > 0) {
          if (typeof groupsData[0] === "string") {
            groupsString = (groupsData as string[]).join(", ");
          } else {
            const groupNames = (groupsData as GroupInfo[])
              .map((group) => {
                const name =
                  group.name ||
                  (
                    group as {
                      name?: string;
                      displayname?: string;
                      samaccountname?: string;
                    }
                  ).displayname ||
                  group.displayName ||
                  (
                    group as {
                      name?: string;
                      displayname?: string;
                      samaccountname?: string;
                    }
                  ).samaccountname ||
                  group.samAccountName ||
                  "";

                return name;
              })
              .filter((name) => name !== "");
            groupsString = groupNames.join(", ");
          }
        } else {
        }

        let lastLogon: string | undefined;
        if (lastLogonUnix !== undefined && lastLogonUnix !== null) {
          let timestamp: number;
          if (typeof lastLogonUnix === "string") {
            timestamp = Number.parseInt(lastLogonUnix, 10);
          } else {
            timestamp = lastLogonUnix;
          }
          if (timestamp === 0 || Number.isNaN(timestamp)) {
            lastLogon = "Никогда";
          } else {
            lastLogon = formatDate(new Date(timestamp * 1000).toISOString());
          }
        }

        return {
          name: userName,
          sid: user.sid || "",
          type: accountType,
          lastLogon,
          groups: groupsString,
        };
      });
    } else {
    }
  } catch (error) {
    const errorMessage = (error as { message?: string })?.message || "";
    const is404 =
      (error as { response?: { status?: number } })?.response?.status === 404 ||
      errorMessage.includes("404");
    const isRpcError =
      errorMessage.includes("RpcError") ||
      errorMessage.includes("deserializing");

    if (is404) {
      // console.log(
      //   "[GPO] ⚠️ UserService endpoint not implemented yet, using empty list",
      // );
    } else if (isRpcError) {
      // console.log(
      //   "[GPO] ⚠️ UserService endpoint error (possibly not implemented), using empty list",
      //   error,
      // );
    } else {
      console.error("[GPO] Error loading users:", error);
    }
    usersList.value = [];
  } finally {
    usersLoading.value = false;
  }
}

const selectAgent = (agent: Agent) => {
  if (selectedAgent.value?.id === agent.id) {
    clearAgentSelection();
    return;
  }
  selectedAgent.value = agent;
  if (agent.id) {
    loadUsersForAgent(agent.id);
    loadNetworkInfo(agent.id);
    loadAssignedPolicies(agent.id);
  }
  pingResult.value = null;
};

const clearAgentSelection = () => {
  selectedAgent.value = null;
  usersList.value = [];
  agentDetails.value = null;
  networkInfo.value = {};
  pingResult.value = null;
  assignedPolicies.value = [];
};

async function loadAssignedPolicies(agentId: string) {
  try {
    // TODO: реализовать загрузку назначенных политик через API
    // Пока используем заглушку
    // agentId будет использоваться для загрузки политик конкретного устройства
    console.log("[GPO] Loading assigned policies for agent:", agentId);
    assignedPolicies.value = [];
  } catch (error) {
    console.error("[GPO] Error loading assigned policies:", error);
    notifyError("Ошибка загрузки назначенных политик");
  }
}

async function assignPolicies() {
  if (
    !selectedAgent.value ||
    selectedPoliciesForAssignment.value.length === 0
  ) {
    return;
  }

  assignmentLoading.value = true;
  try {
    // TODO: Реализовать назначение политик через API
    // Пока используем заглушку
    const policiesToAssign = selectedPoliciesForAssignment.value;

    // Добавляем политики в список назначенных
    for (const policy of policiesToAssign) {
      const assignedPolicy = {
        ...policy,
        assignedDate: new Date().toISOString(),
      };
      assignedPolicies.value.push(assignedPolicy);
    }

    addActionToHistory({
      title: "Назначение политик",
      description: `Назначено ${policiesToAssign.length} политик устройству ${selectedAgent.value.hostname}`,
      icon: "assignment",
      color: "primary",
    });

    selectedPoliciesForAssignment.value = [];
    notifySuccess(
      `Политики успешно назначены устройству ${selectedAgent.value.hostname}`,
    );
  } catch (error) {
    console.error("[GPO] Error assigning policies:", error);
    notifyError("Ошибка назначения политик");
  } finally {
    assignmentLoading.value = false;
  }
}

async function removePolicyAssignment(policy: GPOPolicy) {
  if (!selectedAgent.value) {
    return;
  }

  $q.dialog({
    title: "Подтверждение",
    message: `Удалить назначение политики "${policy.displayName || policy.name}" для устройства ${selectedAgent.value.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const policyId = Number.parseInt(policy.id, 10);
      if (Number.isNaN(policyId)) {
        throw new TypeError(`Неверный ID политики: ${policy.id}`);
      }

      const policyDetails = await policyCatalogClient.getPolicyDetails(
        policyId,
        "en-US",
      );
      const policyHash = (policyDetails.policy?.hash as string) || "";

      if (!policyHash) {
        throw new Error(
          "Hash политики не найден. Не удалось получить детали политики.",
        );
      }

      if (!selectedAgent.value) {
        throw new Error("Агент не выбран");
      }

      await policyAssignmentClient.removePolicy(policyHash, "agent", {
        agentId: selectedAgent.value.id,
      });

      assignedPolicies.value = assignedPolicies.value.filter(
        (p) => p.id !== policy.id,
      );

      if (selectedAgent.value) {
        addActionToHistory({
          title: "Удаление назначения",
          description: `Удалено назначение политики "${policy.displayName || policy.name}" для устройства ${selectedAgent.value.hostname}`,
          icon: "delete",
          color: "negative",
        });
      }

      notifySuccess("Назначение политики удалено");
    } catch (error) {
      console.error("[GPO] Error removing policy assignment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка удаления назначения";
      notifyError(`Ошибка удаления назначения: ${errorMessage}`);
    }
  });
}

async function reapplyPolicies() {
  if (!selectedAgent.value) {
    return;
  }

  actionLoading.value = true;
  try {
    // TODO: Реализовать повторное применение политик через API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // типа запроса

    addActionToHistory({
      title: "Повторное применение политик",
      description: `Политики применены повторно для устройства ${selectedAgent.value.hostname}`,
      icon: "refresh",
      color: "primary",
    });

    notifySuccess("Политики применены повторно");
  } catch (error) {
    console.error("[GPO] Error reapplying policies:", error);
    notifyError("Ошибка повторного применения политик");
  } finally {
    actionLoading.value = false;
  }
}

async function rollbackPolicies() {
  if (!selectedAgent.value) {
    return;
  }

  $q.dialog({
    title: "Подтверждение",
    message: `Откатить политики для устройства ${selectedAgent.value.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      // TODO: Реализовать откат политик через API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // типа запрос

      if (selectedAgent.value) {
        addActionToHistory({
          title: "Откат политик",
          description: `Политики откачены для устройства ${selectedAgent.value.hostname}`,
          icon: "undo",
          color: "warning",
        });
      }

      notifySuccess("Политики откачены");
    } catch (error) {
      console.error("[GPO] Error rolling back policies:", error);
      notifyError("Ошибка отката политик");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function synchronizePolicies() {
  if (!selectedAgent.value) {
    return;
  }

  actionLoading.value = true;
  try {
    // TODO: Реализовать синхронизацию политик через API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // типа запрос

    await loadAssignedPolicies(selectedAgent.value.id);

    addActionToHistory({
      title: "Синхронизация политик",
      description: `Политики синхронизированы для устройства ${selectedAgent.value.hostname}`,
      icon: "sync",
      color: "secondary",
    });

    notifySuccess("Политики синхронизированы");
  } catch (error) {
    console.error("[GPO] Error synchronizing policies:", error);
    notifyError("Ошибка синхронизации политик");
  } finally {
    actionLoading.value = false;
  }
}

function addActionToHistory(action: Omit<DeviceAction, "date">) {
  deviceActionHistory.value.unshift({
    ...action,
    date: formatDate(new Date().toISOString()),
  });

  if (deviceActionHistory.value.length > 50) {
    deviceActionHistory.value = deviceActionHistory.value.slice(0, 50);
  }
}

async function loadNetworkInfo(agentId: string) {
  try {
    if (selectedAgent.value && selectedAgent.value.id === agentId) {
      if (selectedAgent.value.ip_address) {
        networkInfo.value = {
          local_ips: selectedAgent.value.ip_address,
          public_ip: "N/A",
        };
        return;
      }
    }

    try {
      const metadata = createGrpcMetadata();

      if (!operator_pb.GetAgentRequest) {
        throw new Error("GetAgentRequest class not found in operator_pb");
      }

      const request = new operator_pb.GetAgentRequest();
      request.setAgentId(agentId);

      const response = await agentServiceClient.getAgent(request, metadata);

      let agentData: AgentDetails = {};

      if (response && typeof response === "object") {
        if (
          typeof (response as { toObject?: () => unknown }).toObject ===
          "function"
        ) {
          agentData = (
            response as {
              toObject: (options?: {
                longs?: typeof String;
                enums?: typeof String;
                bytes?: typeof String;
                defaults?: boolean;
                arrays?: boolean;
                objects?: boolean;
                oneofs?: boolean;
              }) => AgentDetails;
            }
          ).toObject({
            longs: String,
            enums: String,
            bytes: String,
            defaults: true,
            arrays: true,
            objects: true,
            oneofs: true,
          }) as AgentDetails;
        }
      }

      agentDetails.value = agentData;

      const nodeInfo = agentData.nodeInfo;
      const systemInfo = nodeInfo?.systemInfo;
      const ipAddresses =
        systemInfo?.ipAddresses || systemInfo?.ip_addresses || [];

      const localIps =
        ipAddresses
          .filter((ip) => {
            if (
              ip === "127.0.0.1" ||
              ip === "::1" ||
              ip.startsWith("fe80::") ||
              ip.startsWith("169.254.")
            ) {
              return false;
            }

            return /^\d+\.\d+\.\d+\.\d+$/.test(ip);
          })
          .join(", ") ||
        agentData.ipAddress ||
        "N/A";

      networkInfo.value = {
        local_ips: localIps,
        public_ip: "N/A",
      };
    } catch (apiError) {
      console.error("[GPO] Error fetching agent from gRPC:", apiError);
      agentDetails.value = null;
      networkInfo.value = {
        local_ips: "N/A",
        public_ip: "N/A",
      };
    }
  } catch (error) {
    console.error("[GPO] Error loading network info:", error);
    agentDetails.value = null;
    networkInfo.value = {
      local_ips: "N/A",
      public_ip: "N/A",
    };
  }
}

async function handleReboot() {
  if (!selectedAgent.value) return;

  $q.dialog({
    title: "Подтверждение",
    message: `Перезагрузить ${selectedAgent.value.hostname}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      await agentRebootNow(selectedAgent.value!.id);
      notifySuccess(`${selectedAgent.value!.hostname} будет перезагружен`);
    } catch (error) {
      console.error("[GPO] Error rebooting agent:", error);
      notifyError("Ошибка при перезагрузке агента");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function handleShutdown() {
  if (!selectedAgent.value) return;

  const clean = DOMPurify.sanitize(selectedAgent.value.hostname);
  $q.dialog({
    title: `Введите <code style="color:red">yes</code> для подтверждения выключения <span style="color:red">${clean}</span>.`,
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val.toLowerCase() === "yes",
    },
    cancel: true,
    ok: { label: "Выключить", color: "negative" },
    persistent: true,
    html: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      await agentShutdown(selectedAgent.value!.id);
      notifySuccess(`${selectedAgent.value!.hostname} будет выключен`);
    } catch (error) {
      console.error("[GPO] Error shutting down agent:", error);
      notifyError("Ошибка при выключении агента");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function handleDelete() {
  if (!selectedAgent.value) return;

  const clean = DOMPurify.sanitize(selectedAgent.value.hostname);
  $q.dialog({
    title: `Введите <code style="color:red">yes</code> для подтверждения удаления <span style="color:red">${clean}</span>.`,
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val.toLowerCase() === "yes",
    },
    cancel: true,
    ok: { label: "Удалить", color: "negative" },
    persistent: true,
    html: true,
  }).onOk(async () => {
    actionLoading.value = true;
    try {
      const data = await removeAgent(selectedAgent.value!.id);
      notifySuccess(data);
      selectedAgent.value = null;
      await loadAgents();
    } catch (error) {
      console.error("[GPO] Error deleting agent:", error);
      notifyError("Ошибка при удалении агента");
    } finally {
      actionLoading.value = false;
    }
  });
}

async function handlePing() {
  if (!selectedAgent.value) return;

  pingLoading.value = true;
  pingResult.value = null;
  try {
    const data = await sendAgentPing(selectedAgent.value.id);
    let message = "Неизвестный статус";
    if (data.status === "online") {
      message = "Агент доступен";
    } else if (data.status === "offline") {
      message = "Агент недоступен";
    }
    pingResult.value = {
      status: data.status || "unknown",
      message,
    };
    if (data.status === "online") {
      notifySuccess("Ping успешен: агент онлайн");
    } else {
      notifyError("Ping неудачен: агент офлайн");
    }
  } catch (error) {
    console.error("[GPO] Error pinging agent:", error);
    pingResult.value = {
      status: "error",
      message: "Ошибка при выполнении ping",
    };
    notifyError("Ошибка при выполнении ping");
  } finally {
    pingLoading.value = false;
  }
}

const onEditPolicy = (policy: unknown) => {
  console.log("Edit policy:", policy);
  policyToEdit.value = policy as GPOPolicy;
  policyDialogMode.value = "edit";
  showPolicyDialog.value = true;
};

const onDeletePolicy = (policy: unknown) => {
  console.log("Delete policy:", policy);
  const policyToDelete = policy as GPOPolicy;
  $q.dialog({
    title: "Удалить политику?",
    message: `Вы уверены, что хотите удалить политику "${policyToDelete.displayName || policyToDelete.name}"?`,
    cancel: true,
    persistent: true,
    ok: { label: "Удалить", color: "negative" },
  }).onOk(async () => {
    try {
      await policiesStore.deletePolicy(policyToDelete.id);
      notifySuccess("Политика успешно удалена");
      await policiesStore.fetchPolicies();
      await treeStore.fetchPolicyTree();
    } catch (error) {
      console.error("[GPO] Error deleting policy:", error);
      notifyError("Ошибка при удалении политики");
    }
  });
};

const onCreatePolicy = () => {
  policyToEdit.value = null;
  policyDialogMode.value = "create";
  showPolicyDialog.value = true;
};

const onEditSelectedPolicy = () => {
  if (selectedPolicyForManagement.value) {
    onEditPolicy(selectedPolicyForManagement.value);
  }
};

const onClonePolicy = () => {
  if (selectedPolicyForManagement.value) {
    const policy = selectedPolicyForManagement.value;
    policyToEdit.value = {
      ...policy,
      name: `${policy.name}_copy`,
      displayName: `${policy.displayName || policy.name} (копия)`,
      id: "",
    } as GPOPolicy;
    policyDialogMode.value = "clone";
    showPolicyDialog.value = true;
  }
};

const onDeleteSelectedPolicy = () => {
  if (selectedPolicyForManagement.value) {
    onDeletePolicy(selectedPolicyForManagement.value);
  }
};

watch(selectedPoliciesForManagement, (newSelection) => {
  if (newSelection && newSelection.length > 0) {
    selectedPolicyForManagement.value = newSelection[0] as GPOPolicy;
  } else {
    selectedPolicyForManagement.value = null;
  }
});

const onPolicyFormSubmit = async (
  data: CreateGPOPolicyRequest | UpdateGPOPolicyRequest,
) => {
  try {
    if (policyDialogMode.value === "edit" && policyToEdit.value) {
      await policiesStore.updatePolicy(
        policyToEdit.value.id,
        data as UpdateGPOPolicyRequest,
      );
      notifySuccess("Политика успешно обновлена");
    } else if (policyDialogMode.value === "clone" && policyToEdit.value) {
      await policiesStore.createPolicy(data as CreateGPOPolicyRequest);
      notifySuccess("Политика успешно склонирована");
    } else {
      await policiesStore.createPolicy(data as CreateGPOPolicyRequest);
      notifySuccess("Политика успешно создана");
    }
    showPolicyDialog.value = false;
    policyToEdit.value = null;
    selectedPolicyForManagement.value = null;
    selectedPoliciesForManagement.value = [];
    await policiesStore.fetchPolicies();
    await treeStore.fetchPolicyTree();
  } catch (error) {
    console.error("[GPO] Error saving policy:", error);
    notifyError("Ошибка при сохранении политики");
  }
};

const getAgentStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "positive";
    case "offline":
      return "warning";
    case "overdue":
      return "negative";
    default:
      return "grey";
  }
};

const getAgentStatusLabel = (status: string) => {
  switch (status) {
    case "online":
      return "Онлайн";
    case "offline":
      return "Офлайн";
    case "overdue":
      return "Просрочен";
    default:
      return "Неизвестно";
  }
};

const getAgentStatusTooltip = (status: string) => {
  switch (status) {
    case "online":
      return "Устройство активно и отправляет heartbeat";
    case "offline":
      return "Устройство недоступно";
    case "overdue":
      return "Устройство не отправляло heartbeat дольше установленного времени.";
    default:
      return "Статус неизвестен";
  }
};

watch(mainTab, (newTab) => {
  if (newTab === "library") {
    if (policiesStore.policies.value.length === 0) {
      policiesStore.fetchPolicies();
    }
    if (!treeStore.tree.value) {
      treeStore.fetchPolicyTree();
    }
  }
});

const openApplyPolicyDialog = () => {
  showApplyPolicyDialog.value = true;
};

const openAppliedPoliciesDialog = () => {
  if (!selectedAgent.value) return;
  showAppliedPoliciesDialog.value = true;
};

function onPolicySettingsApplied(
  policyId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  settings: Record<string, unknown>,
) {
  if (selectedAgent.value) {
    loadAssignedPolicies(selectedAgent.value.id);

    addActionToHistory({
      title: "Применение политики",
      description: `Политика ${policyId} применена`,
      icon: "policy",
      color: "positive",
    });
  }
}

function onPolicySettingsDisabled(policyId: string) {
  if (selectedAgent.value) {
    loadAssignedPolicies(selectedAgent.value.id);

    addActionToHistory({
      title: "Отключение политики",
      description: `Политика ${policyId} отключена`,
      icon: "policy",
      color: "negative",
    });
  }
}

onMounted(() => {
  loadAgents();

  if (mainTab.value === "library") {
    policiesStore.fetchPolicies();
    treeStore.fetchPolicyTree();
  }
});
</script>

<style scoped lang="sass">
.gpo-manager-page
  height: 100%
  min-height: 100%
  overflow: hidden
  display: flex
  flex-direction: column

.gpo-manager-page .gpo-main-row
  flex: 1
  min-height: 0
  display: flex
  align-items: stretch
  height: 100%

.gpo-sidebar
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 247, 251, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.2)
  display: flex
  flex-direction: column
  flex: 0 0 auto
  min-height: 0
  overflow: hidden

.gpo-sidebar-header
  background: linear-gradient(135deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)
  color: white
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  flex-shrink: 0

.gpo-nav-tabs
  padding: 4px
  flex-shrink: 0

.gpo-nav-tab
  margin-bottom: 1px
  border-radius: 6px
  transition: all 0.2s ease
  padding: 4px 6px
  min-height: 36px

.gpo-nav-tab:hover
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.1) 0%, rgba(18, 177, 209, 0.15) 100%)

.gpo-submenu
  padding: 2px 6px
  background: rgba(255, 255, 255, 0.5)
  flex-shrink: 0

.gpo-submenu-item
  border-radius: 6px
  margin: 1px 0
  transition: all 0.2s ease
  padding: 3px 6px
  min-height: 28px

.gpo-submenu-item:hover
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.1) 0%, rgba(18, 177, 209, 0.15) 100%)
  transform: translateX(4px)

.gpo-devices-panel
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 247, 251, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.2)
  display: flex
  flex-direction: column
  flex: 0 0 auto
  min-height: 0
  overflow: hidden

.gpo-devices-header
  background: rgba(255, 255, 255, 0.8)
  border-bottom: 1px solid rgba(18, 177, 209, 0.2)
  flex-shrink: 0

.gpo-devices-scroll
  flex: 1
  height: 100%
  overflow-y: auto

.gpo-main-content
  display: flex
  flex-direction: column
  flex: 1
  min-height: 0
  overflow: hidden

.gpo-agents-list-items
  padding: 4px 0

.gpo-agent-item
  border-radius: 6px
  margin: 2px 8px
  padding: 8px
  transition: all 0.2s ease
  cursor: pointer

.gpo-agent-item:hover
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.1) 0%, rgba(18, 177, 209, 0.15) 100%)
  transform: translateX(2px)

.gpo-agent-item.q-item--active
  background: linear-gradient(135deg, rgba(16, 137, 211, 0.2) 0%, rgba(18, 177, 209, 0.25) 100%)
  border-left: 3px solid rgb(16, 137, 211)

.gpo-content
  display: flex
  flex-direction: column
  flex: 1
  min-height: 0
  overflow: hidden

.gpo-content > .gpo-content-row
  flex: 1
  min-height: 0
  display: flex
  align-items: stretch

.gpo-content-header
  background: white
  border-bottom: 1px solid rgba(18, 177, 209, 0.2)
  flex-shrink: 0

.gpo-content-panels
  flex: 1
  overflow-y: auto

.body--dark .gpo-sidebar
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(40, 45, 55, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-sidebar-header
  background: linear-gradient(135deg, rgb(25, 35, 45) 0%, rgb(30, 40, 50) 100%)
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 8px

.body--dark .gpo-submenu
  background: rgba(50, 55, 60, 0.5)

.body--dark .gpo-content-header
  background: rgba(30, 30, 30, 0.98)
  border-bottom: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-devices-panel
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(40, 45, 55, 0.98) 100%)
  border-right: 1px solid rgba(18, 177, 209, 0.3)

.body--dark .gpo-devices-header
  background: rgba(30, 30, 30, 0.8)
  border-bottom: 1px solid rgba(18, 177, 209, 0.3)

.gpo-library-content
  display: flex
  flex-direction: column
  width: 100%
  height: 100%

.gpo-library-content .gpo-content-header
  flex-shrink: 0

.gpo-library-content .gpo-content-panels
  flex: 1
  overflow-y: auto
  min-height: 0
  position: relative
  display: flex
  flex-direction: column

.gpo-library-panels
  flex: 1
  min-height: 400px
  overflow-y: auto
  position: relative

.gpo-policies-sub-panels
  min-height: 300px

.gpo-windows-sub-panels
  min-height: 300px

.table-container
  max-height: 600px
  overflow-y: auto
  overflow-x: hidden

.policy-assignment-scroll-area
  height: 400px
  width: 100%

.policy-assignment-table
  width: 100%
</style>
