/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { mergeConfig } = require("vite");
const { configure } = require("quasar/wrappers");
const path = require("node:path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(dotenv.config());

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: true,
      errors: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ["pinia", "axios", "monaco", "integrations"],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      "ionicons-v4",
      "mdi-v7",
      "fontawesome-v6",
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ["es2022"],
        node: "node20",
      },

      vueRouterMode: "history", // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      env: {
        DEV_API: process.env.DEV_URL,
        PROD_API: process.env.PROD_URL,
        DOCKER_BUILD: process.env.DOCKER_BUILD,
        DEV_DOCS_URL: process.env.DEV_DOCS_URL,
        DEV_GRPC_URL: process.env.DEV_GRPC_URL,
        
        // используем проксю для обхода корсов (по умолчанию true в dev режиме)
        USE_PROXY: process.env.USE_PROXY !== "false",
        WAZUH_API_ID: process.env.WAZUH_API_ID || "",
      },
      alias: {
        ["@"]: path.join(__dirname, "./src"),
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      distDir: "dist/",

      /* eslint-disable quotes */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      extendViteConf(viteConf, { isServer, isClient }) {
        viteConf.build = mergeConfig(viteConf.build, {
          chunkSizeWarningLimit: 1600,
          rollupOptions: {
            output: {
              entryFileNames: `[hash].js`,
              chunkFileNames: `[hash].js`,
              assetFileNames: `[hash].[ext]`,
            },
          },
        });

        // настройка прокси для обхода CORS в режиме разработки
        if (!isServer && viteConf.server) {
          const apiUrl = process.env.DEV_URL;
          // Если используется самоподписанный сертификат, установите USE_PROXY_INSECURE=true
          // Проверяем переменную из .env (dotenv уже загружен в начале )
          const insecure =
            process.env.USE_PROXY_INSECURE === "true" ||
            process.env.USE_PROXY_INSECURE === true;

          // для работы с самоподписанными сертификатами нужен специальный agent
          let httpsAgent = null;
          if (insecure) {
            const https = require("https");
            httpsAgent = new https.Agent({
              rejectUnauthorized: false, // Игнорь ошибок SSL
            });
          }

          const grpcUrl = process.env.DEV_GRPC_URL;

          const wazuhDashboardUrl = process.env.DEV_WAZUH_DASHBOARD_URL || "";
          const wazuhDashboardUser =
            process.env.DEV_WAZUH_DASHBOARD_USER || "admin";
          const wazuhDashboardPass = process.env.DEV_WAZUH_DASHBOARD_PASS || "";

          viteConf.server.proxy = {
            "/api/grpc": {
              target: grpcUrl,
              changeOrigin: true,
              secure: !insecure,
              agent: httpsAgent,

              rewrite: (path) => path.replace(/^\/api\/grpc/, ""),
              configure: (proxy) => {
                proxy.on("proxyReq", (proxyReq) => {
                  const contentType = proxyReq.getHeader("Content-Type");
                  if (
                    contentType &&
                    contentType.includes("application/grpc-web")
                  ) {
                  } else if (!contentType) {
                    proxyReq.setHeader(
                      "Content-Type",
                      "application/grpc-web+proto",
                    );
                  }
                });
                proxy.on("proxyRes", (proxyRes) => {
                  const contentType = proxyRes.headers["content-type"];
                  if (
                    !contentType ||
                    !contentType.includes("application/grpc-web")
                  ) {
                    proxyRes.headers["content-type"] =
                      "application/grpc-web+proto";
                  }
                });
              },
            },

            // Proxy to Wazuh Dashboard (OpenSearch Dashboards) for Alerting API.
            // Injects Basic Auth so OSD accepts the requests.
            ...(wazuhDashboardUrl
              ? {
                  "/wazuh-dashboard": {
                    target: wazuhDashboardUrl,
                    changeOrigin: true,
                    secure: !insecure,
                    agent: httpsAgent,
                    rewrite: (path) => path.replace(/^\/wazuh-dashboard/, ""),
                    configure: (proxy) => {
                      proxy.on("proxyReq", (proxyReq) => {
                        if (wazuhDashboardUser && wazuhDashboardPass) {
                          const basicAuth = Buffer.from(
                            `${wazuhDashboardUser}:${wazuhDashboardPass}`,
                          ).toString("base64");
                          proxyReq.setHeader(
                            "Authorization",
                            `Basic ${basicAuth}`,
                          );
                        }
                        // OSD requires osd-xsrf header for non-GET requests
                        if (!proxyReq.getHeader("osd-xsrf")) {
                          proxyReq.setHeader("osd-xsrf", "true");
                        }
                      });
                    },
                  },
                }
              : {}),

            // CYWM backend — path preserved as-is (Django registers at /api/cywm/)
            "/api/cywm": {
              target: apiUrl,
              changeOrigin: true,
              secure: !insecure,
              agent: httpsAgent,
            },

            "/api": {
              target: apiUrl,
              changeOrigin: true,
              secure: !insecure, // false для самоподписанных сертификатов
              agent: httpsAgent, // использовать agent для игнорирования SSL ошибок
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          };
        }
      },
      /* eslint-enable quotes */
      // viteVuePluginOptions: {},
      // vitePlugins: []
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      https: process.env.USE_HTTPS === "true",
      open: false, // opens browser window automatically
      host: process.env.DEV_HOST,
      port: process.env.DEV_PORT,
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        loadingBar: {
          size: "4px",
        },
        notify: {
          position: "top",
          timeout: 2000,
          textColor: "white",
          actions: [{ icon: "close", color: "white" }],
        },
        loading: {
          delay: 50,
        },
      },

      iconSet: "material-icons", // Quasar icon set
      lang: "en-US", // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["Dialog", "Loading", "LoadingBar", "Meta", "Notify"],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        "render", // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: "generateSW", // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "quasar-project",
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ["my-content-script"],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  };
});
