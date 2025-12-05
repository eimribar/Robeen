'use client';

import Image from 'next/image';

interface ExpertQuoteProps {
  text: string;
  expert: {
    name: string;
    title: string;
    organization: string;
    image?: string;
  };
}

export function ExpertQuote({ text, expert }: ExpertQuoteProps) {
  return (
    <blockquote className="my-8 md:my-12 relative">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-rose-100 shadow-sm">
        {/* Quote icon */}
        <svg
          className="absolute top-4 left-4 w-8 h-8 text-rose-200 opacity-60"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
        </svg>

        {/* Quote text */}
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic pl-8 md:pl-10 pr-4">
          &ldquo;{text}&rdquo;
        </p>

        {/* Expert info */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-rose-100">
          {expert.image ? (
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-white shadow-md">
              <Image
                src={expert.image}
                alt={expert.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-md">
              <span className="text-white font-semibold text-lg">
                {expert.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{expert.name}</p>
            <p className="text-sm text-gray-600">{expert.title}</p>
            <p className="text-sm text-rose-600">{expert.organization}</p>
          </div>
        </div>
      </div>
    </blockquote>
  );
}
