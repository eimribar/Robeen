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
    <div className="my-16 md:my-24">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 md:-translate-x-1/2 rounded-full" />

        <div className="space-y-12 md:space-y-24">
          {items.map((item, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}>
              {/* Content Side */}
              <div className="flex-1 ml-12 md:ml-0 group perspective-[1000px]">
                <div className={`bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500 relative transform hover:scale-[1.02] ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                  }`}>

                  <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg mb-4 uppercase tracking-widest border border-indigo-100">
                    {item.label}
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium text-lg">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-white border-4 border-indigo-600 shadow-[0_0_0_4px_rgba(255,255,255,1)] transform -translate-x-1/2 mt-10 z-10 md:mt-10 ring-4 ring-indigo-50" />

              {/* Empty Side for Balance */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
