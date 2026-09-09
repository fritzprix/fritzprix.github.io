import React from 'react';
import { cn } from "@/lib/utils";

type MarkdownComponentProps = { className?: string; alt?: string; children?: React.ReactNode; [key: string]: unknown };

type MarkdownComponentsMap = { [key: string]: React.FC<MarkdownComponentProps> };

function getHeadingId(children: React.ReactNode): string {
  const text = React.Children.toArray(children)
    .map(child => (typeof child === 'string' || typeof child === 'number' ? child : ''))
    .join('')
    .replace(/[*_`#]/g, '')
    .trim();
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60);
}

export const MarkdownComponents: MarkdownComponentsMap = {
  // Headings
  h1: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h1 id={id} className={cn("mt-2 scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props}>{children}</h1>;
  },
  h2: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h2 id={id} className={cn("mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props}>{children}</h2>;
  },
  h3: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h3 id={id} className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>{children}</h3>;
  },
  h4: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h4 id={id} className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>{children}</h4>;
  },
  h5: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h5 id={id} className={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)} {...props}>{children}</h5>;
  },
  h6: ({ className, children, ...props }) => {
    const id = getHeadingId(children);
    return <h6 id={id} className={cn("mt-8 scroll-m-20 text-base font-semibold tracking-tight", className)} {...props}>{children}</h6>;
  },

  // Paragraph
  p: ({ className, ...props }) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),

  // Link
  a: ({ className, ...props }) => (
    <a className={cn("font-medium text-primary underline underline-offset-4", className)} {...props} />
  ),

  // Lists
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),

  // Blockquote
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground", className)} {...props} />
  ),

  // Image
  img: ({ className, alt, ...props }) => (
    <img className={cn("rounded-md border my-6", className)} {...props} alt={alt || ''} />
  ),

  // Horizontal Rule
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,

  // Table Elements (using Tailwind for styling)
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  ),
  tbody: ({ className, ...props }) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),

  // Inline Code
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded border bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    />
  ),

  // Code Block (pre)
  pre: ({ className, ...props }) => (
    <pre
      className={cn("mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-sm dark:bg-zinc-900", className)}
      {...props}
    />
  ),
};