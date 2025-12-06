'use client';

import { useState } from 'react';
import { Check, Circle } from 'lucide-react';

interface ChecklistProps {
    title: string;
    items: string[];
}

export function Checklist({ title, items }: ChecklistProps) {
    // Initialize state with no items checked
    const [checkedState, setCheckedState] = useState<boolean[]>(
        new Array(items.length).fill(false)
    );

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    };

    const allChecked = checkedState.every(Boolean);

    return (
        <div className="my-12 md:my-16">
            <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-500 ${allChecked ? 'ring-2 ring-emerald-100' : ''}`}>
                {/* Header */}
                <div className="bg-slate-50/50 p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                        {checkedState.filter(Boolean).length} / {items.length}
                    </div>
                </div>

                {/* List */}
                <div className="p-6 md:p-8 space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleOnChange(index)}
                            className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${checkedState[index]
                                    ? 'bg-emerald-50/30'
                                    : 'bg-white hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${checkedState[index]
                                    ? 'bg-emerald-500 text-white scale-110 shadow-md shadow-emerald-200'
                                    : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'
                                }`}>
                                {checkedState[index] ? <Check size={14} strokeWidth={3} /> : <Circle size={14} strokeWidth={3} />}
                            </div>

                            <span className={`text-lg font-medium transition-all duration-300 ${checkedState[index]
                                    ? 'text-emerald-700 line-through opacity-70'
                                    : 'text-slate-700'
                                }`}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Completion Message */}
                {allChecked && (
                    <div className="bg-emerald-50 p-4 text-center animate-fade-in">
                        <p className="text-emerald-700 font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                            <Check size={16} /> All steps completed!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
