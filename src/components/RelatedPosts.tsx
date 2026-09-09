import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findRelatedPosts } from '@/lib/blogUtils';
import { Post } from '@/App';

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
  posts: Post[];
}

export default function RelatedPosts({ currentSlug, currentTags, posts }: RelatedPostsProps) {
  const related = findRelatedPosts(currentSlug, currentTags, posts, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">관련 글</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(post => (
          <Link key={post.slug} to={`/posts/${post.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.date}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
