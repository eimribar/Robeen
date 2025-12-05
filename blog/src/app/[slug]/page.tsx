import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts, getAllPostSlugs } from '@/lib/posts';
import BlogPostContent from '@/components/BlogPostContent';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robeen.ai';

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author_name }],
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      images: [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'Robeen Journal',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [post.featured_image],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  };
}

// JSON-LD Structured Data - Article
function generateArticleSchema(post: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    author: {
      '@type': 'Person',
      name: post.author_name,
      jobTitle: post.author_role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Robeen',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
  };
}

// JSON-LD Structured Data - FAQPage (for posts with FAQ blocks)
function generateFAQSchema(post: any) {
  const faqBlocks = post.content_blocks?.filter((b: any) => b.type === 'faq' && b.faqs);
  if (!faqBlocks || faqBlocks.length === 0) return null;

  const allFaqs = faqBlocks.flatMap((block: any) => block.faqs || []);
  if (allFaqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// JSON-LD Structured Data - HowTo (for posts with step_by_step blocks)
function generateHowToSchema(post: any, siteUrl: string) {
  const stepBlocks = post.content_blocks?.filter((b: any) => b.type === 'step_by_step' && b.steps);
  if (!stepBlocks || stepBlocks.length === 0) return null;

  // Use the first step_by_step block for HowTo schema
  const block = stepBlocks[0];
  const steps = block.steps || [];
  if (steps.length === 0) return null;

  // Find a relevant h2 heading before the step block to use as the name
  const blockIndex = post.content_blocks.indexOf(block);
  let howToName = post.title;
  for (let i = blockIndex - 1; i >= 0; i--) {
    if (post.content_blocks[i].type === 'h2') {
      howToName = post.content_blocks[i].text;
      break;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howToName,
    description: post.excerpt,
    image: post.featured_image,
    step: steps.map((step: any, index: number) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      ...(step.image && { image: step.image }),
      ...(step.duration && {
        itemListElement: {
          '@type': 'HowToDirection',
          text: `Duration: ${step.duration}`,
        },
      }),
    })),
  };
}

// Combine all structured data
function generateStructuredData(post: any, siteUrl: string) {
  const schemas: any[] = [generateArticleSchema(post, siteUrl)];

  const faqSchema = generateFAQSchema(post);
  if (faqSchema) schemas.push(faqSchema);

  const howToSchema = generateHowToSchema(post, siteUrl);
  if (howToSchema) schemas.push(howToSchema);

  return schemas;
}

// Server wrapper to fetch data
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robeen.ai';
  const structuredData = generateStructuredData(post, siteUrl);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <BlogPostContent post={post} relatedPosts={relatedPosts} />
      </Suspense>
    </>
  );
}
