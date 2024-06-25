// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+vite@5.0.10_@types+node@18.15.3_sass@1.69.7/node_modules/vite/dist/node/index.js";
import { resolve as resolve2 } from "path";

// build/getEnv.ts
function wrapperEnv(envConf) {
  const ret = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT")
      realName = Number(realName);
    if (envName === "VITE_PROXY") {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
      }
    }
    ret[envName] = realName;
  }
  return ret;
}

// build/proxy.ts
function createProxy(list = []) {
  const ret = {};
  for (const [prefix, target] of list) {
    const httpsRE = /^https:\/\//;
    const isHttps = httpsRE.test(target);
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      // https is require secure=false
      ...isHttps ? { secure: false } : {}
    };
  }
  return ret;
}

// build/plugins.ts
import { resolve } from "path";
import { VitePWA } from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-pwa@0.17.4_vite@5.0.10_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
import { createHtmlPlugin } from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-html@3.2.1_vite@5.0.10/node_modules/vite-plugin-html/dist/index.mjs";
import { visualizer } from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+rollup-plugin-visualizer@5.12.0_rollup@2.79.1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { createSvgIconsPlugin } from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.0.10/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vue from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@5.0.2_vite@5.0.10_vue@3.4.3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue-jsx@3.1.0_vite@5.0.10_vue@3.4.3/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import eslintPlugin from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/vite-plugin-eslint@1.8.1_eslint@8.56.0_vite@5.0.10/node_modules/vite-plugin-eslint/dist/index.mjs";
import viteCompression from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.0.10/node_modules/vite-plugin-compression/dist/index.mjs";
import vueSetupExtend from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/unplugin-vue-setup-extend-plus@1.0.0/node_modules/unplugin-vue-setup-extend-plus/dist/vite.js";
var createVitePlugins = (viteEnv) => {
  const { VITE_GLOB_APP_TITLE, VITE_REPORT, VITE_PWA } = viteEnv;
  return [
    vue(),
    // vue 可以使用 jsx/tsx 语法
    vueJsx(),
    // esLint 报错信息显示在浏览器界面上
    eslintPlugin(),
    // name 可以写在 script 标签上
    vueSetupExtend({}),
    // 创建打包压缩配置
    createCompression(viteEnv),
    // 注入变量到 html 文件
    createHtmlPlugin({
      minify: true,
      viteNext: true,
      inject: {
        data: { title: VITE_GLOB_APP_TITLE }
      }
    }),
    // 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    // vitePWA
    VITE_PWA && createVitePwa(viteEnv),
    // 是否生成包预览，分析依赖包大小做优化处理
    VITE_REPORT && visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true })
  ];
};
var createCompression = (viteEnv) => {
  const { VITE_BUILD_COMPRESS = "none", VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(",");
  const plugins = [];
  if (compressList.includes("gzip")) {
    plugins.push(
      viteCompression({
        ext: ".gz",
        algorithm: "gzip",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  if (compressList.includes("brotli")) {
    plugins.push(
      viteCompression({
        ext: ".br",
        algorithm: "brotliCompress",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  return plugins;
};
var createVitePwa = (viteEnv) => {
  const { VITE_GLOB_APP_TITLE } = viteEnv;
  return VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: VITE_GLOB_APP_TITLE,
      short_name: VITE_GLOB_APP_TITLE,
      theme_color: "#ffffff",
      icons: [
        {
          src: "/logo.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    }
  });
};

// package.json
var package_default = {
  name: "geeker-admin",
  private: true,
  version: "1.2.0",
  type: "module",
  description: "geeker-admin open source management system",
  author: {
    name: "Geeker",
    email: "848130454@qq.com",
    url: "https://github.com/HalseySpicy"
  },
  license: "MIT",
  homepage: "https://github.com/HalseySpicy/Geeker-Admin",
  repository: {
    type: "git",
    url: "git@github.com:HalseySpicy/Geeker-Admin.git"
  },
  bugs: {
    url: "https://github.com/HalseySpicy/Geeker-Admin/issues"
  },
  scripts: {
    dev: "vite",
    serve: "vite",
    "build:dev": "vue-tsc && vite build --mode development",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production",
    "type:check": "vue-tsc --noEmit --skipLibCheck",
    preview: "npm run build:dev && vite preview",
    "lint:eslint": "eslint --fix --ext .js,.ts,.vue ./src",
    "lint:prettier": 'prettier --write "src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}"',
    "lint:stylelint": 'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" --cache --cache-location node_modules/.cache/stylelint/',
    "lint:lint-staged": "lint-staged",
    prepare: "husky install",
    release: "standard-version",
    commit: "git add -A && czg && git push"
  },
  dependencies: {
    "@element-plus/icons-vue": "^2.3.1",
    "@vueuse/core": "^10.7.1",
    "@wangeditor/editor": "^5.1.23",
    "@wangeditor/editor-for-vue": "^5.1.12",
    axios: "^1.6.3",
    dayjs: "^1.11.10",
    "driver.js": "^1.3.1",
    echarts: "^5.4.3",
    "echarts-liquidfill": "^3.1.0",
    "element-plus": "^2.4.4",
    md5: "^2.3.0",
    mitt: "^3.0.1",
    nprogress: "^0.2.0",
    pinia: "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.1",
    qs: "^6.11.2",
    screenfull: "^6.0.2",
    sortablejs: "^1.15.1",
    vue: "^3.4.3",
    "vue-i18n": "^9.8.0",
    "vue-router": "^4.2.5",
    vuedraggable: "^4.1.0"
  },
  devDependencies: {
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "@types/md5": "^2.3.5",
    "@types/nprogress": "^0.2.3",
    "@types/qs": "^6.9.11",
    "@types/sortablejs": "^1.15.7",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    "@vitejs/plugin-vue": "^5.0.2",
    "@vitejs/plugin-vue-jsx": "^3.1.0",
    autoprefixer: "^10.4.16",
    "cz-git": "^1.8.0",
    czg: "^1.8.0",
    eslint: "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.2",
    "eslint-plugin-vue": "^9.19.2",
    husky: "^8.0.3",
    "lint-staged": "^15.2.0",
    postcss: "^8.4.32",
    "postcss-html": "^1.5.0",
    prettier: "^3.1.1",
    "rollup-plugin-visualizer": "^5.12.0",
    sass: "^1.69.7",
    "standard-version": "^9.5.0",
    stylelint: "^16.1.0",
    "stylelint-config-html": "^1.1.0",
    "stylelint-config-recess-order": "^4.4.0",
    "stylelint-config-recommended-scss": "^14.0.0",
    "stylelint-config-recommended-vue": "^1.5.0",
    "stylelint-config-standard": "^36.0.0",
    "stylelint-config-standard-scss": "^12.0.0",
    typescript: "^5.3.3",
    "unplugin-vue-setup-extend-plus": "^1.0.0",
    vite: "^5.0.10",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-html": "^3.2.1",
    "vite-plugin-pwa": "^0.17.4",
    "vite-plugin-svg-icons": "^2.0.1",
    "vue-tsc": "^1.8.27"
  },
  engines: {
    node: ">=16.0.0"
  },
  browserslist: {
    production: [
      "> 1%",
      "not dead",
      "not op_mini all"
    ],
    development: [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  config: {
    commitizen: {
      path: "node_modules/cz-git"
    }
  }
};

// vite.config.ts
import dayjs from "file:///D:/vscode/Geeker-Admin/node_modules/.pnpm/registry.npmmirror.com+dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
var __vite_injected_original_dirname = "D:\\vscode\\Geeker-Admin";
var { dependencies, devDependencies, name, version } = package_default;
var __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};
var vite_config_default = defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": resolve2(__vite_injected_original_dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/var.scss";`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    plugins: createVitePlugins(viteEnv),
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    },
    build: {
      outDir: "dist",
      minify: "esbuild",
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      sourcemap: false,
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2e3,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvZ2V0RW52LnRzIiwgImJ1aWxkL3Byb3h5LnRzIiwgImJ1aWxkL3BsdWdpbnMudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcdnNjb2RlXFxcXEdlZWtlci1BZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcdnNjb2RlXFxcXEdlZWtlci1BZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovdnNjb2RlL0dlZWtlci1BZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgQ29uZmlnRW52LCBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgd3JhcHBlckVudiB9IGZyb20gXCIuL2J1aWxkL2dldEVudlwiO1xuaW1wb3J0IHsgY3JlYXRlUHJveHkgfSBmcm9tIFwiLi9idWlsZC9wcm94eVwiO1xuaW1wb3J0IHsgY3JlYXRlVml0ZVBsdWdpbnMgfSBmcm9tIFwiLi9idWlsZC9wbHVnaW5zXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiO1xuXG5jb25zdCB7IGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzLCBuYW1lLCB2ZXJzaW9uIH0gPSBwa2c7XG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XG4gIHBrZzogeyBkZXBlbmRlbmNpZXMsIGRldkRlcGVuZGVuY2llcywgbmFtZSwgdmVyc2lvbiB9LFxuICBsYXN0QnVpbGRUaW1lOiBkYXlqcygpLmZvcm1hdChcIllZWVktTU0tREQgSEg6bW06c3NcIilcbn07XG5cbi8vIEBzZWU6IGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdCk7XG4gIGNvbnN0IHZpdGVFbnYgPSB3cmFwcGVyRW52KGVudik7XG5cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiB2aXRlRW52LlZJVEVfUFVCTElDX1BBVEgsXG4gICAgcm9vdCxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgIFwidnVlLWkxOG5cIjogXCJ2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qc1wiXG4gICAgICB9XG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fQVBQX0lORk9fXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfSU5GT19fKVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3N0eWxlcy92YXIuc2Nzc1wiO2BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICAgIHBvcnQ6IHZpdGVFbnYuVklURV9QT1JULFxuICAgICAgb3Blbjogdml0ZUVudi5WSVRFX09QRU4sXG4gICAgICBjb3JzOiB0cnVlLFxuICAgICAgLy8gTG9hZCBwcm94eSBjb25maWd1cmF0aW9uIGZyb20gLmVudi5kZXZlbG9wbWVudFxuICAgICAgcHJveHk6IGNyZWF0ZVByb3h5KHZpdGVFbnYuVklURV9QUk9YWSlcbiAgICB9LFxuICAgIHBsdWdpbnM6IGNyZWF0ZVZpdGVQbHVnaW5zKHZpdGVFbnYpLFxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIHB1cmU6IHZpdGVFbnYuVklURV9EUk9QX0NPTlNPTEUgPyBbXCJjb25zb2xlLmxvZ1wiLCBcImRlYnVnZ2VyXCJdIDogW11cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgICAgbWluaWZ5OiBcImVzYnVpbGRcIixcbiAgICAgIC8vIGVzYnVpbGQgXHU2MjUzXHU1MzA1XHU2NkY0XHU1RkVCXHVGRjBDXHU0RjQ2XHU2NjJGXHU0RTBEXHU4MEZEXHU1M0JCXHU5NjY0IGNvbnNvbGUubG9nXHVGRjBDdGVyc2VyXHU2MjUzXHU1MzA1XHU2MTYyXHVGRjBDXHU0RjQ2XHU4MEZEXHU1M0JCXHU5NjY0IGNvbnNvbGUubG9nXG4gICAgICAvLyBtaW5pZnk6IFwidGVyc2VyXCIsXG4gICAgICAvLyB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAvLyBcdGNvbXByZXNzOiB7XG4gICAgICAvLyBcdFx0ZHJvcF9jb25zb2xlOiB2aXRlRW52LlZJVEVfRFJPUF9DT05TT0xFLFxuICAgICAgLy8gXHRcdGRyb3BfZGVidWdnZXI6IHRydWVcbiAgICAgIC8vIFx0fVxuICAgICAgLy8gfSxcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgICAvLyBcdTc5ODFcdTc1MjggZ3ppcCBcdTUzOEJcdTdGMjlcdTU5MjdcdTVDMEZcdTYyQTVcdTU0NEFcdUZGMENcdTUzRUZcdTc1NjVcdTVGQUVcdTUxQ0ZcdTVDMTFcdTYyNTNcdTUzMDVcdTY1RjZcdTk1RjRcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcbiAgICAgIC8vIFx1ODlDNFx1NUI5QVx1ODlFNlx1NTNEMVx1OEI2Nlx1NTQ0QVx1NzY4NCBjaHVuayBcdTU5MjdcdTVDMEZcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgLy8gU3RhdGljIHJlc291cmNlIGNsYXNzaWZpY2F0aW9uIGFuZCBwYWNrYWdpbmdcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiYXNzZXRzL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF1cIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHZzY29kZVxcXFxHZWVrZXItQWRtaW5cXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHZzY29kZVxcXFxHZWVrZXItQWRtaW5cXFxcYnVpbGRcXFxcZ2V0RW52LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi92c2NvZGUvR2Vla2VyLUFkbWluL2J1aWxkL2dldEVudi50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RldkZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9kRm4obW9kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBtb2RlID09PSBcInByb2R1Y3Rpb25cIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVzdEZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbW9kZSA9PT0gXCJ0ZXN0XCI7XG59XG5cbi8qKlxuICogV2hldGhlciB0byBnZW5lcmF0ZSBwYWNrYWdlIHByZXZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwb3J0TW9kZSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LlZJVEVfUkVQT1JUID09PSBcInRydWVcIjtcbn1cblxuLy8gUmVhZCBhbGwgZW52aXJvbm1lbnQgdmFyaWFibGUgY29uZmlndXJhdGlvbiBmaWxlcyB0byBwcm9jZXNzLmVudlxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBwZXJFbnYoZW52Q29uZjogUmVjb3JkYWJsZSk6IFZpdGVFbnYge1xuICBjb25zdCByZXQ6IGFueSA9IHt9O1xuXG4gIGZvciAoY29uc3QgZW52TmFtZSBvZiBPYmplY3Qua2V5cyhlbnZDb25mKSkge1xuICAgIGxldCByZWFsTmFtZSA9IGVudkNvbmZbZW52TmFtZV0ucmVwbGFjZSgvXFxcXG4vZywgXCJcXG5cIik7XG4gICAgcmVhbE5hbWUgPSByZWFsTmFtZSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogcmVhbE5hbWUgPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogcmVhbE5hbWU7XG4gICAgaWYgKGVudk5hbWUgPT09IFwiVklURV9QT1JUXCIpIHJlYWxOYW1lID0gTnVtYmVyKHJlYWxOYW1lKTtcbiAgICBpZiAoZW52TmFtZSA9PT0gXCJWSVRFX1BST1hZXCIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlYWxOYW1lID0gSlNPTi5wYXJzZShyZWFsTmFtZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICB9XG4gICAgcmV0W2Vudk5hbWVdID0gcmVhbE5hbWU7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBHZXQgdXNlciByb290IGRpcmVjdG9yeVxuICogQHBhcmFtIGRpciBmaWxlIHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RQYXRoKC4uLmRpcjogc3RyaW5nW10pIHtcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAuLi5kaXIpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx2c2NvZGVcXFxcR2Vla2VyLUFkbWluXFxcXGJ1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx2c2NvZGVcXFxcR2Vla2VyLUFkbWluXFxcXGJ1aWxkXFxcXHByb3h5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi92c2NvZGUvR2Vla2VyLUFkbWluL2J1aWxkL3Byb3h5LnRzXCI7aW1wb3J0IHR5cGUgeyBQcm94eU9wdGlvbnMgfSBmcm9tIFwidml0ZVwiO1xuXG50eXBlIFByb3h5SXRlbSA9IFtzdHJpbmcsIHN0cmluZ107XG5cbnR5cGUgUHJveHlMaXN0ID0gUHJveHlJdGVtW107XG5cbnR5cGUgUHJveHlUYXJnZXRMaXN0ID0gUmVjb3JkPHN0cmluZywgUHJveHlPcHRpb25zPjtcblxuLyoqXG4gKiBcdTUyMUJcdTVFRkFcdTRFRTNcdTc0MDZcdUZGMENcdTc1MjhcdTRFOEVcdTg5RTNcdTY3OTAgLmVudi5kZXZlbG9wbWVudCBcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcbiAqIEBwYXJhbSBsaXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm94eShsaXN0OiBQcm94eUxpc3QgPSBbXSkge1xuICBjb25zdCByZXQ6IFByb3h5VGFyZ2V0TGlzdCA9IHt9O1xuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgbGlzdCkge1xuICAgIGNvbnN0IGh0dHBzUkUgPSAvXmh0dHBzOlxcL1xcLy87XG4gICAgY29uc3QgaXNIdHRwcyA9IGh0dHBzUkUudGVzdCh0YXJnZXQpO1xuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2h0dHAtcGFydHkvbm9kZS1odHRwLXByb3h5I29wdGlvbnNcbiAgICByZXRbcHJlZml4XSA9IHtcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgd3M6IHRydWUsXG4gICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtwcmVmaXh9YCksIFwiXCIpLFxuICAgICAgLy8gaHR0cHMgaXMgcmVxdWlyZSBzZWN1cmU9ZmFsc2VcbiAgICAgIC4uLihpc0h0dHBzID8geyBzZWN1cmU6IGZhbHNlIH0gOiB7fSlcbiAgICB9O1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHZzY29kZVxcXFxHZWVrZXItQWRtaW5cXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHZzY29kZVxcXFxHZWVrZXItQWRtaW5cXFxcYnVpbGRcXFxccGx1Z2lucy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovdnNjb2RlL0dlZWtlci1BZG1pbi9idWlsZC9wbHVnaW5zLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgZXNsaW50UGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI7XG5pbXBvcnQgdnVlU2V0dXBFeHRlbmQgZnJvbSBcInVucGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQtcGx1cy92aXRlXCI7XG5cbi8qKlxuICogXHU1MjFCXHU1RUZBIHZpdGUgXHU2M0QyXHU0RUY2XG4gKiBAcGFyYW0gdml0ZUVudlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlVml0ZVBsdWdpbnMgPSAodml0ZUVudjogVml0ZUVudik6IChQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSlbXSA9PiB7XG4gIGNvbnN0IHsgVklURV9HTE9CX0FQUF9USVRMRSwgVklURV9SRVBPUlQsIFZJVEVfUFdBIH0gPSB2aXRlRW52O1xuICByZXR1cm4gW1xuICAgIHZ1ZSgpLFxuICAgIC8vIHZ1ZSBcdTUzRUZcdTRFRTVcdTRGN0ZcdTc1MjgganN4L3RzeCBcdThCRURcdTZDRDVcbiAgICB2dWVKc3goKSxcbiAgICAvLyBlc0xpbnQgXHU2MkE1XHU5NTE5XHU0RkUxXHU2MDZGXHU2NjNFXHU3OTNBXHU1NzI4XHU2RDRGXHU4OUM4XHU1NjY4XHU3NTRDXHU5NzYyXHU0RTBBXG4gICAgZXNsaW50UGx1Z2luKCksXG4gICAgLy8gbmFtZSBcdTUzRUZcdTRFRTVcdTUxOTlcdTU3Mjggc2NyaXB0IFx1NjgwN1x1N0I3RVx1NEUwQVxuICAgIHZ1ZVNldHVwRXh0ZW5kKHt9KSxcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTYyNTNcdTUzMDVcdTUzOEJcdTdGMjlcdTkxNERcdTdGNkVcbiAgICBjcmVhdGVDb21wcmVzc2lvbih2aXRlRW52KSxcbiAgICAvLyBcdTZDRThcdTUxNjVcdTUzRDhcdTkxQ0ZcdTUyMzAgaHRtbCBcdTY1ODdcdTRFRjZcbiAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgIHZpdGVOZXh0OiB0cnVlLFxuICAgICAgaW5qZWN0OiB7XG4gICAgICAgIGRhdGE6IHsgdGl0bGU6IFZJVEVfR0xPQl9BUFBfVElUTEUgfVxuICAgICAgfVxuICAgIH0pLFxuICAgIC8vIFx1NEY3Rlx1NzUyOCBzdmcgXHU1NkZFXHU2ODA3XG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgaWNvbkRpcnM6IFtyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwic3JjL2Fzc2V0cy9pY29uc1wiKV0sXG4gICAgICBzeW1ib2xJZDogXCJpY29uLVtkaXJdLVtuYW1lXVwiXG4gICAgfSksXG4gICAgLy8gdml0ZVBXQVxuICAgIFZJVEVfUFdBICYmIGNyZWF0ZVZpdGVQd2Eodml0ZUVudiksXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU3NTFGXHU2MjEwXHU1MzA1XHU5ODg0XHU4OUM4XHVGRjBDXHU1MjA2XHU2NzkwXHU0RjlEXHU4RDU2XHU1MzA1XHU1OTI3XHU1QzBGXHU1MDVBXHU0RjE4XHU1MzE2XHU1OTA0XHU3NDA2XG4gICAgVklURV9SRVBPUlQgJiYgKHZpc3VhbGl6ZXIoeyBmaWxlbmFtZTogXCJzdGF0cy5odG1sXCIsIGd6aXBTaXplOiB0cnVlLCBicm90bGlTaXplOiB0cnVlIH0pIGFzIFBsdWdpbk9wdGlvbilcbiAgXTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFx1NjgzOVx1NjM2RSBjb21wcmVzcyBcdTkxNERcdTdGNkVcdUZGMENcdTc1MUZcdTYyMTBcdTRFMERcdTU0MENcdTc2ODRcdTUzOEJcdTdGMjlcdTg5QzRcdTUyMTlcbiAqIEBwYXJhbSB2aXRlRW52XG4gKi9cbmNvbnN0IGNyZWF0ZUNvbXByZXNzaW9uID0gKHZpdGVFbnY6IFZpdGVFbnYpOiBQbHVnaW5PcHRpb24gfCBQbHVnaW5PcHRpb25bXSA9PiB7XG4gIGNvbnN0IHsgVklURV9CVUlMRF9DT01QUkVTUyA9IFwibm9uZVwiLCBWSVRFX0JVSUxEX0NPTVBSRVNTX0RFTEVURV9PUklHSU5fRklMRSB9ID0gdml0ZUVudjtcbiAgY29uc3QgY29tcHJlc3NMaXN0ID0gVklURV9CVUlMRF9DT01QUkVTUy5zcGxpdChcIixcIik7XG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW107XG4gIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoXCJnemlwXCIpKSB7XG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgICAgZXh0OiBcIi5nelwiLFxuICAgICAgICBhbGdvcml0aG06IFwiZ3ppcFwiLFxuICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBWSVRFX0JVSUxEX0NPTVBSRVNTX0RFTEVURV9PUklHSU5fRklMRVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoXCJicm90bGlcIikpIHtcbiAgICBwbHVnaW5zLnB1c2goXG4gICAgICB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgICBleHQ6IFwiLmJyXCIsXG4gICAgICAgIGFsZ29yaXRobTogXCJicm90bGlDb21wcmVzc1wiLFxuICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBWSVRFX0JVSUxEX0NPTVBSRVNTX0RFTEVURV9PUklHSU5fRklMRVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIHJldHVybiBwbHVnaW5zO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gVml0ZVB3YVxuICogQHBhcmFtIHZpdGVFbnZcbiAqL1xuY29uc3QgY3JlYXRlVml0ZVB3YSA9ICh2aXRlRW52OiBWaXRlRW52KTogUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10gPT4ge1xuICBjb25zdCB7IFZJVEVfR0xPQl9BUFBfVElUTEUgfSA9IHZpdGVFbnY7XG4gIHJldHVybiBWaXRlUFdBKHtcbiAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgIG1hbmlmZXN0OiB7XG4gICAgICBuYW1lOiBWSVRFX0dMT0JfQVBQX1RJVExFLFxuICAgICAgc2hvcnRfbmFtZTogVklURV9HTE9CX0FQUF9USVRMRSxcbiAgICAgIHRoZW1lX2NvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgIGljb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6IFwiL2xvZ28ucG5nXCIsXG4gICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogXCIvbG9nby5wbmdcIixcbiAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBcIi9sb2dvLnBuZ1wiLFxuICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIHB1cnBvc2U6IFwiYW55IG1hc2thYmxlXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG59O1xuIiwgIntcbiAgXCJuYW1lXCI6IFwiZ2Vla2VyLWFkbWluXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInZlcnNpb25cIjogXCIxLjIuMFwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcImdlZWtlci1hZG1pbiBvcGVuIHNvdXJjZSBtYW5hZ2VtZW50IHN5c3RlbVwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiR2Vla2VyXCIsXG4gICAgXCJlbWFpbFwiOiBcIjg0ODEzMDQ1NEBxcS5jb21cIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9IYWxzZXlTcGljeVwiXG4gIH0sXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL0hhbHNleVNwaWN5L0dlZWtlci1BZG1pblwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0QGdpdGh1Yi5jb206SGFsc2V5U3BpY3kvR2Vla2VyLUFkbWluLmdpdFwiXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vSGFsc2V5U3BpY3kvR2Vla2VyLUFkbWluL2lzc3Vlc1wiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgXCJzZXJ2ZVwiOiBcInZpdGVcIixcbiAgICBcImJ1aWxkOmRldlwiOiBcInZ1ZS10c2MgJiYgdml0ZSBidWlsZCAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcbiAgICBcImJ1aWxkOnRlc3RcIjogXCJ2dWUtdHNjICYmIHZpdGUgYnVpbGQgLS1tb2RlIHRlc3RcIixcbiAgICBcImJ1aWxkOnByb1wiOiBcInZ1ZS10c2MgJiYgdml0ZSBidWlsZCAtLW1vZGUgcHJvZHVjdGlvblwiLFxuICAgIFwidHlwZTpjaGVja1wiOiBcInZ1ZS10c2MgLS1ub0VtaXQgLS1za2lwTGliQ2hlY2tcIixcbiAgICBcInByZXZpZXdcIjogXCJucG0gcnVuIGJ1aWxkOmRldiAmJiB2aXRlIHByZXZpZXdcIixcbiAgICBcImxpbnQ6ZXNsaW50XCI6IFwiZXNsaW50IC0tZml4IC0tZXh0IC5qcywudHMsLnZ1ZSAuL3NyY1wiLFxuICAgIFwibGludDpwcmV0dGllclwiOiBcInByZXR0aWVyIC0td3JpdGUgXFxcInNyYy8qKi8qLntqcyx0cyxqc29uLHRzeCxjc3MsbGVzcyxzY3NzLHZ1ZSxodG1sLG1kfVxcXCJcIixcbiAgICBcImxpbnQ6c3R5bGVsaW50XCI6IFwic3R5bGVsaW50IC0tY2FjaGUgLS1maXggXFxcIioqLyoue3Z1ZSxsZXNzLHBvc3Rjc3MsY3NzLHNjc3N9XFxcIiAtLWNhY2hlIC0tY2FjaGUtbG9jYXRpb24gbm9kZV9tb2R1bGVzLy5jYWNoZS9zdHlsZWxpbnQvXCIsXG4gICAgXCJsaW50OmxpbnQtc3RhZ2VkXCI6IFwibGludC1zdGFnZWRcIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreSBpbnN0YWxsXCIsXG4gICAgXCJyZWxlYXNlXCI6IFwic3RhbmRhcmQtdmVyc2lvblwiLFxuICAgIFwiY29tbWl0XCI6IFwiZ2l0IGFkZCAtQSAmJiBjemcgJiYgZ2l0IHB1c2hcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjMuMVwiLFxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjcuMVwiLFxuICAgIFwiQHdhbmdlZGl0b3IvZWRpdG9yXCI6IFwiXjUuMS4yM1wiLFxuICAgIFwiQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWVcIjogXCJeNS4xLjEyXCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjYuM1wiLFxuICAgIFwiZGF5anNcIjogXCJeMS4xMS4xMFwiLFxuICAgIFwiZHJpdmVyLmpzXCI6IFwiXjEuMy4xXCIsXG4gICAgXCJlY2hhcnRzXCI6IFwiXjUuNC4zXCIsXG4gICAgXCJlY2hhcnRzLWxpcXVpZGZpbGxcIjogXCJeMy4xLjBcIixcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjQuNFwiLFxuICAgIFwibWQ1XCI6IFwiXjIuMy4wXCIsXG4gICAgXCJtaXR0XCI6IFwiXjMuMC4xXCIsXG4gICAgXCJucHJvZ3Jlc3NcIjogXCJeMC4yLjBcIixcbiAgICBcInBpbmlhXCI6IFwiXjIuMS43XCIsXG4gICAgXCJwaW5pYS1wbHVnaW4tcGVyc2lzdGVkc3RhdGVcIjogXCJeMy4yLjFcIixcbiAgICBcInFzXCI6IFwiXjYuMTEuMlwiLFxuICAgIFwic2NyZWVuZnVsbFwiOiBcIl42LjAuMlwiLFxuICAgIFwic29ydGFibGVqc1wiOiBcIl4xLjE1LjFcIixcbiAgICBcInZ1ZVwiOiBcIl4zLjQuM1wiLFxuICAgIFwidnVlLWkxOG5cIjogXCJeOS44LjBcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC4yLjVcIixcbiAgICBcInZ1ZWRyYWdnYWJsZVwiOiBcIl40LjEuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjb21taXRsaW50L2NsaVwiOiBcIl4xOC40LjNcIixcbiAgICBcIkBjb21taXRsaW50L2NvbmZpZy1jb252ZW50aW9uYWxcIjogXCJeMTguNC4zXCIsXG4gICAgXCJAdHlwZXMvbWQ1XCI6IFwiXjIuMy41XCIsXG4gICAgXCJAdHlwZXMvbnByb2dyZXNzXCI6IFwiXjAuMi4zXCIsXG4gICAgXCJAdHlwZXMvcXNcIjogXCJeNi45LjExXCIsXG4gICAgXCJAdHlwZXMvc29ydGFibGVqc1wiOiBcIl4xLjE1LjdcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjYuMTcuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl42LjE3LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcIl41LjAuMlwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiOiBcIl4zLjEuMFwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTZcIixcbiAgICBcImN6LWdpdFwiOiBcIl4xLjguMFwiLFxuICAgIFwiY3pnXCI6IFwiXjEuOC4wXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ni4wXCIsXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMS4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjUuMS4yXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjE5LjJcIixcbiAgICBcImh1c2t5XCI6IFwiXjguMC4zXCIsXG4gICAgXCJsaW50LXN0YWdlZFwiOiBcIl4xNS4yLjBcIixcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjMyXCIsXG4gICAgXCJwb3N0Y3NzLWh0bWxcIjogXCJeMS41LjBcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMS4xXCIsXG4gICAgXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjogXCJeNS4xMi4wXCIsXG4gICAgXCJzYXNzXCI6IFwiXjEuNjkuN1wiLFxuICAgIFwic3RhbmRhcmQtdmVyc2lvblwiOiBcIl45LjUuMFwiLFxuICAgIFwic3R5bGVsaW50XCI6IFwiXjE2LjEuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1odG1sXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY2Vzcy1vcmRlclwiOiBcIl40LjQuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC1zY3NzXCI6IFwiXjE0LjAuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC12dWVcIjogXCJeMS41LjBcIixcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmRcIjogXCJeMzYuMC4wXCIsXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXN0YW5kYXJkLXNjc3NcIjogXCJeMTIuMC4wXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMy4zXCIsXG4gICAgXCJ1bnBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kLXBsdXNcIjogXCJeMS4wLjBcIixcbiAgICBcInZpdGVcIjogXCJeNS4wLjEwXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiOiBcIl4wLjUuMVwiLFxuICAgIFwidml0ZS1wbHVnaW4tZXNsaW50XCI6IFwiXjEuOC4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1odG1sXCI6IFwiXjMuMi4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1wd2FcIjogXCJeMC4xNy40XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjogXCJeMi4wLjFcIixcbiAgICBcInZ1ZS10c2NcIjogXCJeMS44LjI3XCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTE2LjAuMFwiXG4gIH0sXG4gIFwiYnJvd3NlcnNsaXN0XCI6IHtcbiAgICBcInByb2R1Y3Rpb25cIjogW1xuICAgICAgXCI+IDElXCIsXG4gICAgICBcIm5vdCBkZWFkXCIsXG4gICAgICBcIm5vdCBvcF9taW5pIGFsbFwiXG4gICAgXSxcbiAgICBcImRldmVsb3BtZW50XCI6IFtcbiAgICAgIFwibGFzdCAxIGNocm9tZSB2ZXJzaW9uXCIsXG4gICAgICBcImxhc3QgMSBmaXJlZm94IHZlcnNpb25cIixcbiAgICAgIFwibGFzdCAxIHNhZmFyaSB2ZXJzaW9uXCJcbiAgICBdXG4gIH0sXG4gIFwiY29uZmlnXCI6IHtcbiAgICBcImNvbW1pdGl6ZW5cIjoge1xuICAgICAgXCJwYXRoXCI6IFwibm9kZV9tb2R1bGVzL2N6LWdpdFwiXG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBQLFNBQVMsY0FBYyxlQUFzQztBQUN2VCxTQUFTLFdBQUFBLGdCQUFlOzs7QUNxQmpCLFNBQVMsV0FBVyxTQUE4QjtBQUN2RCxRQUFNLE1BQVcsQ0FBQztBQUVsQixhQUFXLFdBQVcsT0FBTyxLQUFLLE9BQU8sR0FBRztBQUMxQyxRQUFJLFdBQVcsUUFBUSxPQUFPLEVBQUUsUUFBUSxRQUFRLElBQUk7QUFDcEQsZUFBVyxhQUFhLFNBQVMsT0FBTyxhQUFhLFVBQVUsUUFBUTtBQUN2RSxRQUFJLFlBQVk7QUFBYSxpQkFBVyxPQUFPLFFBQVE7QUFDdkQsUUFBSSxZQUFZLGNBQWM7QUFDNUIsVUFBSTtBQUNGLG1CQUFXLEtBQUssTUFBTSxRQUFRO0FBQUEsTUFDaEMsU0FBUyxPQUFPO0FBQUEsTUFBQztBQUFBLElBQ25CO0FBQ0EsUUFBSSxPQUFPLElBQUk7QUFBQSxFQUNqQjtBQUNBLFNBQU87QUFDVDs7O0FDekJPLFNBQVMsWUFBWSxPQUFrQixDQUFDLEdBQUc7QUFDaEQsUUFBTSxNQUF1QixDQUFDO0FBQzlCLGFBQVcsQ0FBQyxRQUFRLE1BQU0sS0FBSyxNQUFNO0FBQ25DLFVBQU0sVUFBVTtBQUNoQixVQUFNLFVB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WUFBYztBQUFBLE1BQ1osTUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQ0Y7OztBSnJIQSxPQUFPLFdBQVc7QUFObEIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTSxFQUFFLGNBQWMsaUJBQWlCLE1BQU0sUUFBUSxJQUFJO0FBQ3pELElBQU0sZUFBZTtBQUFBLEVBQ25CLEtBQUssRUFBRSxjQUFjLGlCQUFpQixNQUFNLFFBQVE7QUFBQSxFQUNwRCxlQUFlLE1BQU0sRUFBRSxPQUFPLHFCQUFxQjtBQUNyRDtBQUdBLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUE2QjtBQUMvRCxRQUFNLE9BQU8sUUFBUSxJQUFJO0FBQ3pCLFFBQU0sTUFBTSxRQUFRLE1BQU0sSUFBSTtBQUM5QixRQUFNLFVBQVUsV0FBVyxHQUFHO0FBRTlCLFNBQU87QUFBQSxJQUNMLE1BQU0sUUFBUTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUtDLFNBQVEsa0NBQVcsT0FBTztBQUFBLFFBQy9CLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sY0FBYyxLQUFLLFVBQVUsWUFBWTtBQUFBLElBQzNDO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNLFFBQVE7QUFBQSxNQUNkLE1BQU0sUUFBUTtBQUFBLE1BQ2QsTUFBTTtBQUFBO0FBQUEsTUFFTixPQUFPLFlBQVksUUFBUSxVQUFVO0FBQUEsSUFDdkM7QUFBQSxJQUNBLFNBQVMsa0JBQWtCLE9BQU87QUFBQSxJQUNsQyxTQUFTO0FBQUEsTUFDUCxNQUFNLFFBQVEsb0JBQW9CLENBQUMsZUFBZSxVQUFVLElBQUksQ0FBQztBQUFBLElBQ25FO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BU1IsV0FBVztBQUFBO0FBQUEsTUFFWCxzQkFBc0I7QUFBQTtBQUFBLE1BRXRCLHVCQUF1QjtBQUFBLE1BQ3ZCLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQTtBQUFBLFVBRU4sZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJyZXNvbHZlIiwgInJlc29sdmUiXQp9Cg==
