<template>
  <NConfigProvider :cls-prefix="classPrefix" :theme-overrides="commonOverrides" abstract>
    <NNotificationProvider>
      <Index />
    </NNotificationProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import Index from './index.vue';

  const classPrefix = useNaiveStyle();
</script>

<style lang="scss">
  @import url("@unocss/reset/tailwind.css");
</style>
