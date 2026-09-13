import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

function ensureMermaidInit(isDark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
    suppressErrorRendering: true,
  });
}

// Global sequential queue for rendering Mermaid diagrams.
// Mermaid's internal parser and D3 renderers are stateful singletons;
// running concurrent render calls on multiple diagrams causes DOM collision & parsing errors.
let renderQueue: Promise<void> = Promise.resolve();

function renderQueued(id: string, chart: string): Promise<{ svg: string }> {
  const next = renderQueue.then(async () => {
    try {
      return await mermaid.render(id, chart);
    } finally {
      // Clean up any lingering temporary DOM nodes created by Mermaid
      document.getElementById(`d${id}`)?.remove();
      document.getElementById(id)?.remove();
    }
  });

  // Keep the queue flowing even if one diagram errors
  renderQueue = next.then(() => {}, () => {});
  return next;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    ensureMermaidInit(isDark);

    const cleanChart = chart.trim();
    if (!cleanChart) return;

    // Use a clean alphanumeric ID
    const uniqueId = `mmd_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    renderQueued(uniqueId, cleanChart)
      .then(({ svg }) => {
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          setError(err?.message || 'Mermaid 렌더링 오류');
        }
      });

    return () => {
      isMounted = false;
      document.getElementById(`d${uniqueId}`)?.remove();
      document.getElementById(uniqueId)?.remove();
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm">
        <p className="font-semibold text-destructive mb-2">다이어그램 렌더링 오류</p>
        <pre className="p-3 bg-muted/60 rounded-lg text-xs font-mono overflow-x-auto text-foreground">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="my-8 flex justify-center items-center h-32 rounded-xl border border-border/40 bg-muted/20 animate-pulse text-xs text-muted-foreground">
        다이어그램 생성 중...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-8 flex justify-center overflow-x-auto rounded-xl border border-border/70 bg-card/60 p-6 shadow-xs backdrop-blur-xs [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default Mermaid;
