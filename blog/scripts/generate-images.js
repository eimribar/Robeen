#!/usr/bin/env node
/**
 * generate-images.js
 * Generates images for blog posts using Gemini Imagen 4
 *
 * Usage:
 *   node scripts/generate-images.js --post-id <uuid>
 *   node scripts/generate-images.js --prompt "description of image"
 *
 * Requires: GEMINI_API_KEY environment variable
 */

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uytqxlbymowzaagmvznl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc0NTIxNCwiZXhwIjoyMDc5MzIxMjE0fQ.XphPpmvq0Rayfhizy4W0uAemF_uxix0LP1fqJMPSnsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Image generation settings
const IMAGE_MODEL = 'imagen-4.0-generate-001';
const IMAGE_BUCKET = 'blog-images';

/**
 * Generate a single image from a prompt
 */
async function generateImage(ai, prompt, options = {}) {
  const {
    aspectRatio = '16:9',
    outputPath = null,
  } = options;

  console.log(`\n   Generating image for: "${prompt.substring(0, 50)}..."`);

  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error('No images generated');
    }

    const imageBytes = response.generatedImages[0].image.imageBytes;
    const buffer = Buffer.from(imageBytes, 'base64');

    // Save locally if path provided
    if (outputPath) {
      fs.writeFileSync(outputPath, buffer);
      console.log(`   Saved to: ${outputPath}`);
    }

    return {
      buffer,
      base64: imageBytes,
      mimeType: 'image/png',
    };
  } catch (error) {
    console.error(`   Error generating image: ${error.message}`);
    throw error;
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadToSupabase(buffer, filename) {
  const filePath = `generated/${filename}`;

  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Generate images for a blog post
 */
async function generateImagesForPost(postId) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is required');
    console.log('\nSet it with: export GEMINI_API_KEY=...\n');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  // Fetch post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error || !post) {
    console.error(`Post not found: ${postId}`);
    process.exit(1);
  }

  console.log(`\nGenerating images for: "${post.title}"`);
  console.log('─'.repeat(50));

  // Check for image_prompts in post metadata or content_blocks
  let imagePrompts = [];

  // Look for image_prompts field (stored during generation)
  if (post.image_prompts && Array.isArray(post.image_prompts)) {
    imagePrompts = post.image_prompts;
  }

  // Also look for image blocks in content that need generation
  const imageBlocks = post.content_blocks?.filter(
    (b) => b.type === 'image' && !b.src && b.prompt
  ) || [];

  if (imagePrompts.length === 0 && imageBlocks.length === 0) {
    console.log('No image prompts found in post');
    console.log('\nTo add images, either:');
    console.log('  1. Add image_prompts array to post metadata');
    console.log('  2. Add image blocks with prompt field in content_blocks');
    return;
  }

  const generatedUrls = [];

  // Generate hero image from first prompt
  if (imagePrompts.length > 0) {
    console.log('\n1. Generating hero image...');
    try {
      const heroPrompt = `${imagePrompts[0]}. Professional photography style, warm lighting, soft focus background, high quality, suitable for parenting blog.`;
      const result = await generateImage(ai, heroPrompt, { aspectRatio: '16:9' });

      const filename = `${post.slug}-hero-${Date.now()}.png`;
      const url = await uploadToSupabase(result.buffer, filename);

      generatedUrls.push({ type: 'hero', url, prompt: imagePrompts[0] });
      console.log(`   Uploaded: ${url}`);

      // Update post featured_image
      await supabase
        .from('blog_posts')
        .update({ featured_image: url })
        .eq('id', postId);

      console.log('   Updated post featured_image');
    } catch (err) {
      console.error(`   Failed to generate hero image: ${err.message}`);
    }
  }

  // Generate section images from remaining prompts
  for (let i = 1; i < imagePrompts.length; i++) {
    console.log(`\n${i + 1}. Generating section image ${i}...`);
    try {
      const prompt = `${imagePrompts[i]}. Professional photography style, warm and supportive mood, high quality, suitable for parenting blog about babies and newborns.`;
      const result = await generateImage(ai, prompt, { aspectRatio: '4:3' });

      const filename = `${post.slug}-section-${i}-${Date.now()}.png`;
      const url = await uploadToSupabase(result.buffer, filename);

      generatedUrls.push({ type: 'section', url, prompt: imagePrompts[i] });
      console.log(`   Uploaded: ${url}`);
    } catch (err) {
      console.error(`   Failed to generate image: ${err.message}`);
    }
  }

  // Generate images for image blocks in content
  if (imageBlocks.length > 0) {
    console.log('\nGenerating images for content blocks...');

    const updatedBlocks = [...post.content_blocks];

    for (const block of imageBlocks) {
      const blockIndex = updatedBlocks.findIndex(
        (b) => b.type === 'image' && b.prompt === block.prompt && !b.src
      );

      if (blockIndex === -1) continue;

      console.log(`\n   Block: "${block.prompt.substring(0, 40)}..."`);
      try {
        const prompt = `${block.prompt}. Professional photography style, warm colors, high quality, suitable for parenting blog.`;
        const result = await generateImage(ai, prompt, { aspectRatio: '4:3' });

        const filename = `${post.slug}-block-${blockIndex}-${Date.now()}.png`;
        const url = await uploadToSupabase(result.buffer, filename);

        // Update the block with the generated URL
        updatedBlocks[blockIndex] = {
          ...updatedBlocks[blockIndex],
          src: url,
          alt: block.alt || block.prompt,
        };

        generatedUrls.push({ type: 'block', url, prompt: block.prompt });
        console.log(`   Uploaded: ${url}`);
      } catch (err) {
        console.error(`   Failed: ${err.message}`);
      }
    }

    // Update post content_blocks
    await supabase
      .from('blog_posts')
      .update({ content_blocks: updatedBlocks })
      .eq('id', postId);

    console.log('\n   Updated post content_blocks with image URLs');
  }

  console.log('\n' + '═'.repeat(50));
  console.log(' Image Generation Complete!');
  console.log('═'.repeat(50));
  console.log(`\nGenerated ${generatedUrls.length} images:`);
  generatedUrls.forEach((img, i) => {
    console.log(`  ${i + 1}. [${img.type}] ${img.url}`);
  });
}

/**
 * Generate a single image from command line
 */
async function generateSingleImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is required');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log('\nGenerating image...');
  console.log('─'.repeat(50));
  console.log(`Prompt: ${prompt}`);

  const outputPath = `./generated-image-${Date.now()}.png`;
  await generateImage(ai, prompt, { outputPath });

  console.log('\nDone!');
}

// Main
async function main() {
  const args = process.argv.slice(2);

  const postIdIndex = args.indexOf('--post-id');
  const promptIndex = args.indexOf('--prompt');

  if (postIdIndex !== -1 && args[postIdIndex + 1]) {
    await generateImagesForPost(args[postIdIndex + 1]);
  } else if (promptIndex !== -1 && args[promptIndex + 1]) {
    await generateSingleImage(args[promptIndex + 1]);
  } else {
    console.log(`
 generate-images.js - Gemini Imagen 4 Image Generator

Usage:
  node scripts/generate-images.js --post-id <uuid>    Generate images for a blog post
  node scripts/generate-images.js --prompt "..."      Generate a single test image

Requires:
  GEMINI_API_KEY environment variable

Example:
  export GEMINI_API_KEY=...
  node scripts/generate-images.js --post-id abc-123-def
    `);
  }
}

main().catch(console.error);
