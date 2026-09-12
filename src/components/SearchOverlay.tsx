import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Post } from '@/App';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchOverlayProps {
  posts: Post[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ posts, isOpen, onClose }: SearchOverlayProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  // Focus trap & focus restoration
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      inputRef.current?.focus();
    } else {
      setQuery('');
      setSelectedIndex(-1);
      previouslyFocusedRef.current?.focus?.();
    }
  }, [isOpen]);

  // Focus trap Tab handler and Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fuse.js for fuzzy search (recreated when posts change)
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'data.title', weight: 0.5 },
          { name: 'data.excerpt', weight: 0.3 },
          { name: 'data.tags', weight: 0.2 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [posts]
  );

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const fuseResults = fuse.search(query);
    setResults(fuseResults.slice(0, 8).map(r => r.item));
    setSelectedIndex(0);
  }, [query, fuse, posts]);

  const handleSelect = (post: Post) => {
    navigate(`/posts/${post.slug}`);
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < results.length) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('search')}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 pt-[max(4rem,env(safe-area-inset-top))] px-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl bg-card border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="flex-1 py-4 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto" role="listbox" aria-label={t('searchResults')}>
          {query.trim().length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-muted-foreground" role="status">
              "{query}" {t('noResults')}
            </div>
          )}

          {results.map((post, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={post.slug}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(post)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 cursor-pointer ${
                  isSelected ? 'bg-muted/80 text-foreground' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{post.data.title}</span>
                  <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                    post.data.lang === 'ko'
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {post.data.lang.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {post.data.date}
                  {post.data.tags.length > 0 && (
                    <span className="ml-2">
                      {post.data.tags.slice(0, 3).map(tag => `#${tag}`).join(' ')}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {query.trim().length < 2 && (
            <div className="py-6 text-center text-muted-foreground text-sm">
              {t('searchPrompt')}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t bg-muted/30 flex items-center gap-3 text-xs text-muted-foreground">
          <kbd
            role="status"
            aria-label="Escape key to close"
            className="px-1.5 py-0.5 bg-muted border rounded text-[10px] font-mono"
          >
            ESC
          </kbd>
          <span>{t('searchHintEsc')}</span>
          <span className="mx-1" aria-hidden="true">·</span>
          <kbd
            role="status"
            aria-label="Enter key to select"
            className="px-1.5 py-0.5 bg-muted border rounded text-[10px] font-mono"
          >
            ↵
          </kbd>
          <span>{t('searchHintSelect')}</span>
          <span className="mx-1" aria-hidden="true">·</span>
          <kbd
            role="status"
            aria-label="Arrow up and down keys to navigate"
            className="px-1.5 py-0.5 bg-muted border rounded text-[10px] font-mono"
          >
            ↑↓
          </kbd>
          <span>탐색</span>
        </div>
      </div>
    </div>
  );
}
