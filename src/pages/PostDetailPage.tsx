import { Post } from '@/App'; // Assuming Post type is exported from App.tsx
import { Button } from '@/components/ui/button'; // For back button
import { MarkdownComponents } from '../components/MarkdownComponents'; // Import custom components
import { ArrowLeft } from 'lucide-react'; // Icon for back button
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
// import { DiscussionEmbed } from 'disqus-react'; // Removed Disqus import

interface PostDetailPageProps {
  posts: Post[];
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ posts }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find the post by slug
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


  return (
    <article className="w-full max-w-4xl mx-auto py-8"> {/* Centered content */}
       <Button onClick={() => navigate(-1)} className="mb-6">
         <ArrowLeft className="mr-2 h-4 w-4" /> Back to posts
       </Button>
       <header className="mb-8 border-b pb-4">
         <h1 className="text-4xl font-bold mb-2">{post.data.title}</h1>
         <p className="text-muted-foreground">
           {post.data.date} - {post.data.author} | Tags: {post.data.tags.join(', ')}
         </p>
         {/* Add image here if needed, maybe from frontmatter */}
       </header>
       <div className="max-w-none text-justify"> 
         <ReactMarkdown 
           remarkPlugins={[remarkGfm, remarkBreaks]} 
           components={MarkdownComponents} // Pass the custom components
           skipHtml={false} // Keep skipHtml if needed, otherwise remove
         >
            {post.content}
        </ReactMarkdown>
       </div>
    </article>
  );
};

export default PostDetailPage; 