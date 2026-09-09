import { Post } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useMemo, useState } from 'react';
import WordCloud from 'react-d3-cloud';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface PostsSectionProps {
  posts: Post[];
}

// Calculate tag frequencies
const calculateTagFrequencies = (posts: Post[]) => {
  const tagCounts: { [tag: string]: number } = {};
  posts.forEach(post => {
    post.data.tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts).map(([text, value]) => ({ text, value }));
};

// --- Post List Item Component (Using Link) ---
const PostListItem: React.FC<{ post: Post }> = ({ post }) => (
  <Link to={`/posts/${post.slug}`} className="block hover:no-underline group">
    <Card
      key={post.slug}
      className="h-full hover:shadow-md transition-shadow duration-200"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors leading-snug">
            {post.data.title}
          </CardTitle>
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
            post.data.lang === 'ko'
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}>
            {post.data.lang.toUpperCase()}
          </span>
        </div>
        <CardDescription>{post.data.date} - {post.data.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{post.data.excerpt}</CardDescription>
      </CardContent>
    </Card>
  </Link>
);

const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'ko' | 'en'>('all');

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter(post => post.data.lang === activeFilter);
  }, [posts, activeFilter]);

  const tagData = useMemo(() => calculateTagFrequencies(filteredPosts), [filteredPosts]);
  const [containerWidth, setContainerWidth] = React.useState(300);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fontSizeMapper = useCallback((word: { text: string; value: number }) => 12 + word.value * 6, []);
  const rotate = useCallback(() => (Math.random() > 0.5 ? 0 : 90), []);

  return (
    <section className="posts-and-tags mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Post List */}
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold">{t('postsTitle')}</h2>
            
            {/* Language filter tabs */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-background shadow-xs font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('filterAll')} ({posts.length})
              </button>
              <button
                onClick={() => setActiveFilter('ko')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeFilter === 'ko'
                    ? 'bg-background shadow-xs font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('filterKo')} ({posts.filter(p => p.data.lang === 'ko').length})
              </button>
              <button
                onClick={() => setActiveFilter('en')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeFilter === 'en'
                    ? 'bg-background shadow-xs font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('filterEn')} ({posts.filter(p => p.data.lang === 'en').length})
              </button>
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
                <PostListItem key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">{t('noPosts')}</p>
          )}
        </div>

        {/* Right Column: Tag Cloud */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-6">{t('tagsTitle')}</h2>
          <Card>
            <CardContent className="pt-6">
              {tagData.length > 0 ? (
                <div ref={containerRef} style={{ height: 300, width: '100%' }}>
                  {typeof window !== 'undefined' && containerWidth > 0 && (
                    <WordCloud
                      data={tagData}
                      width={containerWidth}
                      height={300}
                      font="sans-serif"
                      fontSize={fontSizeMapper}
                      rotate={rotate}
                      padding={2}
                    />
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground py-12 text-center">{t('noTags')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PostsSection;