'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import RobeenAvatar from '@/components/RobeenAvatar';
import CategoryFilter from '@/components/CategoryFilter';
import { CATEGORIES } from '@/lib/types';
import type { BlogPost } from '@/lib/types';

interface BlogPageClientProps {
  featuredPost: BlogPost | null;
  posts: BlogPost[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export default function BlogPageClient({ featuredPost, posts }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'All'
    ? posts.filter(p => !p.is_featured)
    : posts.filter(p => !p.is_featured && p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-100">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white/80 backdrop-blur-xl border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 cursor-pointer">
            <RobeenAvatar size="sm" emotion="happy" />
            <span className="font-bold text-lg tracking-tight">Robeen</span>
            <span className="hidden md:inline-block mx-2 text-slate-300">|</span>
            <span className="hidden md:inline-block font-serif italic text-slate-500">The Journal</span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-full"
            >
              Back to App
            </a>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* --- HERO SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider text-indigo-600 animate-fade-in-up">
              <Sparkles size={12} fill="currentColor" /> Parenting, De-coded
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-slate-900 animate-fade-in-up delay-100">
              Science-backed answers <br/>
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">for modern parents.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              We translate complex pediatric research into simple, actionable guides optimized for your busy life.
            </p>
          </div>

          {/* Featured Article Card */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="group relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 h-[500px] md:h-[600px] cursor-pointer animate-fade-in-up delay-300">
                <Image
                  src={featuredPost.featured_image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                  <div className="flex items-center gap-3 mb-4 text-sm font-bold tracking-wide uppercase opacity-90">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">{featuredPost.category}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {formatReadTime(featuredPost.read_time_minutes)}</span>
                    <span className="hidden md:inline-block mx-1 opacity-50">•</span>
                    <span className="hidden md:inline-block">{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-4 group-hover:underline decoration-2 underline-offset-4 decoration-pink-500 transition-all">
                    {featuredPost.title}
                  </h2>

                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl mb-8 line-clamp-2 md:line-clamp-none opacity-90">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white border-2 border-white">
                        {featuredPost.author_name[0]}
                      </div>
                      <span className="font-bold">{featuredPost.author_name}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors ml-auto md:ml-0">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}
        </section>

        {/* --- CATEGORY FILTER --- */}
        <section className="max-w-7xl mx-auto px-6 mb-12 sticky top-24 z-30 pointer-events-none">
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* --- GRID LAYOUT --- */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-indigo-600 shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">
                      <span className="flex items-center gap-1"><Clock size={12} /> {formatReadTime(post.read_time_minutes)}</span>
                      <span>•</span>
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                      <span className="text-xs font-bold text-slate-400">By {post.author_name}</span>
                      <div className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Article <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No articles found in this category.</p>
            </div>
          )}

          {/* --- NEWSLETTER CTA --- */}
          <div className="mt-24 bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-pink-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white backdrop-blur-md mb-2 border border-white/10">
                <BookOpen size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
                Get smarter about <br/>
                <span className="font-serif italic text-indigo-400">your baby&apos;s growth.</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Join 50,000+ parents receiving weekly insights, science-backed tips, and development milestones.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ring-indigo-500/50 backdrop-blur-sm"
                />
                <button className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-900/50">
                  Subscribe
                </button>
              </div>
              <p className="text-slate-600 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Robeen AI. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-600">
            <a href="/privacy" className="hover:text-indigo-600">Privacy</a>
            <a href="/terms" className="hover:text-indigo-600">Terms</a>
            <a href="/" className="hover:text-indigo-600">Home</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
