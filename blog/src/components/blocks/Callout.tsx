'use client';

import { Lightbulb, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface CalloutProps {
  text: string;
  variant?: 'tip' | 'warning' | 'info' | 'success';
}

const variantStyles = {
  tip: {
    bg: 'bg-amber-50/50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: 'Pro Tip',
    titleColor: 'text-slate-900',
    textColor: 'text-slate-600',
    icon: Lightbulb,
  },
  warning: {
    bg: 'bg-red-50/50',
    border: 'border-red-100',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Important',
    titleColor: 'text-slate-900',
    textColor: 'text-slate-600',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-indigo-50/50',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    title: 'Good to Know',
    titleColor: 'text-slate-900',
    textColor: 'text-slate-600',
    icon: Info,
  },
  success: {
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    title: 'Success Tip',
    titleColor: 'text-slate-900',
    textColor: 'text-slate-600',
    icon: CheckCircle,
  },
};

export function Callout({ text, variant = 'tip' }: CalloutProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div className={`my-10 md:my-12 rounded-2xl ${styles.bg} border ${styles.border} p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center ${styles.iconColor} shrink-0 shadow-sm mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
        <div>
          <h5 className={`font-bold ${styles.titleColor} text-sm uppercase tracking-wider mb-1.5 flex items-center gap-2`}>
            {styles.title}
          </h5>
          <p className={`${styles.textColor} text-base leading-relaxed font-medium`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
