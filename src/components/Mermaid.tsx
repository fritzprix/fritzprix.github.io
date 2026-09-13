import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const cleanChart = chart.trim();
    if (!cleanChart) return;

    const id = `mmd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    mermaid
      .render(id, cleanChart)
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
