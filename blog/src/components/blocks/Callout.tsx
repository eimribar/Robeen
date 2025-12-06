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
    <div className={`my-8 md:my-10 rounded-2xl ${styles.bg} border ${styles.border} p-6 md:p-8`}>
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">{styles.icon}</span>
        <div>
          <p className={`font-semibold ${styles.titleColor} mb-2`}>
            {styles.title}
          </p>
          <p className={`${styles.textColor} leading-relaxed`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
