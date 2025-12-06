'use client';

import { BookOpen } from 'lucide-react';

interface GlossaryTermProps {
    term: string;
    phonetic?: string;
    definition: string;
    example?: string;
}

export function GlossaryTerm({ term, phonetic, definition, example }: GlossaryTermProps) {
    return (
        <div className="my-10 md:my-12 inline-block w-full">
            <div className="bg-indigo-50/30 rounded-2xl p-6 md:p-8 border border-indigo-100 relative overflow-hidden group hover:bg-indigo-50/50 transition-colors duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />

                <div className="relative z-10">
                    <div className="flex items-baseline gap-3 mb-3">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{term}</h4>
                        {phonetic && (
                            <span className="text-sm font-mono text-slate-500 bg-white/50 px-2 py-1 rounded-md border border-slate-200/50">
                                /{phonetic}/
                            </span>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1 bg-indigo-200 rounded-full flex-shrink-0" />
                        <div>
                            <p className="text-slate-700 font-medium leading-relaxed text-lg mb-3">
                                {definition}
                            </p>
                            {example && (
                                <p className="text-slate-500 text-sm italic">
                                    <span className="font-bold text-indigo-600 not-italic mr-1">Example:</span>
                                    "{example}"
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="absolute top-6 right-6 text-indigo-200 opacity-50">
                        <BookOpen size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
}
