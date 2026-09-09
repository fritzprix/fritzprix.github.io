import { useEffect, useState } from 'react';
import { Heading, extractHeadings } from '@/lib/blogUtils';

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [headings] = useState<Heading[]>(() => extractHeadings(content));
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) setActiveId(id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={`sticky top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto text-sm ${className}`}>
      <div className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        목차
      </div>
      <ul className="relative space-y-1.5 border-l-2 border-border">
        {headings.map(h => {
          const indent = Math.max(0, h.level - 2); // h2 = 0, h3 = 1, etc.
          const isActive = activeId === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(h.id);
                }}
                style={{ paddingLeft: `${indent * 12 + 12}px` }}
                className={`block py-1 pr-3 -ml-[2px] border-l-2 transition-all break-keep leading-snug text-xs sm:text-sm ${
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
