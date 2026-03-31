<script setup lang="ts">
import { compressImage, formatSize } from './ImageCompressor.service';
import type { CompressOptions } from './ImageCompressor.service';

const file = ref<File | null>(null);
const originalPreview = ref('');
const originalSize = ref(0);
const originalWidth = ref(0);
const originalHeight = ref(0);

const quality = ref(0.8);
const maxWidth = ref(1920);
const maxHeight = ref(1080);
const keepAspectRatio = ref(true);
const outputFormat = ref<CompressOptions['outputFormat']>('image/jpeg');

// 联动：保持长宽比时修改宽度同步高度，反之亦然
watch(maxWidth, (newVal) => {
  if (keepAspectRatio.value && originalWidth.value && originalHeight.value) {
    maxHeight.value = Math.round(newVal * originalHeight.value / originalWidth.value);
  }
});

watch(maxHeight, (newVal) => {
  if (keepAspectRatio.value && originalWidth.value && originalHeight.value) {
    maxWidth.value = Math.round(newVal * originalWidth.value / originalHeight.value);
  }
});

const compressedPreview = ref('');
const compressedSize = ref(0);
const compressedWidth = ref(0);
const compressedHeight = ref(0);
const isCompressing = ref(false);
const errorMsg = ref('');

const formatOptions = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG', value: 'image/png' },
  { label: 'WebP', value: 'image/webp' },
];

const savingRate = computed(() => {
  if (!originalSize.value || !compressedSize.value) {
    return null;
  }
  return ((originalSize.value - compressedSize.value) / originalSize.value * 100).toFixed(1);
});

async function onUpload(uploadedFile: File) {
  file.value = uploadedFile;
  errorMsg.value = '';
  compressedPreview.value = '';
  compressedSize.value = 0;

  const reader = new FileReader();
  reader.onload = (e) => {
    originalPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(uploadedFile);

  const img = new Image();
  const url = URL.createObjectURL(uploadedFile);
  img.onload = () => {
    originalWidth.value = img.width;
    originalHeight.value = img.height;
    maxWidth.value = img.width;
    maxHeight.value = img.height;
    URL.revokeObjectURL(url);
  };
  img.src = url;

  originalSize.value = uploadedFile.size;
}

async function compress() {
  if (!file.value) {
    return;
  }
  isCompressing.value = true;
  errorMsg.value = '';
  try {
    const result = await compressImage(file.value, {
      quality: quality.value,
      maxWidth: maxWidth.value,
      maxHeight: maxHeight.value,
      keepAspectRatio: keepAspectRatio.value,
      outputFormat: outputFormat.value,
    });
    compressedPreview.value = result.dataUrl;
    compressedSize.value = result.size;
    compressedWidth.value = result.width;
    compressedHeight.value = result.height;
  }
  catch (e: any) {
    errorMsg.value = e.message || '压缩失败';
  }
  finally {
    isCompressing.value = false;
  }
}

function download() {
  if (!compressedPreview.value) {
    return;
  }
  const ext = outputFormat.value.split('/')[1];
  const a = document.createElement('a');
  a.href = compressedPreview.value;
  a.download = `compressed.${ext}`;
  a.click();
}
</script>

<template>
  <div>
    <c-card>
      <c-file-upload
        title="拖拽图片到此处，或点击选择图片"
        accept="image/*"
        @file-upload="onUpload"
      />

      <template v-if="file">
        <n-divider />

        <div flex flex-wrap gap-4>
          <div flex-1 style="min-width: 200px">
            <div mb-1 text-sm op-70>
              压缩质量：{{ Math.round(quality * 100) }}%
            </div>
            <n-slider v-model:value="quality" :min="0.1" :max="1" :step="0.05" />
          </div>

          <c-select
            v-model:value="outputFormat"
            label="输出格式"
            :options="formatOptions"
            style="min-width: 120px"
          />
        </div>

        <div mt-3 flex flex-wrap items-end gap-4>
          <c-input-text
            v-model:value="maxWidth"
            label="最大宽度（px）"
            type="number"
            style="flex: 1; min-width: 140px"
          />
          <c-input-text
            v-model:value="maxHeight"
            label="最大高度（px）"
            type="number"
            style="flex: 1; min-width: 140px"
          />
          <div mb-1 flex items-center gap-2>
            <n-switch v-model:value="keepAspectRatio" />
            <span text-sm>保持长宽比</span>
          </div>
        </div>

        <div mt-4 flex justify-center>
          <c-button :loading="isCompressing" @click="compress">
            开始压缩
          </c-button>
        </div>

        <n-alert v-if="errorMsg" type="error" mt-3>
          {{ errorMsg }}
        </n-alert>

        <n-divider />

        <div flex flex-wrap gap-4>
          <div flex-1 style="min-width: 200px">
            <div mb-2 style="font-size: 0.875rem; font-weight: 500">
              原图
            </div>
            <img :src="originalPreview" style="max-width: 100%; max-height: 300px; border-radius: 6px; display: block">
            <div mt-2 style="font-size: 0.875rem; opacity: 0.7">
              {{ originalWidth }} × {{ originalHeight }} px &nbsp;|&nbsp; {{ formatSize(originalSize) }}
            </div>
          </div>

          <div flex-1 style="min-width: 200px">
            <div mb-2 style="font-size: 0.875rem; font-weight: 500">
              压缩后
              <n-tag v-if="savingRate" type="success" size="small" ml-2>
                节省 {{ savingRate }}%
              </n-tag>
            </div>
            <img
              v-if="compressedPreview"
              :src="compressedPreview"
              style="max-width: 100%; max-height: 300px; border-radius: 6px; display: block"
            >
            <div
              v-else
              style="max-width: 100%; height: 150px; border-radius: 6px; background: rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; color: rgba(128,128,128,0.5)"
            >
              压缩结果将显示在这里
            </div>
            <div v-if="compressedSize" mt-2 style="font-size: 0.875rem; opacity: 0.7">
              {{ compressedWidth }} × {{ compressedHeight }} px &nbsp;|&nbsp; {{ formatSize(compressedSize) }}
            </div>
          </div>
        </div>

        <div v-if="compressedPreview" mt-4 flex justify-center>
          <c-button @click="download">
            下载压缩图片
          </c-button>
        </div>
      </template>
    </c-card>
  </div>
</template>
