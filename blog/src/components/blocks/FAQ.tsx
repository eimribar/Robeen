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
      <div className="bg-indigo-50/50 rounded-2xl p-6 md:p-10 border border-indigo-100/50">
        <div className="flex items-center gap-3 mb-8">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-lg">?</span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors"
            >
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                {faq.question}
              </h4>
              <div className="text-gray-600 leading-relaxed pl-4 border-l-2 border-indigo-100">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
