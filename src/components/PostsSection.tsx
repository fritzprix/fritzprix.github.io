import { Post } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tag as TagIcon, X } from 'lucide-react';

interface PostsSectionProps {
  posts: Post[];
}

// Calculate tag frequencies sorted by count descending
const calculateTagFrequencies = (posts: Post[]) => {
  const tagCounts: { [tag: string]: number } = {};
  posts.forEach(post => {
    post.data.tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value);
};

// --- Post List Item Component ---
const PostListItem: React.FC<{ post: Post }> = ({ post }) => (
  <Link to={`/posts/${post.slug}`} className="block hover:no-underline group">
    <Card
      key={post.slug}
      className="h-full border border-border/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug tracking-tight">
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
        <CardDescription className="text-xs text-muted-foreground/80 mt-1">
          {post.data.date} · {post.data.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.data.excerpt}
        </CardDescription>
        {post.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/40">
            {post.data.tags.map(t => (
              <span key={t} className="text-[11px] font-mono text-muted-foreground/70 bg-muted/40 px-2 py-0.5 rounded">
                #{t}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </Link>
);

const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'ko' | 'en'>(() => lang);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sync active filter with site language
  React.useEffect(() => {
    setActiveFilter(lang);
  }, [lang]);

  // Tag list based on language-filtered posts
  const langFilteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter(post => post.data.lang === activeFilter);
  }, [posts, activeFilter]);

  const tagData = useMemo(() => calculateTagFrequencies(langFilteredPosts), [langFilteredPosts]);

  // Final posts filtered by both language and selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return langFilteredPosts;
    return langFilteredPosts.filter(post => post.data.tags.includes(selectedTag));
  }, [langFilteredPosts, selectedTag]);

  return (
    <section className="posts-and-tags mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Post List */}
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{t('postsTitle')}</h2>
              {selectedTag && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                  <span>#{selectedTag}</span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="hover:opacity-75 focus:outline-none cursor-pointer"
                    aria-label="Clear tag filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Language filter tabs */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
              <button
                onClick={() => { setActiveFilter('all'); setSelectedTag(null); }}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-background shadow-xs font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('filterAll')} ({posts.length})
              </button>
              <button
                onClick={() => { setActiveFilter('ko'); setSelectedTag(null); }}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'ko'
                    ? 'bg-background shadow-xs font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('filterKo')} ({posts.filter(p => p.data.lang === 'ko').length})
              </button>
              <button
                onClick={() => { setActiveFilter('en'); setSelectedTag(null); }}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
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
            <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border/80">
              <p className="text-muted-foreground mb-3">{t('noPosts')}</p>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-primary underline hover:opacity-80 cursor-pointer"
                >
                  태그 필터 초기화
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Topics & Tags Sidebar */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <TagIcon className="w-4 h-4 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">{t('tagsTitle')}</h2>
          </div>
          <Card className="border border-border/70 bg-card/60 backdrop-blur-xs">
            <CardContent className="pt-5 pb-5">
              {tagData.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagData.map(({ text, value }) => {
                    const isSelected = selectedTag === text;
                    return (
                      <button
                        key={text}
                        onClick={() => setSelectedTag(isSelected ? null : text)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-muted/50 hover:bg-muted text-foreground/80 border-border/60 hover:border-foreground/30'
                        }`}
                      >
                        <span>#{text}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-primary-foreground/20 text-primary-foreground font-mono'
                            : 'bg-background/80 text-muted-foreground font-mono border border-border/40'
                        }`}>
                          {value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center text-sm">{t('noTags')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PostsSection;
