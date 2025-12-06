'use client';

import Image from 'next/image';
import { ArrowRight, Star, Download, CheckCircle, Sparkles } from 'lucide-react';
import RobeenAvatar from '../RobeenAvatar';

import { StaticImageData } from 'next/image';

interface ProductShowcaseProps {
    title: string;
    description: string;
    image?: string | StaticImageData;
    price?: string;
    ctaText?: string;
    ctaLink?: string;
    rating?: number;
    features?: string[];
}

export function ProductShowcase({
    title,
    description,
    image,
    price,
    ctaText = 'Get it now',
    ctaLink = '#',
    rating = 5,
    features
}: ProductShowcaseProps) {
    return (
        <div className="my-20 md:my-32">
            <div className="relative bg-gradient-to-br from-indigo-50 via-white to-pink-50 rounded-[3rem] p-8 md:p-12 overflow-hidden border border-white/60 shadow-2xl shadow-indigo-100/50 group">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 to-pink-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/30 to-purple-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Content Side */}
                    <div className="text-center lg:text-left order-last lg:order-first">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-indigo-50 px-3 py-1 rounded-full shadow-sm mb-6">
                            <div className="flex -space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Trusted by 50k+ Parents</span>
                        </div>

                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">
                            {title}
                        </h3>

                        <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                            {description}
                        </p>

                        {features && (
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
                                        <CheckCircle size={14} className="text-emerald-500" strokeWidth={3} />
                                        <span className="font-bold text-slate-700 text-xs">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visual Side */}
                    <div className="flex flex-col items-center justify-center relative py-8 lg:py-0">
                        <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center mb-12">

                            {/* App Screenshot - Tucked Behind */}
                            {image && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 h-80 rounded-[2rem] border-[6px] border-white shadow-xl shadow-indigo-200/50 overflow-hidden transform rotate-6 z-10 bg-white">
                                    <Image src={image} alt="App Screen" fill className="object-cover" />
                                </div>
                            )}

                            {/* Avatar - Front & Center */}
                            <div className="relative z-20 transform transition-transform duration-500 hover:scale-105 -translate-x-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/60 rounded-full blur-2xl transform scale-90" />
                                    <RobeenAvatar size="xl" emotion="happy" className="w-48 h-48 md:w-56 md:h-56 drop-shadow-2xl relative z-10" />

                                    {/* Floating Badge */}
                                    <div className="absolute -bottom-2 -right-2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2 animate-bounce-slow z-20">
                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1 rounded-full text-white">
                                            <Sparkles size={12} fill="currentColor" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">AI Powered</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button - Moved Below Image */}
                        <a
                            href={ctaLink}
                            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 relative z-30"
                        >
                            {ctaText}
                            <Download size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
