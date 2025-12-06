'use client';

import Image from 'next/image';

interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ImageBlock({ src, alt, caption }: ImageBlockProps) {
  return (
    <figure className="my-8 md:my-12 group">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-gray-900/5">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        />

        {/* Overlay gradient for caption readability if needed, or just aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
