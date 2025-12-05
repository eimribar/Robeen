#!/usr/bin/env node
/**
 * publish-post.js
 * Publishes a draft blog post
 *
 * Usage:
 *   node scripts/publish-post.js --slug "post-slug"
 *   node scripts/publish-post.js --post-id <uuid>
 *   node scripts/publish-post.js --list          # List draft posts
 *   node scripts/publish-post.js --featured      # Also set as featured
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function listDraftPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, status, created_at')
    .eq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('\n📝 Draft Posts:\n');
  console.log('─'.repeat(80));

  if (data.length === 0) {
    console.log('  No draft posts found.');
  } else {
    for (const post of data) {
      const date = new Date(post.created_at).toLocaleDateString();
      console.log(`  [${post.category}] ${post.title}`);
      console.log(`    Slug: ${post.slug}`);
      console.log(`    ID: ${post.id}`);
      console.log(`    Created: ${date}\n`);
    }
  }

  console.log('─'.repeat(80));
  console.log(`📊 Total: ${data.length} draft posts\n`);
}

async function publishPost(identifier, setFeatured = false) {
  // Find post by slug or ID
  let query = supabase.from('blog_posts').select('*');

  if (identifier.includes('-') && identifier.length > 30) {
    // Looks like a UUID
    query = query.eq('id', identifier);
  } else {
    // Assume it's a slug
    query = query.eq('slug', identifier);
  }

  const { data: post, error: findError } = await query.single();

  if (findError || !post) {
    console.error(`❌ Post not found: ${identifier}`);
    return;
  }

  if (post.status === 'published') {
    console.log(`⚠️  Post is already published: ${post.slug}`);
    console.log(`   Published at: ${post.published_at}`);
    return;
  }

  // If setting as featured, unfeature all other posts first
  if (setFeatured) {
    await supabase
      .from('blog_posts')
      .update({ is_featured: false })
      .eq('is_featured', true);
  }

  // Publish the post
  const { data: updated, error: updateError } = await supabase
    .from('blog_posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      is_featured: setFeatured,
    })
    .eq('id', post.id)
    .select()
    .single();

  if (updateError) {
    console.error('❌ Failed to publish:', updateError.message);
    return;
  }

  console.log('\n✅ Post Published Successfully!\n');
  console.log('─'.repeat(50));
  console.log(`  Title: ${updated.title}`);
  console.log(`  Slug: ${updated.slug}`);
  console.log(`  Category: ${updated.category}`);
  console.log(`  Featured: ${updated.is_featured ? 'Yes' : 'No'}`);
  console.log(`  Published: ${new Date(updated.published_at).toLocaleString()}`);
  console.log('─'.repeat(50));
  console.log('\n📢 Next step: Run rebuild to update the static site:');
  console.log('   node scripts/rebuild-blog.js\n');
}

async function unpublishPost(identifier) {
  let query = supabase.from('blog_posts').select('id, slug, title');

  if (identifier.includes('-') && identifier.length > 30) {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('slug', identifier);
  }

  const { data: post, error: findError } = await query.single();

  if (findError || !post) {
    console.error(`❌ Post not found: ${identifier}`);
    return;
  }

  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({
      status: 'draft',
      published_at: null,
    })
    .eq('id', post.id);

  if (updateError) {
    console.error('❌ Failed to unpublish:', updateError.message);
    return;
  }

  console.log(`✅ Unpublished: ${post.title}`);
  console.log('   Status changed to: draft\n');
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--list') || args.includes('-l')) {
  listDraftPosts();
} else if (args.includes('--unpublish')) {
  const index = args.indexOf('--unpublish');
  const identifier = args[index + 1];
  if (identifier) {
    unpublishPost(identifier);
  } else {
    console.error('Usage: --unpublish "slug-or-id"');
  }
} else {
  const slugIndex = args.indexOf('--slug');
  const idIndex = args.indexOf('--post-id');
  const setFeatured = args.includes('--featured');

  let identifier = null;

  if (slugIndex !== -1 && args[slugIndex + 1]) {
    identifier = args[slugIndex + 1];
  } else if (idIndex !== -1 && args[idIndex + 1]) {
    identifier = args[idIndex + 1];
  }

  if (identifier) {
    publishPost(identifier, setFeatured);
  } else {
    console.log(`
📰 publish-post.js - Blog Post Publisher

Usage:
  node scripts/publish-post.js --list                   List all draft posts
  node scripts/publish-post.js --slug "post-slug"       Publish by slug
  node scripts/publish-post.js --post-id <uuid>         Publish by ID
  node scripts/publish-post.js --slug "slug" --featured Publish and set as featured
  node scripts/publish-post.js --unpublish "slug"       Revert to draft

After publishing, run rebuild-blog.js to update the static site.
    `);
  }
}
