'use client';

interface TimelineProps {
  items: Array<{
    label: string;
    title: string;
    description: string;
  }>;
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="my-8 md:my-12">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-300 via-purple-300 to-indigo-300" />

        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="relative pl-12 md:pl-20">
              {/* Dot */}
              <div className="absolute left-2 md:left-6 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 ring-4 ring-white shadow" />

              {/* Content */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    {item.label}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
