// vite.config.mts
import dotenv from "file:///home/anhdo/projects/openblocks/client/node_modules/dotenv/lib/main.js";
import { defineConfig } from "file:///home/anhdo/projects/openblocks/client/node_modules/vite/dist/node/index.js";
import react from "file:///home/anhdo/projects/openblocks/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///home/anhdo/projects/openblocks/client/node_modules/vite-tsconfig-paths/dist/index.mjs";
import svgrPlugin from "file:///home/anhdo/projects/openblocks/client/node_modules/vite-plugin-svgr/dist/index.mjs";
import checker from "file:///home/anhdo/projects/openblocks/client/node_modules/vite-plugin-checker/dist/esm/main.js";
import { visualizer } from "file:///home/anhdo/projects/openblocks/client/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import path from "path";
import chalk from "file:///home/anhdo/projects/openblocks/client/node_modules/chalk/source/index.js";
import { createHtmlPlugin } from "file:///home/anhdo/projects/openblocks/client/node_modules/vite-plugin-html/dist/index.mjs";
import { ensureLastSlash } from "file:///home/anhdo/projects/openblocks/client/packages/openblocks-dev-utils/util.js";
import { buildVars } from "file:///home/anhdo/projects/openblocks/client/packages/openblocks-dev-utils/buildVars.js";
import { globalDepPlugin } from "file:///home/anhdo/projects/openblocks/client/packages/openblocks-dev-utils/globalDepPlguin.js";
var __vite_injected_original_dirname = "/home/anhdo/projects/openblocks/client/packages/openblocks";
dotenv.config();
var apiProxyTarget = process.env.API_PROXY_TARGET;
var nodeServiceApiProxyTarget = process.env.NODE_SERVICE_API_PROXY_TARGET;
var nodeEnv = process.env.NODE_ENV ?? "development";
var edition = process.env.REACT_APP_EDITION;
var isEE = edition === "enterprise";
var isDev = nodeEnv === "development";
var isVisualizerEnabled = !!process.env.ENABLE_VISUALIZER;
var browserCheckFileName = `browser-check-${process.env.REACT_APP_COMMIT_ID}.js`;
var base = ensureLastSlash(process.env.PUBLIC_URL);
if (!apiProxyTarget && isDev) {
  console.log();
  console.log(chalk.red`API_PROXY_TARGET is required.\n`);
  console.log(chalk.cyan`Start with command: API_PROXY_TARGET=\{backend-api-addr\} yarn start`);
  console.log();
  process.exit(1);
}
var proxyConfig = {
  "/api": {
    target: apiProxyTarget,
    changeOrigin: false
  }
};
if (nodeServiceApiProxyTarget) {
  proxyConfig["/node-service"] = {
    target: nodeServiceApiProxyTarget
  };
}
var define = {};
buildVars.forEach(({ name, defaultValue }) => {
  define[name] = JSON.stringify(process.env[name] || defaultValue);
});
var viteConfig = {
  define,
  assetsInclude: ["**/*.md"],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      "@openblocks-ee": path.resolve(
        __vite_injected_original_dirname,
        isEE ? "../openblocks/src/ee" : "../openblocks/src"
      )
    }
  },
  base,
  build: {
    manifest: true,
    target: "es2015",
    cssTarget: "chrome63",
    outDir: "build",
    assetsDir: "static",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        chunkFileNames: "[hash].js"
      }
    },
    commonjsOptions: {
      defaultIsModuleExports: (id) => {
        if (id.indexOf("antd/lib") !== -1) {
          return false;
        }
        return "auto";
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#3377FF",
          "@link-color": "#3377FF",
          "@border-color-base": "#D7D9E0",
          "@border-radius-base": "4px"
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    open: true,
    cors: true,
    port: 8e3,
    host: "0.0.0.0",
    proxy: proxyConfig
  },
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint --quiet "./src/**/*.{ts,tsx}"',
        dev: {
          logLevel: ["error"]
        }
      }
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"]
        }
      }
    }),
    viteTsconfigPaths({
      projects: ["../openblocks/tsconfig.json", "../openblocks-design/tsconfig.json"]
    }),
    svgrPlugin({
      svgrOptions: {
        exportType: "named",
        prettier: false,
        svgo: false,
        titleProp: true,
        ref: true
      }
    }),
    globalDepPlugin(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          browserCheckScript: isDev ? "" : `<script src="${base}${browserCheckFileName}"><\/script>`
        }
      }
    }),
    isVisualizerEnabled && visualizer()
  ].filter(Boolean)
};
var browserCheckConfig = {
  ...viteConfig,
  define: {
    ...viteConfig.define,
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    ...viteConfig.build,
    manifest: false,
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      formats: ["iife"],
      name: "BrowserCheck",
      entry: "./src/browser-check.ts",
      fileName: () => {
        return browserCheckFileName;
      }
    }
  }
};
var buildTargets = {
  main: viteConfig,
  browserCheck: browserCheckConfig
};
var buildTarget = buildTargets[process.env.BUILD_TARGET || "main"];
var vite_config_default = defineConfig(buildTarget || viteConfig);
export {
  vite_config_default as default,
  viteConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYW5oZG8vcHJvamVjdHMvb3BlbmJsb2Nrcy9jbGllbnQvcGFja2FnZXMvb3BlbmJsb2Nrc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYW5oZG8vcHJvamVjdHMvb3BlbmJsb2Nrcy9jbGllbnQvcGFja2FnZXMvb3BlbmJsb2Nrcy92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYW5oZG8vcHJvamVjdHMvb3BlbmJsb2Nrcy9jbGllbnQvcGFja2FnZXMvb3BlbmJsb2Nrcy92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgU2VydmVyT3B0aW9ucywgVXNlckNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdml0ZVRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBzdmdyUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XG5pbXBvcnQgY2hlY2tlciBmcm9tIFwidml0ZS1wbHVnaW4tY2hlY2tlclwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWh0bWxcIjtcbmltcG9ydCB7IGVuc3VyZUxhc3RTbGFzaCB9IGZyb20gXCJvcGVuYmxvY2tzLWRldi11dGlscy91dGlsXCI7XG5pbXBvcnQgeyBidWlsZFZhcnMgfSBmcm9tIFwib3BlbmJsb2Nrcy1kZXYtdXRpbHMvYnVpbGRWYXJzXCI7XG5pbXBvcnQgeyBnbG9iYWxEZXBQbHVnaW4gfSBmcm9tIFwib3BlbmJsb2Nrcy1kZXYtdXRpbHMvZ2xvYmFsRGVwUGxndWluXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3QgYXBpUHJveHlUYXJnZXQgPSBwcm9jZXNzLmVudi5BUElfUFJPWFlfVEFSR0VUO1xuY29uc3Qgbm9kZVNlcnZpY2VBcGlQcm94eVRhcmdldCA9IHByb2Nlc3MuZW52Lk5PREVfU0VSVklDRV9BUElfUFJPWFlfVEFSR0VUO1xuY29uc3Qgbm9kZUVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID8/IFwiZGV2ZWxvcG1lbnRcIjtcbmNvbnN0IGVkaXRpb24gPSBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRURJVElPTjtcbmNvbnN0IGlzRUUgPSBlZGl0aW9uID09PSBcImVudGVycHJpc2VcIjtcbmNvbnN0IGlzRGV2ID0gbm9kZUVudiA9PT0gXCJkZXZlbG9wbWVudFwiO1xuY29uc3QgaXNWaXN1YWxpemVyRW5hYmxlZCA9ICEhcHJvY2Vzcy5lbnYuRU5BQkxFX1ZJU1VBTElaRVI7XG5jb25zdCBicm93c2VyQ2hlY2tGaWxlTmFtZSA9IGBicm93c2VyLWNoZWNrLSR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0NPTU1JVF9JRH0uanNgO1xuY29uc3QgYmFzZSA9IGVuc3VyZUxhc3RTbGFzaChwcm9jZXNzLmVudi5QVUJMSUNfVVJMKTtcblxuaWYgKCFhcGlQcm94eVRhcmdldCAmJiBpc0Rldikge1xuICBjb25zb2xlLmxvZygpO1xuICBjb25zb2xlLmxvZyhjaGFsay5yZWRgQVBJX1BST1hZX1RBUkdFVCBpcyByZXF1aXJlZC5cXG5gKTtcbiAgY29uc29sZS5sb2coY2hhbGsuY3lhbmBTdGFydCB3aXRoIGNvbW1hbmQ6IEFQSV9QUk9YWV9UQVJHRVQ9XFx7YmFja2VuZC1hcGktYWRkclxcfSB5YXJuIHN0YXJ0YCk7XG4gIGNvbnNvbGUubG9nKCk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn1cblxuY29uc3QgcHJveHlDb25maWc6IFNlcnZlck9wdGlvbnNbXCJwcm94eVwiXSA9IHtcbiAgXCIvYXBpXCI6IHtcbiAgICB0YXJnZXQ6IGFwaVByb3h5VGFyZ2V0LFxuICAgIGNoYW5nZU9yaWdpbjogZmFsc2UsXG4gIH0sXG59O1xuXG5pZiAobm9kZVNlcnZpY2VBcGlQcm94eVRhcmdldCkge1xuICBwcm94eUNvbmZpZ1tcIi9ub2RlLXNlcnZpY2VcIl0gPSB7XG4gICAgdGFyZ2V0OiBub2RlU2VydmljZUFwaVByb3h5VGFyZ2V0LFxuICB9O1xufVxuXG5jb25zdCBkZWZpbmUgPSB7fTtcbmJ1aWxkVmFycy5mb3JFYWNoKCh7IG5hbWUsIGRlZmF1bHRWYWx1ZSB9KSA9PiB7XG4gIGRlZmluZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52W25hbWVdIHx8IGRlZmF1bHRWYWx1ZSk7XG59KTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBjb25zdCB2aXRlQ29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICBkZWZpbmUsXG4gIGFzc2V0c0luY2x1ZGU6IFtcIioqLyoubWRcIl0sXG4gIHJlc29sdmU6IHtcbiAgICBleHRlbnNpb25zOiBbXCIubWpzXCIsIFwiLmpzXCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi50c3hcIiwgXCIuanNvblwiXSxcbiAgICBhbGlhczoge1xuICAgICAgXCJAb3BlbmJsb2Nrcy1lZVwiOiBwYXRoLnJlc29sdmUoXG4gICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgaXNFRSA/IFwiLi4vb3BlbmJsb2Nrcy9zcmMvZWVcIiA6IFwiLi4vb3BlbmJsb2Nrcy9zcmNcIlxuICAgICAgKSxcbiAgICB9LFxuICB9LFxuICBiYXNlLFxuICBidWlsZDoge1xuICAgIG1hbmlmZXN0OiB0cnVlLFxuICAgIHRhcmdldDogXCJlczIwMTVcIixcbiAgICBjc3NUYXJnZXQ6IFwiY2hyb21lNjNcIixcbiAgICBvdXREaXI6IFwiYnVpbGRcIixcbiAgICBhc3NldHNEaXI6IFwic3RhdGljXCIsXG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJbaGFzaF0uanNcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIGRlZmF1bHRJc01vZHVsZUV4cG9ydHM6IChpZCkgPT4ge1xuICAgICAgICBpZiAoaWQuaW5kZXhPZihcImFudGQvbGliXCIpICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJhdXRvXCI7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIGxlc3M6IHtcbiAgICAgICAgbW9kaWZ5VmFyczoge1xuICAgICAgICAgIFwiQHByaW1hcnktY29sb3JcIjogXCIjMzM3N0ZGXCIsXG4gICAgICAgICAgXCJAbGluay1jb2xvclwiOiBcIiMzMzc3RkZcIixcbiAgICAgICAgICBcIkBib3JkZXItY29sb3ItYmFzZVwiOiBcIiNEN0Q5RTBcIixcbiAgICAgICAgICBcIkBib3JkZXItcmFkaXVzLWJhc2VcIjogXCI0cHhcIixcbiAgICAgICAgfSxcbiAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIG9wZW46IHRydWUsXG4gICAgY29yczogdHJ1ZSxcbiAgICBwb3J0OiA4MDAwLFxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHByb3h5OiBwcm94eUNvbmZpZyxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIGNoZWNrZXIoe1xuICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcbiAgICAgIGVzbGludDoge1xuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCAtLXF1aWV0IFwiLi9zcmMvKiovKi57dHMsdHN4fVwiJyxcbiAgICAgICAgZGV2OiB7XG4gICAgICAgICAgbG9nTGV2ZWw6IFtcImVycm9yXCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICByZWFjdCh7XG4gICAgICBiYWJlbDoge1xuICAgICAgICBwYXJzZXJPcHRzOiB7XG4gICAgICAgICAgcGx1Z2luczogW1wiZGVjb3JhdG9ycy1sZWdhY3lcIl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHZpdGVUc2NvbmZpZ1BhdGhzKHtcbiAgICAgIHByb2plY3RzOiBbXCIuLi9vcGVuYmxvY2tzL3RzY29uZmlnLmpzb25cIiwgXCIuLi9vcGVuYmxvY2tzLWRlc2lnbi90c2NvbmZpZy5qc29uXCJdLFxuICAgIH0pLFxuICAgIHN2Z3JQbHVnaW4oe1xuICAgICAgc3Znck9wdGlvbnM6IHtcbiAgICAgICAgZXhwb3J0VHlwZTogXCJuYW1lZFwiLFxuICAgICAgICBwcmV0dGllcjogZmFsc2UsXG4gICAgICAgIHN2Z286IGZhbHNlLFxuICAgICAgICB0aXRsZVByb3A6IHRydWUsXG4gICAgICAgIHJlZjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgZ2xvYmFsRGVwUGx1Z2luKCksXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICBtaW5pZnk6IHRydWUsXG4gICAgICBpbmplY3Q6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGJyb3dzZXJDaGVja1NjcmlwdDogaXNEZXYgPyBcIlwiIDogYDxzY3JpcHQgc3JjPVwiJHtiYXNlfSR7YnJvd3NlckNoZWNrRmlsZU5hbWV9XCI+PC9zY3JpcHQ+YCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgaXNWaXN1YWxpemVyRW5hYmxlZCAmJiB2aXN1YWxpemVyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxufTtcblxuY29uc3QgYnJvd3NlckNoZWNrQ29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICAuLi52aXRlQ29uZmlnLFxuICBkZWZpbmU6IHtcbiAgICAuLi52aXRlQ29uZmlnLmRlZmluZSxcbiAgICBcInByb2Nlc3MuZW52Lk5PREVfRU5WXCI6IEpTT04uc3RyaW5naWZ5KFwicHJvZHVjdGlvblwiKSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAuLi52aXRlQ29uZmlnLmJ1aWxkLFxuICAgIG1hbmlmZXN0OiBmYWxzZSxcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGZvcm1hdHM6IFtcImlpZmVcIl0sXG4gICAgICBuYW1lOiBcIkJyb3dzZXJDaGVja1wiLFxuICAgICAgZW50cnk6IFwiLi9zcmMvYnJvd3Nlci1jaGVjay50c1wiLFxuICAgICAgZmlsZU5hbWU6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJyb3dzZXJDaGVja0ZpbGVOYW1lO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgYnVpbGRUYXJnZXRzID0ge1xuICBtYWluOiB2aXRlQ29uZmlnLFxuICBicm93c2VyQ2hlY2s6IGJyb3dzZXJDaGVja0NvbmZpZyxcbn07XG5cbmNvbnN0IGJ1aWxkVGFyZ2V0ID0gYnVpbGRUYXJnZXRzW3Byb2Nlc3MuZW52LkJVSUxEX1RBUkdFVCB8fCBcIm1haW5cIl07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhidWlsZFRhcmdldCB8fCB2aXRlQ29uZmlnKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1csT0FBTyxZQUFZO0FBQ3JYLFNBQVMsb0JBQStDO0FBQ3hELE9BQU8sV0FBVztBQUNsQixPQUFPLHVCQUF1QjtBQUM5QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGFBQWE7QUFDcEIsU0FBUyxrQkFBa0I7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
