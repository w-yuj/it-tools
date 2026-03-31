import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Unicode转换器',
  path: '/decodeUnicode',
  description: '将Unicode编码转换为可读文本，或将文本转换为Unicode编码。适用于处理包含特殊字符的字符串，或需要在不同编码之间进行转换的场景。',
  keywords: ['decodeUnicode', 'unicode', 'decode'],
  component: () => import('./decodeUnicode.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2026-03-31'),
});