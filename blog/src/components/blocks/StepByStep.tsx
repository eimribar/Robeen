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
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-6">
              {/* Step number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h4>
                  {step.duration && (
                    <span className="flex-shrink-0 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {step.duration}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {step.image && (
                  <div className="mt-4 relative aspect-video w-full max-w-md overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[2.25rem] top-[4.5rem] bottom-0 w-0.5 bg-gradient-to-b from-rose-200 to-transparent h-8 translate-y-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
