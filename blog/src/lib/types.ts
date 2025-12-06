// Funnel stages for content strategy
export type FunnelStage = 'tofu' | 'mofu' | 'bofu';

// Blog post types matching the database schema
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  author_name: string;
  author_role: string | null;
  author_image: string | null;
  category: 'Sleep Science' | 'Feeding' | 'Development' | 'Parental Health';
  tags: string[] | null;
  featured_image: string;
  read_time_minutes: number;
  key_takeaways: string[];
  content_blocks: ContentBlock[];
  meta_title: string | null;
  meta_description: string | null;
  structured_data: Record<string, unknown> | null;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  is_featured: boolean;
  is_pillar: boolean; // Indicates if this is a pillar page
  funnel_stage: FunnelStage; // Content funnel stage
  published_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  type:
    // Existing
    | 'h2' | 'h3' | 'p' | 'quote' | 'list'
    // Visual
    | 'image' | 'comparison_table' | 'timeline'
    // Structure
    | 'callout' | 'expert_quote' | 'stat_highlight' | 'step_by_step'
    | 'pros_cons' | 'tldr' | 'faq'
    // Product & Linking
    | 'robeen_feature' | 'internal_link';

  // Common fields
  text?: string;
  id?: string;
  items?: string[];

  // Robeen Feature fields
  feature?: 'sleep_tracking' | 'wake_windows' | 'feeding_timer' | 'milestone_tracker' | 'wellness_checkin';
  heading?: string;
  description?: string;
  cta?: string;
  ctaUrl?: string;

  // Internal Link fields
  href?: string;
  context?: 'inline' | 'callout' | 'related';

  // Image fields
  src?: string;
  alt?: string;
  caption?: string;

  // Expert quote fields
  expert?: {
    name: string;
    title: string;
    organization: string;
    image?: string;
  };

  // Stat fields
  stat?: {
    value: string;
    label: string;
    source: string;
    sourceUrl?: string;
  };

  // Table fields (for comparison_table)
  table?: {
    title?: string;
    headers: string[];
    rows: string[][];
  };

  // FAQ fields (always visible, not accordion)
  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  // Callout fields
  variant?: 'tip' | 'warning' | 'info' | 'success';

  // Step fields (for step_by_step)
  steps?: Array<{
    title: string;
    description: string;
    image?: string;
    duration?: string;
  }>;

  // Pros/Cons fields
  pros?: string[];
  cons?: string[];

  // Timeline fields
  timelineItems?: Array<{
    label: string;
    title: string;
    description: string;
  }>;

  // TLDR fields
  tldrItems?: string[];
}

export interface BlogTopic {
  id: string;
  keyword: string;
  category: 'Sleep Science' | 'Feeding' | 'Development' | 'Parental Health';
  search_volume: number | null;
  keyword_difficulty: number | null;
  cpc: number | null;
  competition_level: string | null;
  related_keywords: Record<string, unknown> | null;
  serp_analysis: Record<string, unknown> | null;
  status: 'pending' | 'researched' | 'approved' | 'generating' | 'generated' | 'rejected';
  priority: number;
  generated_post_id: string | null;
  generation_prompt: string | null;
  generation_notes: string | null;
  target_publish_date: string | null;
  researched_at: string | null;
  created_at: string;
  updated_at: string;
  // Content strategy fields
  funnel_stage: FunnelStage;
  pillar_id: string | null; // References the pillar page this topic belongs to
  cluster_keywords: string[] | null; // Related keywords in this cluster
}

// Internal link tracking
export interface BlogLink {
  id: string;
  source_post_id: string;
  target_post_id: string;
  anchor_text: string;
  link_type: 'inline' | 'callout' | 'related';
  created_at: string;
}

// Robeen feature configuration for product mentions
export const ROBEEN_FEATURES = {
  sleep_tracking: {
    icon: '🌙',
    heading: 'Track Sleep Patterns with Robeen',
    description: 'Automatically log sleep windows, track patterns over time, and get personalized insights.',
    cta: 'Try Sleep Tracking Free',
    ctaUrl: 'https://robeen.ai/download?feature=sleep'
  },
  wake_windows: {
    icon: '⏰',
    heading: 'Never Miss a Wake Window',
    description: 'Robeen alerts you when your baby is approaching their ideal sleep time based on age.',
    cta: 'Get Wake Window Alerts',
    ctaUrl: 'https://robeen.ai/download?feature=wake'
  },
  feeding_timer: {
    icon: '🍼',
    heading: 'Track Feeding Sessions',
    description: 'Log breastfeeding and bottle sessions with one tap. Track duration, side, and amount.',
    cta: 'Start Tracking Feeds',
    ctaUrl: 'https://robeen.ai/download?feature=feeding'
  },
  milestone_tracker: {
    icon: '🎯',
    heading: 'Track Developmental Milestones',
    description: 'Log milestones, view age-appropriate activities, and monitor your baby\'s progress.',
    cta: 'Track Milestones',
    ctaUrl: 'https://robeen.ai/download?feature=milestones'
  },
  wellness_checkin: {
    icon: '💚',
    heading: 'Parent Wellness Check-ins',
    description: 'Take care of yourself too. Robeen helps you track mood, sleep, and self-care.',
    cta: 'Start Wellness Tracking',
    ctaUrl: 'https://robeen.ai/download?feature=wellness'
  }
} as const;

// Categories for filtering
export const CATEGORIES = ['All', 'Sleep Science', 'Feeding', 'Development', 'Parental Health'] as const;
export type Category = typeof CATEGORIES[number];
