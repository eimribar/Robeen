import Link from 'next/link';

interface InternalLinkProps {
  text: string;
  href: string;
  context?: 'inline' | 'callout' | 'related';
}

export function InternalLink({ text, href, context = 'inline' }: InternalLinkProps) {
  if (context === 'inline') {
    return (
      <Link
        href={href}
        className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 hover:decoration-indigo-600 underline-offset-2 transition-colors duration-200"
      >
        {text}
      </Link>
    );
  }

  if (context === 'callout') {
    return (
      <div className="my-6 p-4 bg-gradient-to-r from-indigo-50 to-pink-50 border-l-4 border-indigo-500 rounded-r-lg">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <span className="text-gray-700">Related: </span>
            <Link
              href={href}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline decoration-indigo-300 hover:decoration-indigo-600 underline-offset-2 transition-colors duration-200"
            >
              {text}
            </Link>
          </div>
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  // Related context - for use in related posts section
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
    >
      <svg className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
        {text}
      </span>
    </Link>
  );
}

export default InternalLink;
