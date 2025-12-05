-- Migration: Create Blog Content Engine Tables
-- Date: 2024-12-05

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT NOT NULL,

  -- Author (denormalized for performance)
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_image TEXT,

  -- Category
  category TEXT NOT NULL CHECK (category IN ('Sleep Science', 'Feeding', 'Development', 'Parental Health')),
  tags TEXT[],

  -- Media
  featured_image TEXT NOT NULL,
  read_time_minutes INT DEFAULT 5,

  -- GEO-optimized content (matches BlogPost.tsx structure)
  key_takeaways TEXT[] NOT NULL,
  content_blocks JSONB NOT NULL,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  structured_data JSONB,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Topics Table (Research Queue)
CREATE TABLE IF NOT EXISTS blog_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Sleep Science', 'Feeding', 'Development', 'Parental Health')),

  -- DataForSEO research data
  search_volume INT,
  keyword_difficulty DECIMAL(5,2),
  cpc DECIMAL(10,2),
  competition_level TEXT,
  related_keywords JSONB,
  serp_analysis JSONB,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'researched', 'approved', 'generating', 'generated', 'rejected')),
  priority INT DEFAULT 0,

  -- Link to generated post
  generated_post_id UUID REFERENCES blog_posts(id),
  generation_prompt TEXT,
  generation_notes TEXT,

  -- Scheduling
  target_publish_date DATE,
  researched_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_featured ON blog_posts(is_featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_slug ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_topics_status ON blog_topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_priority ON blog_topics(priority DESC);
CREATE INDEX IF NOT EXISTS idx_topics_category ON blog_topics(category);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_topics ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Service role has full access (for content engine)
CREATE POLICY "Service role full access posts" ON blog_posts
  FOR ALL USING (true);

CREATE POLICY "Service role full access topics" ON blog_topics
  FOR ALL USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to both tables
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_topics_updated_at ON blog_topics;
CREATE TRIGGER update_blog_topics_updated_at
    BEFORE UPDATE ON blog_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Blog tables created successfully!';
END $$;
