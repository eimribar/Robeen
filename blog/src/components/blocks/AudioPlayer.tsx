'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
    src: string;
    title: string;
    duration?: string;
    type?: 'cry' | 'soothing';
}

export function AudioPlayer({ src, title, duration = '0:10', type = 'cry' }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const isCry = type === 'cry';
    const gradientClass = isCry
        ? 'from-indigo-600 via-violet-600 to-purple-600'
        : 'from-emerald-500 via-teal-500 to-cyan-500';

    const shadowClass = isCry ? 'shadow-indigo-200' : 'shadow-emerald-200';

    return (
        <div className="my-12 md:my-16">
            <div className={`bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl ${shadowClass} relative overflow-hidden group`}>
                <audio ref={audioRef} src={src} preload="metadata" />

                <div className="flex items-center gap-6 relative z-10">
                    {/* Play Button */}
                    <button
                        onClick={togglePlay}
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 flex-shrink-0`}
                    >
                        {isPlaying ? (
                            <Pause size={28} fill="currentColor" />
                        ) : (
                            <Play size={28} fill="currentColor" className="ml-1" />
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-900 text-lg truncate pr-4">{title}</h4>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{duration}</span>
                        </div>

                        {/* Waveform / Progress Bar */}
                        <div className="h-12 flex items-center gap-1">
                            {Array.from({ length: 24 }).map((_, i) => {
                                // Generate a deterministic waveform pattern based on index and progress
                                // Using Math.sin ensures it's deterministic on both server and client
                                // We use progress to animate it when playing
                                const baseHeight = 15 + Math.sin(i * 0.5) * 10;
                                const activeHeight = 20 + Math.sin(i * 0.5 + progress * 0.5) * 15;

                                const height = isPlaying ? activeHeight : baseHeight;
                                const isActive = (i / 24) * 100 < progress;

                                return (
                                    <div
                                        key={i}
                                        className={`w-1.5 rounded-full transition-all duration-300 ${isActive
                                                ? isCry ? 'bg-indigo-500' : 'bg-emerald-500'
                                                : 'bg-slate-100'
                                            }`}
                                        style={{
                                            height: `${height.toFixed(1)}px`,
                                            animation: isPlaying ? `pulse 0.5s ease-in-out infinite ${i * 0.05}s` : 'none'
                                        }}
                                    />
                                );
                            })}
                        </div>                    </div>
                </div>
            </div>
        </div>
    );
}
