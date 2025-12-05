#!/usr/bin/env node
/**
 * seed-topics.js
 * Seeds initial keywords into the blog_topics table
 *
 * Usage:
 *   node scripts/seed-topics.js
 *   node scripts/seed-topics.js --category "Sleep Science"
 *   node scripts/seed-topics.js --list
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Seed topics organized by category
const SEED_TOPICS = {
  'Sleep Science': [
    'baby sleep regression ages',
    'newborn sleep schedule',
    'baby won\'t sleep in crib',
    'sleep training methods comparison',
    'baby nap transitions',
    'how to get baby to sleep through night',
    'baby overtired signs',
    'white noise for baby sleep',
    'safe sleep guidelines for infants',
    'baby sleep associations',
  ],
  'Feeding': [
    'baby led weaning first foods',
    'breastfeeding latch problems',
    'formula feeding schedule by age',
    'introducing solid foods to baby',
    'baby food allergies signs',
    'pumping schedule for working moms',
    'baby bottle refusal solutions',
    'how much should newborn eat',
    'baby feeding milestones by month',
    'combining breastfeeding and formula',
  ],
  'Development': [
    'baby developmental milestones chart',
    'tummy time tips for newborns',
    'when do babies start crawling',
    'baby language development stages',
    'sensory play ideas for babies',
    'baby cognitive development activities',
    'when do babies recognize their name',
    'baby motor skills development',
    'signs of developmental delay in babies',
    'baby social emotional development',
  ],
  'Parental Health': [
    'postpartum depression symptoms',
    'new parent sleep deprivation tips',
    'postpartum anxiety vs normal worry',
    'self care for new moms',
    'returning to work after baby',
    'dad postpartum depression signs',
    'managing stress as new parent',
    'postpartum recovery timeline',
    'new parent relationship tips',
    'balancing work and newborn care',
  ],
};

async function seedTopics(filterCategory = null) {
  console.log('🌱 Seeding topics to blog_topics table...\n');

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const [category, keywords] of Object.entries(SEED_TOPICS)) {
    // Skip if filter is set and doesn't match
    if (filterCategory && category !== filterCategory) {
      continue;
    }

    console.log(`\n📁 Category: ${category}`);
    console.log('─'.repeat(40));

    for (const keyword of keywords) {
      // Check if topic already exists
      const { data: existing } = await supabase
        .from('blog_topics')
        .select('id')
        .eq('keyword', keyword)
        .single();

      if (existing) {
        console.log(`  ⏭️  Skipped (exists): ${keyword}`);
        totalSkipped++;
        continue;
      }

      // Insert new topic
      const { data, error } = await supabase
        .from('blog_topics')
        .insert({
          keyword,
          category,
          status: 'pending',
          priority: 0,
        })
        .select()
        .single();

      if (error) {
        console.log(`  ❌ Error: ${keyword} - ${error.message}`);
      } else {
        console.log(`  ✅ Added: ${keyword}`);
        totalInserted++;
      }
    }
  }

  console.log('\n' + '═'.repeat(40));
  console.log(`📊 Summary:`);
  console.log(`   Inserted: ${totalInserted}`);
  console.log(`   Skipped:  ${totalSkipped}`);
  console.log(`   Total:    ${totalInserted + totalSkipped}`);
  console.log('═'.repeat(40) + '\n');
}

async function listTopics() {
  const { data, error } = await supabase
    .from('blog_topics')
    .select('keyword, category, status, search_volume, keyword_difficulty')
    .order('category')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching topics:', error.message);
    return;
  }

  console.log('\n📋 Current Topics in Database:\n');

  let currentCategory = '';
  for (const topic of data) {
    if (topic.category !== currentCategory) {
      currentCategory = topic.category;
      console.log(`\n📁 ${currentCategory}`);
      console.log('─'.repeat(50));
    }

    const status = topic.status.padEnd(12);
    const volume = topic.search_volume ? `Vol: ${topic.search_volume}`.padEnd(12) : ''.padEnd(12);
    const diff = topic.keyword_difficulty ? `KD: ${topic.keyword_difficulty}%` : '';

    console.log(`  [${status}] ${topic.keyword} ${volume} ${diff}`);
  }

  console.log(`\n📊 Total: ${data.length} topics\n`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const listMode = args.includes('--list') || args.includes('-l');
const categoryIndex = args.indexOf('--category');
const filterCategory = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

if (listMode) {
  listTopics();
} else {
  seedTopics(filterCategory);
}
