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
    <div className="my-8 md:my-12 overflow-hidden">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {table.title && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">{table.title}</h4>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {table.headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 ${
                      index === 0 ? 'bg-gray-100' : ''
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
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-6 py-4 text-sm ${
                        cellIndex === 0
                          ? 'font-medium text-gray-900 bg-gray-50'
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
