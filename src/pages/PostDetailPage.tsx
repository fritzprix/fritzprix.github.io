import { Post, ProfileData } from '@/App';
import { Button } from '@/components/ui/button';
import { MarkdownComponents } from '../components/MarkdownComponents';
import { ArrowLeft, Clock, Globe } from 'lucide-react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Giscus from '@giscus/react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkDirectiveRehype from '../lib/remark-directive-rehype';
import { estimateReadingTime, countWords, fixKoreanMarkdownEmphasis } from '../lib/blogUtils';
import TableOfContents from '../components/TableOfContents';
import SocialShareButtons from '../components/SocialShareButtons';
import RelatedPosts from '../components/RelatedPosts';
import AuthorCard from '../components/AuthorCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { SiteHelmet } from '../components/SEO';
import Newsletter from '../components/Newsletter';
import { giscusConfig } from '../config/giscus';
import { decodeEmail } from '../lib/emailUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface PostDetailPageProps {
  posts: Post[];
  profileData?: ProfileData;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ posts, profileData }) => {
  const { lang, t, setLang } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const prevSlugRef = useRef<string | null>(null);
  const prevLangRef = useRef<string>(lang);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    } else {
      fetch('/about.json')
        .then(r => r.ok ? r.json() : null)
        .then((data: ProfileData | null) => {
          if (data) {
            setProfile({
              ...data,
              email: decodeEmail(data.email),
            });
          }
        })
        .catch(() => null);
    }
  }, [profileData]);

  const post = posts.find(p => p.slug === slug);
  const alternatePost = post ? posts.find(p => p.data.baseSlug === post.data.baseSlug && p.slug !== post.slug) : null;

  useEffect(() => {
    // 1. If slug changed (user navigated directly to another post)
    if (slug !== prevSlugRef.current) {
      prevSlugRef.current = slug || null;
      prevLangRef.current = post?.data.lang || lang;
      if (post && post.data.lang !== lang) {
        setLang(post.data.lang);
      }
      return;
    }

    // 2. If user toggled language in the header LanguageToggle while reading this post
    if (lang !== prevLangRef.current) {
      prevLangRef.current = lang;
      if (post && alternatePost && post.data.lang !== lang && alternatePost.data.lang === lang) {
        navigate(`/posts/${alternatePost.slug}`);
      }
    }
  }, [slug, post, alternatePost, lang, setLang, navigate]);

  const processedContent = useMemo(() => {
    return post ? fixKoreanMarkdownEmphasis(post.content) : '';
  }, [post]);

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl mb-4">{t('postNotFound')}</h2>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('goBack')}
        </Button>
      </div>
    );
  }

  const readingTime = estimateReadingTime(post.content, 200, post.data.lang);
  const wordCount = countWords(post.content);
  const postUrl = `/posts/${post.slug}`;

  return (
    <>
      {/* SEO */}
      <SiteHelmet
        title={post.data.title}
        description={post.data.excerpt}
        url={postUrl}
        type="article"
        articleTags={post.data.tags}
        publishedTime={post.data.date}
      />

      <article className="w-full max-w-7xl mx-auto py-8 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: t('postsTitle'), href: '/' },
          { label: post.data.title }
        ]} />

        {/* Back Button */}
        <Button onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToPosts')}
        </Button>

        {/* Header */}
        <header className="mb-8 pb-4 border-b">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold ${
                post.data.lang === 'ko'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}>
                {post.data.lang === 'ko' ? '한국어' : 'English'}
              </span>
            </div>

            {alternatePost && (
              <button
                onClick={() => {
                  setLang(alternatePost.data.lang);
                  navigate(`/posts/${alternatePost.slug}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border/80 bg-muted/50 hover:bg-muted hover:border-primary/50 text-foreground transition-all cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>
                  {alternatePost.data.lang === 'ko' ? '🇰🇷 한국어로 읽기' : '🇺🇸 Read in English'}
                </span>
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">{post.data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <time>{post.data.date}</time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} {t('readTime')}
            </span>
            <span>·</span>
            <span>{wordCount.toLocaleString()} {t('words')}</span>
            <span>·</span>
            <span>{post.data.author}</span>
          </div>
          {post.data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.data.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content Area: TOC + Article */}
        <div className="flex gap-8">
          {/* Table of Contents — Desktop only */}
          <div className="hidden xl:block flex-shrink-0">
            <TableOfContents key={post.slug} content={post.content} lang={post.data.lang} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Social Share */}
            <div className="mb-6">
              <SocialShareButtons title={post.data.title} url={postUrl} />
            </div>

            {/* Article Body */}
            <div className="max-w-none text-justify prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks, remarkDirective, remarkDirectiveRehype]}
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
                skipHtml={false}
              >
                {processedContent}
              </ReactMarkdown>
            </div>

            {/* Related Posts */}
            <RelatedPosts
              currentSlug={post.slug}
              currentTags={post.data.tags}
              posts={posts}
            />

            {/* Author Card */}
            {profile && (
              <AuthorCard
                name={profile.name}
                email={profile.email}
                location={profile.address}
                bio={t('authorBio')}
                social={profile.social}
              />
            )}

            {/* Newsletter */}
            {profile && (
              <Newsletter email={profile.email} />
            )}

            {/* Comments (giscus) */}
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">{t('comments')}</h2>
              <Giscus
                id="comments"
                repo={giscusConfig.repo}
                repoId={giscusConfig.repoId}
                category={giscusConfig.category}
                categoryId={giscusConfig.categoryId}
                mapping={giscusConfig.mapping}
                reactionsEnabled={giscusConfig.reactionsEnabled}
                emitMetadata={giscusConfig.emitMetadata}
                inputPosition={giscusConfig.inputPosition}
                theme={giscusConfig.theme}
                lang={lang === 'ko' ? 'ko' : 'en'}
                loading={giscusConfig.loading}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostDetailPage;
