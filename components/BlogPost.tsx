import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, Link, CheckCircle, ChevronRight, BookOpen, Star } from 'lucide-react';
import RobeenAvatar from './RobeenAvatar';

interface BlogPostProps {
  postId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

// --- MOCK CONTENT DATABASE ---
// In a real app, this would be fetched from a CMS (Sanity, Contentful, etc.)
const BLOG_CONTENT: Record<string, any> = {
  "feat-1": {
    title: "The Witching Hour Explained: Why Babies Cry in the Evening",
    subtitle: "It's not colic, and it's not your fault. The developmental science behind late-afternoon fussiness.",
    author: {
        name: "Dr. Sarah Miller",
        role: "Pediatric Sleep Specialist",
        image: "https://i.pravatar.cc/150?img=5"
    },
    date: "October 28, 2023",
    readTime: "8 min read",
    category: "Sleep Science",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
    // GEO Optimization: AI models prioritize bulleted summaries
    keyTakeaways: [
        "The 'Witching Hour' typically peaks between 5 PM and 11 PM.",
        "It usually starts around 2-3 weeks of age and peaks at 6 weeks.",
        "Overstimulation is a primary trigger, not just hunger.",
        "The '5 S's' technique is highly effective during this window."
    ],
    content: [
        {
            type: "h2",
            text: "What is the Witching Hour?",
            id: "what-is-it"
        },
        {
            type: "p",
            text: "If your baby transforms from a peaceful angel to an inconsolable crier every evening around dinner time, you are deep in the trenches of the 'Witching Hour'. This phenomenon is incredibly common, affecting healthy, well-fed babies worldwide. It is characterized by intense fussiness, crying, and difficulty soothing that occurs specifically in the late afternoon or evening."
        },
        {
            type: "h2",
            text: "Why does it happen?",
            id: "why-it-happens"
        },
        {
            type: "p",
            text: "Science suggests this isn't just bad luck. It's biology. By the end of the day, a newborn's nervous system is exhausted. They have been processing sights, sounds, and sensations all day long. The Witching Hour is often a release valve for this accumulated stimulation."
        },
        {
            type: "quote",
            text: "Think of it as an adrenaline crash. The baby is tired, but their body is flooded with cortisol, making it impossible to sleep."
        },
        {
            type: "h2",
            text: "Differentiation: Colic vs. Witching Hour",
            id: "colic-vs-witching"
        },
        {
            type: "p",
            text: "While they look similar, the timing is key. Colic follows the 'Rule of 3': Crying for more than 3 hours a day, 3 days a week, for 3 weeks. The Witching Hour is specifically concentrated in the evening and may not last full 3 hours. However, the soothing techniques for both are remarkably similar."
        },
        {
            type: "h2",
            text: "3 Steps to Survive the Evening",
            id: "survival-guide"
        },
        {
            type: "list",
            items: [
                "<strong>Preempt the Crash:</strong> Don't wait for the crying. Start your winding down routine at 4:30 PM, before the fussiness begins.",
                "<strong>Sensory Deprivation:</strong> Go into a dark room. Turn off the TV. Use white noise. Remove the stimulation that is overwhelming their system.",
                "<strong>Motion is Lotion:</strong> Rhythmic movement (bouncing on a yoga ball, walking in a carrier) overrides the nervous system's alarm bells."
            ]
        },
        {
            type: "h2",
            text: "When to call the doctor",
            id: "medical-advice"
        },
        {
            type: "p",
            text: "If the crying is accompanied by fever, vomiting, or if the baby seems to be in physical pain (pulling legs up intensely to a hard tummy), consult your pediatrician to rule out reflux or other medical issues."
        }
    ]
  },
  "1": {
    title: "Is it Hunger or Comfort? Decoding the Root Reflex",
    subtitle: "Babies often root when seeking comfort, not just food. Here is the definitive guide to distinguishing cues.",
    author: {
        name: "Pediatric Team",
        role: "Robeen Medical Board",
        image: "https://i.pravatar.cc/150?img=12"
    },
    date: "October 25, 2023",
    readTime: "5 min read",
    category: "Feeding",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df4?auto=format&fit=crop&q=80&w=800",
    keyTakeaways: [
        "Rooting is an automatic reflex, not always a hunger signal.",
        "Non-nutritive sucking soothes the nervous system.",
        "Look for 'active' cues like hand-to-mouth movements versus 'passive' rooting.",
        "Comfort nursing is normal, but know the difference to avoid overfeeding."
    ],
    content: [
        {
            type: "h2",
            text: "The Rooting Reflex Explained",
            id: "reflex-explained"
        },
        {
            type: "p",
            text: "Newborns are born with several primitive reflexes. Rooting—turning the head toward a touch on the cheek—is one of the strongest. While nature designed this to help babies find food, it stays 'on' even when they are full. This often confuses parents into thinking a baby is starving just 20 minutes after a full feed."
        },
        {
            type: "h2",
            text: "The Hands Tell the Story",
            id: "hands-cue"
        },
        {
            type: "p",
            text: "Don't just look at the mouth; look at the hands. A hungry baby will often have tight fists or bring hands to their mouth with intensity. A baby seeking comfort might root, but their hands will often be more relaxed or open."
        }
    ]
  },
  "2": {
    title: "The 4-Month Sleep Regression: Survival Guide",
    subtitle: "Your baby isn't 'broken'. Their sleep cycles are maturing.",
    author: {
        name: "Robeen Sleep Expert",
        role: "Sleep Science Team",
        image: "https://i.pravatar.cc/150?img=8"
    },
    date: "October 22, 2023",
    readTime: "6 min read",
    category: "Sleep Science",
    image: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=800",
    keyTakeaways: [
        "The 4-month regression is actually a progression in sleep maturity.",
        "Baby's sleep cycles are reorganizing to adult-like patterns.",
        "This is the perfect time to introduce healthy sleep associations.",
        "It typically lasts 2-6 weeks before improving."
    ],
    content: [
        {
            type: "h2",
            text: "Why 4 Months?",
            id: "why-4-months"
        },
        {
            type: "p",
            text: "Around 4 months of age, your baby's sleep architecture undergoes a permanent change. They transition from newborn sleep cycles (only 2 stages) to adult-like sleep cycles (4-5 stages). This is actually a sign of healthy brain development."
        },
        {
            type: "h2",
            text: "Signs of the Regression",
            id: "signs"
        },
        {
            type: "list",
            items: [
                "<strong>Frequent night wakings:</strong> Baby who slept 6-hour stretches now wakes every 2 hours.",
                "<strong>Short naps:</strong> 45-minute naps become the norm as baby wakes between cycles.",
                "<strong>Difficulty falling asleep:</strong> Previous sleep associations stop working."
            ]
        }
    ]
  },
  "3": {
    title: "Postpartum Anxiety vs. 'New Mom Nerves'",
    subtitle: "When does worry become a medical concern?",
    author: {
        name: "Dr. Emily Weiss",
        role: "Perinatal Psychologist",
        image: "https://i.pravatar.cc/150?img=9"
    },
    date: "October 18, 2023",
    readTime: "7 min read",
    category: "Parental Health",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    keyTakeaways: [
        "Some anxiety is normal and protective in new parents.",
        "Postpartum anxiety affects up to 15-20% of new mothers.",
        "Key differentiator: Does the anxiety interfere with daily functioning?",
        "Treatment is highly effective—don't suffer in silence."
    ],
    content: [
        {
            type: "h2",
            text: "Normal vs. Clinical Anxiety",
            id: "normal-vs-clinical"
        },
        {
            type: "p",
            text: "Every new parent worries. Is the baby breathing? Are they eating enough? This is evolutionarily hardwired. However, when worry becomes constant, intrusive, and prevents you from sleeping even when baby sleeps, it may be postpartum anxiety."
        },
        {
            type: "quote",
            text: "If you're spending more time worrying about hypothetical dangers than enjoying your baby, please talk to someone. This is treatable."
        }
    ]
  },
  "4": {
    title: "Developmental Leaps: Why Your Calm Baby is Suddenly Fussy",
    subtitle: "Physical growth hurts. Mental expansion is scary.",
    author: {
        name: "Robeen Team",
        role: "Development Experts",
        image: "https://i.pravatar.cc/150?img=11"
    },
    date: "October 15, 2023",
    readTime: "4 min read",
    category: "Development",
    image: "https://images.unsplash.com/photo-1594824476961-485e7834571f?auto=format&fit=crop&q=80&w=800",
    keyTakeaways: [
        "Babies go through 10 major developmental leaps in the first 20 months.",
        "Fussiness often precedes new skills by 1-2 weeks.",
        "Extra clinginess is your baby's way of seeking security.",
        "These phases are temporary—usually lasting 1-2 weeks."
    ],
    content: [
        {
            type: "h2",
            text: "What Are Wonder Weeks?",
            id: "wonder-weeks"
        },
        {
            type: "p",
            text: "The 'Wonder Weeks' concept, backed by decades of research, identifies predictable developmental leaps. Before each leap, babies often become fussy, clingy, and difficult. This is because their perception of the world is literally changing."
        }
    ]
  },
  "5": {
    title: "Reflux or Gas? Visual Signs to Look For",
    subtitle: "Back arching is the key differentiator.",
    author: {
        name: "Pediatric Team",
        role: "Robeen Medical Board",
        image: "https://i.pravatar.cc/150?img=12"
    },
    date: "October 10, 2023",
    readTime: "5 min read",
    category: "Feeding",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    keyTakeaways: [
        "Back arching during/after feeds often indicates reflux.",
        "Leg pulling toward tummy suggests gas or digestive discomfort.",
        "Timing matters: reflux discomfort peaks 30-60 minutes after feeding.",
        "Different positions help each condition—don't mix them up."
    ],
    content: [
        {
            type: "h2",
            text: "Reading Your Baby's Body Language",
            id: "body-language"
        },
        {
            type: "p",
            text: "Your baby can't tell you what hurts, but their body shows you. Learning to read these cues is one of the most valuable parenting skills you can develop."
        },
        {
            type: "h2",
            text: "Signs of Gas",
            id: "gas-signs"
        },
        {
            type: "list",
            items: [
                "<strong>Leg movements:</strong> Pulling legs up to chest, then extending them.",
                "<strong>Facial expressions:</strong> Grimacing, red face during episodes.",
                "<strong>Timing:</strong> Can happen any time, often worse in evening."
            ]
        },
        {
            type: "h2",
            text: "Signs of Reflux",
            id: "reflux-signs"
        },
        {
            type: "list",
            items: [
                "<strong>Back arching:</strong> Baby arches backward, especially during or after feeds.",
                "<strong>Feeding aversion:</strong> May start feeding eagerly but then pull away crying.",
                "<strong>Timing:</strong> Worst 30-60 minutes after eating."
            ]
        }
    ]
  }
};

const BlogPost: React.FC<BlogPostProps> = ({ postId, onBack, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const post = BLOG_CONTENT[postId] || BLOG_CONTENT["feat-1"]; // Fallback to featured

  // Scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

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
  }, [postId]);

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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">

      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-slate-200 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <RobeenAvatar size="sm" emotion="happy" />
            <span className="font-bold text-lg tracking-tight">Robeen</span>
            <span className="hidden md:inline-block mx-2 text-slate-300">|</span>
            <span className="hidden md:inline-block font-medium text-slate-500 text-sm truncate max-w-[200px]">{post.category}</span>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-full">
                <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Blog</span>
            </button>
             <button className="md:hidden p-2 rounded-full bg-slate-100"><Share2 size={18}/></button>
          </div>
        </div>
      </header>

      {/* --- PROGRESS BAR --- */}
      <div className="fixed top-[64px] left-0 h-1 bg-indigo-600 z-50 transition-all duration-300 origin-left" style={{ transform: `scaleX(${isScrolled ? 1 : 0})` }} />

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
                    {post.subtitle}
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm border-t border-b border-slate-100 py-6">
                    <div className="flex items-center gap-3">
                        <img src={post.author.image} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div className="text-left">
                            <p className="font-bold text-slate-900 leading-none">{post.author.name}</p>
                            <p className="text-slate-500 text-xs mt-1">{post.author.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-slate-500 font-bold">
                        <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
                        <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 mb-16 relative animate-fade-in-up delay-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

                {/* --- LEFT: STICKY TOC & SHARE --- */}
                <aside className="hidden lg:block lg:col-span-3 relative">
                    <div className="sticky top-32 space-y-8">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Table of Contents</h4>
                            <nav className="space-y-1">
                                {post.content.filter((b:any) => b.type === 'h2').map((block:any) => (
                                    <button
                                        key={block.id}
                                        onClick={() => scrollToSection(block.id)}
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

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Share</h4>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Twitter size={18} /></button>
                                <button className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-700 transition-colors"><Facebook size={18} /></button>
                                <button className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-800 transition-colors"><Linkedin size={18} /></button>
                                <button className="p-2 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><Link size={18} /></button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- CENTER: CONTENT --- */}
                <div className="col-span-1 lg:col-span-7">

                    {/* TL;DR Box (AI Optimized) */}
                    <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 mb-12">
                        <h3 className="flex items-center gap-2 font-bold text-indigo-900 text-lg mb-4">
                            <Star className="text-indigo-600 fill-indigo-600" size={20} /> Key Takeaways
                        </h3>
                        <ul className="space-y-3">
                            {post.keyTakeaways.map((item: string, idx: number) => (
                                <li key={idx} className="flex gap-3 text-indigo-800/80 font-medium">
                                    <CheckCircle size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rich Text Body */}
                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-3xl prose-img:shadow-xl">
                        {post.content.map((block: any, idx: number) => {
                            if (block.type === 'h2') {
                                return <h2 key={idx} id={block.id} className="scroll-mt-32">{block.text}</h2>;
                            }
                            if (block.type === 'p') {
                                return <p key={idx}>{block.text}</p>;
                            }
                            if (block.type === 'quote') {
                                return (
                                    <blockquote key={idx} className="border-l-4 border-indigo-500 pl-6 italic text-slate-700 bg-slate-50 py-4 px-6 rounded-r-2xl my-8 not-prose">
                                        "{block.text}"
                                    </blockquote>
                                );
                            }
                            if (block.type === 'list') {
                                return (
                                    <ul key={idx}>
                                        {block.items.map((item: string, i: number) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
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
                            <button onClick={() => onNavigate('app')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all whitespace-nowrap">
                                Ask Robeen
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2 hidden lg:block"></div>
            </div>
        </article>

        {/* --- RELATED ARTICLES --- */}
        <section className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Read next</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="group cursor-pointer" onClick={onBack}>
                         <div className="h-48 rounded-2xl bg-slate-100 mb-4 overflow-hidden relative">
                             <img src={`https://images.unsplash.com/photo-${1519680000000 + i}?auto=format&fit=crop&w=500`} alt="Related" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                         </div>
                         <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Sleep Science</p>
                         <h4 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                             Understanding the 4-month sleep regression (and how to survive it)
                         </h4>
                     </div>
                 ))}
            </div>
        </section>

      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
             <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Robeen AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
