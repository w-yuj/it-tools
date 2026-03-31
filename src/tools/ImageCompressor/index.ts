import { PictureInPicture } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '图片压缩',
  path: '/ImageCompressor',
  description: 'A tool to compress images while maintaining their quality.',
  keywords: ['ImageCompressor', 'compress', 'image', 'compressor'],
  component: () => import('./ImageCompressor.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2026-03-31'),
});