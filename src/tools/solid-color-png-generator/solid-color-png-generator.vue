<script setup lang="ts">
import { downloadPng, generateSolidColorPng } from './solid-color-png-generator.service';

const width = ref(100);
const height = ref(100);
const color = ref('rgba(99, 179, 237, 1)');

const previewUrl = computed(() => {
  if (width.value > 0 && height.value > 0) {
    return generateSolidColorPng(width.value, height.value, color.value);
  }
  return '';
});

function download() {
  if (!previewUrl.value) {
    return;
  }
  downloadPng(previewUrl.value, `solid-color-${width.value}x${height.value}.png`);
}
</script>

<template>
  <div>
    <c-card>
      <div flex flex-wrap gap-4>
        <c-input-text
          v-model:value="width"
          label="宽度（px）"
          type="number"
          :min="1"
          :max="4096"
          style="flex: 1; min-width: 140px"
        />
        <c-input-text
          v-model:value="height"
          label="高度（px）"
          type="number"
          :min="1"
          :max="4096"
          style="flex: 1; min-width: 140px"
        />
      </div>

      <n-form-item label="颜色（含透明度）" mt-3 :show-feedback="false">
        <n-color-picker v-model:value="color" :modes="['rgba', 'hex', 'hsla']" />
      </n-form-item>

      <n-divider />

      <div flex flex-col items-center gap-3>
        <div
          style="border: 1px solid rgba(128,128,128,0.2); border-radius: 6px; overflow: hidden; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px;"
        >
          <img
            v-if="previewUrl"
            :src="previewUrl"
            :style="`display: block; max-width: 300px; max-height: 200px; width: ${width}px; height: ${height}px; object-fit: fill`"
          >
        </div>

        <div style="font-size: 0.875rem; opacity: 0.7">
          {{ width }} × {{ height }} px &nbsp;·&nbsp; {{ color }}
        </div>

        <c-button :disabled="!previewUrl" @click="download">
          下载 PNG
        </c-button>
      </div>
    </c-card>
  </div>
</template>
