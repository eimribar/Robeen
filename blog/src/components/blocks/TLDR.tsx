'use client';

import { Zap, CheckCircle } from 'lucide-react';

interface TLDRProps {
  items: string[];
}

export function TLDR({ items }: TLDRProps) {
  return (
    <div className="my-12 md:my-16">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 pt-8 pb-10 text-white relative shrink-0">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">TL;DR</h2>
              <div className="flex gap-2">
                <span className="bg-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border border-white/10 uppercase tracking-wide flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Quick Summary
                </span>
              </div>
            </div>
          </div>

          {/* Decorative Curve */}
          <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white rounded-t-[2rem]"></div>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-8 -mt-2">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-colors group">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle size={12} />
                </span>
                <span className="text-sm font-bold text-slate-700 leading-snug pt-1">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
