<template>
  <div class="size-screen p-3" un:grid="~ rows-[auto_1fr] gap-3">
    <!-- 操作区 -->
    <n-space justify="space-between" item-style="position: relative">
      <!-- 左侧组件相关功能 -->
      <n-space>
        <n-select
          v-model:value="componentsSelectValue"
          class="!w-72"
          :options="componentsOptions" :render-label="renderOptionLabel" :consistent-menu-width="false"
          placeholder="请选择组件" clearable
        />
        <n-button type="primary" :disabled="!componentsSelectValue" @click="createTab(componentsSelectValue)">新增</n-button>
        <template v-if="componentsSelectValue">
          <router-link class="no-underline!" :to="{ name: 'Frame/Component', params: { name: componentsSelectValue } }" target="_blank">
            <n-button type="primary">新窗口打开</n-button>
          </router-link>
        </template>
      </n-space>
      <!-- 右侧项目相关信息 -->
      <n-space class="absolute -top-1 -right-1 <xs:hidden!" :wrap="false">
        <Logo />
        <div class="h-full flex-(~ col items-center justify-around) [&>*]-(text-lg op-60 transition-all duration-300) [&>*:hover]-(text-primary op-100)">
          <!-- 切换深色模式 -->
          <button title="切换暗色模式" @click="theme.toggle()">
            <i-mdi-theme-light-dark v-if="theme.value === 'auto'" />
            <i-ph-moon v-else-if="theme.value === 'dark'" />
            <i-ic-outline-wb-sunny v-else />
          </button>
          <!-- 跳转到 Github -->
          <button>
            <a class="c-inherit!" href="https://github.com/MoomFE-Starter-Template/Web-Components-Editor" target="_blank" rel="noopener noreferrer">
              <i-mdi-github />
            </a>
          </button>
        </div>
      </n-space>
    </n-space>

    <!-- 组件展示区 -->
    <div ref="tabsWrapRef" class="size-full overflow-hidden">
      <n-tabs
        v-model:value="activeTabId"
        :class="{ 'hidden-tabs-pad-border': tabs.length }"
        type="card" closable animated
        @close="closeTab"
      >
        <!-- 所有的组件预览区 -->
        <template v-if="tabs.length">
          <template v-for="tab in tabs" :key="tab.id!">
            <n-tab-pane class="tab-pane-shadow !p-3" :name="tab.id!" :tab="renderTabTitle(tab.component)" :style="{ height: tabPaneHeight }" display-directive="show:lazy">
              <iframe class="size-full" src="/frame" :name="tab.id!" frameborder="0" />
            </n-tab-pane>
          </template>
        </template>
        <!-- 无组件预览时 -->
        <n-tab-pane v-else name="noop" tab="无组件预览" :closable="false" disabled />
        <!-- 组件测试数据选择 -->
        <template v-if="activeTabData" #suffix>
          <!-- 使用函数返回测试数据时, 重新运行函数生成测试数据 -->
          <n-tooltip v-if="activeTab!.data && isFunction(activeTabData[activeTab!.data])">
            <template #trigger>
              <i class="cursor-pointer mr-2" un:i-mdi-reload @click="dataReload" />
            </template>
            <div un:text="sm">当前测试数据由函数返回, 点击重新运行函数生成测试数据</div>
          </n-tooltip>
          <!-- 组件测试数据选择下拉框 -->
          <n-select v-model:value="activeTab!.data" class="!w-36" size="small" placeholder="选择测试数据" :options="genTabDataOptions(activeTabData)" clearable />
        </template>
      </n-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { isFunction } from 'mixte';
  import { useTabsManage } from './composables/useTabsManage';
  import { genTabDataOptions, renderOptionLabel, renderTabTitle, useTabPaneHeight } from './utils';
  import { componentsOptions } from '@/shared/components';

  const theme = useThemeStore();

  /** 选项卡容器 */
  const tabsWrapRef = ref<HTMLElement>();

  /** 选项卡管理 */
  const { activeTab, activeTabId, activeTabData, tabs, createTab, closeTab } = useTabsManage();
  /** 选项卡面板的高度 */
  const tabPaneHeight = useTabPaneHeight(tabsWrapRef);

  /** 操作区选中的组件列表 */
  const componentsSelectValue = ref();

  /** 重载数据 */
  function dataReload() {
    activeTab.value!.dataReloadCount = (activeTab.value!.dataReloadCount ?? 0) + 1;
  }
</script>

<route lang="yaml">
name: Index
</route>

<style lang="scss" scoped>
  .hidden-tabs-pad-border :deep(.n-tabs-pad){
    border-bottom: 0 !important;
  }
  .tab-pane-shadow{
    box-shadow: inset 0px 0px 4px 0px rgba(0,0,0,0.2);
  }
</style>
