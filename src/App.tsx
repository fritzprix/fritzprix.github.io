import matter from 'gray-matter';
import { Github, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import WebGLBackground from './components/WebGLBackground';
import { ThemeProvider } from './components/theme-provider';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';

// --- Moved Post Data Type Definitions --- 
export interface PostData {
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
}

export interface Post {
  slug: string;
  data: PostData;
  content: string;
}

// --- Profile Type Definition --- 
export interface SocialLink {
  name: string;
  url: string;
  icon: string; // Keep icon field if you plan to use it later
}

export interface ProfileData {
  name: string;
  email: string;
  address: string;
  website: string;
  social: SocialLink[];
  profileImageUrl?: string; // Make optional if not always present
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null); // State for profile data
  const [aboutMeContent, setAboutMeContent] = useState<string>(""); // State for aboutme.md content

  useEffect(() => {
    const modules = import.meta.glob('../posts/*.md', {
      eager: true,
      query: '?raw',
      import: 'default'
    });
    const loadedPosts = Object.entries(modules).map(([filepath, rawContent]) => {
      const slug = filepath.split('/').pop()?.replace('.md', '') ?? 'unknown-slug';
      const { data, content } = matter(rawContent as string);

      // --- Ensure date is a string --- 
      let dateString: string;
      if (data.date instanceof Date) {
        dateString = data.date.toISOString().split('T')[0]; // Format Date object
      } else if (typeof data.date === 'string') {
        dateString = data.date; // Use existing string
      } else {
        dateString = new Date().toISOString().split('T')[0]; // Default to today
      }
      // --- End date formatting ---

      // --- Generate excerpt if missing, cleaning content first --- 
      let excerpt: string;
      if (data.excerpt) {
        excerpt = data.excerpt;
      } else {
        // Remove markdown images and headings for cleaner auto-excerpt
        const cleanedContent = content
          .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images ![]()
          .replace(/^#+\s+/gm, '') // Remove heading hashes #, ## etc.
          .replace(/\*\*|__/g, '') // Remove bold markers
          .replace(/\*|_/g, '') // Remove italic markers
          .replace(/\r\n|\n|\r/g, ' ') // Replace newlines with spaces
          .trim();
        excerpt = cleanedContent.substring(0, 150) + (cleanedContent.length > 150 ? '...' : ''); // Increase length slightly
      }
      // --- End excerpt generation ---

      const postData: PostData = {
        title: data.title ?? 'Untitled',
        date: dateString, // Assign the formatted string date
        author: data.author ?? 'Unknown Author',
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt: excerpt, // Assign the cleaned or provided excerpt
      };
      return { slug, data: postData, content };
    });
    loadedPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    setPosts(loadedPosts);
  }, []);

  useEffect(() => {
    fetch('/about.json') // Fetch from public directory
      .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
      .then((data: ProfileData) => {
        setProfileData(data);
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
        // Handle error appropriately, maybe set default data or show an error message
      });
  }, []); // Empty dependency array, runs once on mount

  // Effect for loading aboutme.md content
  useEffect(() => {
    fetch('/aboutme.md') // Fetch raw markdown text
      .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! status: ${response.status}`))
      .then(text => {
        setAboutMeContent(text);
      })
      .catch(error => {
        console.error("Error fetching about me content:", error);
      });
  }, []);

  const name = profileData?.name ?? "";
  const initials = name.split(' ').map(n => n?.[0] ?? '').join('');

  if (!profileData || aboutMeContent === "") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen relative">
          <WebGLBackground />
          <header className="mb-8 z-10">
            <nav className="flex justify-between items-center">
              <ul className="flex space-x-6">
                <li><Link to="/" className="text-lg hover:text-primary transition-colors">Home</Link></li>
              </ul>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:72ave2@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/fritzprix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </nav>
          </header>
          <Routes>
            <Route
              path="/"
              element={<HomePage
                posts={posts}
                profileData={profileData}
                aboutMeContent={aboutMeContent}
                initials={initials}
              />}
            />
            <Route
              path="/posts/:slug"
              element={<PostDetailPage posts={posts} />}
            />
          </Routes>
          <footer className="mt-12 pt-4 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {profileData.name}</p>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
