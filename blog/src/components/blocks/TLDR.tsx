'use client';

interface TLDRProps {
  items: string[];
}

export function TLDR({ items }: TLDRProps) {
  return (
    <div className="my-8 md:my-12">
      <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            TL;DR
          </span>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Quick Summary</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5" />
              <span className="text-gray-700 leading-relaxed font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
