import matter from 'gray-matter';
import { Github, Mail, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/ModeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import SearchOverlay from './components/SearchOverlay';
import ScrollToTop from './components/ScrollToTop';
import { SkeletonProfile, SkeletonCard } from './components/SkeletonLoader';
import { decodeEmail } from './lib/emailUtils';

// --- Post Data Type Definitions --- 
export interface PostData {
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  lang: 'ko' | 'en';
  baseSlug: string;
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
  icon: string;
}

export interface ProfileData {
  name: string;
  email: string;
  address: string;
  website: string;
  social: SocialLink[];
  profileImageUrl?: string;
}

function AppContent() {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [aboutMeContent, setAboutMeContent] = useState<string>("");

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const modules = import.meta.glob('../posts/*.md', {
      eager: true,
      query: '?raw',
      import: 'default'
    });
    const loadedPosts = Object.entries(modules).map(([filepath, rawContent]) => {
      const slug = filepath.split('/').pop()?.replace('.md', '') ?? 'unknown-slug';
      const { data, content } = matter(rawContent as string);

      let dateString: string;
      if (data.date instanceof Date) {
        dateString = data.date.toISOString().split('T')[0];
      } else if (typeof data.date === 'string') {
        dateString = data.date;
      } else {
        dateString = new Date().toISOString().split('T')[0];
      }

      let excerpt: string;
      if (data.excerpt) {
        excerpt = data.excerpt;
      } else {
        const cleanedContent = content
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .replace(/^#+\s+/gm, '')
          .replace(/\*\*|__/g, '')
          .replace(/\*|_/g, '')
          .replace(/\r\n|\n|\r/g, ' ')
          .trim();
        excerpt = cleanedContent.substring(0, 150) + (cleanedContent.length > 150 ? '...' : '');
      }

      // Detect post language: check frontmatter locale/lang first, then Hangul characters
      let postLang: 'ko' | 'en' = 'en';
      if (data.locale && typeof data.locale === 'string') {
        postLang = data.locale.toLowerCase().startsWith('ko') ? 'ko' : 'en';
      } else if (data.lang && typeof data.lang === 'string') {
        postLang = data.lang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
      } else {
        postLang = /[\uac00-\ud7a3]/.test(data.title + ' ' + content) ? 'ko' : 'en';
      }

      const baseSlug = slug.replace(/-(en|ko)$/, '');

      const postData: PostData = {
        title: data.title ?? 'Untitled',
        date: dateString,
        author: data.author ?? 'Unknown Author',
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt: excerpt,
        lang: postLang,
        baseSlug: baseSlug,
      };
      return { slug, data: postData, content };
    });
    loadedPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    setPosts(loadedPosts);
  }, []);

  useEffect(() => {
    fetch('/about.json')
      .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
      .then((data: ProfileData) => {
        setProfileData({
          ...data,
          email: decodeEmail(data.email),
        });
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
      });
  }, []);

  useEffect(() => {
    // Attempt localized aboutme file first, then fallback to default
    fetch(`/aboutme_${lang}.md`)
      .then(r => r.ok ? r.text() : fetch('/aboutme.md').then(r2 => r2.text()))
      .then(text => {
        setAboutMeContent(text);
      })
      .catch(error => {
        console.error("Error fetching about me content:", error);
      });
  }, [lang]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const name = profileData?.name ?? "";
  const initials = name.split(' ').map(n => n?.[0] ?? '').join('');

  const isLoading = !profileData || aboutMeContent === "";

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen relative">
        <header className="mb-8 z-10">
          <nav className="flex justify-between items-center">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center"
            >
              <span className="text-foreground font-semibold">fritzprix</span>
              <span className="text-primary font-mono text-base font-normal">.dev</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                aria-label={t('search')}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">{t('search')}</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-muted border rounded text-[10px] text-muted-foreground">{t('searchShortcut')}</kbd>
              </button>
              <LanguageToggle />
              <ModeToggle />
              <a
                href={profileData?.email ? `mailto:${profileData.email}` : undefined}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={t('email')}
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={profileData?.social?.find(s => s.icon === 'github')?.url || 'https://github.com/fritzprix'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={t('github')}
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </nav>
        </header>

        {isLoading ? (
          <main className="flex-grow">
            <SkeletonProfile />
            <div className="mb-12">
              <SkeletonCard />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <div className="md:col-span-1">
                <SkeletonCard />
              </div>
            </div>
          </main>
        ) : (
          <>
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
                element={<PostDetailPage posts={posts} profileData={profileData} />}
              />
            </Routes>
            <footer className="mt-12 pt-4 border-t text-center text-muted-foreground relative z-10">
              <p>&copy; {new Date().getFullYear()} {profileData.name}. {t('allRightsReserved')}</p>
            </footer>
          </>
        )}
      </div>
      <SearchOverlay posts={posts} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </BrowserRouter>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
