'use client';

import { CheckCircle, XCircle } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="my-16 md:my-20">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Pros */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-emerald-50/30 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full opacity-50 -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-sm border border-emerald-200/50">
                <CheckCircle size={28} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">The Pros</h4>
            </div>

            <ul className="space-y-5 relative z-10">
              {pros.map((item, index) => (
                <li key={index} className="flex items-start gap-4 group/item">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-emerald-200 transition-colors duration-300 text-emerald-600">
                    <CheckCircle size={14} />
                  </span>
                  <span className="text-slate-700 leading-relaxed font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-rose-50/30 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-bl-full opacity-50 -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600 shadow-sm border border-rose-200/50">
                <XCircle size={28} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">The Cons</h4>
            </div>

            <ul className="space-y-5 relative z-10">
              {cons.map((item, index) => (
                <li key={index} className="flex items-start gap-4 group/item">
                  <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-rose-200 transition-colors duration-300 text-rose-600">
                    <XCircle size={14} />
                  </span>
                  <span className="text-slate-700 leading-relaxed font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
