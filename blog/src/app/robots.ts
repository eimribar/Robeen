import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robeen.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/blog/',
        disallow: '/blog/admin/',
      },
    ],
    sitemap: `${siteUrl}/blog/sitemap.xml`,
  };
}
