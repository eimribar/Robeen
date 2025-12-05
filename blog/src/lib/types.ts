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
    | 'pros_cons' | 'tldr' | 'faq';

  // Common fields
  text?: string;
  id?: string;
  items?: string[];

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
}

// Categories for filtering
export const CATEGORIES = ['All', 'Sleep Science', 'Feeding', 'Development', 'Parental Health'] as const;
export type Category = typeof CATEGORIES[number];
