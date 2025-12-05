#!/usr/bin/env node
/**
 * Migration: Add image_prompts column to blog_posts table
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addColumn() {
  console.log('Adding image_prompts column to blog_posts table...');

  // Use raw SQL via RPC or Supabase SQL Editor
  // Since we can't run raw SQL directly, we'll need to do this via Supabase Dashboard
  // For now, let's verify the table structure

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('Current columns:', Object.keys(data[0] || {}));
  console.log('\n⚠️  To add the image_prompts column, run this SQL in Supabase Dashboard:');
  console.log('\n────────────────────────────────────────');
  console.log('ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_prompts jsonb DEFAULT \'[]\'::jsonb;');
  console.log('────────────────────────────────────────\n');
}

addColumn();
