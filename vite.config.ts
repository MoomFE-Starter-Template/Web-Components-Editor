import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import type { UserConfig } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { viteVueCESubStyle } from '@unplugin-vue-ce/sub-style';
import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Inspect from 'vite-plugin-inspect';
import { deepMerge } from 'mixte';
import { MixteUseAutoImport } from '@mixte/use/register';
import VirtualPublic from './scripts/plugins/virtual-public';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 创建一个基础的 vite 配置
 *  - 当前 Editor 项目和 Web Components 的公用配置
 */
export function createViteBaseConfig(options: CreateViteBaseConfigOptions = {}) {
  const plugins = options.plugins || [];
  const isCustomElementRE = /\/web-components\/.*\/.*\.vue$/;

  return defineConfig({
    // 环境变量前缀
    envPrefix: 'APP_',
    // 路径别名
    resolve: {
      alias: {
        '~': resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
        '@@': resolve(__dirname, './'),
      },
    },
    // 插件
    plugins: [
      ...plugins,
      // 对 Web Components 组件使用的 public 资源进行虚拟路径替换
      VirtualPublic(),
      // Vue 3 支持
      Vue({
        customElement: [isCustomElementRE],
      }),
      // 子组件样式支持
      viteVueCESubStyle(),
      // JSX 支持
      VueJsx(),
      // 原子化 CSS 引擎 ( 供 Web Components 使用 )
      Unocss({
        mode: 'vue-scoped',
        content: {
          pipeline: {
            include: [isCustomElementRE],
          },
        },
      }),
      // 将图标作为图标组件可进行导入
      Icons({
        scale: 1,
        compiler: 'vue3',
      }),
      // 自动导入使用到的组件
      Components({
        dts: resolve(__dirname, './types/components.d.ts'),
        dirs: [
          resolve(__dirname, './src/components'),
          resolve(__dirname, './src/components-private'),
        ],
        resolvers: [
          // 自动导入图标组件
          IconsResolver({ prefix: 'i' }),
          // 自动导入 Naive UI 组件
          NaiveUiResolver(),
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
        ],
      }),
      // API 自动加载
      AutoImport({
        dts: resolve(__dirname, './types/auto-imports.d.ts'),
        vueTemplate: true,
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          '@vueuse/math',
          MixteUseAutoImport({ useWithVueUseCore: true }),
        ],
        resolvers: [
          ElementPlusResolver(),
        ],
        dirs: [
          resolve(__dirname, './src/composables'),
          resolve(__dirname, './src/stores'),
        ],
        eslintrc: {
          enabled: true,
          filepath: resolve(__dirname, './.eslintrc-auto-import.json'),
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/styles/element.scss" as *;',
        },
      },
    },
  });
}

export default defineConfig(({ mode }) => {
  /** 是否是开发模式 */
  const isDev = mode === 'development';
  /** 环境变量 */
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'APP_']);

  return deepMerge(
    // 基础配置
    createViteBaseConfig({
      // 当前 Editor 项目专用 vite 插件
      plugins: [
        // 以文件系统为基础的路由
        Pages({
          dirs: resolve(__dirname, './src/pages'),
          extensions: ['vue'],
          exclude: ['**/components', '**/composables'],
        }),
        // 页面布局系统
        Layouts(),
        // 原子化 CSS 引擎
        Unocss(),
        // 插件调试
        Inspect(),
      ],
    }),
    // 当前 Editor 项目专用配置
    {
      // 开发服务器选项
      server: {
        port: 666,
      },
      // 预览选项
      preview: {
        port: 888,
      },
    },
  );
});

interface CreateViteBaseConfigOptions {
  /** 需要额外插入的 vite 插件 */
  plugins?: UserConfig['plugins']
}
