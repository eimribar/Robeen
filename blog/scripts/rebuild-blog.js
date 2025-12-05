#!/usr/bin/env node
/**
 * rebuild-blog.js
 * Triggers a Vercel rebuild to regenerate static blog pages
 *
 * Usage:
 *   node scripts/rebuild-blog.js
 *   node scripts/rebuild-blog.js --wait    # Wait for deployment to complete
 *   node scripts/rebuild-blog.js --status  # Check current deployment status
 *
 * Requires: VERCEL_DEPLOY_HOOK_URL environment variable
 *           Or set it in this file for convenience
 */

// Configuration
// You can set this directly or use environment variable
const DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL || 'https://api.vercel.com/v1/integrations/deploy/prj_r9UYKEHele9Uua0FjbNO7Y53wB6I/wSnAHTFMKc';

// Vercel API token for checking deployment status (optional)
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || '';
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || '';

async function triggerRebuild() {
  if (!DEPLOY_HOOK_URL) {
    console.log(`
❌ VERCEL_DEPLOY_HOOK_URL not configured.

To set up a deploy hook:
1. Go to your Vercel project settings
2. Navigate to Git → Deploy Hooks
3. Create a new hook (e.g., "Blog Content Update")
4. Copy the URL and set it as an environment variable:

   export VERCEL_DEPLOY_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/..."

Or add it to your .env file.
    `);
    return null;
  }

  console.log('\n🚀 Triggering Vercel rebuild...\n');

  try {
    const response = await fetch(DEPLOY_HOOK_URL, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ Rebuild triggered successfully!');
    console.log('─'.repeat(40));
    console.log(`  Job ID: ${data.job?.id || 'N/A'}`);
    console.log(`  Created: ${data.job?.createdAt ? new Date(data.job.createdAt).toLocaleString() : 'N/A'}`);
    console.log('─'.repeat(40));

    return data;
  } catch (error) {
    console.error('❌ Failed to trigger rebuild:', error.message);
    return null;
  }
}

async function checkDeploymentStatus() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.log(`
⚠️  Cannot check deployment status without Vercel API credentials.

To enable status checking:
  export VERCEL_TOKEN="your-vercel-api-token"
  export VERCEL_PROJECT_ID="your-project-id"
  export VERCEL_TEAM_ID="your-team-id" (if applicable)

For now, check your Vercel dashboard manually.
    `);
    return null;
  }

  console.log('\n📊 Checking deployment status...\n');

  try {
    let url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=5`;
    if (VERCEL_TEAM_ID) {
      url += `&teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('Recent Deployments:');
    console.log('─'.repeat(60));

    for (const deployment of data.deployments || []) {
      const status = deployment.state || deployment.readyState;
      const statusIcon =
        status === 'READY' ? '✅' :
        status === 'BUILDING' ? '🔨' :
        status === 'QUEUED' ? '⏳' :
        status === 'ERROR' ? '❌' : '❓';

      const createdAt = new Date(deployment.createdAt).toLocaleString();
      console.log(`  ${statusIcon} ${status.padEnd(10)} | ${createdAt} | ${deployment.url || 'N/A'}`);
    }

    console.log('─'.repeat(60));

    return data;
  } catch (error) {
    console.error('❌ Failed to check status:', error.message);
    return null;
  }
}

async function waitForDeployment(maxWaitMs = 300000) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.log('\n⏳ Waiting 60 seconds for deployment (no API access for status check)...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    console.log('✅ Wait complete. Check your Vercel dashboard for deployment status.\n');
    return;
  }

  console.log('\n⏳ Waiting for deployment to complete...\n');

  const startTime = Date.now();
  const pollInterval = 10000; // 10 seconds

  while (Date.now() - startTime < maxWaitMs) {
    try {
      let url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1`;
      if (VERCEL_TEAM_ID) {
        url += `&teamId=${VERCEL_TEAM_ID}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      });

      const data = await response.json();
      const latest = data.deployments?.[0];

      if (latest) {
        const status = latest.state || latest.readyState;
        const elapsed = Math.round((Date.now() - startTime) / 1000);

        if (status === 'READY') {
          console.log(`\n✅ Deployment complete! (${elapsed}s)`);
          console.log(`   URL: https://${latest.url}`);
          return latest;
        } else if (status === 'ERROR') {
          console.log(`\n❌ Deployment failed after ${elapsed}s`);
          return null;
        }

        process.stdout.write(`\r  Status: ${status} (${elapsed}s elapsed)...`);
      }
    } catch (error) {
      // Continue polling even if one request fails
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  console.log('\n⚠️  Timeout waiting for deployment. Check Vercel dashboard.\n');
  return null;
}

async function verifyBlogAccessible(slug = null) {
  const baseUrl = 'https://robeen.ai/blog';
  const testUrl = slug ? `${baseUrl}/${slug}` : baseUrl;

  console.log(`\n🔍 Verifying blog is accessible: ${testUrl}`);

  try {
    const response = await fetch(testUrl);

    if (response.ok) {
      console.log('✅ Blog is accessible!\n');
      return true;
    } else {
      console.log(`⚠️  Got HTTP ${response.status}. Page may not be ready yet.\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error accessing blog: ${error.message}\n`);
    return false;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--status') || args.includes('-s')) {
  checkDeploymentStatus();
} else if (args.includes('--verify')) {
  const slugIndex = args.indexOf('--verify');
  const slug = args[slugIndex + 1];
  verifyBlogAccessible(slug);
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📦 rebuild-blog.js - Vercel Deployment Trigger

Usage:
  node scripts/rebuild-blog.js              Trigger rebuild
  node scripts/rebuild-blog.js --wait       Trigger and wait for completion
  node scripts/rebuild-blog.js --status     Check recent deployment status
  node scripts/rebuild-blog.js --verify     Verify blog is accessible
  node scripts/rebuild-blog.js --verify "slug"  Verify specific post

Environment Variables:
  VERCEL_DEPLOY_HOOK_URL  (required) Deploy hook URL from Vercel
  VERCEL_TOKEN            (optional) API token for status checking
  VERCEL_PROJECT_ID       (optional) Project ID for status checking
  VERCEL_TEAM_ID          (optional) Team ID if applicable

Setup:
  1. Go to Vercel Dashboard → Your Project → Settings → Git
  2. Scroll to "Deploy Hooks" section
  3. Create a new hook named "Blog Content Update"
  4. Copy the URL and set as VERCEL_DEPLOY_HOOK_URL
  `);
} else {
  // Default: trigger rebuild
  triggerRebuild().then(async (result) => {
    if (result && args.includes('--wait')) {
      await waitForDeployment();
      await verifyBlogAccessible();
    } else if (result) {
      console.log('\n💡 Tip: Use --wait to wait for deployment to complete');
      console.log('        Use --status to check deployment status\n');
    }
  });
}
