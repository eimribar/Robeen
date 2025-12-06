'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';

interface StepByStepProps {
  steps: Array<{
    title: string;
    description: string;
    image?: string;
    duration?: string;
  }>;
}

export function StepByStep({ steps }: StepByStepProps) {
  return (
    <div className="my-16 md:my-20">
      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-12 md:pl-24 pb-20 last:pb-0 group">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[1.5rem] md:left-[3rem] top-20 bottom-0 w-1 bg-slate-100 group-hover:bg-indigo-100 transition-colors duration-500 rounded-full" />
            )}

            {/* Step number */}
            <div className="absolute left-0 top-0 w-12 h-12 md:w-24 md:h-24 rounded-[2rem] bg-white border-4 border-slate-50 flex items-center justify-center z-10 shadow-xl shadow-indigo-100/50 group-hover:scale-110 transition-all duration-300 ring-1 ring-slate-100">
              <span className="text-xl md:text-4xl font-black text-indigo-600">
                {index + 1}
              </span>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h4 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
                  {step.title}
                </h4>
                {step.duration && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold self-start md:self-auto tracking-widest uppercase border border-indigo-100">
                    <Clock size={14} />
                    {step.duration}
                  </span>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed text-lg font-medium mb-8">
                {step.description}
              </p>

              {step.image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-inner ring-1 ring-black/5">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
