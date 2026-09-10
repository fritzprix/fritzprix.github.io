// --- Reading Time Utility ---
export function estimateReadingTime(content: string, wordsPerMinute: number = 200, lang: 'ko' | 'en' = 'ko'): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  if (lang === 'en') {
    return minutes < 1 ? '< 1' : `${minutes}`;
  }
  return minutes < 1 ? '< 1분' : `${minutes}분`;
}

/**
 * Fix CommonMark flanking delimiter limitation for Korean/CJK text.
 * When closing ** or * is preceded by punctuation (e.g. quotes, parentheses)
 * and directly followed by Hangul characters (particles/조사), CommonMark's
 * flanking delimiter rule fails because Hangul is categorized as Unicode Letter.
 * This converts those instances safely to <strong> / <em> tags outside of code blocks.
 */
export function fixKoreanMarkdownEmphasis(content: string): string {
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts
    .map((part, index) => {
      if (index % 2 === 1) return part;
      let res = part.replace(/\*\*([^\n*]+?[.,!?:;'")[\]}])\*\*([가-힣])/g, '<strong>$1</strong>$2');
      res = res.replace(/(?<!\*)\*([^\n*]+?[.,!?:;'")[\]}])\*(?!\*)([가-힣])/g, '<em>$1</em>$2');
      return res;
    })
    .join('');
}

// --- Word Count ---
export function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

// --- Slugify utility for consistent heading IDs (supports Unicode/Korean) ---
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`#]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80) || 'heading';
}

// --- Extract headings from markdown content for TOC ---
export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): Heading[] {
  const regex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`#]/g, '').trim();
    const id = slugifyHeading(text);
    headings.push({ id, text, level });
  }
  return headings;
}

// --- Tag-based related posts ---
// --- Tag-based related posts ---
export interface RelatedPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  score: number;
}

interface PostLike {
  slug: string;
  data: {
    title: string;
    date: string;
    tags: string[];
  };
}

export function findRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  allPosts: PostLike[],
  limit: number = 3
): RelatedPost[] {
  if (!currentTags || currentTags.length === 0) return [];
  const scored = allPosts
    .filter(p => p.slug !== currentSlug)
    .map(post => {
      const tags = post.data?.tags || [];
      const sharedTags = tags.filter(t => currentTags.includes(t));
      const score = sharedTags.length;
      return {
        slug: post.slug,
        title: post.data?.title ?? 'Untitled',
        date: post.data?.date ?? '',
        tags,
        score,
      };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored;
}

// --- Social sharing ---
export function shareOnX(text: string, url: string) {
  const encoded = encodeURIComponent(`${text} ${url}`);
  window.open(`https://x.com/intent/tweet?text=${encoded}`, '_blank', 'noopener,noreferrer');
}

export function shareOnLinkedIn(text: string, url: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`, '_blank', 'noopener,noreferrer');
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    // Could show a toast, but keeping it simple
  });
}
