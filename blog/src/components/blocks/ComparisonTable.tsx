'use client';

interface ComparisonTableProps {
  table: {
    title?: string;
    headers: string[];
    rows: string[][];
  };
}

export function ComparisonTable({ table }: ComparisonTableProps) {
  return (
    <div className="my-16 md:my-20">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {table.title && (
          <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-100">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">{table.title}</h4>
          </div>
        )}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50">
                {table.headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest ${index === 0 ? 'bg-slate-50/90 sticky left-0 z-10 backdrop-blur-sm' : ''
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {table.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-8 py-6 text-sm leading-relaxed ${cellIndex === 0
                          ? 'font-bold text-slate-900 bg-white sticky left-0 z-10 group-hover:bg-indigo-50/30 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.03)]'
                          : 'text-slate-600 font-medium'
                        }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
