'use client';

interface FAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQ({ faqs }: FAQProps) {
  return (
    <div className="my-8 md:my-12">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-200">
          <span className="text-2xl">❓</span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-blue-100"
            >
              <h4 className="font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-blue-600 font-bold">Q:</span>
                <span>{faq.question}</span>
              </h4>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">A:</span>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
