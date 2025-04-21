import React from 'react';
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn setup
// import { ComponentPropsWithoutRef } from 'react'; // No longer needed for basic overrides

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarkdownComponentProps = { node?: any; [key: string]: any }; // Basic type for props

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarkdownComponentsMap = { [key: string]: React.FC<MarkdownComponentProps> }; // Use the basic type

export const MarkdownComponents: MarkdownComponentsMap = {
  // Headings
  h1: ({ node, className, ...props }) => (
    <h1 className={cn("mt-2 scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props} />
  ),
  h2: ({ node, className, ...props }) => (
    <h2 className={cn("mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props} />
  ),
  h3: ({ node, className, ...props }) => (
    <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
  ),
  h4: ({ node, className, ...props }) => (
    <h4 className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />
  ),
  h5: ({ node, className, ...props }) => (
    <h5 className={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)} {...props} />
  ),
  h6: ({ node, className, ...props }) => (
    <h6 className={cn("mt-8 scroll-m-20 text-base font-semibold tracking-tight", className)} {...props} />
  ),

  // Paragraph
  p: ({ node, className, ...props }) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),

  // Link
  a: ({ node, className, ...props }) => (
    <a className={cn("font-medium text-primary underline underline-offset-4", className)} {...props} />
  ),

  // Lists
  ul: ({ node, className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ node, className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ node, className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),

  // Blockquote
  blockquote: ({ node, className, ...props }) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground", className)} {...props} />
  ),

  // Image
  img: ({ node, className, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border my-6", className)} {...props} alt={alt || ''} />
  ),

  // Horizontal Rule
  hr: ({ node, ...props }) => <hr className="my-4 md:my-8" {...props} />,

  // Table Elements (using Tailwind for styling)
  table: ({ node, className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({ node, className, ...props }) => (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  ),
  tbody: ({ node, className, ...props }) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
  tr: ({ node, className, ...props }) => (
    <tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props} />
  ),
  th: ({ node, className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ node, className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),

  // Inline Code
  code: ({ node, className, inline, ...props }) => (
    <code
      className={cn(
          // Different styling for inline vs block code can be added here if needed based on `inline` prop
          "relative rounded border bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", 
          className
      )}
      {...props}
    />
  ),

  // Code Block (pre)
  pre: ({ node, className, ...props }) => (
    <pre
      className={cn("mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-sm dark:bg-zinc-900", className)} // Added padding
      {...props}
    />
  ),

  // You can add more component overrides here if needed
}; 