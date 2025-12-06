'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';

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
    <blockquote className="my-16 md:my-20 relative group">
      <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
        {/* Decorative Quote Icon */}
        <div className="absolute top-6 right-8 text-indigo-100 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
          <Quote size={80} fill="currentColor" className="opacity-50" />
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm shadow-indigo-100">
              <Quote size={24} />
            </div>
            <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed font-serif italic">
              &ldquo;{text}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
            {expert.image ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-indigo-50">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-md ring-2 ring-indigo-50">
                <span className="text-indigo-600 font-bold text-lg">
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 text-lg tracking-tight">{expert.name}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <span>{expert.title}</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="text-indigo-500">{expert.organization}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </blockquote>
  );
}
