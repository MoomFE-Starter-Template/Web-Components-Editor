<template>
  <div class="root flex justify-center">
    <template v-if="isSupported && memory">
      <div text="left sm" grid="~ cols-[auto_1fr] gap-(x-3 y-1)">
        <div text-gray>Used:</div>
        <div>{{ size(memory.usedJSHeapSize) }}</div>
        <div text-gray>Allocated:</div>
        <div>{{ size(memory.totalJSHeapSize) }}</div>
        <div text-gray>Limit:</div>
        <div>{{ size(memory.jsHeapSizeLimit) }}</div>
      </div>
    </template>
    <template v-else>
      Your browser does not support performance memory API
    </template>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{ unit?: 'KB' | 'MB' }>();

  const { isSupported, memory } = useMemory();

  const unit = refDefault(
    toRef(props, 'unit'),
    'MB',
  );

  function size(b: number) {
    const KB = b / 1024;

    if (unit.value === 'KB') return `${KB.toFixed(2)} KB`;
    if (unit.value === 'MB') return `${(KB / 1024).toFixed(2)} MB`;
  }
</script>

<style>
  @import "@unocss/reset/tailwind.css";
</style>
