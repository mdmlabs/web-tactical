<template>
  <q-drawer
    :key="drawerKey"
    :behavior="drawerBehavior"
    v-model="drawerOpen"
    :width="sidebarWidth"
    :breakpoint="1024"
    :mini="isMiniMode && !isMobile"
    :mini-width="64"
    bordered
    show-if-above
    class="filebar-drawer"
  >
    <div class="filebar-drawer-content">
      <div class="filebar-drawer-header" v-if="isMobile">
        <div class="filebar-drawer-title">
          <span style="padding: 0 12px">Menu</span>
        </div>
        <q-btn
          flat
          dense
          round
          icon="close"
          size="sm"
          @click="closeDrawer"
          class="close-btn"
        />
      </div>

      <div class="filebar-menu-scroll-wrap">
        <q-scroll-area class="filebar-menu-scroll">
          <q-list class="filebar-menu-list">
            <!-- файл часть-->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="folder" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      File
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >File</q-item-label
                    >

                    <q-expansion-item
                      icon="add_circle_outline"
                      label="Add"
                      dense
                      class="filebar-popup-expansion"
                    >
                      <q-item
                        clickable
                        v-ripple
                        @click="handleMenuAction('addSite')"
                        class="filebar-popup-item"
                        v-close-popup
                      >
                        <q-item-section avatar>
                          <q-icon name="business_center" size="sm" />
                        </q-item-section>
                        <q-item-section>Site</q-item-section>
                      </q-item>
                    </q-expansion-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('auditLog')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="history" size="sm" />
                      </q-item-section>
                      <q-item-section>Audit Log</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('debugLog')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="bug_report" size="sm" />
                      </q-item-section>
                      <q-item-section>Debug Log</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="folder"
              label="File"
              class="filebar-menu-section"
            >
              <q-list>
                <q-expansion-item
                  icon="add_circle_outline"
                  label="Add"
                  class="filebar-menu-subsection"
                >
                  <q-list>
                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('addSite')"
                      class="filebar-menu-item"
                    >
                      <q-item-section avatar>
                        <q-icon name="business_center" />
                      </q-item-section>
                      <q-item-section>Site</q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('auditLog')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="history" />
                  </q-item-section>
                  <q-item-section>Audit Log</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('debugLog')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="bug_report" />
                  </q-item-section>
                  <q-item-section>Debug Log</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <!--полиси манаджер часть -->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="policy" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Policy Manager
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >Policy Manager</q-item-label
                    >

                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToGPO('dashboard')"
                      :class="[
                        'filebar-popup-item',
                        { 'active-menu-item': isActiveGPOTab('dashboard') },
                      ]"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="dashboard" size="sm" />
                      </q-item-section>
                      <q-item-section>Dashboard</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToGPO('collections')"
                      :class="[
                        'filebar-popup-item',
                        { 'active-menu-item': isActiveGPOTab('collections') },
                      ]"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="collections" size="sm" />
                      </q-item-section>
                      <q-item-section>Collections</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToGPO('library')"
                      :class="[
                        'filebar-popup-item',
                        { 'active-menu-item': isActiveGPOTab('library') },
                      ]"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="library_books" size="sm" />
                      </q-item-section>
                      <q-item-section>Policy Library</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('users')"
                      :class="[
                        'filebar-popup-item',
                        { 'active-menu-item': isActiveGPOTab('users') },
                      ]"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="person" size="sm" />
                      </q-item-section>
                      <q-item-section>Users</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('groups')"
                      :class="[
                        'filebar-popup-item',
                        { 'active-menu-item': isActiveGPOTab('groups') },
                      ]"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="group" size="sm" />
                      </q-item-section>
                      <q-item-section>Users Groups</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('groupsMachines')"
                      :class="[
                        'filebar-popup-item',
                        {
                          'active-menu-item': isActiveGPOTab('groupsMachines'),
                        },
                      ]"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="laptop_windows" size="sm" />
                      </q-item-section>
                      <q-item-section>Groups of Machines</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="policy"
              label="Policy Manager"
              class="filebar-menu-section"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToGPO('dashboard')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveGPOTab('dashboard') },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="dashboard" />
                  </q-item-section>
                  <q-item-section>Dashboard</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToGPO('collections')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveGPOTab('collections') },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="collections" />
                  </q-item-section>
                  <q-item-section>Collections</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToGPO('library')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveGPOTab('library') },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="library_books" />
                  </q-item-section>
                  <q-item-section>Policy Library</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('users')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveGPOTab('users') },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Users</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('groups')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveGPOTab('groups') },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="group" />
                  </q-item-section>
                  <q-item-section>Users Groups</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('groupsMachines')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveGPOTab('groupsMachines') },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="dns" />
                  </q-item-section>
                  <q-item-section>Groups of Machines</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- вью часть -->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="visibility" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      View
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >View</q-item-label
                    >

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('pendingActions')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="pending_actions" size="sm" />
                      </q-item-section>
                      <q-item-section>Pending Actions</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('agentMap')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="mdi-map-marker" size="sm" />
                      </q-item-section>
                      <q-item-section>Agent Map</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="visibility"
              label="View"
              class="filebar-menu-section"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('pendingActions')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="pending_actions" />
                  </q-item-section>
                  <q-item-section>Pending Actions</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('agentMap')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': currentPath === '/agents/map' },
                  ]"
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-map-marker" />
                  </q-item-section>
                  <q-item-section>Agent Map</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- File Management - commented out temporarily
          <template v-if="isMiniMode && !isMobile">
            <q-item
              clickable
              class="filebar-menu-section-mini"
              @click="handleMenuAction('fileManagement')"
            >
              <q-item-section avatar>
                <q-icon name="cloud_upload" size="24px">
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[10, 0]"
                  >
                    File Delivery
                  </q-tooltip>
                </q-icon>
              </q-item-section>
            </q-item>
          </template>

          <q-item
            v-else
            clickable
            v-ripple
            @click="handleMenuAction('fileManagement')"
            class="filebar-menu-section"
          >
            <q-item-section avatar>
              <q-icon name="cloud_upload" />
            </q-item-section>
            <q-item-section>File Delivery</q-item-section>
          </q-item>
          -->

            <!-- Resources -->
            <template v-if="isMiniMode && !isMobile">
              <q-item
                clickable
                class="filebar-menu-section-mini"
                @click="navigateToResources"
              >
                <q-item-section avatar>
                  <q-icon name="folder_open" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Resources
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
              </q-item>
            </template>

            <q-item
              v-else
              clickable
              v-ripple
              @click="navigateToResources"
              :class="[
                'filebar-menu-section',
                { 'active-menu-item': isResourcesActive },
              ]"
            >
              <q-item-section avatar>
                <q-icon name="folder_open" />
              </q-item-section>
              <q-item-section>Resources</q-item-section>
            </q-item>

            <!-- Policies -->
            <template v-if="isMiniMode && !isMobile">
              <q-item
                clickable
                class="filebar-menu-section-mini"
                @click="navigateToPolicies"
              >
                <q-item-section avatar>
                  <q-icon name="security" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Policies
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
              </q-item>
            </template>

            <q-item
              v-else
              clickable
              v-ripple
              @click="navigateToPolicies"
              :class="[
                'filebar-menu-section',
                { 'active-menu-item': isPoliciesActive },
              ]"
            >
              <q-item-section avatar>
                <q-icon name="security" />
              </q-item-section>
              <q-item-section>Policies</q-item-section>
            </q-item>

            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="hub" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Workspace
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >Workspace</q-item-label
                    >
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('AppManagement')"
                    >
                      <q-item-section avatar><q-icon name="apps" /></q-item-section>
                      <q-item-section>App Management</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('Licenses')"
                    >
                      <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
                      <q-item-section>License Tracking</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('Compliance')"
                    >
                      <q-item-section avatar><q-icon name="rule" /></q-item-section>
                      <q-item-section>Compliance</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('ComplianceCenter')"
                    >
                      <q-item-section avatar><q-icon name="fact_check" /></q-item-section>
                      <q-item-section>Compliance Center</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('WindowsAdvanced')"
                    >
                      <q-item-section avatar><q-icon name="dns" /></q-item-section>
                      <q-item-section>Windows Advanced</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="shield" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      DLP &amp; Security
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >DLP &amp; Security</q-item-label
                    >
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SecurityCenter')"
                    >
                      <q-item-section avatar><q-icon name="security" /></q-item-section>
                      <q-item-section>Security Center</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SecurityPeripheralControls')"
                    >
                      <q-item-section avatar><q-icon name="devices_other" /></q-item-section>
                      <q-item-section>Peripheral Controls</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="vpn_key" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      SSP (Self-Service)
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >SSP (Self-Service)</q-item-label
                    >
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPDevices')"
                    >
                      <q-item-section avatar><q-icon name="devices_other" /></q-item-section>
                      <q-item-section>My Devices</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPApps')"
                    >
                      <q-item-section avatar><q-icon name="apps_outage" /></q-item-section>
                      <q-item-section>App Catalog</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPRights')"
                    >
                      <q-item-section avatar><q-icon name="verified_user" /></q-item-section>
                      <q-item-section>My Rights</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPPassword')"
                    >
                      <q-item-section avatar><q-icon name="lock" /></q-item-section>
                      <q-item-section>Password</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPProfile')"
                    >
                      <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                      <q-item-section>My Profile</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPInfo')"
                    >
                      <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
                      <q-item-section>Info Portal</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      dense
                      class="filebar-popup-item"
                      v-close-popup
                      @click="navigateToMdmExtras('SSPLostDevice')"
                    >
                      <q-item-section avatar><q-icon name="report_problem" /></q-item-section>
                      <q-item-section>Report Lost Device</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              icon="hub"
              label="Workspace"
              header-class="filebar-menu-section"
              expand-separator
              dense-toggle
              v-if="!isMiniMode || isMobile"
            >
              <q-list class="q-pl-md">
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('DeviceManagement')"
                >
                  <q-item-section avatar>
                    <q-icon name="devices" />
                  </q-item-section>
                  <q-item-section>Devices &amp; Containers</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('AppManagement')"
                >
                  <q-item-section avatar><q-icon name="apps" /></q-item-section>
                  <q-item-section>App Management</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('Licenses')"
                >
                  <q-item-section avatar
                    ><q-icon name="receipt_long"
                  /></q-item-section>
                  <q-item-section>License Tracking</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('Compliance')"
                >
                  <q-item-section avatar><q-icon name="rule" /></q-item-section>
                  <q-item-section>Compliance</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('ComplianceCenter')"
                >
                  <q-item-section avatar
                    ><q-icon name="fact_check"
                  /></q-item-section>
                  <q-item-section>Compliance Center</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('WindowsAdvanced')"
                >
                  <q-item-section avatar><q-icon name="dns" /></q-item-section>
                  <q-item-section>Windows Advanced</q-item-section>
                </q-item>  
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('AgentHealthStatus')"
                >
                  <q-item-section avatar>
                    <q-icon name="favorite" />
                  </q-item-section>
                  <q-item-section>Agent Health</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              icon="shield"
              label="DLP &amp; Security"
              header-class="filebar-menu-section"
              expand-separator
              dense-toggle
              v-if="!isMiniMode || isMobile"
            >
              <q-list class="q-pl-md">
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SecurityCenter')"
                >
                  <q-item-section avatar
                    ><q-icon name="security"
                  /></q-item-section>
                  <q-item-section>Security Center</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SecurityPeripheralControls')"
                >
                  <q-item-section avatar>
                    <q-icon name="devices_other" />
                  </q-item-section>
                  <q-item-section>Peripheral Controls</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('Geofence')"
                >
                  <q-item-section avatar>
                    <q-icon name="public" />
                  </q-item-section>
                  <q-item-section>Geofence</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              icon="vpn_key"
              label="SSP (Self-Service)"
              header-class="filebar-menu-section"
              expand-separator
              dense-toggle
              v-if="!isMiniMode || isMobile"
            >
              <q-list class="q-pl-md">
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPDevices')"
                >
                  <q-item-section avatar
                    ><q-icon name="devices_other"
                  /></q-item-section>
                  <q-item-section>My Devices</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPApps')"
                >
                  <q-item-section avatar
                    ><q-icon name="apps_outage"
                  /></q-item-section>
                  <q-item-section>App Catalog</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPRights')"
                >
                  <q-item-section avatar
                    ><q-icon name="verified_user"
                  /></q-item-section>
                  <q-item-section>My Rights</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPPassword')"
                >
                  <q-item-section avatar><q-icon name="lock" /></q-item-section>
                  <q-item-section>Password</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPProfile')"
                >
                  <q-item-section avatar
                    ><q-icon name="account_circle"
                  /></q-item-section>
                  <q-item-section>My Profile</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPInfo')"
                >
                  <q-item-section avatar
                    ><q-icon name="menu_book"
                  /></q-item-section>
                  <q-item-section>Info Portal</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  dense
                  @click="navigateToMdmExtras('SSPLostDevice')"
                >
                  <q-item-section avatar
                    ><q-icon name="report_problem"
                  /></q-item-section>
                  <q-item-section>Report Lost Device</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>


            <!-- Security (SIEM / Wazuh) -->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="shield" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Security
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >Security</q-item-label
                    >
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('agents')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="dns" size="sm"
                      /></q-item-section>
                      <q-item-section>Agents</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('alerts')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="notification_important" size="sm"
                      /></q-item-section>
                      <q-item-section>Alerts / Rules</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('groups')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="folder" size="sm"
                      /></q-item-section>
                      <q-item-section>Groups</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToCywm('files')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="tune" size="sm"
                      /></q-item-section>
                      <q-item-section
                        >Configuration — Files &amp; Deploy</q-item-section
                      >
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToCywm('history')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="history" size="sm"
                      /></q-item-section>
                      <q-item-section
                        >Configuration — Deploy History</q-item-section
                      >
                    </q-item>
                    <q-separator spaced />
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('it-hygiene')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="health_and_safety" size="sm"
                      /></q-item-section>
                      <q-item-section>IT Hygiene</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('discover')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="explore" size="sm"
                      /></q-item-section>
                      <q-item-section>Discover</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('fim')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="fingerprint" size="sm"
                      /></q-item-section>
                      <q-item-section>FIM</q-item-section>
                    </q-item>
                    <q-separator spaced />
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('threat-hunting')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="track_changes" size="sm"
                      /></q-item-section>
                      <q-item-section>Threat Hunting</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('compliance')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="policy" size="sm"
                      /></q-item-section>
                      <q-item-section>Compliance</q-item-section>
                    </q-item>
                    <q-separator spaced />
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('vulnerability-detection')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="bug_report" size="sm"
                      /></q-item-section>
                      <q-item-section>Vulnerability Detection</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('reports')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="picture_as_pdf" size="sm"
                      /></q-item-section>
                      <q-item-section>Reports</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('reporting')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="summarize" size="sm"
                      /></q-item-section>
                      <q-item-section>Reporting</q-item-section>
                    </q-item>
                    <q-separator spaced />
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('workshop')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="construction" size="sm"
                      /></q-item-section>
                      <q-item-section>Workshop</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('rules')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="rule" size="sm"
                      /></q-item-section>
                      <q-item-section>Rules Management</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('use-cases')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="rocket_launch" size="sm"
                      /></q-item-section>
                      <q-item-section>Detection Cases</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('agent-compliance')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="verified" size="sm"
                      /></q-item-section>
                      <q-item-section>Agent SCA</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('ossec-config')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar
                        ><q-icon name="settings_applications" size="sm"
                      /></q-item-section>
                      <q-item-section>Manager Config</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="shield"
              label="Security"
              class="filebar-menu-section"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('agents')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('agents') },
                  ]"
                >
                  <q-item-section avatar><q-icon name="dns" /></q-item-section>
                  <q-item-section>Agents</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('alerts')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('alerts') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="notification_important"
                  /></q-item-section>
                  <q-item-section>Alerts / Rules</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('groups')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('groups') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="folder"
                  /></q-item-section>
                  <q-item-section>Groups</q-item-section>
                </q-item>
                <q-expansion-item
                  icon="tune"
                  label="Configuration"
                  dense
                  :default-opened="
                    isActiveCywmTab('files') || isActiveCywmTab('history')
                  "
                  class="filebar-submenu"
                >
                  <q-list>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToCywm('files')"
                      :class="[
                        'filebar-menu-item',
                        { 'active-menu-item': isActiveCywmTab('files') },
                      ]"
                    >
                      <q-item-section avatar
                        ><q-icon name="upload_file"
                      /></q-item-section>
                      <q-item-section>Files &amp; Deploy</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToCywm('history')"
                      :class="[
                        'filebar-menu-item',
                        { 'active-menu-item': isActiveCywmTab('history') },
                      ]"
                    >
                      <q-item-section avatar
                        ><q-icon name="history"
                      /></q-item-section>
                      <q-item-section>Deploy History</q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
                <q-expansion-item
                  icon="health_and_safety"
                  label="IT Hygiene"
                  dense
                  :default-opened="
                    isActiveSecurityTab('it-hygiene') ||
                    isActiveSecurityTab('discover') ||
                    isActiveSecurityTab('fim')
                  "
                  class="filebar-submenu"
                >
                  <q-list>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('it-hygiene')"
                      :class="[
                        'filebar-menu-item',
                        {
                          'active-menu-item': isActiveSecurityTab('it-hygiene'),
                        },
                      ]"
                    >
                      <q-item-section avatar
                        ><q-icon name="health_and_safety"
                      /></q-item-section>
                      <q-item-section>Overview</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('discover')"
                      :class="[
                        'filebar-menu-item',
                        { 'active-menu-item': isActiveSecurityTab('discover') },
                      ]"
                    >
                      <q-item-section avatar
                        ><q-icon name="explore"
                      /></q-item-section>
                      <q-item-section>Discover</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      @click="navigateToSecurity('fim')"
                      :class="[
                        'filebar-menu-item',
                        { 'active-menu-item': isActiveSecurityTab('fim') },
                      ]"
                    >
                      <q-item-section avatar
                        ><q-icon name="fingerprint"
                      /></q-item-section>
                      <q-item-section>FIM</q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('threat-hunting')"
                  :class="[
                    'filebar-menu-item',
                    {
                      'active-menu-item': isActiveSecurityTab('threat-hunting'),
                    },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="track_changes"
                  /></q-item-section>
                  <q-item-section>Threat Hunting</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('compliance')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('compliance') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="policy"
                  /></q-item-section>
                  <q-item-section>Compliance</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('vulnerability-detection')"
                  :class="[
                    'filebar-menu-item',
                    {
                      'active-menu-item': isActiveSecurityTab(
                        'vulnerability-detection',
                      ),
                    },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="bug_report"
                  /></q-item-section>
                  <q-item-section>Vulnerability Detection</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('reports')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('reports') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="picture_as_pdf"
                  /></q-item-section>
                  <q-item-section>Reports</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('reporting')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('reporting') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="summarize"
                  /></q-item-section>
                  <q-item-section>Reporting</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('workshop')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('workshop') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="construction"
                  /></q-item-section>
                  <q-item-section>Workshop</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('rules')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('rules') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="rule"
                  /></q-item-section>
                  <q-item-section>Rules Management</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('use-cases')"
                  :class="[
                    'filebar-menu-item',
                    { 'active-menu-item': isActiveSecurityTab('use-cases') },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="rocket_launch"
                  /></q-item-section>
                  <q-item-section>Detection Cases</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('agent-compliance')"
                  :class="[
                    'filebar-menu-item',
                    {
                      'active-menu-item':
                        isActiveSecurityTab('agent-compliance'),
                    },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="verified"
                  /></q-item-section>
                  <q-item-section>Agent SCA</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="navigateToSecurity('ossec-config')"
                  :class="[
                    'filebar-menu-item',
                    {
                      'active-menu-item':
                        isActiveSecurityTab('ossec-config'),
                    },
                  ]"
                >
                  <q-item-section avatar
                    ><q-icon name="settings_applications"
                  /></q-item-section>
                  <q-item-section>Manager Config</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- агент часть -->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="dns" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Agents
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >Agents</q-item-label
                    >

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('installAgent')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="download" size="sm" />
                      </q-item-section>
                      <q-item-section>Install Agent</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('deployments')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="cloud_download" size="sm" />
                      </q-item-section>
                      <q-item-section>Manage Deployments</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('updateAgents')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="system_update" size="sm" />
                      </q-item-section>
                      <q-item-section>Update Agents</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="dns"
              label="Agents"
              class="filebar-menu-section"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('installAgent')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="download" />
                  </q-item-section>
                  <q-item-section>Install Agent</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('deployments')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="cloud_download" />
                  </q-item-section>
                  <q-item-section>Manage Deployments</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('updateAgents')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="system_update" />
                  </q-item-section>
                  <q-item-section>Update Agents</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- сетинг часть-->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="settings" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Settings
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >Settings</q-item-label
                    >

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('clientsManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="people" size="sm" />
                      </q-item-section>
                      <q-item-section>Clients Manager</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('scriptManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="code" size="sm" />
                      </q-item-section>
                      <q-item-section>Script Manager</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('automationManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="auto_awesome" size="sm" />
                      </q-item-section>
                      <q-item-section>Automation Manager</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('alertsManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="notifications" size="sm" />
                      </q-item-section>
                      <q-item-section>Alerts Manager</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('permissionsManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="admin_panel_settings" size="sm" />
                      </q-item-section>
                      <q-item-section>Permissions Manager</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('adminManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="manage_accounts" size="sm" />
                      </q-item-section>
                      <q-item-section>User Administration</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('globalSettings')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="tune" size="sm" />
                      </q-item-section>
                      <q-item-section>Global Settings</q-item-section>
                    </q-item>

                    <q-item
                      v-if="!hosted"
                      clickable
                      v-ripple
                      @click="handleMenuAction('codeSign')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="verified" size="sm" />
                      </q-item-section>
                      <q-item-section>Code Signing</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="settings"
              label="Settings"
              class="filebar-menu-section"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('clientsManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="people" />
                  </q-item-section>
                  <q-item-section>Clients Manager</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('scriptManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="code" />
                  </q-item-section>
                  <q-item-section>Script Manager</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('automationManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="auto_awesome" />
                  </q-item-section>
                  <q-item-section>Automation Manager</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('alertsManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="notifications" />
                  </q-item-section>
                  <q-item-section>Alerts Manager</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('permissionsManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="admin_panel_settings" />
                  </q-item-section>
                  <q-item-section>Permissions Manager</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('adminManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="manage_accounts" />
                  </q-item-section>
                  <q-item-section>User Administration</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('globalSettings')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="tune" />
                  </q-item-section>
                  <q-item-section>Global Settings</q-item-section>
                </q-item>
                <q-item
                  v-if="!hosted"
                  clickable
                  v-ripple
                  @click="handleMenuAction('codeSign')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="verified" />
                  </q-item-section>
                  <q-item-section>Code Signing</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- тулз часть -->
            <template v-if="isMiniMode && !isMobile">
              <q-item clickable class="filebar-menu-section-mini">
                <q-item-section avatar>
                  <q-icon name="build" size="24px">
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[10, 0]"
                    >
                      Tools
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-menu
                  anchor="top end"
                  self="top start"
                  :offset="[8, 0]"
                  class="sidebar-popup-menu"
                >
                  <q-list class="filebar-popup-list">
                    <q-item-label header class="text-weight-bold"
                      >Tools</q-item-label
                    >
                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('bulkCommand')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="terminal" size="sm" />
                      </q-item-section>
                      <q-item-section>Bulk Command</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('bulkScript')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="article" size="sm" />
                      </q-item-section>
                      <q-item-section>Bulk Script</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('bulkPatch')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="update" size="sm" />
                      </q-item-section>
                      <q-item-section>Bulk Patch Management</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('bulkSoftware')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="apps" size="sm" />
                      </q-item-section>
                      <q-item-section>Bulk Software</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('templatesManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="folder_special" size="sm" />
                      </q-item-section>
                      <q-item-section>Templates Manager</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('serverMaintenance')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="construction" size="sm" />
                      </q-item-section>
                      <q-item-section>Server Maintenance</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('clearCache')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="cleaning_services" size="sm" />
                      </q-item-section>
                      <q-item-section>Clear Cache</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('recoverAgents')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="restart_alt" size="sm" />
                      </q-item-section>
                      <q-item-section>Recover All Agents</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="handleMenuAction('reportsManager')"
                      class="filebar-popup-item"
                      v-close-popup
                    >
                      <q-item-section avatar>
                        <q-icon name="report" size="sm" />
                      </q-item-section>
                      <q-item-section>Reports Manager</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </template>

            <q-expansion-item
              v-else
              icon="build"
              label="Tools"
              class="filebar-menu-section"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('bulkCommand')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="terminal" />
                  </q-item-section>
                  <q-item-section>Bulk Command</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('bulkScript')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="article" />
                  </q-item-section>
                  <q-item-section>Bulk Script</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('bulkPatch')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="update" />
                  </q-item-section>
                  <q-item-section>Bulk Patch Management</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('bulkSoftware')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="apps" />
                  </q-item-section>
                  <q-item-section>Bulk Software</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('templatesManager')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="folder_special" />
                  </q-item-section>
                  <q-item-section>Templates Manager</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('serverMaintenance')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="construction" />
                  </q-item-section>
                  <q-item-section>Server Maintenance</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('clearCache')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="cleaning_services" />
                  </q-item-section>
                  <q-item-section>Clear Cache</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('recoverAgents')"
                  class="filebar-menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="restart_alt" />
                  </q-item-section>
                  <q-item-section>Recover All Agents</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="handleMenuAction('reportsManager')"
                  class="filebar-menu-item"
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon name="report" />
                  </q-item-section>
                  <q-item-section>Reports Manager</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- <q-expansion-item
            v-if="!hosted"
            icon="help"
            label="Help"
            class="filebar-menu-section"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpDocs')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="menu_book" />
                </q-item-section>
                <q-item-section>Documentation</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpGithub')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="code" />
                </q-item-section>
                <q-item-section>GitHub Repo</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpBug')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="bug_report" />
                </q-item-section>
                <q-item-section>Bug Report</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpFeature')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="lightbulb" />
                </q-item-section>
                <q-item-section>Feature Request</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="handleMenuAction('helpDiscord')"
                class="filebar-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="chat" />
                </q-item-section>
                <q-item-section>Join Discord</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item> -->
          </q-list>
        </q-scroll-area>
      </div>
    </div>

    <q-dialog v-model="showEditCoreSettingsModal">
      <EditCoreSettings @close="showEditCoreSettingsModal = false" />
    </q-dialog>
    <q-dialog v-model="showInstallAgent">
      <InstallAgent @close="showInstallAgent = false" />
    </q-dialog>
    <q-dialog v-model="showAdminManager">
      <AdminManager @close="showAdminManager = false" />
    </q-dialog>
    <q-dialog v-model="showServerMaintenance">
      <ServerMaintenance @close="showServerMaintenance = false" />
    </q-dialog>
    <q-dialog v-model="showCodeSign">
      <CodeSign @close="showCodeSign = false" />
    </q-dialog>

    <AddSiteDialog
      v-model="showAddSiteDialog"
      :loading="addSiteLoading"
      :name="addSiteForm.name"
      :description="addSiteForm.description"
      :parent-id="addSiteForm.parentId"
      :max-agents="addSiteForm.maxAgents"
      :os-version="addSiteForm.osVersion"
      :parent-options="addSiteParentOptions"
      @update:name="addSiteForm.name = $event"
      @update:description="addSiteForm.description = $event"
      @update:parent-id="addSiteForm.parentId = $event"
      @update:max-agents="addSiteForm.maxAgents = $event"
      @update:os-version="addSiteForm.osVersion = $event"
      @create="doAddSite"
    />
  </q-drawer>
</template>

<script>
import mixins from "@/mixins/mixins";
import DialogWrapper from "@/components/ui/DialogWrapper.vue";
import DebugLog from "@/components/logs/DebugLog.vue";
import PendingActions from "@/components/logs/PendingActions.vue";
import ClientsManager from "@/components/clients/ClientsManager.vue";
import ClientsForm from "@/components/clients/ClientsForm.vue";
import AddSiteDialog from "@/components/clients/AddSiteDialog.vue";
import ScriptManager from "@/components/scripts/ScriptManager.vue";
import EditCoreSettings from "@/components/modals/coresettings/EditCoreSettings.vue";
import AlertsManager from "@/components/AlertsManager.vue";
import AutomationManager from "@/components/automation/AutomationManager.vue";
import AdminManager from "@/components/AdminManager.vue";
import InstallAgent from "@/components/modals/agents/InstallAgent.vue";
import AuditManager from "@/components/logs/AuditManager.vue";
import BulkAction from "@/components/modals/agents/BulkAction.vue";
import DeploymentTable from "@/components/clients/DeploymentTable.vue";
import ServerMaintenance from "@/components/modals/core/ServerMaintenance.vue";
import CodeSign from "@/components/modals/coresettings/CodeSign.vue";
import PermissionsManager from "@/components/accounts/PermissionsManager.vue";
import TemplateManager from "@/components/tasks/TemplateManager.vue";
import ReportsManager from "@/reports/components/ReportsManager.vue";

export default {
  name: "FileBar",
  mixins: [mixins],
  components: {
    EditCoreSettings,
    InstallAgent,
    AdminManager,
    ServerMaintenance,
    CodeSign,
    AddSiteDialog,
  },
  data() {
    return {
      showServerMaintenance: false,
      showEditCoreSettingsModal: false,
      showAdminManager: false,
      showInstallAgent: false,
      showCodeSign: false,
      showAddSiteDialog: false,
      addSiteLoading: false,
      addSiteForm: {
        name: "",
        description: "",
        parentId: null,
        maxAgents: 0,
        osVersion: "",
      },
      addSiteParentOptions: [],
    };
  },
  computed: {
    hosted() {
      return this.$store.state.hosted;
    },
    drawerOpen: {
      get() {
        return this.isMobile ? this.$store.state.fileBarDrawerOpen : true;
      },
      set(val) {
        // commit always so q-drawer's internal model stays in sync
        // with the store on breakpoint crossings (e.g. opening/closing F12)
        this.$store.commit("SET_FILEBAR_DRAWER", val);
      },
    },
    isMiniMode() {
      return this.$store.state.sidebarCollapsed;
    },
    isMobile() {
      return this.$q.screen.lt.md;
    },
    drawerKey() {
      return this.isMobile ? "filebar-mobile" : "filebar-desktop";
    },

    drawerBehavior() {
      return this.isMobile ? "mobile" : "desktop";
    },

    sidebarWidth() {
      if (this.isMobile) {
        return 280;
      }
      return this.isMiniMode ? 64 : 280;
    },
    currentPath() {
      return this.$route.path;
    },
  },
  methods: {
    isActiveRoute(path) {
      if (!path) return false;
      return (
        this.currentPath === path || this.currentPath.startsWith(path + "/")
      );
    },
    isActiveGPOTab(tab) {
      return this.currentPath === "/gpo" && this.$route.query.tab === tab;
    },
    isResourcesActive() {
      return this.currentPath.startsWith("/resources");
    },
    isPoliciesActive() {
      return this.currentPath.startsWith("/policies");
    },
    closeDrawer() {
      if (this.isMobile) {
        this.$store.commit("SET_FILEBAR_DRAWER", false);
      }
    },
    handleMenuAction(action) {
      // клозим дравер на мобилках после выбора действия
      if (this.isMobile) {
        this.closeDrawer();
      }

      switch (action) {
        case "addClient":
          this.showAddClientModal();
          break;
        case "addSite":
          this.showAddSiteModal();
          break;
        case "auditLog":
          this.showAuditManager();
          break;
        case "debugLog":
          this.showDebugLog();
          break;
        case "pendingActions":
          this.showPendingActions();
          break;
        case "users":
          this.navigateToGPO("users");
          break;
        case "groups":
          this.navigateToGPO("groups");
          break;
        case "groupsMachines":
          this.navigateToGPO("groupsMachines");
          break;
        case "installAgent":
          this.showInstallAgent = true;
          break;
        case "deployments":
          this.showDeployments();
          break;
        case "updateAgents":
          this.$router.push("/updates");
          break;
        case "clientsManager":
          this.showClientsManager();
          break;
        case "scriptManager":
          this.showScriptManager();
          break;
        case "automationManager":
          this.showAutomationManager();
          break;
        case "alertsManager":
          this.showAlertsManager();
          break;
        case "permissionsManager":
          this.showPermissionsManager();
          break;
        case "adminManager":
          this.showAdminManager = true;
          break;
        case "globalSettings":
          this.showEditCoreSettingsModal = true;
          break;
        case "codeSign":
          this.showCodeSign = true;
          break;
        case "bulkCommand":
          this.showBulkAction("command");
          break;
        case "bulkScript":
          this.showBulkAction("script");
          break;
        case "bulkPatch":
          this.showBulkAction("patch");
          break;
        case "bulkSoftware":
          this.showBulkAction("software");
          break;
        case "templatesManager":
          this.showTemplatesManager();
          break;
        case "serverMaintenance":
          this.showServerMaintenance = true;
          break;
        case "clearCache":
          this.clearCache();
          break;
        case "recoverAgents":
          this.bulkRecoverAgents();
          break;
        case "reportsManager":
          this.showReportsManager();
          break;
        case "helpDocs":
          this.openHelp("docs");
          break;
        case "helpGithub":
          this.openHelp("github");
          break;
        case "helpBug":
          this.openHelp("bug");
          break;
        case "helpFeature":
          this.openHelp("feature");
          break;
        case "helpDiscord":
          this.openHelp("discord");
          break;
        case "fileManagement":
          this.$router.push({ name: "FileManagement" });
          break;
        case "agentMap":
          this.$router.push({ name: "AgentMap" });
          break;
      }
    },
    navigateToGPO(tab = "dashboard") {
      // клозим дравер на мобилках после выбора действия
      if (this.isMobile) {
        this.closeDrawer();
      }
      this.$router.push({
        path: "/gpo",
        query: { tab },
      });
    },
    navigateToResources() {
      if (this.isMobile) {
        this.closeDrawer();
      }
      this.$router.push({ name: "Resources" });
    },
    navigateToPolicies() {
      if (this.isMobile) {
        this.closeDrawer();
      }
      this.$router.push({ name: "Policies" });
    },
    navigateToMdmExtras(routeName) {
      if (this.isMobile) {
        this.closeDrawer();
      }
      this.$router.push({ name: routeName }).catch(() => {});
    },
    navigateToSecurity(tab = "dashboard") {
      if (this.isMobile) {
        this.closeDrawer();
      }
      // Compliance hub navigates to the unified compliance page
      if (tab === "compliance") {
        this.$router.push({ name: "ComplianceHub" });
        return;
      }
      const routeMap = {
        agents: "SecurityAgents",
        alerts: "SecurityAlerts",
        groups: "SecurityGroups",
        "it-hygiene": "ITHygiene",
        discover: "SecurityDiscover",
        fim: "SecurityFIM",
        reports: "SecurityReports",
        reporting: "SecurityReporting",
        "threat-hunting": "ThreatHunting",
        "vulnerability-detection": "VulnerabilityDetection",
        workshop: "Workshop",
        rules: "RulesManagement",
        "use-cases": "DetectionCases",
        "agent-compliance": "AgentCompliance",
        "ossec-config": "OssecConfig",
      };
      this.$router.push({ name: routeMap[tab] || "SecurityAgents" });
    },
    navigateToCywm(tab = "files") {
      if (this.isMobile) {
        this.closeDrawer();
      }
      const routeMap = {
        files: "CywmFiles",
        history: "CywmHistory",
      };
      this.$router.push({ name: routeMap[tab] || "CywmFiles" });
    },
    isActiveCywmTab(tab) {
      const pathMap = {
        files: "/cywm/files",
        history: "/cywm/history",
      };
      return this.currentPath === pathMap[tab];
    },
    isActiveComplianceFramework(framework) {
      return this.currentPath === "/security/compliance/" + framework;
    },
    isActiveSecurityTab(tab) {
      const path = this.currentPath;
      if (tab === "agents")
        return path.startsWith("/security/agents") || path === "/security";
      if (tab === "alerts") return path === "/security/alerts";
      if (tab === "groups") return path === "/security/groups";
      if (tab === "compliance")
        return (
          path.startsWith("/security/compliance") ||
          path.startsWith("/security/sca")
        );
      if (tab === "it-hygiene") return path === "/security/it-hygiene";
      if (tab === "discover") return path === "/security/discover";
      if (tab === "fim") return path.startsWith("/security/fim");
      if (tab === "threat-hunting")
        return path.startsWith("/security/threat-hunting");
      if (tab === "vulnerability-detection")
        return path.startsWith("/security/vulnerability-detection");
      if (tab === "reports") return path === "/security/reports";
      if (tab === "reporting") return path === "/security/reporting";
      if (tab === "workshop") return path.startsWith("/security/workshop");
      if (tab === "rules") return path.startsWith("/security/rules");
      if (tab === "use-cases") return path.startsWith("/security/use-cases");
      if (tab === "agent-compliance")
        return path.startsWith("/security/agent-compliance");
      if (tab === "ossec-config")
        return path.startsWith("/security/ossec-config");
      return false;
    },
    clearCache() {
      this.$axios
        .get("/core/clearcache/")
        .then((r) => this.notifySuccess(r.data));
    },
    bulkRecoverAgents() {
      this.$q
        .dialog({
          title: "Bulk Recover All Agents?",
          message:
            "This will restart the Tactical and Mesh Agent services on all agents",
          cancel: true,
        })
        .onOk(() => {
          this.$axios
            .get("/agents/bulkrecovery/")
            .then((r) => this.notifySuccess(r.data));
        });
    },
    openHelp(mode) {
      let url;
      switch (mode) {
        case "github":
          url = "https://github.com/amidaware/tacticalrmm/";
          break;
        case "docs":
          url = "https://docs.tacticalrmm.com";
          break;
        case "bug":
          url =
            "https://github.com/amidaware/tacticalrmm/issues/new?template=bug_report.md";
          break;
        case "feature":
          url =
            "https://github.com/amidaware/tacticalrmm/issues/new?template=feature_request.md";
          break;
        case "discord":
          url = "https://discord.gg/upGTkWp";
          break;
      }
      window.open(url, "_blank");
    },
    showAutomationManager() {
      this.$q.dialog({
        component: AutomationManager,
      });
    },
    showAlertsManager() {
      this.$q.dialog({
        component: AlertsManager,
      });
    },
    showClientsManager() {
      this.$q
        .dialog({
          component: ClientsManager,
        })
        .onDismiss(() => this.$store.dispatch("refreshDashboard", true));
    },
    showAddClientModal() {
      this.$q
        .dialog({
          component: ClientsForm,
        })
        .onOk(() => this.$store.dispatch("loadTree"));
    },
    async showAddSiteModal() {
      const { data } = await this.$axios.get("/clients/sites/");
      this.addSiteParentOptions = data.map((s) => ({
        label: s.name,
        value: s.id,
      }));
      this.addSiteForm = {
        name: "",
        description: "",
        parentId: null,
        maxAgents: 0,
        osVersion: "",
      };
      this.showAddSiteDialog = true;
    },
    async doAddSite() {
      this.addSiteLoading = true;
      try {
        await this.$axios.post("/clients/sites/", {
          site: {
            name: this.addSiteForm.name.trim(),
            description: this.addSiteForm.description.trim() || "",
            parent: this.addSiteForm.parentId ?? null,
            max_agents: this.addSiteForm.maxAgents ?? 0,
            os_version: (this.addSiteForm.osVersion || "").trim() || null,
          },
          custom_fields: [],
        });
        this.notifySuccess("Site created");
        this.showAddSiteDialog = false;
        this.$store.dispatch("loadTree");
      } catch (e) {
        console.error(e);
      }
      this.addSiteLoading = false;
    },
    showPermissionsManager() {
      this.$q.dialog({
        component: PermissionsManager,
      });
    },
    showAuditManager() {
      this.$q.dialog({
        component: DialogWrapper,
        componentProps: {
          vuecomponent: AuditManager,
          noCard: true,
          componentProps: {
            modal: true,
          },
          dialogProps: {
            maximized: true,
            ["transition-show"]: "slide-up",
            ["transition-hide"]: "slide-down",
          },
        },
      });
    },
    showScriptManager() {
      this.$q.dialog({
        component: ScriptManager,
      });
    },
    showBulkAction(mode) {
      this.$q.dialog({
        component: BulkAction,
        componentProps: {
          mode: mode,
        },
      });
    },
    showTemplatesManager() {
      this.$q.dialog({
        component: TemplateManager,
      });
    },
    showDebugLog() {
      this.$q.dialog({
        component: DialogWrapper,
        componentProps: {
          vuecomponent: DebugLog,
          noCard: true,
          componentProps: {
            modal: true,
          },
          dialogProps: {
            maximized: true,
            ["transition-show"]: "slide-up",
            ["transition-hide"]: "slide-down",
          },
        },
      });
    },
    showPendingActions() {
      this.$q.dialog({
        component: PendingActions,
      });
    },
    showDeployments() {
      this.$q.dialog({
        component: DeploymentTable,
      });
    },
    showReportsManager() {
      this.$q.dialog({
        component: ReportsManager,
      });
    },
  },
};
</script>

<style scoped>
.filebar-drawer {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(244, 247, 251, 0.98) 100%
  );
  backdrop-filter: blur(10px);
  transition: width 0.3s ease;
}

.filebar-drawer :deep(.q-drawer__content) {
  overflow-x: hidden;
}

.filebar-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.filebar-menu-scroll-wrap {
  flex: 1 1 0%;
  min-height: 0;
  max-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
}

@media (max-width: 1023px) {
  .filebar-menu-scroll-wrap {
    max-height: calc(100vh - 80px);
  }
}

.filebar-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(
    135deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 64px;
}

@media (min-width: 1024px) {
  .filebar-drawer-header {
    display: none;
  }
}

.filebar-drawer-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn,
.toggle-btn {
  color: white;
  transition: all 0.3s ease;
}

.close-btn:hover,
.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.filebar-menu-scroll {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.filebar-menu-list {
  padding: 8px;
}

.filebar-menu-section {
  margin-bottom: 4px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(18, 177, 209, 0.1);
}

.filebar-menu-section :deep(.q-item) {
  border-radius: 8px;
}

.filebar-menu-section :deep(.q-expansion-item__container) {
  border-radius: 8px;
}

.filebar-menu-section :deep(.q-expansion-item__content) {
  background: rgba(255, 255, 255, 0.3);
}

.filebar-drawer.q-drawer--mini .filebar-menu-section {
  margin: 4px 2px;
}

.filebar-drawer.q-drawer--mini .filebar-menu-section :deep(.q-item) {
  justify-content: center;
  padding: 8px;
}

.filebar-drawer.q-drawer--mini
  .filebar-menu-section
  :deep(.q-item__section--avatar) {
  min-width: auto;
  padding-right: 0;
}

.filebar-drawer.q-drawer--mini .filebar-menu-item {
  justify-content: center;
}

.filebar-drawer.q-drawer--mini .filebar-menu-section :deep(.q-item__label),
.filebar-drawer.q-drawer--mini
  .filebar-menu-item
  :deep(.q-item__section--main) {
  display: none;
}

.filebar-drawer.q-drawer--mini
  .filebar-menu-section
  :deep(.q-expansion-item__toggle-icon) {
  display: none;
}

.filebar-drawer.q-drawer--mini .mini-header {
  justify-content: center;
}

.filebar-menu-item {
  border-radius: 6px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

.filebar-menu-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.1) 0%,
    rgba(18, 177, 209, 0.15) 100%
  );
  transform: translateX(4px);
}

.filebar-menu-item.active-menu-item {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.25) 0%,
    rgba(18, 177, 209, 0.3) 100%
  );
  border-left: 3px solid rgb(16, 137, 211);
  font-weight: 600;
}

.filebar-menu-item.active-menu-item :deep(.q-icon) {
  color: rgb(16, 137, 211);
}

.filebar-menu-item :deep(.q-item-section) {
  color: #333;
  font-weight: 500;
}

.filebar-menu-item :deep(.q-icon) {
  color: rgb(16, 137, 211);
}

.filebar-menu-subsection {
  margin-left: 8px;
}

.filebar-menu-subsection :deep(.q-expansion-item__content) {
  background: rgba(255, 255, 255, 0.2);
}

.filebar-menu-section-mini {
  margin: 4px 8px;
  border-radius: 8px;
  padding: 12px 0 !important;
  transition: all 0.2s ease;
  cursor: pointer;
}

.filebar-menu-section-mini:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.1) 0%,
    rgba(18, 177, 209, 0.15) 100%
  );
}

.filebar-menu-section-mini .q-item-section {
  justify-content: center;
  align-items: center;
}

.filebar-menu-section-mini.active-section-icon {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.25) 0%,
    rgba(18, 177, 209, 0.3) 100%
  );
  border-left: 3px solid rgb(16, 137, 211);
}

.filebar-menu-section-mini.active-section-icon .q-icon {
  color: rgb(16, 137, 211);
  transform: scale(1.1);
}

.sidebar-popup-menu {
  min-width: 240px;
  max-width: 280px;
}

.filebar-popup-list {
  padding: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(244, 247, 251, 0.98) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(18, 177, 209, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.filebar-popup-list .q-item-label--header {
  padding: 8px 12px;
  font-size: 14px;
  color: rgb(16, 137, 211);
  border-bottom: 1px solid rgba(18, 177, 209, 0.2);
  margin-bottom: 4px;
}

.filebar-popup-item {
  border-radius: 6px;
  margin: 2px 0;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.filebar-popup-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.1) 0%,
    rgba(18, 177, 209, 0.15) 100%
  );
  transform: translateX(4px);
}

.filebar-popup-item :deep(.q-item__section--avatar) {
  min-width: 32px;
  padding-right: 12px;
}

.filebar-popup-item :deep(.q-icon) {
  color: rgb(16, 137, 211);
}

.filebar-popup-item.active-menu-item {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.25) 0%,
    rgba(18, 177, 209, 0.3) 100%
  );
  border-left: 3px solid rgb(16, 137, 211);
  font-weight: 600;
}

.filebar-popup-item.active-menu-item :deep(.q-icon) {
  color: rgb(16, 137, 211);
  font-weight: bold;
}

.filebar-popup-expansion {
  border-radius: 6px;
  margin: 2px 0;
}

.filebar-popup-expansion :deep(.q-item) {
  padding: 8px 12px;
}

.filebar-popup-expansion :deep(.q-expansion-item__content) {
  background: rgba(16, 137, 211, 0.05);
  border-radius: 4px;
  margin-top: 4px;
}

.body--dark .filebar-drawer {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.98) 0%,
    rgba(40, 45, 55, 0.98) 100%
  );
}

.body--dark .filebar-drawer-header {
  background: linear-gradient(135deg, rgb(25, 35, 45) 0%, rgb(30, 40, 50) 100%);
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 8px;
}

.body--dark .filebar-menu-section {
  background: rgba(50, 55, 60, 0.5);
  border: 1px solid rgba(18, 177, 209, 0.3);
}

.body--dark .filebar-menu-section :deep(.q-expansion-item__content) {
  background: rgba(40, 45, 50, 0.3);
}

.body--dark .filebar-menu-item :deep(.q-item-section) {
  color: #e0e0e0;
}

.body--dark .filebar-menu-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.2) 0%,
    rgba(18, 177, 209, 0.25) 100%
  );
}

.body--dark .filebar-menu-item :deep(.q-icon) {
  color: #12b1d1;
}

.body--dark .filebar-menu-subsection :deep(.q-expansion-item__content) {
  background: rgba(35, 40, 45, 0.2);
}

.body--dark .filebar-drawer.q-drawer--mini .filebar-drawer-header {
  justify-content: center;
}

.body--dark .filebar-popup-list {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.98) 0%,
    rgba(40, 45, 55, 0.98) 100%
  );
  border: 1px solid rgba(18, 177, 209, 0.3);
}

.body--dark .filebar-popup-list .q-item-label--header {
  color: #12b1d1;
  border-bottom: 1px solid rgba(18, 177, 209, 0.3);
}

.body--dark .filebar-popup-item {
  color: #e0e0e0;
}

.body--dark .filebar-popup-item:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.2) 0%,
    rgba(18, 177, 209, 0.25) 100%
  );
}

.body--dark .filebar-popup-item :deep(.q-icon) {
  color: #12b1d1;
}

.body--dark .filebar-menu-section-mini:hover {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.2) 0%,
    rgba(18, 177, 209, 0.25) 100%
  );
}

.body--dark .filebar-popup-expansion :deep(.q-expansion-item__content) {
  background: rgba(16, 137, 211, 0.1);
}

.body--dark .filebar-menu-item.active-menu-item {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.35) 0%,
    rgba(18, 177, 209, 0.4) 100%
  );
  border-left: 3px solid #12b1d1;
}

.body--dark .filebar-menu-item.active-menu-item :deep(.q-icon) {
  color: #12b1d1;
}

.body--dark .filebar-popup-item.active-menu-item {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.35) 0%,
    rgba(18, 177, 209, 0.4) 100%
  );
  border-left: 3px solid #12b1d1;
}

.body--dark .filebar-popup-item.active-menu-item :deep(.q-icon) {
  color: #12b1d1;
}

.body--dark .filebar-menu-section-mini.active-section-icon {
  background: linear-gradient(
    135deg,
    rgba(16, 137, 211, 0.35) 0%,
    rgba(18, 177, 209, 0.4) 100%
  );
  border-left: 3px solid #12b1d1;
}

.body--dark .filebar-menu-section-mini.active-section-icon .q-icon {
  color: #12b1d1;
}
</style>
