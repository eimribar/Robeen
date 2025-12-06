#!/usr/bin/env node
/**
 * inject-links.js
 * Automated internal link injection for blog posts
 *
 * Scans all published posts and injects relevant internal links based on:
 * 1. Keyword matching (primary keywords in titles/tags)
 * 2. Category relationships
 * 3. Pillar/cluster relationships
 *
 * Usage:
 *   node scripts/inject-links.js --all           # Process all published posts
 *   node scripts/inject-links.js --post-id <id>  # Process specific post
 *   node scripts/inject-links.js --dry-run       # Preview changes without saving
 *   node scripts/inject-links.js --report        # Generate link coverage report
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Link injection settings
const MAX_LINKS_PER_POST = 5;
const MIN_CONTENT_WORDS_BEFORE_LINK = 200; // Minimum words between links

/**
 * Extract keywords from a post for matching
 */
function extractKeywords(post) {
  const keywords = new Set();

  // Add tags
  if (post.tags) {
    post.tags.forEach(tag => keywords.add(tag.toLowerCase()));
  }

  // Extract important words from title
  const titleWords = post.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4 && !['about', 'guide', 'complete', 'ultimate', 'tips'].includes(word));

  titleWords.forEach(word => keywords.add(word));

  return Array.from(keywords);
}

/**
 * Calculate relevance score between two posts
 */
function calculateRelevance(sourcePost, targetPost) {
  let score = 0;

  // Same category = +2
  if (sourcePost.category === targetPost.category) {
    score += 2;
  }

  // Same funnel stage = +1
  if (sourcePost.funnel_stage === targetPost.funnel_stage) {
    score += 1;
  }

  // Adjacent funnel stages = +0.5 (TOFU→MOFU, MOFU→BOFU)
  const funnelOrder = { tofu: 0, mofu: 1, bofu: 2 };
  const sourceFunnel = funnelOrder[sourcePost.funnel_stage || 'tofu'];
  const targetFunnel = funnelOrder[targetPost.funnel_stage || 'tofu'];
  if (Math.abs(sourceFunnel - targetFunnel) === 1) {
    score += 0.5;
  }

  // Tag overlap = +1 per matching tag
  const sourceTags = new Set((sourcePost.tags || []).map(t => t.toLowerCase()));
  const targetTags = new Set((targetPost.tags || []).map(t => t.toLowerCase()));
  for (const tag of sourceTags) {
    if (targetTags.has(tag)) {
      score += 1;
    }
  }

  // Keyword match in title = +3
  const sourceKeywords = extractKeywords(sourcePost);
  const targetTitle = targetPost.title.toLowerCase();
  for (const keyword of sourceKeywords) {
    if (targetTitle.includes(keyword)) {
      score += 3;
    }
  }

  // Pillar to cluster relationship = +5
  if (targetPost.is_pillar && !sourcePost.is_pillar) {
    score += 5;
  }

  return score;
}

/**
 * Find the best positions in content blocks to inject links
 */
function findLinkPositions(contentBlocks) {
  const positions = [];
  let wordCount = 0;
  let lastLinkPosition = -1;

  contentBlocks.forEach((block, index) => {
    // Count words in paragraph blocks
    if (block.type === 'p' && block.text) {
      wordCount += block.text.split(/\s+/).length;

      // Check if we've gone far enough since last link
      if (wordCount - lastLinkPosition >= MIN_CONTENT_WORDS_BEFORE_LINK) {
        // Good position after this paragraph
        positions.push({
          index: index + 1,
          wordCount,
          afterH2: false
        });
      }
    }

    // Prefer positions right after h2 headers
    if (block.type === 'h2') {
      positions.push({
        index: index + 1,
        wordCount,
        afterH2: true,
        sectionId: block.id
      });
    }
  });

  // Sort by preference (after h2 first, then by word count spread)
  return positions.sort((a, b) => {
    if (a.afterH2 && !b.afterH2) return -1;
    if (!a.afterH2 && b.afterH2) return 1;
    return a.wordCount - b.wordCount;
  });
}

/**
 * Generate anchor text for an internal link
 */
function generateAnchorText(targetPost) {
  // Use a variation of the title
  const title = targetPost.title;

  // Try to shorten long titles
  if (title.length > 50) {
    // Take first meaningful phrase
    const colonIndex = title.indexOf(':');
    if (colonIndex > 0 && colonIndex < 40) {
      return title.substring(0, colonIndex);
    }
    // Or truncate at a good point
    const words = title.split(' ');
    let shortTitle = '';
    for (const word of words) {
      if ((shortTitle + ' ' + word).length > 45) break;
      shortTitle = shortTitle ? shortTitle + ' ' + word : word;
    }
    return shortTitle;
  }

  return title;
}

/**
 * Inject internal links into a post's content blocks
 */
async function injectLinksIntoPost(post, allPosts, dryRun = false) {
  console.log(`\n📝 Processing: "${post.title.substring(0, 50)}..."`);

  // Calculate relevance scores for all other posts
  const candidates = allPosts
    .filter(p => p.id !== post.id && p.status === 'published')
    .map(targetPost => ({
      post: targetPost,
      score: calculateRelevance(post, targetPost)
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LINKS_PER_POST);

  if (candidates.length === 0) {
    console.log('   ⚠️  No relevant posts found for linking');
    return { added: 0, links: [] };
  }

  // Find positions to inject links
  const positions = findLinkPositions(post.content_blocks);

  if (positions.length === 0) {
    console.log('   ⚠️  No suitable positions found for links');
    return { added: 0, links: [] };
  }

  // Count existing internal links
  const existingLinkCount = post.content_blocks.filter(b => b.type === 'internal_link').length;
  const linksToAdd = Math.min(
    MAX_LINKS_PER_POST - existingLinkCount,
    candidates.length,
    positions.length
  );

  if (linksToAdd <= 0) {
    console.log(`   ℹ️  Post already has ${existingLinkCount} internal links`);
    return { added: 0, links: [] };
  }

  // Create new content blocks with injected links
  const newBlocks = [...post.content_blocks];
  const addedLinks = [];
  let offset = 0;

  for (let i = 0; i < linksToAdd; i++) {
    const position = positions[i];
    const target = candidates[i].post;

    const linkBlock = {
      type: 'internal_link',
      text: generateAnchorText(target),
      href: `/blog/${target.slug}`,
      context: position.afterH2 ? 'callout' : 'related'
    };

    // Insert at position (adjusted for previous insertions)
    newBlocks.splice(position.index + offset, 0, linkBlock);
    offset++;

    addedLinks.push({
      targetId: target.id,
      targetSlug: target.slug,
      anchorText: linkBlock.text,
      context: linkBlock.context,
      score: candidates[i].score
    });

    console.log(`   ✓ Link to: "${target.title.substring(0, 40)}..." (score: ${candidates[i].score})`);
  }

  // Save updated content blocks
  if (!dryRun && addedLinks.length > 0) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ content_blocks: newBlocks })
      .eq('id', post.id);

    if (error) {
      console.error(`   ❌ Failed to update post: ${error.message}`);
      return { added: 0, links: [] };
    }

    // Record links in blog_links table
    for (const link of addedLinks) {
      await supabase.from('blog_links').insert({
        source_post_id: post.id,
        target_post_id: link.targetId,
        anchor_text: link.anchorText,
        link_type: link.context
      });
    }

    console.log(`   ✅ Added ${addedLinks.length} internal links`);
  } else if (dryRun) {
    console.log(`   🔍 [DRY RUN] Would add ${addedLinks.length} internal links`);
  }

  return { added: addedLinks.length, links: addedLinks };
}

/**
 * Generate a link coverage report
 */
async function generateReport() {
  console.log('\n📊 Internal Link Coverage Report\n');
  console.log('═'.repeat(70));

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, funnel_stage, content_blocks')
    .eq('status', 'published');

  const { data: links } = await supabase
    .from('blog_links')
    .select('*');

  if (!posts || posts.length === 0) {
    console.log('No published posts found.');
    return;
  }

  // Calculate stats
  const linksBySource = {};
  const linksByTarget = {};

  for (const link of (links || [])) {
    linksBySource[link.source_post_id] = (linksBySource[link.source_post_id] || 0) + 1;
    linksByTarget[link.target_post_id] = (linksByTarget[link.target_post_id] || 0) + 1;
  }

  // Count inline internal_link blocks
  for (const post of posts) {
    const inlineLinks = post.content_blocks.filter(b => b.type === 'internal_link').length;
    if (inlineLinks > 0) {
      linksBySource[post.id] = (linksBySource[post.id] || 0) + inlineLinks;
    }
  }

  console.log('\nPosts by Outbound Links:\n');
  console.log('Links  Category           Title');
  console.log('─'.repeat(70));

  const sorted = posts.sort((a, b) =>
    (linksBySource[a.id] || 0) - (linksBySource[b.id] || 0)
  );

  for (const post of sorted) {
    const outbound = linksBySource[post.id] || 0;
    const inbound = linksByTarget[post.id] || 0;
    const category = post.category.substring(0, 15).padEnd(18);
    const title = post.title.substring(0, 40);
    console.log(`${String(outbound).padStart(3)}    ${category}${title}`);
  }

  console.log('─'.repeat(70));

  // Summary stats
  const totalLinks = Object.values(linksBySource).reduce((a, b) => a + b, 0);
  const postsWithLinks = Object.keys(linksBySource).length;
  const postsWithoutLinks = posts.length - postsWithLinks;
  const avgLinksPerPost = totalLinks / posts.length;

  console.log(`\nSummary:`);
  console.log(`  Total posts: ${posts.length}`);
  console.log(`  Posts with outbound links: ${postsWithLinks}`);
  console.log(`  Posts without outbound links: ${postsWithoutLinks}`);
  console.log(`  Total internal links: ${totalLinks}`);
  console.log(`  Average links per post: ${avgLinksPerPost.toFixed(1)}`);

  // Orphan pages (no inbound links)
  const orphans = posts.filter(p => !linksByTarget[p.id]);
  if (orphans.length > 0) {
    console.log(`\n⚠️  Orphan pages (no inbound links): ${orphans.length}`);
    orphans.forEach(p => console.log(`     - ${p.slug}`));
  }

  console.log('\n');
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reportOnly = args.includes('--report');
  const processAll = args.includes('--all');
  const postIdIndex = args.indexOf('--post-id');

  if (reportOnly) {
    await generateReport();
    return;
  }

  console.log('\n🔗 Internal Link Injector\n');
  console.log('═'.repeat(50));

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be saved\n');
  }

  // Get all published posts
  const { data: allPosts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published');

  if (error) {
    console.error('❌ Failed to fetch posts:', error.message);
    process.exit(1);
  }

  if (!allPosts || allPosts.length === 0) {
    console.log('No published posts found.');
    return;
  }

  console.log(`Found ${allPosts.length} published posts\n`);

  let postsToProcess = allPosts;

  // Filter to specific post if requested
  if (postIdIndex !== -1 && args[postIdIndex + 1]) {
    const postId = args[postIdIndex + 1];
    postsToProcess = allPosts.filter(p => p.id === postId);
    if (postsToProcess.length === 0) {
      console.error(`❌ Post not found: ${postId}`);
      process.exit(1);
    }
  } else if (!processAll) {
    console.log(`
Usage:
  node scripts/inject-links.js --all           # Process all published posts
  node scripts/inject-links.js --post-id <id>  # Process specific post
  node scripts/inject-links.js --dry-run       # Preview changes without saving
  node scripts/inject-links.js --report        # Generate link coverage report

Add --dry-run to any command to preview without saving.
    `);
    return;
  }

  // Process posts
  let totalAdded = 0;
  for (const post of postsToProcess) {
    const result = await injectLinksIntoPost(post, allPosts, dryRun);
    totalAdded += result.added;
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`✨ Complete! ${dryRun ? 'Would add' : 'Added'} ${totalAdded} internal links`);
  console.log('═'.repeat(50) + '\n');

  if (!dryRun && totalAdded > 0) {
    console.log('Next steps:');
    console.log('  1. Rebuild blog: node scripts/rebuild-blog.js');
    console.log('  2. Check report: node scripts/inject-links.js --report\n');
  }
}

main().catch(console.error);
