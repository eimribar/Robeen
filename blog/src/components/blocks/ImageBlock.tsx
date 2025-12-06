'use client';

import Image from 'next/image';

interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ImageBlock({ src, alt, caption }: ImageBlockProps) {
  return (
    <figure className="my-16 md:my-20 group">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-200 border-4 border-slate-900 ring-1 ring-slate-900/5 transition-all duration-500 hover:shadow-indigo-200/50 hover:scale-[1.01]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-95 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        />

        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </div>
      {caption && (
        <figcaption className="mt-6 text-center text-sm text-slate-500 font-bold tracking-wide flex items-center justify-center gap-2 px-4 uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
