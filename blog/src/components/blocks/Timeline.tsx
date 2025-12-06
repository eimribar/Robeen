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
    <div className="my-8 md:my-16">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 md:-translate-x-1/2" />

        <div className="space-y-8 md:space-y-16">
          {items.map((item, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}>
              {/* Content Side */}
              <div className="flex-1 ml-12 md:ml-0">
                <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                  }`}>
                  {/* Arrow for desktop */}
                  <div className={`hidden md:block absolute top-6 w-4 h-4 bg-white border-t border-r border-gray-100 transform rotate-45 ${index % 2 === 0 ? '-left-2.5 border-l-0 border-b-0' : '-right-2.5 border-t-0 border-r-0 border-l border-b'
                    }`} />

                  <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                    {item.label}
                  </span>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm transform -translate-x-1/2 mt-6 z-10 md:mt-6" />

              {/* Empty Side for Balance */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
