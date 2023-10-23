<template>
  <div class="root p2">
    <el-tooltip content="提示">
      <el-button>鼠标移上显示提示</el-button>
    </el-tooltip>

    <el-button @click="ElNotification.success({ message: '通知', duration: 1500 })">点击显示通知</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { ElNotification } from 'element-plus';
</script>
