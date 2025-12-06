'use client';

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
    <div className="my-8 md:my-12">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-center shadow-xl text-white relative overflow-hidden group">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-pink-500 blur-3xl group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="relative z-10">
          {/* Big number */}
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-sm">
              {stat.value}
            </span>
          </div>

          {/* Label */}
          <p className="text-xl md:text-2xl text-indigo-50 max-w-2xl mx-auto leading-relaxed font-medium">
            {stat.label}
          </p>

          {/* Source */}
          <div className="mt-8 pt-6 border-t border-white/10 inline-block px-8">
            {stat.sourceUrl ? (
              <a
                href={stat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>Source: {stat.source}</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-sm text-indigo-200">
                Source: {stat.source}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
