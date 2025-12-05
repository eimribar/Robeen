'use client';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="my-8 md:my-12">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Pros */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h4 className="text-lg font-semibold text-green-800">Pros</h4>
          </div>
          <ul className="space-y-3">
            {pros.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-500 mt-1 flex-shrink-0">+</span>
                <span className="text-green-900 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
            <h4 className="text-lg font-semibold text-red-800">Cons</h4>
          </div>
          <ul className="space-y-3">
            {cons.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-red-500 mt-1 flex-shrink-0">-</span>
                <span className="text-red-900 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
