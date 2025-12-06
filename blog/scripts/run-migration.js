#!/usr/bin/env node
/**
 * run-migration.js
 * Runs database migrations via Supabase Management API
 *
 * Usage: node scripts/run-migration.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  console.log('🔄 Running content strategy migration...\n');

  // Since we can't run raw SQL through the JS client,
  // we'll add columns by attempting operations that will fail gracefully
  // and then use RPC if available, or provide instructions

  const migrations = [
    {
      name: 'Add funnel_stage to blog_topics',
      check: async () => {
        const { error } = await supabase.from('blog_topics').select('funnel_stage').limit(1);
        return !error;
      },
      instruction: `ALTER TABLE blog_topics ADD COLUMN funnel_stage TEXT DEFAULT 'tofu';`
    },
    {
      name: 'Add pillar_id to blog_topics',
      check: async () => {
        const { error } = await supabase.from('blog_topics').select('pillar_id').limit(1);
        return !error;
      },
      instruction: `ALTER TABLE blog_topics ADD COLUMN pillar_id UUID REFERENCES blog_posts(id);`
    },
    {
      name: 'Add cluster_keywords to blog_topics',
      check: async () => {
        const { error } = await supabase.from('blog_topics').select('cluster_keywords').limit(1);
        return !error;
      },
      instruction: `ALTER TABLE blog_topics ADD COLUMN cluster_keywords JSONB DEFAULT '[]'::jsonb;`
    },
    {
      name: 'Add is_pillar to blog_posts',
      check: async () => {
        const { error } = await supabase.from('blog_posts').select('is_pillar').limit(1);
        return !error;
      },
      instruction: `ALTER TABLE blog_posts ADD COLUMN is_pillar BOOLEAN DEFAULT false;`
    },
    {
      name: 'Add funnel_stage to blog_posts',
      check: async () => {
        const { error } = await supabase.from('blog_posts').select('funnel_stage').limit(1);
        return !error;
      },
      instruction: `ALTER TABLE blog_posts ADD COLUMN funnel_stage TEXT DEFAULT 'tofu';`
    },
    {
      name: 'Create blog_links table',
      check: async () => {
        const { error } = await supabase.from('blog_links').select('id').limit(1);
        return !error;
      },
      instruction: `CREATE TABLE blog_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  target_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  anchor_text TEXT NOT NULL,
  link_type TEXT DEFAULT 'inline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`
    }
  ];

  const pending = [];
  const completed = [];

  for (const migration of migrations) {
    const exists = await migration.check();
    if (exists) {
      completed.push(migration.name);
      console.log(`✅ ${migration.name} - already exists`);
    } else {
      pending.push(migration);
      console.log(`⏳ ${migration.name} - needs to be added`);
    }
  }

  if (pending.length === 0) {
    console.log('\n✨ All migrations already applied!');
    return;
  }

  console.log('\n' + '─'.repeat(60));
  console.log('📋 MANUAL SQL REQUIRED');
  console.log('─'.repeat(60));
  console.log('\nRun the following SQL in the Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/uytqxlbymowzaagmvznl/sql/new\n');

  for (const migration of pending) {
    console.log(`-- ${migration.name}`);
    console.log(migration.instruction);
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log('\nAlternatively, run the full migration file:');
  console.log('migrations/001_content_strategy.sql\n');
}

runMigration().catch(console.error);
