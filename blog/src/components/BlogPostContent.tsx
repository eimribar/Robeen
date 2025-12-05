'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, CheckCircle, Star } from 'lucide-react';
import RobeenAvatar from '@/components/RobeenAvatar';
import { formatDate, formatReadTime } from '@/lib/posts';
import type { BlogPost, ContentBlock } from '@/lib/types';
import {
  ImageBlock,
  ExpertQuote,
  StatHighlight,
  Callout,
  TLDR,
  ComparisonTable,
  ProsCons,
  StepByStep,
  Timeline,
  FAQ,
} from '@/components/blocks';

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll spy for TOC and progress
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = windowHeight > 0 ? window.scrollY / windowHeight : 0;
      setScrollProgress(progress);

      // Update active TOC item
      const headings = document.querySelectorAll('h2');
      headings.forEach(h => {
        const top = h.getBoundingClientRect().top;
        if (top > 0 && top < 200) {
          setActiveSection(h.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post.slug]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const tocItems = post.content_blocks.filter((b) => b.type === 'h2');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">

      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-slate-200 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <RobeenAvatar size="sm" emotion="happy" />
            <span className="font-bold text-lg tracking-tight">Robeen</span>
            <span className="hidden md:inline-block mx-2 text-slate-300">|</span>
            <span className="hidden md:inline-block font-medium text-slate-500 text-sm truncate max-w-[200px]">{post.category}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-full">
              <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Blog</span>
            </Link>
            <button onClick={copyLink} className="md:hidden p-2 rounded-full bg-slate-100"><Share2 size={18}/></button>
          </div>
        </div>
      </header>

      {/* --- PROGRESS BAR --- */}
      <div
        className="fixed top-[64px] left-0 h-1 bg-indigo-600 z-50 transition-all duration-100 origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <main className="pt-24 md:pt-32 pb-20">

        {/* --- HERO --- */}
        <article className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium mb-8">
              {post.subtitle || post.excerpt}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm border-t border-b border-slate-100 py-6">
              <div className="flex items-center gap-3">
                {post.author_image ? (
                  <Image
                    src={post.author_image}
                    alt={post.author_name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white border border-slate-200">
                    {post.author_name[0]}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-slate-900 leading-none">{post.author_name}</p>
                  <p className="text-slate-500 text-xs mt-1">{post.author_role || 'Robeen Team'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-slate-500 font-bold">
                <span className="flex items-center gap-2"><Calendar size={16} /> {formatDate(post.published_at || post.created_at)}</span>
                <span className="flex items-center gap-2"><Clock size={16} /> {formatReadTime(post.read_time_minutes)}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 mb-16 relative animate-fade-in-up delay-100">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

            {/* --- LEFT: STICKY TOC & SHARE --- */}
            <aside className="hidden lg:block lg:col-span-3 relative">
              <div className="sticky top-32 space-y-8">
                {tocItems.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Table of Contents</h4>
                    <nav className="space-y-1">
                      {tocItems.map((block) => (
                        <button
                          key={block.id}
                          onClick={() => scrollToSection(block.id!)}
                          className={`block text-sm text-left w-full py-1.5 px-3 rounded-lg transition-all border-l-2 ${
                            activeSection === block.id
                              ? 'border-indigo-600 text-indigo-700 bg-indigo-50 font-bold'
                              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {block.text}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Share</h4>
                  <div className="flex gap-2">
                    <button onClick={shareToTwitter} className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Twitter size={18} /></button>
                    <button onClick={shareToFacebook} className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-700 transition-colors"><Facebook size={18} /></button>
                    <button onClick={shareToLinkedin} className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-800 transition-colors"><Linkedin size={18} /></button>
                    <button onClick={copyLink} className="p-2 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><LinkIcon size={18} /></button>
                  </div>
                </div>
              </div>
            </aside>

            {/* --- CENTER: CONTENT --- */}
            <div className="col-span-1 lg:col-span-7">

              {/* TL;DR Box (AI Optimized) */}
              {post.key_takeaways && post.key_takeaways.length > 0 && (
                <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 mb-12">
                  <h3 className="flex items-center gap-2 font-bold text-indigo-900 text-lg mb-4">
                    <Star className="text-indigo-600 fill-indigo-600" size={20} /> Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {post.key_takeaways.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-indigo-800/80 font-medium">
                        <CheckCircle size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rich Text Body */}
              <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-3xl prose-img:shadow-xl">
                {post.content_blocks.map((block: ContentBlock, idx: number) => {
                  // Existing block types
                  if (block.type === 'h2') {
                    return <h2 key={idx} id={block.id} className="scroll-mt-32">{block.text}</h2>;
                  }
                  if (block.type === 'h3') {
                    return <h3 key={idx} id={block.id} className="scroll-mt-32">{block.text}</h3>;
                  }
                  if (block.type === 'p') {
                    return <p key={idx}>{block.text}</p>;
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote key={idx} className="border-l-4 border-indigo-500 pl-6 italic text-slate-700 bg-slate-50 py-4 px-6 rounded-r-2xl my-8 not-prose">
                        &ldquo;{block.text}&rdquo;
                      </blockquote>
                    );
                  }
                  if (block.type === 'list' && block.items) {
                    return (
                      <ul key={idx}>
                        {block.items.map((item: string, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    );
                  }

                  // New visual block types
                  if (block.type === 'image' && block.src) {
                    return (
                      <div key={idx} className="not-prose">
                        <ImageBlock
                          src={block.src}
                          alt={block.alt || ''}
                          caption={block.caption}
                        />
                      </div>
                    );
                  }

                  if (block.type === 'expert_quote' && block.expert) {
                    return (
                      <div key={idx} className="not-prose">
                        <ExpertQuote
                          text={block.text || ''}
                          expert={block.expert}
                        />
                      </div>
                    );
                  }

                  if (block.type === 'stat_highlight' && block.stat) {
                    return (
                      <div key={idx} className="not-prose">
                        <StatHighlight stat={block.stat} />
                      </div>
                    );
                  }

                  if (block.type === 'callout') {
                    return (
                      <div key={idx} className="not-prose">
                        <Callout
                          text={block.text || ''}
                          variant={block.variant}
                        />
                      </div>
                    );
                  }

                  if (block.type === 'tldr' && block.tldrItems) {
                    return (
                      <div key={idx} className="not-prose">
                        <TLDR items={block.tldrItems} />
                      </div>
                    );
                  }

                  if (block.type === 'comparison_table' && block.table) {
                    return (
                      <div key={idx} className="not-prose">
                        <ComparisonTable table={block.table} />
                      </div>
                    );
                  }

                  if (block.type === 'pros_cons' && block.pros && block.cons) {
                    return (
                      <div key={idx} className="not-prose">
                        <ProsCons pros={block.pros} cons={block.cons} />
                      </div>
                    );
                  }

                  if (block.type === 'step_by_step' && block.steps) {
                    return (
                      <div key={idx} className="not-prose">
                        <StepByStep steps={block.steps} />
                      </div>
                    );
                  }

                  if (block.type === 'timeline' && block.timelineItems) {
                    return (
                      <div key={idx} className="not-prose">
                        <Timeline items={block.timelineItems} />
                      </div>
                    );
                  }

                  if (block.type === 'faq' && block.faqs) {
                    return (
                      <div key={idx} className="not-prose">
                        <FAQ faqs={block.faqs} />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Article Footer */}
              <div className="mt-16 pt-12 border-t border-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">Still have questions?</h4>
                    <p className="text-slate-500 text-sm">Our AI assistant can read this article and answer specific questions about {post.category.toLowerCase()}.</p>
                  </div>
                  <a
                    href="https://robeen.ai"
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all whitespace-nowrap"
                  >
                    Ask Robeen
                  </a>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 hidden lg:block"></div>
          </div>
        </article>

        {/* --- RELATED ARTICLES --- */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Read next</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/${relatedPost.slug}`} className="group cursor-pointer">
                  <div className="h-48 rounded-2xl bg-slate-100 mb-4 overflow-hidden relative">
                    <Image
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">{relatedPost.category}</p>
                  <h4 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                    {relatedPost.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Robeen AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
