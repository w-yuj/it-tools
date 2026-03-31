<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const inputText = ref('');

type Mode = 'unicodeToText' | 'textToUnicode';
const mode = ref<Mode>('unicodeToText');

function unicodeToText(str: string): string {
  return str.replace(/\\u([\dA-Fa-f]{4})/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16)),
  );
}

function textToUnicode(str: string): string {
  return Array.from(str)
    .map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()}`)
    .join('');
}

const outputText = computed(() => {
  if (!inputText.value.trim()) return '';
  return mode.value === 'unicodeToText'
    ? unicodeToText(inputText.value)
    : textToUnicode(inputText.value);
});

const { copy } = useCopy({ source: outputText, text: '已复制到剪贴板' });
</script>

<template>
  <div>
    <c-card>
      <c-select
        v-model:value="mode"
        mb-4
        label="转换模式"
        :options="[
          { label: 'Unicode 编码 → 文本（如 \\u4F60\\u597D → 你好）', value: 'unicodeToText' },
          { label: '文本 → Unicode 编码（如 你好 → \\u4F60\\u597D）', value: 'textToUnicode' },
        ]"
      />

      <c-input-text
        v-model:value="inputText"
        multiline
        raw-text
        :placeholder="mode === 'unicodeToText' ? '输入 Unicode 编码，如 \\u0041\\u4F60\\u597D' : '输入文本，如 Hello 你好'"
        rows="3"
        autosize
        autofocus
        :label="mode === 'unicodeToText' ? '输入 Unicode 编码：' : '输入文本：'"
      />

      <n-divider />

      <c-input-text
        :value="outputText"
        multiline
        raw-text
        readonly
        rows="3"
        autosize
        :label="mode === 'unicodeToText' ? '转换结果（文本）：' : '转换结果（Unicode 编码）：'"
        :placeholder="mode === 'unicodeToText' ? '转换后的文本将显示在这里' : '转换后的 Unicode 编码将显示在这里'"
      />

      <div mt-4 flex justify-center>
        <c-button :disabled="!outputText" @click="copy()">
          复制结果
        </c-button>
      </div>
    </c-card>
  </div>
</template>
