// --- Reading Time Utility ---
export function estimateReadingTime(content: string, wordsPerMinute: number = 200): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes < 1 ? '< 1분' : `${minutes}분`;
}

// --- Word Count ---
export function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
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
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
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
