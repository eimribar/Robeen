import { ROBEEN_FEATURES } from '@/lib/types';

interface RobeenFeatureProps {
  feature: keyof typeof ROBEEN_FEATURES;
  heading?: string;
  description?: string;
  cta?: string;
  ctaUrl?: string;
}

export function RobeenFeature({
  feature,
  heading,
  description,
  cta,
  ctaUrl
}: RobeenFeatureProps) {
  const config = ROBEEN_FEATURES[feature];

  const displayHeading = heading || config.heading;
  const displayDescription = description || config.description;
  const displayCta = cta || config.cta;
  const displayCtaUrl = ctaUrl || config.ctaUrl;

  return (
    <div className="my-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 border border-indigo-100 shadow-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-pink-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-indigo-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-3xl md:text-4xl shadow-lg">
              {config.icon}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                Robeen Feature
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {displayHeading}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {displayDescription}
            </p>
            <a
              href={displayCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {displayCta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* App mockup placeholder */}
          <div className="hidden lg:block flex-shrink-0">
            <div className="w-32 h-56 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 shadow-xl">
              <div className="w-full h-full bg-gradient-to-b from-indigo-500/20 to-pink-500/20 rounded-[22px] flex items-center justify-center">
                <span className="text-6xl">{config.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RobeenFeature;
