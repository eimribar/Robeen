#!/usr/bin/env node
/**
 * research-topics.js
 * Lists pending topics for research and updates with DataForSEO data
 *
 * Usage:
 *   node scripts/research-topics.js --list          # List pending topics
 *   node scripts/research-topics.js --update       # Interactive: paste JSON to update
 *   node scripts/research-topics.js --auto-approve  # Auto-approve high-value topics
 *
 * Workflow:
 *   1. Run --list to get keywords for research
 *   2. Use DataForSEO (via Claude Code MCP) to get keyword data
 *   3. Run --update and paste the research data JSON
 *   4. Run --auto-approve to approve topics meeting criteria
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Auto-approve criteria
const APPROVAL_CRITERIA = {
  minSearchVolume: 500,
  maxKeywordDifficulty: 60,
};

async function listPendingTopics() {
  const { data, error } = await supabase
    .from('blog_topics')
    .select('id, keyword, category')
    .eq('status', 'pending')
    .order('category')
    .order('created_at');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('\n📋 Pending Topics for Research:\n');
  console.log('Copy these keywords to research with DataForSEO:\n');
  console.log('─'.repeat(60));

  const keywords = data.map(t => t.keyword);
  console.log(JSON.stringify(keywords, null, 2));

  console.log('─'.repeat(60));
  console.log(`\n📊 Total: ${data.length} pending topics`);
  console.log('\n💡 Use this with Claude Code MCP tool:');
  console.log('   mcp__dataforseo__dataforseo_labs_google_keyword_overview');
  console.log('   with keywords array and location_name="United States"\n');
}

async function listResearchedTopics() {
  const { data, error } = await supabase
    .from('blog_topics')
    .select('*')
    .in('status', ['researched', 'approved'])
    .order('search_volume', { ascending: false });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('\n📊 Researched Topics:\n');
  console.log('─'.repeat(80));
  console.log('Keyword'.padEnd(40) + 'Volume'.padEnd(10) + 'KD'.padEnd(8) + 'CPC'.padEnd(8) + 'Status');
  console.log('─'.repeat(80));

  for (const topic of data) {
    const vol = topic.search_volume ? topic.search_volume.toString() : '-';
    const kd = topic.keyword_difficulty ? `${topic.keyword_difficulty}%` : '-';
    const cpc = topic.cpc ? `$${topic.cpc}` : '-';
    console.log(
      topic.keyword.substring(0, 38).padEnd(40) +
      vol.padEnd(10) +
      kd.padEnd(8) +
      cpc.padEnd(8) +
      topic.status
    );
  }

  console.log('─'.repeat(80));
  console.log(`📊 Total: ${data.length} researched topics\n`);
}

async function updateTopicData(keyword, data) {
  const { error } = await supabase
    .from('blog_topics')
    .update({
      search_volume: data.search_volume || null,
      keyword_difficulty: data.keyword_difficulty || null,
      cpc: data.cpc || null,
      competition_level: data.competition_level || null,
      related_keywords: data.related_keywords || null,
      status: 'researched',
      researched_at: new Date().toISOString(),
    })
    .eq('keyword', keyword);

  return error;
}

async function interactiveUpdate() {
  console.log('\n📝 Paste DataForSEO keyword_overview response JSON (then press Enter twice):\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let jsonInput = '';
  let emptyLineCount = 0;

  for await (const line of rl) {
    if (line === '') {
      emptyLineCount++;
      if (emptyLineCount >= 2) break;
    } else {
      emptyLineCount = 0;
      jsonInput += line;
    }
  }

  rl.close();

  try {
    const response = JSON.parse(jsonInput);
    const items = response.items || response;

    console.log(`\n📥 Processing ${items.length} keywords...\n`);

    for (const item of items) {
      const keyword = item.keyword;
      const keywordInfo = item.keyword_info || {};
      const keywordProps = item.keyword_properties || {};

      const updateData = {
        search_volume: keywordInfo.search_volume,
        keyword_difficulty: keywordProps.keyword_difficulty,
        cpc: keywordInfo.cpc,
        competition_level: keywordInfo.competition_level,
      };

      const error = await updateTopicData(keyword, updateData);

      if (error) {
        console.log(`  ❌ ${keyword}: ${error.message}`);
      } else {
        const vol = updateData.search_volume || '-';
        const kd = updateData.keyword_difficulty ? `KD:${updateData.keyword_difficulty}%` : '';
        console.log(`  ✅ ${keyword}: Vol:${vol} ${kd}`);
      }
    }

    console.log('\n✨ Update complete!\n');
  } catch (e) {
    console.error('❌ Failed to parse JSON:', e.message);
  }
}

async function autoApproveTopics() {
  const { data, error } = await supabase
    .from('blog_topics')
    .select('*')
    .eq('status', 'researched');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('\n🔍 Checking topics for auto-approval...\n');
  console.log(`Criteria: Volume >= ${APPROVAL_CRITERIA.minSearchVolume}, KD <= ${APPROVAL_CRITERIA.maxKeywordDifficulty}%\n`);

  let approved = 0;
  let skipped = 0;

  for (const topic of data) {
    const meetsVolume = topic.search_volume >= APPROVAL_CRITERIA.minSearchVolume;
    const meetsKD = topic.keyword_difficulty <= APPROVAL_CRITERIA.maxKeywordDifficulty;

    if (meetsVolume && meetsKD) {
      const { error: updateError } = await supabase
        .from('blog_topics')
        .update({ status: 'approved' })
        .eq('id', topic.id);

      if (!updateError) {
        console.log(`  ✅ Approved: ${topic.keyword} (Vol:${topic.search_volume}, KD:${topic.keyword_difficulty}%)`);
        approved++;
      }
    } else {
      const reason = !meetsVolume ? 'low volume' : 'high difficulty';
      console.log(`  ⏭️  Skipped: ${topic.keyword} (${reason})`);
      skipped++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`📊 Results: ${approved} approved, ${skipped} skipped`);
  console.log('═'.repeat(50) + '\n');
}

async function approveByKeyword(keyword) {
  const { data, error } = await supabase
    .from('blog_topics')
    .update({ status: 'approved' })
    .eq('keyword', keyword)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error approving "${keyword}":`, error.message);
  } else {
    console.log(`✅ Approved: ${keyword}`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--list') || args.includes('-l')) {
  listPendingTopics();
} else if (args.includes('--researched') || args.includes('-r')) {
  listResearchedTopics();
} else if (args.includes('--update') || args.includes('-u')) {
  interactiveUpdate();
} else if (args.includes('--auto-approve') || args.includes('-a')) {
  autoApproveTopics();
} else if (args.includes('--approve')) {
  const keywordIndex = args.indexOf('--approve') + 1;
  if (args[keywordIndex]) {
    approveByKeyword(args[keywordIndex]);
  } else {
    console.error('Usage: --approve "keyword to approve"');
  }
} else {
  console.log(`
📚 research-topics.js - Topic Research Helper

Usage:
  node scripts/research-topics.js --list           List pending topics (get keywords for research)
  node scripts/research-topics.js --researched     Show researched topics with data
  node scripts/research-topics.js --update         Interactive: paste DataForSEO JSON to update
  node scripts/research-topics.js --auto-approve   Auto-approve topics meeting criteria
  node scripts/research-topics.js --approve "kw"   Manually approve a specific keyword

Workflow:
  1. Run --list to get keywords needing research
  2. Use DataForSEO MCP tool in Claude Code to research keywords
  3. Copy the JSON response
  4. Run --update and paste the JSON
  5. Run --auto-approve or manually approve topics
  `);
}
