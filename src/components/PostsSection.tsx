import { Post } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useMemo } from 'react';
import WordCloud from 'react-d3-cloud';
import { Link } from 'react-router-dom';

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
  <Link to={`/posts/${post.slug}`} className="block hover:no-underline">
    <Card 
      key={post.slug} 
      className="h-full hover:shadow-md transition-shadow duration-200"
    >
      <CardHeader>
        <CardTitle className="text-lg">{post.data.title}</CardTitle>
        <CardDescription>{post.data.date} - {post.data.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{post.data.excerpt}</CardDescription>
      </CardContent>
    </Card>
  </Link>
);

const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
  const tagData = useMemo(() => calculateTagFrequencies(posts), [posts]);

  const fontSizeMapper = useCallback((word: { text: string; value: number }) => 12 + word.value * 6, []);
  const rotate = useCallback(() => (Math.random() > 0.5 ? 0 : 90), []);

  return (
    <section className="posts-and-tags mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Post List */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Posts</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map(post => (
                <PostListItem key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No posts found.</p>
          )}
        </div>

        {/* Right Column: Tag Cloud */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-6">Tags</h2>
          <Card>
            <CardContent className="pt-6">
              {tagData.length > 0 ? (
                <div style={{ height: 300, width: '100%' }}>
                  {typeof window !== 'undefined' && (
                    <WordCloud
                      data={tagData}
                      width={300}
                      height={300}
                      font="sans-serif"
                      fontSize={fontSizeMapper}
                      rotate={rotate}
                      padding={2}
                    />
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No tags found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PostsSection; 