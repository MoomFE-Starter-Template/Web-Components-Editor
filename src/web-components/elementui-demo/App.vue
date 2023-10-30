<template>
  <ElConfigProvider namespace="st">
    <Index />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
  import Index from './index.vue';

  useElementStyle();
</script>

<style lang="scss">
  @import url("@unocss/reset/tailwind.css");
</style>
