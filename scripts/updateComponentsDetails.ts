import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { asyncForEach } from 'mixte';

export interface componentDetail {
  /** 组件所在文件夹名称 */
  path: string
  /** 名称 */
  name: string
  /** 显示名称 */
  displayName: string
  /** 额外的 Vite 配置 */
  viteConfigPath?: string
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const rootPath = resolve(__dirname, '../');
const srcPath = resolve(rootPath, 'src');

(async () => {
  /** 组件注册文件 */
  const componentsIndex = await fg(['web-components/*/index.(ts|tsx)'], { cwd: srcPath });

  /** 组件相关信息 */
  const components: componentDetail[] = [];

  await asyncForEach(componentsIndex, async (fullPath) => {
    const [, path] = fullPath.split('/').reverse();

    // index.ts 和 info.ts 必须同时存在, 才承认这是个组件
    try {
      /** 组件信息 */
      const info = await import(`../src/web-components/${path}/info.ts`);
      /** 组件的额外的 Vite 配置地址 */
      const viteConfigPath = `web-components/${path}/vite.config.ts`;

      components.push({
        path,
        name: info.tag,
        displayName: info.name || info.tag,
        viteConfigPath: await fs.exists(resolve(srcPath, viteConfigPath)) ? viteConfigPath : undefined,
      });
    }
    catch (error) {}
  });

  fs.writeJsonSync(resolve(__dirname, '../meta/components.json'), { components }, { spaces: 2 });
})();
