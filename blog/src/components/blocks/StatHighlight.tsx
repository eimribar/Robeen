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
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 md:p-10 text-center border border-indigo-100 shadow-sm">
        {/* Big number */}
        <div className="inline-flex items-center justify-center mb-4">
          <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {stat.value}
          </span>
        </div>

        {/* Label */}
        <p className="text-lg md:text-xl text-gray-700 max-w-md mx-auto leading-relaxed">
          {stat.label}
        </p>

        {/* Source */}
        <div className="mt-6 pt-4 border-t border-indigo-100">
          {stat.sourceUrl ? (
            <a
              href={stat.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Source: {stat.source}
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              Source: {stat.source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
