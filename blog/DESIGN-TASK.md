# Blog Block Components Design Task

## Overview

We have a parenting blog at **robeen.ai/blog** that uses modular content blocks to create visually engaging articles. The blocks are functional but need design refinement to match the Robeen brand aesthetic—warm, supportive, modern, and parent-friendly.

## Live Examples

- **Blog index**: https://www.robeen.ai/blog/
- **Sample post with all block types**: https://www.robeen.ai/blog/sleep-training-methods-compared-find-what-works-for-you/

## Files to Work On

All block components are located in:

```
blog/src/components/blocks/
├── Callout.tsx          # Tip/warning/info callout boxes
├── ComparisonTable.tsx  # Side-by-side comparison tables
├── ExpertQuote.tsx      # Expert quotes with credentials
├── FAQ.tsx              # Always-visible FAQ section
├── ImageBlock.tsx       # Images with captions
├── ProsCons.tsx         # Pros and cons lists
├── StatHighlight.tsx    # Big statistics with sources
├── StepByStep.tsx       # Numbered tutorial steps
├── Timeline.tsx         # Age/stage progressions
├── TLDR.tsx             # Quick summary box
└── index.ts             # Barrel export
```

**Main content renderer**: `blog/src/components/BlogPostContent.tsx`

**Global styles**: `blog/src/app/globals.css`

## Current Brand Colors (from globals.css)

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #6366f1;      /* Indigo */
  --secondary: #ec4899;    /* Pink */
  --accent: #f472b6;       /* Light pink */
  --background-slate: #f8fafc;
  --surface: #ffffff;
}
```

## Block Descriptions & Current State

### 1. TLDR (`TLDR.tsx`)
**Purpose**: Quick summary box at the top of articles with 3-5 key points.

**Current**: Basic indigo left border with bullet points.

**Consider**: More prominent styling, possibly a card with gradient background, better visual hierarchy.

---

### 2. ExpertQuote (`ExpertQuote.tsx`)
**Purpose**: Quotes from medical experts with their photo, name, title, and organization.

**Current**: Gray background card with avatar placeholder and quote.

**Consider**: More elegant quote styling, better typography for credentials, subtle design touches that convey authority/trust.

---

### 3. StatHighlight (`StatHighlight.tsx`)
**Purpose**: Eye-catching statistics (e.g., "80% of parents report...") with source citation.

**Current**: Centered large number with gradient text.

**Consider**: More impactful visual treatment, perhaps a card or banner style, better source attribution styling.

---

### 4. Callout (`Callout.tsx`)
**Purpose**: Highlighted boxes for tips, warnings, and info. Three variants:
- `tip` (💡) - Helpful advice
- `warning` (⚠️) - Safety information
- `info` (ℹ️) - Good to know

**Current**: Colored left border with matching background tint.

**Consider**: More polished icons, better padding/spacing, more distinctive styling per variant.

---

### 5. ComparisonTable (`ComparisonTable.tsx`)
**Purpose**: Side-by-side comparisons (e.g., sleep training methods).

**Current**: Standard table with alternating row colors.

**Consider**: More modern table design, better header styling, mobile responsiveness improvements.

---

### 6. ProsCons (`ProsCons.tsx`)
**Purpose**: Two-column layout showing pros (✓) and cons (✗).

**Current**: Two cards side by side with green/red accents.

**Consider**: More balanced visual weight, better iconography, improved mobile stacking.

---

### 7. StepByStep (`StepByStep.tsx`)
**Purpose**: Numbered tutorial steps with title, description, and optional duration.

**Current**: Numbered circles with connecting line.

**Consider**: More visual interest, better step number styling, clearer visual flow.

---

### 8. Timeline (`Timeline.tsx`)
**Purpose**: Age-based progressions (e.g., "0-3 months", "3-6 months").

**Current**: Left-aligned timeline with dots and cards.

**Consider**: More engaging timeline visualization, better age label styling, clearer progression.

---

### 9. FAQ (`FAQ.tsx`)
**Purpose**: Always-visible Q&A section (NOT accordion—intentionally always open for SEO).

**Current**: Simple question/answer pairs with styled question text.

**Consider**: Better visual separation between Q&As, more distinctive question styling, improved readability.

---

### 10. ImageBlock (`ImageBlock.tsx`)
**Purpose**: Images with optional captions.

**Current**: Rounded image with italic caption below.

**Consider**: Better caption styling, possible subtle frame/shadow, responsive sizing.

---

## Design Guidelines

### Brand Personality
- **Warm & Supportive**: Parents are tired and stressed—the design should feel calming
- **Trustworthy**: Medical/scientific content needs to feel credible
- **Modern but Accessible**: Clean design that works for all ages
- **Mobile-First**: Most parents browse on phones while feeding/rocking baby

### Typography
- Currently using system fonts
- Headers should feel friendly, not clinical
- Body text needs excellent readability

### Spacing
- Generous whitespace between blocks
- Consistent padding within blocks
- Clear visual separation between sections

### Color Usage
- Primary indigo for interactive/accent elements
- Pink/accent for warmth
- Avoid harsh reds for warnings (use softer tones—parents are anxious enough)

## Technical Notes

- Components use **Tailwind CSS v4**
- Blog is a **Next.js 16** static export
- Must remain **mobile responsive**
- Keep components performant (no heavy animations)
- Typography plugin is available: `@tailwindcss/typography`

## Testing Your Changes

```bash
cd blog
npm install
npm run dev
# Visit http://localhost:3000/blog/sleep-training-methods-compared-find-what-works-for-you/
```

## Questions?

Check the live post to see all blocks in context. Each block type appears at least once in the sample article.
