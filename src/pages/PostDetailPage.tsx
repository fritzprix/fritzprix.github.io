import { Post, ProfileData } from '@/App';
import { Button } from '@/components/ui/button';
import { MarkdownComponents } from '../components/MarkdownComponents';
import { ArrowLeft, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Giscus from '@giscus/react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkDirectiveRehype from '../lib/remark-directive-rehype';
import { estimateReadingTime, countWords } from '../lib/blogUtils';
import TableOfContents from '../components/TableOfContents';
import SocialShareButtons from '../components/SocialShareButtons';
import RelatedPosts from '../components/RelatedPosts';
import AuthorCard from '../components/AuthorCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { SiteHelmet } from '../components/SEO';
import Newsletter from '../components/Newsletter';

interface PostDetailPageProps {
  posts: Post[];
  profileData?: ProfileData;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ posts, profileData }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    } else {
      fetch('/about.json')
        .then(r => r.ok ? r.json() : null)
        .then(setProfile)
        .catch(() => null);
    }
  }, [profileData]);

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl mb-4">Post not found!</h2>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const readingTime = estimateReadingTime(post.content);
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

      <article className="w-full max-w-7xl mx-auto py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Posts', href: '/' },
          { label: post.data.title }
        ]} />

        {/* Back Button */}
        <Button onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to posts
        </Button>

        {/* Header */}
        <header className="mb-8 pb-4 border-b">
          <h1 className="text-4xl font-bold mb-4 leading-tight">{post.data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <time>{post.data.date}</time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} 읽기
            </span>
            <span>·</span>
            <span>{wordCount.toLocaleString()} words</span>
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
            <TableOfContents content={post.content} />
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
                {post.content}
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
                bio="An anonymous seeker, navigating the complexities of our world through persistent curiosity and unwavering determination."
                social={profile.social}
              />
            )}

            {/* Newsletter */}
            {profile && (
              <Newsletter email={profile.email} />
            )}

            {/* Comments (giscus) */}
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">Comments</h2>
              <Giscus
                id="comments"
                repo="fritzprix/fritzprix.github.io"
                repoId="R_kgDOOdG2bw"
                category="General"
                categoryId="DIC_kwDOOdG2b84DFObu"
                mapping="pathname"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme="preferred_color_scheme"
                lang="en"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostDetailPage;
