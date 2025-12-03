import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Clock, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import RobeenAvatar from './RobeenAvatar';

interface BlogProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onPostClick?: (id: string) => void;
}

// --- MOCK DATA ---
const CATEGORIES = ["All", "Sleep Science", "Feeding", "Development", "Parental Health"];

const FEATURED_POST = {
  id: "feat-1",
  title: "The witching hour explained: Why babies cry in the evening",
  excerpt: "It's not colic, and it's not your fault. Learn the developmental science behind late-afternoon fussiness and the 3-step 'reset' technique to soothe an overstimulated nervous system.",
  category: "Sleep Science",
  readTime: "8 min read",
  author: "Dr. Sarah Miller",
  date: "Oct 28, 2023",
  image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"
};

const POSTS = [
  {
    id: "1",
    title: "Is it Hunger or Comfort? decoding the root reflex",
    excerpt: "Babies often root when seeking comfort, not just food. Here is the definitive guide to distinguishing hunger cues from soothing behaviors to prevent overfeeding.",
    category: "Feeding",
    readTime: "5 min",
    date: "Oct 25, 2023",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df4?auto=format&fit=crop&q=80&w=800",
    author: "Pediatric Team"
  },
  {
    id: "2",
    title: "The 4-Month Sleep Regression: Survival Guide",
    excerpt: "Your baby isn't 'broken'. Their sleep cycles are maturing. We break down the biology of the 4-month mark and how to gently transition to independent sleep associations.",
    category: "Sleep Science",
    readTime: "6 min",
    date: "Oct 22, 2023",
    image: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=800",
    author: "Robeen Sleep Expert"
  },
  {
    id: "3",
    title: "Postpartum Anxiety vs. 'New Mom Nerves'",
    excerpt: "When does worry become a medical concern? A compassionate look at maternal mental health, with a checklist of symptoms that warrant a conversation with your doctor.",
    category: "Parental Health",
    readTime: "7 min",
    date: "Oct 18, 2023",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    author: "Dr. Emily Weiss"
  },
  {
    id: "4",
    title: "Developmental Leaps: Why your calm baby is suddenly fussy",
    excerpt: "Physical growth hurts. Mental expansion is scary. Understanding the 'Wonder Weeks' helps you empathize with the tears instead of fixing them.",
    category: "Development",
    readTime: "4 min",
    date: "Oct 15, 2023",
    image: "https://images.unsplash.com/photo-1594824476961-485e7834571f?auto=format&fit=crop&q=80&w=800",
    author: "Robeen Team"
  },
  {
    id: "5",
    title: "Reflux or Gas? Visual signs to look for",
    excerpt: "Back arching is the key. We analyze the subtle body language differences between trapped wind and acid reflux, and which position works best for each.",
    category: "Feeding",
    readTime: "5 min",
    date: "Oct 10, 2023",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    author: "Pediatric Team"
  }
];

const Blog: React.FC<BlogProps> = ({ onBack, onNavigate, onPostClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = activeCategory === "All"
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-100">

      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-slate-200 py-3' : 'bg-white border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <RobeenAvatar size="sm" emotion="happy" />
            <span className="font-bold text-lg tracking-tight">Robeen</span>
            <span className="hidden md:inline-block mx-2 text-slate-300">|</span>
            <span className="hidden md:inline-block font-serif italic text-slate-500">The Journal</span>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:ring-2 ring-indigo-500/20 transition-all">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
                />
             </div>
             <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-full"
            >
                <ArrowLeft size={16} /> Back to App
            </button>
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
            <article
                onClick={() => onPostClick && onPostClick(FEATURED_POST.id)}
                className="group relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 h-[500px] md:h-[600px] cursor-pointer animate-fade-in-up delay-300"
            >
                <img
                    src={FEATURED_POST.image}
                    alt={FEATURED_POST.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="flex items-center gap-3 mb-4 text-sm font-bold tracking-wide uppercase opacity-90">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">{FEATURED_POST.category}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {FEATURED_POST.readTime}</span>
                        <span className="hidden md:inline-block mx-1 opacity-50">•</span>
                        <span className="hidden md:inline-block">{FEATURED_POST.date}</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-4 group-hover:underline decoration-2 underline-offset-4 decoration-pink-500 transition-all">
                        {FEATURED_POST.title}
                    </h2>

                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl mb-8 line-clamp-2 md:line-clamp-none opacity-90">
                        {FEATURED_POST.excerpt}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white border-2 border-white">
                                {FEATURED_POST.author[0]}
                            </div>
                            <span className="font-bold">{FEATURED_POST.author}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors ml-auto md:ml-0">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </article>
        </section>

        {/* --- CATEGORY FILTER --- */}
        <section className="max-w-7xl mx-auto px-6 mb-12 sticky top-24 z-30 pointer-events-none">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 pointer-events-auto no-scrollbar mask-image-fade">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm border ${
                            activeCategory === cat
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>

        {/* --- GRID LAYOUT --- */}
        <section className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                    <article
                        key={post.id}
                        onClick={() => onPostClick && onPostClick(post.id)}
                        className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-indigo-600 shadow-sm">
                                {post.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col">
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">
                                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                {post.title}
                            </h3>

                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                <span className="text-xs font-bold text-slate-400">By {post.author}</span>
                                <div className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read Article <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* --- NEWSLETTER CTA (SEO Sticky) --- */}
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
                        <span className="font-serif italic text-indigo-400">your baby's growth.</span>
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

      {/* Footer (Simplified) */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Robeen AI. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-bold text-slate-600">
                <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600">Privacy</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600">Terms</button>
                <button onClick={onBack} className="hover:text-indigo-600">Home</button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
