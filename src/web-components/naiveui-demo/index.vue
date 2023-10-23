<template>
  <div class="root p2">
    <NSpace>
      <NTooltip>
        <template #trigger>
          <NButton>鼠标移上显示提示</NButton>
        </template>
        提示
      </NTooltip>

      <NButton @click="notification.success({ content: '通知', duration: 1500 })">点击显示通知</NButton>
    </NSpace>
  </div>
</template>

<script lang="ts" setup>
  import { useNotification } from 'naive-ui';

  const notification = useNotification();
</script>
