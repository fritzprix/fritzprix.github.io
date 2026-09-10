# SEO 감사 보고서

> **작성일**: 2026-09-10  
> **감사자**: SEO Specialist (Blog Management Org)  
> **대상**: fritzprix.github.io (nublog)  
> **상태**: 초안 — 개선안 실행 필요

---

## 목차

1. [실행 요약](#1-실행-요약)
2. [sitemap.xml 감사](#2-sitemapxml-감사)
3. [robots.txt 감사](#3-robotstxt-감사)
4. [404.html 감사](#4-404html-감사)
5. [SEO.tsx 컴포넌트 감사](#5-seotsx-컴포넌트-감사)
6. [index.html 감사](#6-indexhtml-감사)
7. [HomePage SEO 미적용](#7-homepage-seo-미적용)
8. [게시글 구조 분석](#8-게시글-구조-분석)
9. [개선안 (우선순위별)](#9-개선안-우선순위별)
10. [체크리스트](#10-체크리스트)

---

## 1. 실행 요약

| 영역 | 현재 상태 | 점수 |
|---|---|---|
| 사이트맵 | 6개 URL만 등록, 10개 게시글 중 4개 누락 | ⚠️ 개선 필요 |
| robots.txt | 기본 설정만, 개선 여지 다수 | ⚠️ 개선 필요 |
| 404.html | SPA 라우팅용 템플릿, SEO 요소 부재 | ❌ 즉시 개선 |
| SEO.tsx | OG/Twitter/JSON-LD 구조 좋음, but 누락 다수 | ⚠️ 개선 필요 |
| index.html | title 외 메타태그 전무 | ❌ 즉시 개선 |
| HomePage | `<SiteHelmet>` 미사용 | ❌ 즉시 개선 |
| hreflang | 다국어 게시글에 hreflang tags 없음 | ❌ 즉시 개선 |
| canonical | 구현됨 butHomePage에서 누락 | ⚠️ 개선 필요 |

**종합 평가**: 핵심 SEO 구조(SEO.tsx)는 잘 설계되어 있으나, **sitemap 누락, HomePage 미적용, hreflang 부재, index.html 메타태그 결여** 등 검색 엔진 크롤링과 인덱싱에 직접적인 영향을 주는 중대 이슈가 다수 존재합니다.

---

## 2. sitemap.xml 감사

### 현재 상태

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fritzprix.github.io/</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- posts 5개만 등록 -->
</urlset>
```

### 발견된 문제

| # | 문제 | 영향도 | 설명 |
|---|---|---|---|
| 2.1 | **게시글 누락 10개** | 🔴 중대 | 사이트맵에 6개 URL만 등록되어 있으나, 실제 posts/ 디렉토리에 **12개 파일**(영어 6개 + 한국어 6개) 존재. 누락된 URL: `fight-club-ubermensch`(en/ko), `AI-research-of-week`(ko), `ftx-crisis`(ko), `chomsky-llm`(ko), `model-quantization`(ko), `boombust`(ko) |
| 2.2 | **lastmod 날짜 불일치** | 🟡 보통 | 홈페이지 lastmod가 `2026-09-09`이나, 최신 게시글은 `2024-12-21`. `fight-club-ubermensch`(2026-09-09)는 누락됨 |
| 2.3 | **hreflang 태그 미비** | 🔴 중대 | 다국어 게시글(en/ko 쌍)에 `<xhtml:link rel="alternate" hreflang="...">` 태그 없음. 검색 엔진이 언어별 페이지를 올바르게 인식하지 못함 |
| 2.4 | **changefreq 과다** | 🟢 경미 | 모든 게시글에 `monthly` 사용. 정적 게시글이므로 `yearly` 또는 제거 권장 |

### 권장 사항

- [ ] **모든 게시글 URL 추가** — 영어/한국어 버전 모두 포함
- [ ] **hreflang 태그 도입** — `<xhtml:link>` 네임스페이스 추가
- [ ] **lastmod 정확화** — 각 게시글의 실제 최신 수정일 반영
- [ ] **sitemap index 고려** — 게시글이 50개 이상으로 늘면 sitemap index 패턴으로 전환

---

## 3. robots.txt 감사

### 현재 상태

```
User-agent: *
Allow: /
Sitemap: https://fritzprix.github.io/sitemap.xml
```

### 발견된 문제

| # | 문제 | 영향도 | 설명 |
|---|---|---|---|
| 3.1 | **Disallow 규칙 부재** | 🟡 보통 | `/api/`, `/node_modules/`, `/_.json` 등 크롤링 불필요 경로에 대한 차단 규칙 없음 |
| 3.2 | **sitemap 경로 절대적** | 🟢 경미 | 절대 URL 사용은 좋으나, 나중에 도메인 변경 시 수동 업데이트 필요 |

### 권장 사항

```
User-agent: *
Allow: /

# Prevent crawling of non-content paths
Disallow: /_
Disallow: /node_modules/
Disallow: *.json$

Sitemap: https://fritzprix.github.io/sitemap.xml
```

---

## 4. 404.html 감사

### 현재 상태

- GitHub Pages SPA 라우팅용 템플릿
- title: `"Dwid's Space"` (구 사이트명)
- SEO 메타태그 전무 (description, canonical, OG 없음)
- 인라인 JavaScript로 SPA 라우팅 처리

### 발견된 문제

| # | 문제 | 영향도 | 설명 |
|---|---|---|---|
| 4.1 | **title 구버전** | 🟡 보통 | `"Dwid's Space"` → `"Dwid's Space"`로 변경되었으나, 404.html이 업데이트 안됨 |
| 4.2 | **SEO 메타태그 부재** | 🔴 중대 | description, canonical, OG 태그 없음. 404 페이지가 검색 인덱스되는 경우 품질 신호 약화 |
| 4.3 | **user-friendly UI 부재** | 🟡 보통 | 빈 `<body>`에 JavaScript만 있음. 사용자가 탐색할 수 있는 UI 없음 |
| 4.4 | **index.html과 중복 로직** | 🟢 경미 | SPA 라우팅 JS가 두 파일에 중복되어 유지보수 부담 |

### 권장 사항

- [ ] description 메타태그 추가
- [ ] canonical link 추가
- [ ] "돌아가기" 버튼 또는 홈 링크 포함
- [ ] OG tags 추가 (404가 SNS 공유될 경우 대비)

---

## 5. SEO.tsx 컴포넌트 감사

### 현재 상태 (좋음)

- ✅ `react-helmet-async`로 올바른 동적 title/meta 관리
- ✅ Open Graph tags (type, title, description, image, url, site_name)
- ✅ Twitter Card (summary_large_image)
- ✅ JSON-LD BlogPosting structured data (article 타입일 때)
- ✅ canonical URL 자동 생성
- ✅ articleTags → keywords 매핑

### 발견된 문제

| # | 문제 | 영향도 | 설명 |
|---|---|---|---|
| 5.1 | **hardcoded SITE_TITLE** | 🟡 보통 | `"Dwid's Space"`로 고정. 구성 파일(from `about.json`)에서 동적으로 로드해야 함 |
| 5.2 | **SITE_IMAGE 제한적** | 🟡 보통 | `/fav.png`만 지원. 게시글별 og:image를 override할 수 있으나 기본값이 favicon |
| 5.3 | **hreflang 미지원** | 🔴 중대 | 다국어 게시글의 alternate 언어 링크를 `<link rel="alternate" hreflang="...">`로 추가해야 함 |
| 5.4 | **JSON-LD dateModified 누락** | 🟡 보통 | `dateModified`에 `publishedTime`만 할당. 실제 수정일과 다를 수 있음 |
| 5.5 | **language meta 고정** | 🟡 보통 | `<meta name="language" content="en">` 고정. 한국어 게시글에서는 `"ko"`여야 함 |
| 5.6 | **article 외 타입 JSON-LD 부재** | 🟢 경미 | 홈페이지(website 타입)에는 JSON-LD가 전혀 적용되지 않음 |

### 권장 개선안 (코드)

```tsx
// 추가: hreflang support
<link rel="alternate" hreflang="ko" href={`${fullUrl}?lang=ko`} />
<link rel="alternate" hreflang="en" href={`${fullUrl}?lang=en`} />
<link rel="alternate" hreflang="x-default" href={fullUrl} />

// 추가: language prop
interface SiteHelmetProps {
  lang?: string;  // default: 'en'
  // ...
}

// language meta 동적 설정
<meta name="language" content={lang || 'en'} />
```

---

## 6. index.html 감사

### 현재 상태

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/fav.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dwid's Space</title>
    <!-- SPA router script -->
  </head>
```

### 발견된 문제

| # | 문제 | 영향도 | 설명 |
|---|---|---|---|
| 6.1 | **meta description 부재** | 🔴 중대 | 검색 엔진이 페이지 내용을 이해하지 못함. `<SiteHelmet>`으로 대체 가능하지만, SSR/프론트엔드 렌더링 전 기본값 필요 |
| 6.2 | **OG tags 부재** | 🔴 중대 | SNS 공유 시 미리보기 이미지가 표시되지 않음 |
| 6.3 | **canonical link 부재** | 🟡 보통 | 중복 콘텐츠 신호 발생 가능 |
| 6.4 | **webmanifest 부재** | 🟡 보통 | PWA/모바일 홈스크린 아이콘 미지원 |
| 6.5 | **preconnect/preload 부재** | 🟢 경미 | 성능 최적화 기회 놓침 |
| 6.6 | **html lang="en" 고정** | 🟡 보통 | SPA이므로 문제되진 않으나, 접근성 관점에서 고려 |

### 권장 사항

```html
<head>
  <!-- ... existing ... -->
  <meta name="description" content="Personal reflections on AI, economics, and unconventional thinking by Doowoong Lee" />
  <link rel="canonical" href="https://fritzprix.github.io/" />

  <!-- Open Graph (fallback for direct sharing) -->
  <meta property="og:title" content="Dwid's Space" />
  <meta property="og:description" content="Personal reflections on AI, economics, and unconventional thinking by Doowoong Lee" />
  <meta property="og:image" content="https://fritzprix.github.io/fav.png" />
  <meta property="og:url" content="https://fritzprix.github.io/" />
  <meta property="og:type" content="website" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

---

## 7. HomePage SEO 미적용

### 발견된 문제

`HomePage.tsx`에서 **`<SiteHelmet>` 컴포넌트를 전혀 사용하지 않습니다.**

```tsx
// HomePage.tsx — SEO 컴포넌트 없음!
<main className="flex-grow relative z-10">
  <ProfileSection ... />
  <section className="about-me mb-12">...</section>
  <PostsSection posts={posts} />
</main>
```

### 영향도

| 항목 | 영향 |
|---|---|
| title | `index.html`의 정적 `"Dwid's Space"`만 사용. 검색 결과에 표시 |
| description | 없음. 검색 엔진이 `<meta name="description">`를 추출하지 못해 snippets 품질 저하 |
| OG/Twitter | 없음. SNS 공유 시 미리보기 이미지/설명 생략 |
| canonical | 없음. 중복 URL 신호 |
| JSON-LD | 없음. 검색 결과의 리치 스니펫 기회 손실 |

### 권장 사항

```tsx
import { SiteHelmet } from '../components/SEO';

const HomePage: React.FC<HomePageProps> = ({ posts, profileData, ... }) => {
  return (
    <>
      {/* SEO: Add this */}
      <SiteHelmet
        title="Home"
        description={profileData?.bio || "Personal reflections on AI, economics, and unconventional thinking"}
        url="/"
        type="website"
      />
      <WebGLBackground />
      <main>...</main>
    </>
  );
};
```

---

## 8. 게시글 구조 분석

### frontmatter 분석 (12개 게시글 중 샘플)

```yaml
---
layout: post
title: "..."
date: 2024-12-21
categories: [Finance, Economics, Investing]
image: "/img/austrian.png"
tags: [Austrian School, Economics, ...]
author: Doowoong(David) Lee
excerpt: "..."
---
```

### 발견된 문제

| # | 문제 | 영향도 | 설명 |
|---|---|---|---|
| 8.1 | **lang 필드 누락** | 🔴 중대 | `PostDetailPage.tsx`에서 `post.data.lang`을 참조하지만, frontmatter에 `lang` 필드가 없음. 언어判별이 slug 패턴(`-ko`, `-en`)에 의존 |
| 8.2 | **baseSlug 필드 누락** | 🟡 보통 | `PostDetailPage.tsx`에서 `post.data.baseSlug`을 참조하여 다국어 대체 게시글查找. frontmatter에 명시적 baseSlug 필요 |
| 8.3 | **tags 과다** | 🟡 보통 | `boombust.md`의 tags가 11개. SEO 관점에서 5-7개가 적정. keyword stuffing 위험 |
| 8.4 | **excerpt 길이 불균일** | 🟢 경미 | 일부 게시글의 excerpt가 과다하거나 부족. 155-160자 권장 |

### 권장 사항

- [ ] frontmatter에 `lang: en` 또는 `lang: ko` 명시적 추가
- [ ] 다국어 쌍에 `baseSlug` 필드 추가 (예: `baseSlug: fight-club-ubermensch`)
- [ ] tags 수 5-7개로 제한
- [ ] excerpt 길이 155-160자로 표준화

---

## 9. 개선안 (우선순위별)

### 🔴 Priority 1 — 즉시 실행 (검색 인덱싱에 직접 영향)

| # | 항목 | 파일 | 작업 내용 |
|---|---|---|---|
| P1.1 | sitemap.xml 게시글 누락 보충 | `public/sitemap.xml` | 누락된 6개 게시글 URL + hreflang 태그 추가 |
| P1.2 | HomePage에 SiteHelmet 적용 | `src/pages/HomePage.tsx` | `<SiteHelmet>` 컴포넌트 추가 |
| P1.3 | index.html 메타태그 추가 | `index.html` | description, OG, canonical, Twitter Card 추가 |
| P1.4 | 404.html SEO 개선 | `public/404.html` | description, canonical, user-friendly UI 추가 |

### 🟡 Priority 2 — 1주일 내 실행 (검색 품질 향상)

| # | 항목 | 파일 | 작업 내용 |
|---|---|---|---|
| P2.1 | SEO.tsx hreflang 지원 | `src/components/SEO.tsx` | `hreflang` prop 및 `<link rel="alternate">` 추가 |
| P2.2 | SEO.tsx language prop | `src/components/SEO.tsx` | 동적 언어 설정 지원 |
| P2.3 | robots.txt 강화 | `public/robots.txt` | Disallow 규칙 추가 |
| P2.4 | 게시글 frontmatter 표준화 | `posts/*.md` | `lang`, `baseSlug` 필드 추가, tags 수 제한 |
| P2.5 | SITE_TITLE 구성 파일화 | `src/components/SEO.tsx` | 하드코딩 제거, `about.json` 또는 별도 config에서 로드 |

### 🟢 Priority 3 — 장기 유지보수 (성능/확장성)

| # | 항목 | 파일 | 작업 내용 |
|---|---|---|---|
| P3.1 | sitemap 자동화 | build script | 게시글 추가 시 sitemap.xml 자동 재생성 |
| P3.2 | webmanifest 추가 | `public/manifest.json` | PWA 지원, 모바일 홈스크린 아이콘 |
| P3.3 | JSON-LD website 타입 | `src/components/SEO.tsx` | 홈페이지용 Organization/Website structured data |
| P3.4 | preconnect/preload | `index.html` | 외부 font/이미지 preconnect |
| P3.5 | sitemap index 패턴 | `public/sitemap-index.xml` | 게시글 50개 이상일 때 대비 |

---

## 10. 체크리스트

### Priority 1 — 즉시

- [ ] P1.1: sitemap.xml에 누락된 6개 게시글 URL 추가 + `<xhtml:link>` hreflang 태그
- [ ] P1.2: HomePage.tsx에 `<SiteHelmet>` 컴포넌트 추가
- [ ] P1.3: index.html에 meta description, OG, canonical, Twitter Card 추가
- [ ] P1.4: 404.html에 SEO 메타태그 + user-friendly UI 추가

### Priority 2 — 1주일 내

- [ ] P2.1: SEO.tsx에 hreflang prop 및 `<link rel="alternate">` 렌더링 추가
- [ ] P2.2: SEO.tsx에 `lang` prop 추가 (영어/한국어 동적 설정)
- [ ] P2.3: robots.txt에 Disallow 규칙 추가
- [ ] P2.4: 모든 게시글 frontmatter에 `lang` + `baseSlug` 필드 추가
- [ ] P2.5: SITE_TITLE/SITE_DESCRIPTION을 구성 파일로 분리

### Priority 3 — 장기

- [ ] P3.1: 빌드 스크립트로 sitemap.xml 자동화
- [ ] P3.2: manifest.json 추가
- [ ] P3.3: 홈페이지용 JSON-LD (Website/Organization) 추가
- [ ] P3.4: preconnect/preload 최적화
- [ ] P3.5: sitemap index 패턴 설계

---

## 부록: 누락된 sitemap URL 목록

| # | Slug | 언어 | 현재 상태 |
|---|---|---|---|
| 1 | `fight-club-ubermensch` | English | ❌ 누락 |
| 2 | `fight-club-ubermensch-ko` | 한국어 | ❌ 누락 |
| 3 | `AI-research-of-week-ko` | 한국어 | ❌ 누락 |
| 4 | `ftx-crisis-us-regulation-ko` | 한국어 | ❌ 누락 |
| 5 | `chomsky-llm-ko` | 한국어 | ❌ 누락 |
| 6 | `model-quantization-ko` | 한국어 | ❌ 누락 |
| 7 | `boombust-ko` | 한국어 | ❌ 누락 |

> **참고**: `AI-research-of-week`, `ftx-crisis`, `chomsky-llm`, `model-quantization`의 영어 버전은 sitemap에 등록되어 있으나, 한국어 버전은 모두 누락됨.
