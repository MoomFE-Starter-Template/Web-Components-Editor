import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import prompts from 'prompts';
import chalk from 'chalk';
import { type InlineConfig, build, mergeConfig } from 'vite';
import { camelCase } from 'lodash-es';
import { asyncForEach } from 'mixte';
import { createViteBaseConfig } from '../vite.config';
import { components } from '../meta/components.json';
import type { componentDetail } from './updateComponentsDetails';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rootPath = resolve(__dirname, '../');
const srcPath = resolve(rootPath, 'src');
const outDirPath = resolve(rootPath, 'dist');

// 打包所有单个组件
(async () => {
  const response = await prompts({
    type: 'multiselect',
    name: 'value',
    message: '请选择需要打包的组件',
    choices: Object.values(components).map(info => ({ title: `${info.displayName} ( ${info.name} )`, value: info.name })),
    instructions: false,
  });

  if (response.value?.length) {
    // 清空代码输出目录
    await fs.emptyDir(outDirPath);

    // 打包组件
    await asyncForEach<string>(response.value, async (name) => {
      const { path, displayName, viteConfigPath } = Object.values(components).find(info => info.name === name)! as componentDetail;
      const viteBaseConfig = createViteBaseConfig();
      const viteExtraConfig: InlineConfig = {
        configFile: viteConfigPath ? resolve(srcPath, viteConfigPath) : false,
        publicDir: resolve(rootPath, 'public', path),
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
          minify: true,
          outDir: resolve(outDirPath, name),
          emptyOutDir: false,
          lib: {
            entry: resolve(srcPath, `web-components/${path}/index.ts`),
            formats: ['iife'],
            name: camelCase(name),
            fileName: () => 'index.js',
          },
        },
      };

      console.log(`\n${chalk.green(`- 开始打包 ${chalk.blue(`${displayName} ( ${name} )`)} 组件`)}`);

      await build(
        mergeConfig(viteBaseConfig, viteExtraConfig),
      );
    });
  }
  else {
    console.log(
      chalk.red('× 没有选择任何组件'),
    );
  }
})();
