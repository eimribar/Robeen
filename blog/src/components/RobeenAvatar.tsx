'use client';

import React from 'react';

interface RobeenAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'neutral' | 'happy' | 'listening' | 'talking';
}

const RobeenAvatar: React.FC<RobeenAvatarProps> = ({
  className = "",
  size = "md",
  emotion = "neutral"
}) => {

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-40 h-40"
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-lg transition-transform duration-300"
      >
        <defs>
          <linearGradient id="skinGradient" x1="100" y1="50" x2="100" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8DACC"/>
            <stop offset="100%" stopColor="#E6C0A8"/>
          </linearGradient>

          <linearGradient id="hairGradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5"/>
            <stop offset="60%" stopColor="#4338CA"/>
            <stop offset="100%" stopColor="#312E81"/>
          </linearGradient>

          <linearGradient id="clothesGradient" x1="50" y1="150" x2="150" y2="200" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#EC4899"/>
             <stop offset="100%" stopColor="#BE185D"/>
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Hair (Heart Shape Silhouette) */}
        <path
          d="M100 190 C 60 170 10 130 10 80 C 10 35 45 15 80 25 C 92 28 100 40 100 40 C 100 40 108 28 120 25 C 155 15 190 35 190 80 C 190 130 140 170 100 190 Z"
          fill="url(#hairGradient)"
        />

        {/* Neck */}
        <path d="M85 140 V 160 H 115 V 140" fill="#E6C0A8" />
        <ellipse cx="100" cy="160" rx="15" ry="5" fill="#D4A88E" />

        {/* Shoulders / Clothing */}
        <path d="M50 200 C 50 175 70 160 100 160 C 130 160 150 175 150 200" fill="url(#clothesGradient)" />
        <path d="M100 160 L 90 175 H 110 L 100 160" fill="white" opacity="0.3" />

        {/* Face */}
        <rect x="55" y="45" width="90" height="105" rx="40" ry="45" fill="url(#skinGradient)" />

        {/* Hair Bangs (Voluminous & Stylish) */}
        <path d="M55 60 C 40 100 45 130 55 130 C 50 100 50 50 100 45 C 70 45 55 50 55 60" fill="url(#hairGradient)" />
        <path d="M145 60 C 160 100 155 130 145 130 C 150 100 150 50 100 45 C 130 45 145 50 145 60" fill="url(#hairGradient)" />

        {/* Facial Features */}
        <g transform="translate(0, 5)">
            {/* Eyebrows */}
            <path d="M70 85 Q 80 80 90 85" stroke="#885A43" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M110 85 Q 120 80 130 85" stroke="#885A43" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            <g fill="#1E293B">
                {/* Left */}
                {emotion === 'happy' ? (
                    <path d="M72 100 Q 80 92 88 100" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                ) : (
                    <ellipse cx="80" cy="98" rx="6" ry="8" />
                )}
                {/* Right */}
                {emotion === 'happy' ? (
                    <path d="M112 100 Q 120 92 128 100" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                ) : (
                    <ellipse cx="120" cy="98" rx="6" ry="8" />
                )}
            </g>

            {/* Blush */}
            <ellipse cx="70" cy="115" rx="8" ry="5" fill="#EC4899" opacity="0.15" />
            <ellipse cx="130" cy="115" rx="8" ry="5" fill="#EC4899" opacity="0.15" />

            {/* Nose */}
            <path d="M100 105 Q 98 112 102 115" stroke="#D4A88E" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            <g transform="translate(100, 128)">
                {emotion === 'talking' ? (
                     <path d="M-8 0 Q 0 8 8 0 Q 0 -8 -8 0" fill="#BE123C">
                        <animate attributeName="d" values="M-8 0 Q 0 8 8 0 Q 0 -8 -8 0; M-8 0 Q 0 12 8 0 Q 0 -2 -8 0; M-8 0 Q 0 8 8 0 Q 0 -8 -8 0" dur="0.25s" repeatCount="indefinite" />
                     </path>
                ) : emotion === 'happy' ? (
                     <path d="M-10 -2 Q 0 8 10 -2" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" fill="none" />
                ) : (
                     <path d="M-6 0 Q 0 4 6 0" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" fill="none" />
                )}
            </g>
        </g>

        {/* Headset (Modern Tech) */}
        {/* Ear Cup */}
        <ellipse cx="58" cy="100" rx="10" ry="16" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
        <path d="M58 84 L 58 50 C 58 40 80 30 100 30" stroke="#F1F5F9" strokeWidth="6" strokeLinecap="round" fill="none"/>

        {/* Mic Boom */}
        <path d="M58 110 Q 50 135 80 140" stroke="#E2E8F0" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Mic Tip */}
        <circle cx="80" cy="140" r="5" fill="#1E293B" />
        {/* Live Indicator Light */}
        {(emotion === 'talking' || emotion === 'listening') && (
            <circle cx="80" cy="140" r="2.5" fill="#10B981" filter="url(#glow)">
                 <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
        )}

    </svg>
    </div>
  );
};

export default RobeenAvatar;
