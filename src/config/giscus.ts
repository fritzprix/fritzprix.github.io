export interface GiscusConfig {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  reactionsEnabled: '0' | '1';
  emitMetadata: '0' | '1';
  inputPosition: 'top' | 'bottom';
  theme: string;
  lang: string;
  loading: 'lazy' | 'eager';
}

export const giscusConfig: GiscusConfig = {
  repo: (import.meta.env.VITE_GISCUS_REPO as `${string}/${string}`) || 'fritzprix/fritzprix.github.io',
  repoId: import.meta.env.VITE_GISCUS_REPO_ID || 'R_kgDOOdG2bw',
  category: import.meta.env.VITE_GISCUS_CATEGORY || 'General',
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID || 'DIC_kwDOOdG2b84DFObu',
  mapping: 'pathname',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'preferred_color_scheme',
  lang: 'en',
  loading: 'lazy',
};
