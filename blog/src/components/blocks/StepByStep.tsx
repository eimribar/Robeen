'use client';

import Image from 'next/image';

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
    <div className="my-8 md:my-12">
      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-12 md:pl-16 pb-12 last:pb-0 group">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[1.5rem] md:left-[2rem] top-12 bottom-0 w-0.5 bg-gray-100 group-hover:bg-indigo-50 transition-colors" />
            )}

            {/* Step number */}
            <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-4 border-indigo-50 flex items-center justify-center z-10 shadow-sm group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
              <span className="text-lg md:text-xl font-bold text-indigo-600">
                {index + 1}
              </span>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {step.title}
                </h4>
                {step.duration && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium self-start md:self-auto">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                {step.description}
              </p>

              {step.image && (
                <div className="mt-6 relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 shadow-inner">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
