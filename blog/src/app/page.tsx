import { getPublishedPosts, getFeaturedPost } from '@/lib/posts';
import BlogPageClient from '@/components/BlogPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Journal | Science-backed Parenting Advice',
  description: 'We translate complex pediatric research into simple, actionable guides optimized for your busy life. Science-backed answers for modern parents.',
};

// Static generation
export const dynamic = 'force-static';

export default async function BlogPage() {
  const [featuredPost, posts] = await Promise.all([
    getFeaturedPost(),
    getPublishedPosts(),
  ]);

  return <BlogPageClient featuredPost={featuredPost} posts={posts} />;
}
