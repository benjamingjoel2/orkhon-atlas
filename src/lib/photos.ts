import type { ImageMetadata } from 'astro';
import credits from '../data/photos.json';

export type Photo = {
  key: string;
  file: string;
  title: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  image: ImageMetadata;
};

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });

export function getPhoto(key: string): Photo {
  const meta = (credits as Record<string, Omit<Photo, 'key' | 'image'>>)[key];
  if (!meta) throw new Error(`No photo credit entry for "${key}" in src/data/photos.json`);
  const mod = files[`../assets/photos/${meta.file}`];
  if (!mod) throw new Error(`Missing image file src/assets/photos/${meta.file}`);
  return { key, ...meta, image: mod.default };
}

export function allPhotos(): Photo[] {
  return Object.keys(credits).map(getPhoto);
}
