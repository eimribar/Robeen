#!/usr/bin/env node
/**
 * generate-pillar.js
 * Generates comprehensive pillar pages for topical authority
 *
 * Pillar pages are long-form (3000-4000 words) comprehensive guides
 * that serve as the hub for topic clusters.
 *
 * Usage:
 *   node scripts/generate-pillar.js --category "Sleep Science"
 *   node scripts/generate-pillar.js --list  # List pillar page suggestions
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Pillar page configurations by category
const PILLAR_CONFIGS = {
  'Sleep Science': {
    title: 'The Ultimate Baby Sleep Guide: From Newborn to Toddler',
    slug: 'ultimate-baby-sleep-guide',
    keyword: 'baby sleep guide',
    targetKeywords: [
      'newborn sleep schedule', 'baby sleep training', 'sleep regression',
      'wake windows', 'nap schedule', 'sleep through the night'
    ],
    sections: [
      'Understanding Baby Sleep Science',
      'Newborn Sleep (0-3 Months)',
      'Sleep Training Methods Compared',
      'Managing Sleep Regressions',
      'Wake Windows by Age',
      'Nap Schedules That Work',
      'Getting Baby to Sleep Through the Night',
      'Common Sleep Problems & Solutions',
      'Creating the Perfect Sleep Environment'
    ]
  },
  'Feeding': {
    title: 'Complete Baby Feeding Guide: Breast, Bottle & Beyond',
    slug: 'complete-feeding-guide',
    keyword: 'baby feeding guide',
    targetKeywords: [
      'breastfeeding tips', 'formula feeding', 'feeding schedule',
      'starting solids', 'baby nutrition', 'feeding problems'
    ],
    sections: [
      'Breastfeeding Fundamentals',
      'Formula Feeding 101',
      'Feeding Schedules by Age',
      'Starting Solid Foods',
      'Common Feeding Challenges',
      'Nutrition for Growing Babies',
      'Weaning with Confidence',
      'Feeding Gear & Equipment',
      'When to Seek Help'
    ]
  },
  'Development': {
    title: 'Baby Development Milestones: Month-by-Month Guide',
    slug: 'baby-development-milestones-guide',
    keyword: 'baby development milestones',
    targetKeywords: [
      'baby milestones', 'motor development', 'cognitive development',
      'language development', 'baby activities', 'developmental delays'
    ],
    sections: [
      'How Babies Develop',
      'Physical Milestones by Month',
      'Cognitive Development Stages',
      'Language & Communication',
      'Social & Emotional Growth',
      'Activities to Encourage Development',
      'When Milestones Are Delayed',
      'Tracking Your Baby\'s Progress',
      'Supporting Each Stage'
    ]
  },
  'Parental Health': {
    title: 'New Parent Survival Guide: Self-Care & Mental Health',
    slug: 'new-parent-survival-guide',
    keyword: 'new parent tips',
    targetKeywords: [
      'postpartum recovery', 'parent mental health', 'sleep deprivation',
      'work-life balance', 'partner relationship', 'self-care for parents'
    ],
    sections: [
      'The Reality of New Parenthood',
      'Postpartum Recovery Timeline',
      'Managing Sleep Deprivation',
      'Recognizing Postpartum Depression',
      'Self-Care When You Have No Time',
      'Keeping Your Relationship Strong',
      'Returning to Work',
      'Building Your Support Network',
      'Finding Joy in the Chaos'
    ]
  }
};

// Category-specific images
const CATEGORY_IMAGES = {
  'Sleep Science': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200',
  'Feeding': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df4?auto=format&fit=crop&q=80&w=1200',
  'Development': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200',
  'Parental Health': 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=1200',
};

// Default author
const DEFAULT_AUTHOR = {
  name: 'Dr. Sarah Chen',
  role: 'Pediatric Sleep Specialist',
};

function buildPillarPrompt(category, config, clusterPosts) {
  // Build list of existing cluster posts to link to
  const clusterLinks = clusterPosts.map(p => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt?.substring(0, 100)
  }));

  return `You are an expert parenting content writer creating a PILLAR PAGE for Robeen, a science-backed parenting app. Pillar pages are comprehensive, authoritative guides that serve as the hub for related content.

PILLAR PAGE TOPIC: ${config.title}
CATEGORY: ${category}
PRIMARY KEYWORD: ${config.keyword}
TARGET KEYWORDS TO INCLUDE: ${config.targetKeywords.join(', ')}

SECTIONS TO COVER:
${config.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

EXISTING CLUSTER POSTS TO LINK TO:
${clusterLinks.length > 0 ? clusterLinks.map(p => `- "${p.title}" (/blog/${p.slug})`).join('\n') : 'No cluster posts yet - use placeholder links that will be updated later'}

TARGET AUDIENCE: New parents (0-2 years) who want science-backed, actionable advice

===== PILLAR PAGE REQUIREMENTS =====

This is a COMPREHENSIVE GUIDE that should:
1. Be 3000-4000 words (longer than regular posts)
2. Cover the topic exhaustively but accessibly
3. Use clear hierarchical structure (H2 for main sections, H3 for subsections)
4. Include jump links / table of contents functionality
5. Reference and link to cluster posts throughout
6. Be the definitive resource that AI systems will cite

GEO OPTIMIZATION (for AI citations):
- Start EVERY section with a direct, quotable answer (40-60 words)
- Include statistics with sources every 150-200 words
- Use expert quotes with full credentials
- FAQ section should match "People Also Ask" queries
- Each section should be independently quotable

OUTPUT FORMAT: Return ONLY valid JSON with this structure:

{
  "title": "${config.title}",
  "subtitle": "Compelling subtitle",
  "excerpt": "150-200 char summary for meta description",
  "meta_title": "SEO title with primary keyword (max 60 chars)",
  "meta_description": "Meta description with call-to-action (max 155 chars)",
  "key_takeaways": [
    "6-8 key points for this comprehensive guide",
    "Each is a standalone, actionable insight"
  ],
  "content_blocks": [
    // INTRODUCTION
    {"type": "p", "text": "Opening paragraph establishing authority and scope..."},
    {"type": "tldr", "tldrItems": ["5-7 key takeaways from this comprehensive guide"]},

    // TABLE OF CONTENTS (create as a list of internal links)
    {"type": "h2", "id": "contents", "text": "What You'll Learn in This Guide"},
    {"type": "list", "items": [
      "<a href='#section-1'>Section 1 Title</a>",
      "<a href='#section-2'>Section 2 Title</a>"
    ]},

    // MAIN SECTIONS (9 sections as specified above)
    {"type": "h2", "id": "section-slug", "text": "Question-Format Section Title?"},
    {"type": "p", "text": "Direct answer first, then elaboration..."},
    {"type": "h3", "id": "subsection-slug", "text": "Subsection heading"},
    {"type": "p", "text": "More detail..."},

    // Include throughout:
    {"type": "expert_quote", "text": "Quote...", "expert": {"name": "Dr. Name", "title": "Title", "organization": "Org"}},
    {"type": "stat_highlight", "stat": {"value": "85%", "label": "...", "source": "Source, Year"}},
    {"type": "callout", "variant": "tip", "text": "..."},
    {"type": "comparison_table", "table": {...}},
    {"type": "timeline", "timelineItems": [...]},
    {"type": "step_by_step", "steps": [...]},

    // Link to cluster posts
    {"type": "internal_link", "text": "Learn more about...", "href": "/blog/cluster-post-slug", "context": "callout"},

    // Robeen feature callouts (2-3 throughout)
    {"type": "robeen_feature", "feature": "sleep_tracking"},

    // COMPREHENSIVE FAQ (5-8 questions)
    {"type": "h2", "id": "faq", "text": "Frequently Asked Questions"},
    {"type": "faq", "faqs": [
      {"question": "PAA-style question?", "answer": "Direct answer first..."},
      ...more questions
    ]},

    // CONCLUSION with CTA
    {"type": "h2", "id": "conclusion", "text": "Your Next Steps"},
    {"type": "p", "text": "Wrap up with encouragement and clear next actions..."},
    {"type": "robeen_feature", "feature": "appropriate_feature"}
  ],
  "tags": ["comprehensive", "guide", "pillar", "${category.toLowerCase().replace(' ', '-')}", ...more],
  "read_time_minutes": 15,
  "image_prompts": [
    "Hero image description...",
    "Image for section X...",
    "Image for section Y..."
  ]
}

CONTENT GUIDELINES:
1. Write 3000-4000 words across all content blocks
2. Use ALL 9 sections from the list above
3. Include 2-3 h3 subsections under each h2
4. Add visual blocks liberally (minimum 15 throughout):
   - 3-4 expert_quote blocks
   - 3-4 stat_highlight blocks
   - 4-5 callout blocks (tips, warnings, info)
   - 1-2 comparison_table blocks
   - 1-2 timeline blocks
   - 1 step_by_step block
5. Include 5-10 internal_link blocks to cluster posts
6. Include 2-3 robeen_feature blocks at natural points
7. FAQ section with 5-8 questions
8. Warm, authoritative, supportive tone

IMPORTANT: Return ONLY the JSON object, no explanations or markdown.`;
}

async function generatePillar(category) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  const config = PILLAR_CONFIGS[category];
  if (!config) {
    console.error(`❌ Unknown category: ${category}`);
    console.log('Available categories:', Object.keys(PILLAR_CONFIGS).join(', '));
    process.exit(1);
  }

  // Check if pillar already exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .eq('slug', config.slug)
    .single();

  if (existing) {
    console.log(`⚠️  Pillar page already exists: /blog/${config.slug}`);
    console.log(`   Post ID: ${existing.id}`);
    return;
  }

  // Get existing cluster posts for this category
  const { data: clusterPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt')
    .eq('category', category)
    .eq('status', 'published')
    .eq('is_pillar', false);

  console.log(`\n🏛️  Generating Pillar Page: "${config.title}"\n`);
  console.log('─'.repeat(60));
  console.log(`Category: ${category}`);
  console.log(`Cluster posts to link: ${clusterPosts?.length || 0}`);
  console.log('─'.repeat(60));

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 32768,
      messages: [
        {
          role: 'user',
          content: buildPillarPrompt(category, config, clusterPosts || []),
        },
      ],
    });

    const responseText = message.content[0].text;

    // Parse JSON response
    let postData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        postData = JSON.parse(jsonMatch[0]);
      } else {
        postData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Claude response as JSON');
      console.log('\nRaw response preview:\n', responseText.substring(0, 500));
      throw parseError;
    }

    console.log(`\n✅ Generated: "${postData.title}"`);
    console.log(`   Sections: ${postData.content_blocks.filter(b => b.type === 'h2').length}`);
    console.log(`   Read time: ${postData.read_time_minutes} min`);

    // Save to database
    const post = {
      slug: config.slug,
      title: postData.title,
      subtitle: postData.subtitle || null,
      excerpt: postData.excerpt,
      author_name: DEFAULT_AUTHOR.name,
      author_role: DEFAULT_AUTHOR.role,
      category: category,
      tags: postData.tags || [],
      featured_image: CATEGORY_IMAGES[category],
      read_time_minutes: postData.read_time_minutes || 15,
      key_takeaways: postData.key_takeaways,
      content_blocks: postData.content_blocks,
      meta_title: postData.meta_title || postData.title,
      meta_description: postData.meta_description || postData.excerpt,
      status: 'draft',
      is_featured: true,
      is_pillar: true,
      funnel_stage: 'tofu', // Pillar pages are TOFU
      image_prompts: postData.image_prompts || [],
    };

    console.log('\n📝 Saving pillar page to database...');

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to save:', error.message);
      throw error;
    }

    console.log(`✅ Saved as draft: ${config.slug}`);
    console.log(`   Post ID: ${data.id}`);

    // Update cluster posts to reference this pillar (if blog_topics has pillar_id)
    if (clusterPosts && clusterPosts.length > 0) {
      console.log(`\n📎 Linking ${clusterPosts.length} cluster posts to pillar...`);
      // This would update blog_topics.pillar_id, but we're using blog_posts
      // In practice, you'd update the topics table or add a pillar_post_id to blog_posts
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✨ Pillar Page Generation Complete!');
    console.log('═'.repeat(60));
    console.log(`\nNext steps:`);
    console.log(`  1. Review draft in Supabase`);
    console.log(`  2. Generate images: node scripts/generate-images.js --post-id "${data.id}"`);
    console.log(`  3. Publish: update status to 'published' in Supabase`);
    console.log(`  4. Inject links: node scripts/inject-links.js --all`);
    console.log(`  5. Rebuild: node scripts/rebuild-blog.js\n`);

    return data;

  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    throw error;
  }
}

async function listPillarSuggestions() {
  console.log('\n🏛️  Pillar Page Configurations\n');
  console.log('═'.repeat(70));

  for (const [category, config] of Object.entries(PILLAR_CONFIGS)) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id, status')
      .eq('slug', config.slug)
      .single();

    const status = existing
      ? `✅ EXISTS (${existing.status})`
      : '⚪ NOT CREATED';

    console.log(`\n${category}:`);
    console.log(`  Title: ${config.title}`);
    console.log(`  Slug: /blog/${config.slug}`);
    console.log(`  Primary Keyword: ${config.keyword}`);
    console.log(`  Status: ${status}`);
    console.log(`  Sections: ${config.sections.length}`);

    // Count potential cluster posts
    const { count } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('category', category)
      .eq('status', 'published')
      .eq('is_pillar', false);

    console.log(`  Cluster Posts: ${count || 0}`);
  }

  console.log('\n' + '═'.repeat(70));
  console.log('\n💡 Generate with: node scripts/generate-pillar.js --category "Category Name"\n');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.includes('-l')) {
    await listPillarSuggestions();
    return;
  }

  const categoryIndex = args.indexOf('--category');
  if (categoryIndex !== -1 && args[categoryIndex + 1]) {
    const category = args[categoryIndex + 1];
    await generatePillar(category);
  } else {
    console.log(`
🏛️  generate-pillar.js - Pillar Page Generator

Usage:
  node scripts/generate-pillar.js --list                     List pillar configurations
  node scripts/generate-pillar.js --category "Sleep Science" Generate pillar for category

Available categories:
  - Sleep Science
  - Feeding
  - Development
  - Parental Health

Requires:
  ANTHROPIC_API_KEY environment variable
    `);
  }
}

main().catch(console.error);
