#!/usr/bin/env node
/**
 * generate-post.js
 * Generates a blog post from an approved topic using Claude API
 *
 * Usage:
 *   node scripts/generate-post.js --keyword "newborn sleep schedule"
 *   node scripts/generate-post.js --topic-id <uuid>
 *   node scripts/generate-post.js --list  # List approved topics
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Category-specific featured images (high quality Unsplash photos)
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

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

function buildPrompt(topic) {
  return `You are an expert parenting content writer for Robeen, a science-backed parenting app. Write a comprehensive, VISUALLY ENGAGING blog post about the following topic.

TOPIC: ${topic.keyword}
CATEGORY: ${topic.category}
${topic.search_volume ? `SEARCH VOLUME: ${topic.search_volume}/month` : ''}
${topic.related_keywords ? `RELATED KEYWORDS TO NATURALLY INCLUDE: ${JSON.stringify(topic.related_keywords)}` : ''}

TARGET AUDIENCE: New parents (0-2 years) who want science-backed, actionable advice

OUTPUT FORMAT: Return ONLY valid JSON with this exact structure (no markdown, no code blocks, just pure JSON):

{
  "title": "Engaging, SEO-friendly title (50-60 chars)",
  "subtitle": "Compelling subtitle that expands on the title",
  "excerpt": "150-200 character summary for previews and meta description",
  "meta_title": "SEO title with primary keyword (max 60 chars)",
  "meta_description": "Meta description with call-to-action (max 155 chars)",
  "key_takeaways": [
    "4-5 bullet points summarizing the main actionable insights",
    "Each should be a complete, standalone sentence",
    "Focus on what parents can DO, not just know"
  ],
  "content_blocks": [
    // Use a VARIETY of these block types to create visual interest:

    // Text blocks
    {"type": "h2", "id": "section-slug-id", "text": "Section Heading"},
    {"type": "h3", "id": "subsection-id", "text": "Subsection Heading"},
    {"type": "p", "text": "Paragraph content..."},
    {"type": "list", "items": ["Item 1", "Item 2", "Item 3"]},
    {"type": "quote", "text": "Simple quote text"},

    // Visual/Interactive blocks - USE THESE FOR VARIETY:
    {"type": "tldr", "tldrItems": ["Key point 1", "Key point 2", "Key point 3"]},

    {"type": "expert_quote", "text": "Quote from the expert...", "expert": {
      "name": "Dr. Expert Name",
      "title": "Pediatric Specialist",
      "organization": "Children's Hospital"
    }},

    {"type": "stat_highlight", "stat": {
      "value": "80%",
      "label": "of parents report this experience",
      "source": "American Academy of Pediatrics, 2024"
    }},

    {"type": "callout", "variant": "tip", "text": "Pro tip content here..."},
    {"type": "callout", "variant": "warning", "text": "Important safety warning..."},
    {"type": "callout", "variant": "info", "text": "Good to know information..."},

    {"type": "comparison_table", "table": {
      "title": "Comparison Title",
      "headers": ["Aspect", "Option A", "Option B"],
      "rows": [
        ["Row 1", "Value A1", "Value B1"],
        ["Row 2", "Value A2", "Value B2"]
      ]
    }},

    {"type": "pros_cons", "pros": ["Pro 1", "Pro 2"], "cons": ["Con 1", "Con 2"]},

    {"type": "step_by_step", "steps": [
      {"title": "Step 1 Title", "description": "Step description...", "duration": "5 min"},
      {"title": "Step 2 Title", "description": "Step description...", "duration": "10 min"}
    ]},

    {"type": "timeline", "timelineItems": [
      {"label": "0-3 months", "title": "Stage Title", "description": "Description..."},
      {"label": "3-6 months", "title": "Next Stage", "description": "Description..."}
    ]},

    {"type": "faq", "faqs": [
      {"question": "Common question?", "answer": "Detailed answer..."},
      {"question": "Another question?", "answer": "Another answer..."}
    ]}
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "read_time_minutes": 7,
  "image_prompts": [
    "Describe an image for the hero/featured image...",
    "Describe an image for a key section..."
  ]
}

CONTENT GUIDELINES:
1. Write 1500-2000 words total across all content blocks
2. Use 5-7 h2 sections with descriptive kebab-case IDs (used for table of contents)
3. MAKE IT VISUALLY ENGAGING - use at least:
   - 1 tldr block near the beginning (after first intro paragraph)
   - 2-3 expert_quote or stat_highlight blocks throughout
   - 2-3 callout blocks (tips, warnings, or info)
   - 1 comparison_table OR pros_cons block if comparing methods/approaches
   - 1 step_by_step block if there's a how-to aspect
   - 1 timeline block if discussing developmental stages by age
   - 1 faq block near the end with 3-5 common questions
4. Write in warm, supportive tone - parents are tired and need encouragement
5. Include specific ages/timelines when relevant
6. For GEO/AI optimization: Start each section with a direct answer in first 40-60 words
7. Include 1 statistic per 150-200 words for fact density
8. Make each h2 section self-contained and readable independently
9. Naturally incorporate the primary keyword and variations throughout

IMPORTANT: Return ONLY the JSON object, no explanations or markdown formatting.`;
}

async function generatePost(topic) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    console.log('\nSet it with: export ANTHROPIC_API_KEY=sk-ant-...\n');
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });

  console.log(`\n🤖 Generating post for: "${topic.keyword}"\n`);
  console.log('─'.repeat(50));

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 16384,
      messages: [
        {
          role: 'user',
          content: buildPrompt(topic),
        },
      ],
    });

    const responseText = message.content[0].text;

    // Parse JSON response
    let postData;
    try {
      // Try to extract JSON if wrapped in code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        postData = JSON.parse(jsonMatch[0]);
      } else {
        postData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Claude response as JSON');
      console.log('\nRaw response:\n', responseText.substring(0, 500));
      throw parseError;
    }

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'key_takeaways', 'content_blocks'];
    for (const field of requiredFields) {
      if (!postData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log(`✅ Generated: "${postData.title}"`);
    console.log(`   Sections: ${postData.content_blocks.filter(b => b.type === 'h2').length}`);
    console.log(`   Read time: ${postData.read_time_minutes} min`);

    return postData;
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    throw error;
  }
}

async function savePost(topic, postData) {
  let slug = generateSlug(postData.title);

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing) {
    console.log(`⚠️  Slug "${slug}" already exists, adding suffix`);
    const timestamp = Date.now().toString().slice(-6);
    slug = `${slug}-${timestamp}`;
  }

  const post = {
    slug,
    title: postData.title,
    subtitle: postData.subtitle || null,
    excerpt: postData.excerpt,
    author_name: DEFAULT_AUTHOR.name,
    author_role: DEFAULT_AUTHOR.role,
    category: topic.category,
    tags: postData.tags || [],
    featured_image: CATEGORY_IMAGES[topic.category] || CATEGORY_IMAGES['Development'],
    read_time_minutes: postData.read_time_minutes || 7,
    key_takeaways: postData.key_takeaways,
    content_blocks: postData.content_blocks,
    meta_title: postData.meta_title || postData.title,
    meta_description: postData.meta_description || postData.excerpt,
    status: 'draft',
    is_featured: false,
    image_prompts: postData.image_prompts || [],
  };

  console.log('\n📝 Saving to database...');

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('❌ Failed to save post:', error.message);
    throw error;
  }

  // Update topic with generated post reference
  await supabase
    .from('blog_topics')
    .update({
      status: 'generated',
      generated_post_id: data.id,
    })
    .eq('id', topic.id);

  console.log(`✅ Saved as draft: ${slug}`);
  console.log(`   Post ID: ${data.id}`);

  if (postData.image_prompts?.length > 0) {
    console.log(`   Image prompts: ${postData.image_prompts.length}`);
  }

  return data;
}

async function listApprovedTopics() {
  const { data, error } = await supabase
    .from('blog_topics')
    .select('*')
    .in('status', ['approved', 'researched'])
    .order('search_volume', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('\n📋 Topics Ready for Generation:\n');
  console.log('─'.repeat(70));
  console.log('Status'.padEnd(12) + 'Volume'.padEnd(10) + 'KD'.padEnd(8) + 'Keyword');
  console.log('─'.repeat(70));

  for (const topic of data) {
    const status = topic.status.padEnd(12);
    const vol = topic.search_volume ? topic.search_volume.toString().padEnd(10) : '-'.padEnd(10);
    const kd = topic.keyword_difficulty ? `${topic.keyword_difficulty}%`.padEnd(8) : '-'.padEnd(8);
    console.log(`${status}${vol}${kd}${topic.keyword}`);
  }

  console.log('─'.repeat(70));
  console.log(`\n📊 Total: ${data.length} topics ready`);
  console.log('\n💡 Generate with: node scripts/generate-post.js --keyword "topic keyword"\n');
}

async function main() {
  const args = process.argv.slice(2);

  // List mode
  if (args.includes('--list') || args.includes('-l')) {
    await listApprovedTopics();
    return;
  }

  // Get topic by keyword or ID
  let topic = null;

  const keywordIndex = args.indexOf('--keyword');
  const idIndex = args.indexOf('--topic-id');

  if (keywordIndex !== -1 && args[keywordIndex + 1]) {
    const keyword = args[keywordIndex + 1];
    const { data, error } = await supabase
      .from('blog_topics')
      .select('*')
      .eq('keyword', keyword)
      .single();

    if (error || !data) {
      console.error(`❌ Topic not found: "${keyword}"`);
      process.exit(1);
    }
    topic = data;
  } else if (idIndex !== -1 && args[idIndex + 1]) {
    const id = args[idIndex + 1];
    const { data, error } = await supabase
      .from('blog_topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(`❌ Topic not found: ${id}`);
      process.exit(1);
    }
    topic = data;
  } else {
    console.log(`
📝 generate-post.js - Blog Post Generator

Usage:
  node scripts/generate-post.js --list                    List topics ready for generation
  node scripts/generate-post.js --keyword "keyword"       Generate post for specific keyword
  node scripts/generate-post.js --topic-id <uuid>         Generate post by topic ID

Requires:
  ANTHROPIC_API_KEY environment variable

Example:
  export ANTHROPIC_API_KEY=sk-ant-...
  node scripts/generate-post.js --keyword "newborn sleep schedule"
    `);
    return;
  }

  // Check topic status
  if (topic.status === 'generated') {
    console.log(`⚠️  Topic "${topic.keyword}" already has a generated post`);
    console.log(`   Post ID: ${topic.generated_post_id}`);
    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug, status')
      .eq('id', topic.generated_post_id)
      .single();
    if (post) {
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
    }
    return;
  }

  // Generate the post
  console.log('\n🚀 Starting content generation...');
  console.log(`   Topic: ${topic.keyword}`);
  console.log(`   Category: ${topic.category}`);
  console.log(`   Search Volume: ${topic.search_volume || 'N/A'}`);

  const postData = await generatePost(topic);
  const savedPost = await savePost(topic, postData);

  console.log('\n' + '═'.repeat(50));
  console.log('✨ Generation Complete!');
  console.log('═'.repeat(50));
  console.log(`\nNext steps:`);
  console.log(`  1. Review draft in Supabase: blog_posts table`);
  console.log(`  2. Generate images: node scripts/generate-images.js --post-id "${savedPost.id}"`);
  console.log(`  3. Publish: node scripts/publish-post.js --slug "${savedPost.slug}"`);
  console.log(`  4. Rebuild: node scripts/rebuild-blog.js\n`);
}

main().catch(console.error);
