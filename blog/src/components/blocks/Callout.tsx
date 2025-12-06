'use client';

interface CalloutProps {
  text: string;
  variant?: 'tip' | 'warning' | 'info' | 'success';
}

const variantStyles = {
  tip: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '💡',
    title: 'Pro Tip',
    titleColor: 'text-amber-800',
    textColor: 'text-amber-900',
  },
  warning: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '⚠️',
    title: 'Important',
    titleColor: 'text-red-800',
    textColor: 'text-red-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'ℹ️',
    title: 'Good to Know',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-900',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '✅',
    title: 'Success Tip',
    titleColor: 'text-green-800',
    textColor: 'text-green-900',
  },
};

export function Callout({ text, variant = 'tip' }: CalloutProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`my-8 md:my-10 rounded-xl ${styles.bg} border ${styles.border} p-5 md:p-6 shadow-sm overflow-hidden relative`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-2xl" role="img" aria-label={styles.title}>
            {styles.icon}
          </span>
        </div>
        <div>
          <h5 className={`font-bold ${styles.titleColor} text-base mb-1.5`}>
            {styles.title}
          </h5>
          <p className={`${styles.textColor} text-base leading-relaxed`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
