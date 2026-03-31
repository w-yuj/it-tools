import { Ad } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'png生成器',
  path: '/solid-color-png-generator',
  description: '生成纯色图片',
  keywords: ['solid', 'color', 'png', 'generator', 'image', 'creator'],
  component: () => import('./solid-color-png-generator.vue'),
  icon: Ad,
  createdAt: new Date('2026-03-31'),
});