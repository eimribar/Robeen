'use client';

import { Activity } from 'lucide-react';

interface StatHighlightProps {
  stat: {
    value: string;
    label: string;
    source: string;
    sourceUrl?: string;
  };
}

export function StatHighlight({ stat }: StatHighlightProps) {
  return (
    <div className="my-16 md:my-20">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl shadow-indigo-200/50 relative overflow-hidden group transform transition-transform duration-500 hover:scale-[1.02]">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 opacity-90" />

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-8 shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>

          {/* Big number */}
          <div className="inline-flex items-center justify-center mb-6 relative">
            <span className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-sm">
              {stat.value}
            </span>
          </div>

          {/* Label */}
          <p className="text-xl md:text-2xl text-indigo-50 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            {stat.label}
          </p>

          {/* Source */}
          <div className="inline-block">
            {stat.sourceUrl ? (
              <a
                href={stat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                <span>Source: {stat.source}</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm border border-white/10">
                <span>Source: {stat.source}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
