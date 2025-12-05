// Migration Script: Seed blog_posts table with existing mock data
// Run with: node scripts/migrate-blog-content.js

const MOCK_CONTENT = {
  "feat-1": {
    slug: "witching-hour-explained-why-babies-cry-evening",
    title: "The Witching Hour Explained: Why Babies Cry in the Evening",
    subtitle: "It's not colic, and it's not your fault. The developmental science behind late-afternoon fussiness.",
    excerpt: "It's not colic, and it's not your fault. Learn the developmental science behind late-afternoon fussiness and the 3-step 'reset' technique to soothe an overstimulated nervous system.",
    author_name: "Dr. Sarah Miller",
    author_role: "Pediatric Sleep Specialist",
    author_image: "https://i.pravatar.cc/150?img=5",
    category: "Sleep Science",
    tags: ["witching hour", "evening crying", "baby fussiness", "colic", "newborn sleep"],
    featured_image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
    read_time_minutes: 8,
    key_takeaways: [
      "The 'Witching Hour' typically peaks between 5 PM and 11 PM.",
      "It usually starts around 2-3 weeks of age and peaks at 6 weeks.",
      "Overstimulation is a primary trigger, not just hunger.",
      "The '5 S's' technique is highly effective during this window."
    ],
    content_blocks: [
      { type: "h2", text: "What is the Witching Hour?", id: "what-is-it" },
      { type: "p", text: "If your baby transforms from a peaceful angel to an inconsolable crier every evening around dinner time, you are deep in the trenches of the 'Witching Hour'. This phenomenon is incredibly common, affecting healthy, well-fed babies worldwide. It is characterized by intense fussiness, crying, and difficulty soothing that occurs specifically in the late afternoon or evening." },
      { type: "h2", text: "Why does it happen?", id: "why-it-happens" },
      { type: "p", text: "Science suggests this isn't just bad luck. It's biology. By the end of the day, a newborn's nervous system is exhausted. They have been processing sights, sounds, and sensations all day long. The Witching Hour is often a release valve for this accumulated stimulation." },
      { type: "quote", text: "Think of it as an adrenaline crash. The baby is tired, but their body is flooded with cortisol, making it impossible to sleep." },
      { type: "h2", text: "Differentiation: Colic vs. Witching Hour", id: "colic-vs-witching" },
      { type: "p", text: "While they look similar, the timing is key. Colic follows the 'Rule of 3': Crying for more than 3 hours a day, 3 days a week, for 3 weeks. The Witching Hour is specifically concentrated in the evening and may not last full 3 hours. However, the soothing techniques for both are remarkably similar." },
      { type: "h2", text: "3 Steps to Survive the Evening", id: "survival-guide" },
      { type: "list", items: [
        "<strong>Preempt the Crash:</strong> Don't wait for the crying. Start your winding down routine at 4:30 PM, before the fussiness begins.",
        "<strong>Sensory Deprivation:</strong> Go into a dark room. Turn off the TV. Use white noise. Remove the stimulation that is overwhelming their system.",
        "<strong>Motion is Lotion:</strong> Rhythmic movement (bouncing on a yoga ball, walking in a carrier) overrides the nervous system's alarm bells."
      ]},
      { type: "h2", text: "When to call the doctor", id: "medical-advice" },
      { type: "p", text: "If the crying is accompanied by fever, vomiting, or if the baby seems to be in physical pain (pulling legs up intensely to a hard tummy), consult your pediatrician to rule out reflux or other medical issues." }
    ],
    meta_title: "The Witching Hour Explained: Why Babies Cry Every Evening | Robeen",
    meta_description: "Learn why babies cry in the evening during the 'witching hour' and discover 3 science-backed techniques to soothe your fussy baby.",
    status: "published",
    is_featured: true,
    published_at: "2023-10-28T12:00:00Z"
  },
  "1": {
    slug: "hunger-or-comfort-decoding-root-reflex",
    title: "Is it Hunger or Comfort? Decoding the Root Reflex",
    subtitle: "Babies often root when seeking comfort, not just food. Here is the definitive guide to distinguishing cues.",
    excerpt: "Babies often root when seeking comfort, not just food. Here is the definitive guide to distinguishing hunger cues from soothing behaviors to prevent overfeeding.",
    author_name: "Pediatric Team",
    author_role: "Robeen Medical Board",
    author_image: "https://i.pravatar.cc/150?img=12",
    category: "Feeding",
    tags: ["rooting reflex", "hunger cues", "comfort nursing", "baby feeding", "overfeeding"],
    featured_image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df4?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 5,
    key_takeaways: [
      "Rooting is an automatic reflex, not always a hunger signal.",
      "Non-nutritive sucking soothes the nervous system.",
      "Look for 'active' cues like hand-to-mouth movements versus 'passive' rooting.",
      "Comfort nursing is normal, but know the difference to avoid overfeeding."
    ],
    content_blocks: [
      { type: "h2", text: "The Rooting Reflex Explained", id: "reflex-explained" },
      { type: "p", text: "Newborns are born with several primitive reflexes. Rooting—turning the head toward a touch on the cheek—is one of the strongest. While nature designed this to help babies find food, it stays 'on' even when they are full. This often confuses parents into thinking a baby is starving just 20 minutes after a full feed." },
      { type: "h2", text: "The Hands Tell the Story", id: "hands-cue" },
      { type: "p", text: "Don't just look at the mouth; look at the hands. A hungry baby will often have tight fists or bring hands to their mouth with intensity. A baby seeking comfort might root, but their hands will often be more relaxed or open." }
    ],
    meta_title: "Is Baby Hungry or Seeking Comfort? Decoding the Root Reflex | Robeen",
    meta_description: "Learn to distinguish between hunger cues and comfort-seeking behavior in babies. Understand the rooting reflex and prevent overfeeding.",
    status: "published",
    is_featured: false,
    published_at: "2023-10-25T12:00:00Z"
  },
  "2": {
    slug: "4-month-sleep-regression-survival-guide",
    title: "The 4-Month Sleep Regression: Survival Guide",
    subtitle: "Your baby isn't 'broken'. Their sleep cycles are maturing.",
    excerpt: "Your baby isn't 'broken'. Their sleep cycles are maturing. We break down the biology of the 4-month mark and how to gently transition to independent sleep associations.",
    author_name: "Robeen Sleep Expert",
    author_role: "Sleep Science Team",
    author_image: "https://i.pravatar.cc/150?img=8",
    category: "Sleep Science",
    tags: ["4 month regression", "baby sleep", "sleep cycles", "sleep training", "baby development"],
    featured_image: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 6,
    key_takeaways: [
      "The 4-month regression is actually a progression in sleep maturity.",
      "Baby's sleep cycles are reorganizing to adult-like patterns.",
      "This is the perfect time to introduce healthy sleep associations.",
      "It typically lasts 2-6 weeks before improving."
    ],
    content_blocks: [
      { type: "h2", text: "Why 4 Months?", id: "why-4-months" },
      { type: "p", text: "Around 4 months of age, your baby's sleep architecture undergoes a permanent change. They transition from newborn sleep cycles (only 2 stages) to adult-like sleep cycles (4-5 stages). This is actually a sign of healthy brain development." },
      { type: "h2", text: "Signs of the Regression", id: "signs" },
      { type: "list", items: [
        "<strong>Frequent night wakings:</strong> Baby who slept 6-hour stretches now wakes every 2 hours.",
        "<strong>Short naps:</strong> 45-minute naps become the norm as baby wakes between cycles.",
        "<strong>Difficulty falling asleep:</strong> Previous sleep associations stop working."
      ]}
    ],
    meta_title: "The 4-Month Sleep Regression: Complete Survival Guide | Robeen",
    meta_description: "Understand why the 4-month sleep regression happens and learn proven strategies to help your baby (and you) get through it.",
    status: "published",
    is_featured: false,
    published_at: "2023-10-22T12:00:00Z"
  },
  "3": {
    slug: "postpartum-anxiety-vs-new-mom-nerves",
    title: "Postpartum Anxiety vs. 'New Mom Nerves'",
    subtitle: "When does worry become a medical concern?",
    excerpt: "When does worry become a medical concern? A compassionate look at maternal mental health, with a checklist of symptoms that warrant a conversation with your doctor.",
    author_name: "Dr. Emily Weiss",
    author_role: "Perinatal Psychologist",
    author_image: "https://i.pravatar.cc/150?img=9",
    category: "Parental Health",
    tags: ["postpartum anxiety", "maternal mental health", "new mom", "anxiety symptoms", "perinatal care"],
    featured_image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 7,
    key_takeaways: [
      "Some anxiety is normal and protective in new parents.",
      "Postpartum anxiety affects up to 15-20% of new mothers.",
      "Key differentiator: Does the anxiety interfere with daily functioning?",
      "Treatment is highly effective—don't suffer in silence."
    ],
    content_blocks: [
      { type: "h2", text: "Normal vs. Clinical Anxiety", id: "normal-vs-clinical" },
      { type: "p", text: "Every new parent worries. Is the baby breathing? Are they eating enough? This is evolutionarily hardwired. However, when worry becomes constant, intrusive, and prevents you from sleeping even when baby sleeps, it may be postpartum anxiety." },
      { type: "quote", text: "If you're spending more time worrying about hypothetical dangers than enjoying your baby, please talk to someone. This is treatable." }
    ],
    meta_title: "Postpartum Anxiety vs. Normal New Mom Worries | Robeen",
    meta_description: "Learn to recognize the difference between normal new parent worry and postpartum anxiety. Includes symptoms checklist and when to seek help.",
    status: "published",
    is_featured: false,
    published_at: "2023-10-18T12:00:00Z"
  },
  "4": {
    slug: "developmental-leaps-calm-baby-suddenly-fussy",
    title: "Developmental Leaps: Why Your Calm Baby is Suddenly Fussy",
    subtitle: "Physical growth hurts. Mental expansion is scary.",
    excerpt: "Physical growth hurts. Mental expansion is scary. Understanding the 'Wonder Weeks' helps you empathize with the tears instead of fixing them.",
    author_name: "Robeen Team",
    author_role: "Development Experts",
    author_image: "https://i.pravatar.cc/150?img=11",
    category: "Development",
    tags: ["wonder weeks", "developmental leaps", "baby milestones", "fussy baby", "baby development"],
    featured_image: "https://images.unsplash.com/photo-1594824476961-485e7834571f?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 4,
    key_takeaways: [
      "Babies go through 10 major developmental leaps in the first 20 months.",
      "Fussiness often precedes new skills by 1-2 weeks.",
      "Extra clinginess is your baby's way of seeking security.",
      "These phases are temporary—usually lasting 1-2 weeks."
    ],
    content_blocks: [
      { type: "h2", text: "What Are Wonder Weeks?", id: "wonder-weeks" },
      { type: "p", text: "The 'Wonder Weeks' concept, backed by decades of research, identifies predictable developmental leaps. Before each leap, babies often become fussy, clingy, and difficult. This is because their perception of the world is literally changing." }
    ],
    meta_title: "Developmental Leaps: Why Babies Get Fussy Before Milestones | Robeen",
    meta_description: "Understand Wonder Weeks and developmental leaps. Learn why your calm baby suddenly becomes fussy before reaching new milestones.",
    status: "published",
    is_featured: false,
    published_at: "2023-10-15T12:00:00Z"
  },
  "5": {
    slug: "reflux-or-gas-visual-signs-to-look-for",
    title: "Reflux or Gas? Visual Signs to Look For",
    subtitle: "Back arching is the key differentiator.",
    excerpt: "Back arching is the key. We analyze the subtle body language differences between trapped wind and acid reflux, and which position works best for each.",
    author_name: "Pediatric Team",
    author_role: "Robeen Medical Board",
    author_image: "https://i.pravatar.cc/150?img=12",
    category: "Feeding",
    tags: ["baby reflux", "baby gas", "digestive issues", "body language", "feeding problems"],
    featured_image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 5,
    key_takeaways: [
      "Back arching during/after feeds often indicates reflux.",
      "Leg pulling toward tummy suggests gas or digestive discomfort.",
      "Timing matters: reflux discomfort peaks 30-60 minutes after feeding.",
      "Different positions help each condition—don't mix them up."
    ],
    content_blocks: [
      { type: "h2", text: "Reading Your Baby's Body Language", id: "body-language" },
      { type: "p", text: "Your baby can't tell you what hurts, but their body shows you. Learning to read these cues is one of the most valuable parenting skills you can develop." },
      { type: "h2", text: "Signs of Gas", id: "gas-signs" },
      { type: "list", items: [
        "<strong>Leg movements:</strong> Pulling legs up to chest, then extending them.",
        "<strong>Facial expressions:</strong> Grimacing, red face during episodes.",
        "<strong>Timing:</strong> Can happen any time, often worse in evening."
      ]},
      { type: "h2", text: "Signs of Reflux", id: "reflux-signs" },
      { type: "list", items: [
        "<strong>Back arching:</strong> Baby arches backward, especially during or after feeds.",
        "<strong>Feeding aversion:</strong> May start feeding eagerly but then pull away crying.",
        "<strong>Timing:</strong> Worst 30-60 minutes after eating."
      ]}
    ],
    meta_title: "Reflux vs Gas in Babies: Visual Signs Guide | Robeen",
    meta_description: "Learn to tell the difference between reflux and gas in babies. Visual guide to baby body language and the best positions for each condition.",
    status: "published",
    is_featured: false,
    published_at: "2023-10-10T12:00:00Z"
  }
};

async function migratePosts() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
  }

  console.log('Starting migration to:', SUPABASE_URL);

  for (const [id, post] of Object.entries(MOCK_CONTENT)) {
    console.log(`\nInserting post: ${post.slug}`);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        excerpt: post.excerpt,
        author_name: post.author_name,
        author_role: post.author_role,
        author_image: post.author_image,
        category: post.category,
        tags: post.tags,
        featured_image: post.featured_image,
        read_time_minutes: post.read_time_minutes,
        key_takeaways: post.key_takeaways,
        content_blocks: post.content_blocks,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        status: post.status,
        is_featured: post.is_featured,
        published_at: post.published_at
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`  ✓ Inserted: ${data[0]?.id || 'success'}`);
    } else {
      const error = await response.text();
      console.error(`  ✗ Failed: ${error}`);
    }
  }

  console.log('\n✅ Migration complete!');
}

migratePosts().catch(console.error);
