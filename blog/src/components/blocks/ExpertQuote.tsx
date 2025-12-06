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
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg shadow-indigo-50/50 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-bl-full opacity-50 -mr-8 -mt-8" />

        {/* Quote icon */}
        <div className="relative z-10 mb-6">
          <svg
            className="w-10 h-10 text-indigo-200"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
          </svg>
        </div>

        {/* Quote text */}
        <p className="relative z-10 text-xl md:text-2xl text-gray-800 leading-relaxed font-medium mb-8">
          &ldquo;{text}&rdquo;
        </p>

        {/* Expert info */}
        <div className="relative z-10 flex items-center gap-4">
          {expert.image ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-4 ring-indigo-50">
              <Image
                src={expert.image}
                alt={expert.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center flex-shrink-0 ring-4 ring-indigo-50">
              <span className="text-indigo-600 font-bold text-xl">
                {expert.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900 text-lg">{expert.name}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm">
              <span className="text-gray-600 font-medium">{expert.title}</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="text-indigo-600 font-medium">{expert.organization}</span>
            </div>
          </div>
        </div>
      </div>
    </blockquote>
  );
}
