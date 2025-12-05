'use client';

interface TLDRProps {
  items: string[];
}

export function TLDR({ items }: TLDRProps) {
  return (
    <div className="my-8 md:my-10">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">📌</span>
          <h3 className="text-lg md:text-xl font-bold">Quick Summary</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-gray-100 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
