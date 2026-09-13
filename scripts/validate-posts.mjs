import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';

import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;

const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

import { fixKoreanMarkdownEmphasis, escapeCurrencyDollars } from '../src/lib/blogUtils.ts';
import remarkDirectiveRehype from '../src/lib/remark-directive-rehype.ts';

const POSTS_DIR = path.resolve('posts');
const PUBLIC_DIR = path.resolve('public');

let totalErrors = 0;
const results = [];

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();

console.log(`\n🔍 Validating ${files.length} posts for markdown rendering, KaTeX math & Mermaid diagrams...\n`);

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const rawText = fs.readFileSync(filePath, 'utf-8');
  const errors = [];

  // 1. Frontmatter Validation
  let data, content;
  try {
    const parsed = matter(rawText);
    data = parsed.data;
    content = parsed.content;
  } catch (err) {
    errors.push(`Invalid frontmatter: ${err.message}`);
    totalErrors++;
    results.push({ file, errors });
    continue;
  }

  if (!data.title) errors.push('Missing required frontmatter: "title"');
  if (!data.date) errors.push('Missing required frontmatter: "date"');

  // 2. Preprocessing
  const processed = escapeCurrencyDollars(fixKoreanMarkdownEmphasis(content));

  // 3. ReactMarkdown + KaTeX Rendering with Strict Warning Capture
  const katexIssues = [];
  let html = '';
  try {
    html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm, remarkBreaks, remarkMath, remarkDirective, remarkDirectiveRehype],
        rehypePlugins: [rehypeRaw, [rehypeKatex, {
          strict: (errorCode, errorMsg) => {
            katexIssues.push({ errorCode, errorMsg });
            return 'warn';
          }
        }]],
      }, processed)
    );
  } catch (err) {
    errors.push(`ReactMarkdown rendering crashed: ${err.message}`);
  }

  // 4. KaTeX Math Integrity Checks
  // A. Intercepted KaTeX warnings/errors (e.g. unicodeTextInMathMode)
  for (const issue of katexIssues) {
    if (issue.errorCode === 'unicodeTextInMathMode') {
      errors.push(`KaTeX error: Non-ASCII/Korean characters detected inside math mode (${issue.errorMsg}). Check for mismatched or unescaped '$' currency delimiters.`);
    } else {
      errors.push(`KaTeX error [${issue.errorCode}]: ${issue.errorMsg}`);
    }
  }

  // B. KaTeX parse errors (class="katex-error")
  if (html.includes('katex-error')) {
    const match = html.match(/class="katex-error"[^>]*title="([^"]*)"/);
    errors.push(`KaTeX parse syntax error: ${match ? match[1] : 'Unknown syntax error'}`);
  }

  // C. Hangul fallback elements in KaTeX
  if (html.includes('hangul_fallback')) {
    const annotations = html.match(/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g) || [];
    const brokenAnnotations = annotations.filter(a => /[가-힣]/.test(a));
    const snippet = brokenAnnotations.map(a => a.replace(/<\/?annotation[^>]*>/g, '').slice(0, 80)).join(' | ');
    errors.push(`Korean text was accidentally parsed inside KaTeX math mode: "${snippet}"`);
  }

  // D. HTML tags swallowed into math mode
  if (/<annotation encoding="application\/x-tex">[\s\S]*?&lt;\/?(strong|em|p|a|span|div)[^&]*&gt;[\s\S]*?<\/annotation>/.test(html)) {
    errors.push('HTML tags were swallowed inside KaTeX math mode! Multiple currency "$" or unclosed math spans paired across HTML elements.');
  }

  // 5. Unrendered Markdown Emphasis check (e.g. literal ** left in paragraph text)
  const textWithoutCodeOrMath = html
    .replace(/<pre[\s\S]*?<\/pre>/g, '')
    .replace(/<code[\s\S]*?<\/code>/g, '')
    .replace(/<span class="katex"[\s\S]*?<\/span><\/span><\/span>/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '');

  if (/\*\*[^*\s][^*]*\*\*/.test(textWithoutCodeOrMath)) {
    const strayMatch = textWithoutCodeOrMath.match(/\*\*[^*\s][^*]*\*\*/);
    errors.push(`Unrendered bold markdown '**' detected in paragraph text: "${strayMatch ? strayMatch[0].slice(0, 50) : ''}"`);
  }

  // 6. Local image references check
  const imageRegex = /!\[.*?\]\((\/img\/[^)]+)\)/g;
  let imgMatch;
  while ((imgMatch = imageRegex.exec(content)) !== null) {
    const imgPath = path.join(PUBLIC_DIR, imgMatch[1]);
    if (!fs.existsSync(imgPath)) {
      errors.push(`Broken local image reference: "${imgMatch[1]}" does not exist in public directory.`);
    }
  }

  // 7. Mermaid Diagrams Syntax & Parser Validation
  const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g) || [];
  for (const block of mermaidBlocks) {
    const chart = block.replace(/```mermaid\n?|```/g, '').trim();
    if (!chart) continue;
    try {
      await mermaid.parse(chart);
    } catch (mErr) {
      errors.push(`Mermaid diagram syntax error: ${mErr.message || mErr}`);
    }
  }

  if (errors.length > 0) {
    totalErrors += errors.length;
    results.push({ file, errors });
  } else {
    results.push({ file, errors: [] });
  }
}

// Summary Report
let passCount = 0;
for (const res of results) {
  if (res.errors.length === 0) {
    passCount++;
    console.log(`  \x1b[32m✓\x1b[0m ${res.file}`);
  } else {
    console.log(`  \x1b[31m✗\x1b[0m ${res.file}`);
    for (const err of res.errors) {
      console.log(`    \x1b[31m- Error:\x1b[0m ${err}`);
    }
  }
}

console.log('\n------------------------------------------------------------');
if (totalErrors === 0) {
  console.log(`\x1b[32m✨ All ${passCount} posts passed mechanical validation successfully!\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\x1b[31m❌ Validation failed with ${totalErrors} error(s) across ${files.length - passCount} post(s).\x1b[0m\n`);
  process.exit(1);
}
