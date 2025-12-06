'use client';

import { HelpCircle, ChevronRight } from 'lucide-react';

interface FAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQ({ faqs }: FAQProps) {
  return (
    <div className="my-16 md:my-20">
      <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100/40 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-indigo-600 shadow-md border border-slate-100">
            <HelpCircle size={28} />
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid gap-6 relative z-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-200/10 transition-all duration-300 group"
            >
              <h4 className="font-bold text-slate-900 mb-4 text-xl group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                {faq.question}
                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight size={18} />
                </span>
              </h4>
              <div className="text-slate-600 leading-relaxed text-lg font-medium pr-8">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
