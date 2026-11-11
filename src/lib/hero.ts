import { getImage } from 'astro:assets';
import type { Photo } from './photos';

export const HERO_SIZES = '(min-width: 72rem) 68rem, calc(100vw - 2rem)';

export async function heroImage(photo: Photo) {
  const widths = [480, 720, 960, 1280, 1600].filter((w) => w <= photo.image.width);
  const img = await getImage({ src: photo.image, widths, format: 'webp', quality: 72 });
  return {
    src: img.src,
    srcset: img.srcSet.attribute,
    sizes: HERO_SIZES,
    width: photo.image.width,
    height: photo.image.height,
    type: 'image/webp',
  };
}
