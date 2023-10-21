<template>
  <n-config-provider :cls-prefix="classPrefix">
    <n-notification-provider>
      <GetEnv />

      <div root p-2>
        <NSpace>
          <n-tooltip>
            <template #trigger>
              <NButton>鼠标移上显示提示</NButton>
            </template>
            提示
          </n-tooltip>

          <NButton @click="notification.success({ content: '通知' })">点击显示通知</NButton>
        </NSpace>
      </div>
    </n-notification-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
  import { useNotification } from 'naive-ui';

  const classPrefix = useNaive();

  let notification: NotificationApiInjection;
  function GetEnv() {
    notification = useNotification();
  }
</script>

<style>
  @import "@unocss/reset/tailwind.css";
</style>
