import React from 'react';
import { cn } from "@/lib/utils";
import { slugifyHeading } from "@/lib/blogUtils";

type MarkdownComponentProps = { className?: string; alt?: string; children?: React.ReactNode; [key: string]: unknown };

type MarkdownComponentsMap = { [key: string]: React.FC<MarkdownComponentProps> };

function getHeadingId(children: React.ReactNode): string {
  const text = React.Children.toArray(children)
    .map(child => (typeof child === 'string' || typeof child === 'number' ? child : ''))
    .join('');
  return slugifyHeading(text);
}

export const MarkdownComponents: MarkdownComponentsMap = {
  // Headings
  h1: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h1 id={id} className={cn("mt-12 mb-4 scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight text-foreground", className)} {...props}>{children}</h1>;
  },
  h2: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h2 id={id} className={cn("mt-12 mb-4 scroll-m-20 border-b pb-2 text-2xl md:text-3xl font-semibold tracking-tight text-foreground", className)} {...props}>{children}</h2>;
  },
  h3: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h3 id={id} className={cn("mt-8 mb-3 scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight text-foreground", className)} {...props}>{children}</h3>;
  },
  h4: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h4 id={id} className={cn("mt-6 mb-2 scroll-m-20 text-lg md:text-xl font-semibold tracking-tight text-foreground", className)} {...props}>{children}</h4>;
  },
  h5: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h5 id={id} className={cn("mt-6 mb-2 scroll-m-20 text-base md:text-lg font-semibold tracking-tight text-foreground", className)} {...props}>{children}</h5>;
  },
  h6: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h6 id={id} className={cn("mt-6 mb-2 scroll-m-20 text-sm md:text-base font-semibold tracking-tight text-foreground", className)} {...props}>{children}</h6>;
  },

  // Paragraph
  p: ({ className, ...props }) => (
    <p className={cn("leading-relaxed [&:not(:first-child)]:mt-6 text-foreground/95 text-[1.03rem]", className)} {...props} />
  ),

  // Link
  a: ({ className, ...props }) => (
    <a className={cn("font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity", className)} {...props} />
  ),

  // Lists
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc text-foreground/95 space-y-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal text-foreground/95 space-y-2", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-relaxed text-[1.03rem] text-foreground/95", className)} {...props} />
  ),

  // Blockquote
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-l-4 border-primary/80 bg-muted/35 dark:bg-muted/20 py-3.5 px-5 rounded-r-lg font-serif italic text-base md:text-lg leading-relaxed text-foreground/90 shadow-xs",
        className
      )}
      {...props}
    />
  ),

  // Image & Figure
  img: ({ className, alt, ...props }) => (
    <figure className="my-8">
      <img
        className={cn("rounded-xl border border-border/70 max-w-full max-h-[80vh] w-auto h-auto mx-auto object-contain shadow-md transition-transform duration-300 hover:scale-[1.005]", className)}
        {...props}
        alt={alt || ''}
      />
      {alt && (
        <figcaption className="text-center text-xs font-mono text-muted-foreground mt-2.5 tracking-wide">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // Horizontal Rule
  hr: ({ ...props }) => <hr className="my-8 border-border/60" {...props} />,

  // Table Elements
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border/70">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-muted/60 border-b border-border/70", className)} {...props} />
  ),
  tbody: ({ className, ...props }) => (
    <tbody className={cn("[&_tr:last-child]:border-0 divide-y divide-border/60", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("transition-colors hover:bg-muted/30 even:bg-muted/15", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "px-4 py-3 text-left font-semibold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-4 py-3 text-left text-foreground/90 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),

  // Inline Code
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[0.875em] text-foreground font-medium",
        className
      )}
      {...props}
    />
  ),

  // Code Block (pre)
  pre: ({ className, ...props }) => (
    <pre
      className={cn("my-6 max-h-[650px] overflow-x-auto rounded-xl border border-border/80 bg-zinc-950 p-4 font-mono text-sm leading-normal text-zinc-100 dark:bg-zinc-900/90 shadow-sm", className)}
      {...props}
    />
  ),
};
