import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Post } from '@/App';

interface SearchOverlayProps {
  posts: Post[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ posts, isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
      return;
    }
    const fuseResults = fuse.search(query);
    setResults(fuseResults.slice(0, 8).map(r => r.item));
  }, [query, fuse, posts]);

  const handleSelect = (post: Post) => {
    navigate(`/posts/${post.slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Search Panel */}
      <div className="relative w-full max-w-2xl bg-card border rounded-xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="포스트 검색 (제목, 내용, 태그)..."
            className="flex-1 py-4 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              "{query}"에 대한 결과가 없습니다.
            </div>
          )}

          {results.map(post => (
            <button
              key={post.slug}
              onClick={() => handleSelect(post)}
              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
            >
              <div className="font-medium">{post.data.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {post.data.date}
                {post.data.tags.length > 0 && (
                  <span className="ml-2">
                    {post.data.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                  </span>
                )}
              </div>
            </button>
          ))}

          {query.trim().length < 2 && (
            <div className="py-6 text-center text-muted-foreground text-sm">
              검색어를 입력해주세요 (2자 이상)
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t bg-muted/30 flex items-center gap-3 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">ESC</kbd>
          <span>닫기</span>
          <span className="mx-1">·</span>
          <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">↵</kbd>
          <span>선택</span>
        </div>
      </div>
    </div>
  );
}
