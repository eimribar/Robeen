# Robeen Website

> Marketing website (robeen.ai) + Blog content engine

## Quick Reference

| Item | Value |
|------|-------|
| **Repository** | github.com/eimribar/Robeen |
| **Live URL** | https://robeen.ai |
| **Blog URL** | https://robeen.ai/blog |
| **Deployment** | Vercel (auto-deploys from main) |
| **Credentials** | `.env.local` |

---

## Project Structure

```
robeen-website/
├── src/                    # Main website (React + Vite)
│   ├── components/         # React components
│   ├── pages/              # Route pages
│   └── assets/             # Static assets
├── blog/                   # Blog subsystem (Next.js 16)
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # Blog components
│   │   └── lib/           # Utilities (Supabase, posts)
│   ├── scripts/           # Blog generation scripts
│   │   ├── generate-post.js      # Generate post from topic
│   │   ├── generate-images.js    # Generate images with Gemini
│   │   ├── inject-links.js       # Inject internal links
│   │   └── research-topic.js     # Research keywords
│   └── package.json
├── supabase/
│   └── migrations/        # Database migrations
├── .env.local             # All credentials (NEVER commit)
└── package.json
```

---

## Key Commands

### Main Website
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Blog Subsystem
```bash
# Navigate to blog
cd blog

# Start blog dev server (runs on port 3001)
npm run dev

# Build blog
npm run build
```

### Blog Content Generation
```bash
# Generate a blog post from a topic
cd blog
node scripts/generate-post.js --topic-id <uuid>

# Generate images for a post
node scripts/generate-images.js --post-id <uuid>

# Inject internal links across all posts
node scripts/inject-links.js --all

# Research a new topic
node scripts/research-topic.js --keyword "baby sleep training"
```

### Supabase Database
```bash
# Login to Supabase CLI (use SUPABASE_ACCESS_TOKEN from .env.local)
echo "sbp_xxxxx" | supabase login

# Link to project
supabase link --project-ref uytqxlbymowzaagmvznl

# Push migrations
supabase db push
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `blog_topics` | Topic queue with keywords, funnel stage |
| `blog_posts` | Published blog posts with content blocks |
| `blog_links` | Internal linking tracking |

---

## Content Generation Workflow

1. **Add topics** → Insert keywords into `blog_topics` table
2. **Generate post** → `node scripts/generate-post.js --topic-id <id>`
3. **Generate images** → `node scripts/generate-images.js --post-id <id>`
4. **Publish** → Update post status to 'published'
5. **Inject links** → `node scripts/inject-links.js --all`

---

## Credentials Location

All credentials are in `.env.local`:
- **GEMINI_API_KEY** - For blog image generation
- **SUPABASE_SERVICE_KEY** - For server-side Supabase access
- **SUPABASE_ACCESS_TOKEN** - For Supabase CLI authentication
- **NEXT_PUBLIC_SUPABASE_URL** - Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - For client-side Supabase access

---

## Related Projects

- **Mobile App**: `/Users/eimribar/robeen-app` (Robeen iOS/Android app)
- **Marketing Assets**: `/Users/eimribar/Desktop/Robeen-Assets` (Videos, logos, screenshots)
- **Archive**: `/Users/eimribar/robeen-archive` (Old files, temp copies)
