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
    <div className="my-8 md:my-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ring-1 ring-gray-900/5">
        {table.title && (
          <div className="bg-gray-50/80 backdrop-blur-sm px-6 py-5 border-b border-gray-200">
            <h4 className="text-lg font-bold text-gray-900">{table.title}</h4>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/50">
                {table.headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider ${index === 0 ? 'bg-gray-50/80 sticky left-0 z-10' : ''
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-6 py-5 text-sm leading-relaxed ${cellIndex === 0
                          ? 'font-semibold text-gray-900 bg-white sticky left-0 z-10 group-hover:bg-gray-50/50 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]'
                          : 'text-gray-600'
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
