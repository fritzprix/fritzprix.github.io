# Blog Post Writing Guide

> **Writer 역할이 신규 포스트 초안을 작성할 때 준수하는 가이드라인**
>
> 대상: Blog Management Org — Writer (Coding Expert)
> 기준: 기존 12편의 posts/*.md 분석 기반
> 최종 업데이트: 2026-09-10

---

## 1. Frontmatter 표준

모든 포스트는 YAML frontmatter로 시작해야 합니다. 필드는 **아래 순서**로 배치합니다.

```yaml
---
layout: post
title:  "Post Title Here"
date:   YYYY-MM-DD
locale: en_US | ko_KR
image:  /img/filename.png
tags:   [tag1, tag2, tag3, ...]
categories: [Category1, Category2]
excerpt: "One-sentence summary for SEO and card preview."
author: Doowoong(David) Lee
comments: true
permalink: /category/slug/          # optional, 기존 포스트와 일관된 경로
---
```

### 필드 규칙

| 필드 | 필수 | 규칙 |
|---|---|---|
| `layout` | ✅ | 항상 `post` |
| `title` | ✅ | `title:  "값"` — 콜론 뒤 **공백 2개** (Jekyll 호환), 큰따옴표로 감쌈 |
| `date` | ✅ | `date:   YYYY-MM-DD` — 콜론 뒤 **공백 2개**, 파일명의 날짜와 일치 |
| `locale` | ✅ | 영문 포스트 → `en_US`, 한영 병기 또는 한국어 기반 → `ko_KR` |
| `image` | ✅ | `/img/슬러그.png` 형식. 썸네일 이미지는 `public/img/`에 배치 |
| `tags` | ✅ | 배열. 소문자/대문자 혼용 가능. 5~10개 권장. 공백 뒤 콤마 |
| `categories` | ✅ | 배열. 대문자 시작. 1~3개 |
| `excerpt` | ✅ | 1문장 요약. SEO 메타/OG 태그 자동 생성에 사용 |
| `author` | ✅ | `Doowoong(David) Lee` (표준). 구 포스트에 `Doowoong Lee`도 있으나 통일 권장 |
| `comments` | ❌ | 생략 가능. 기존 포스트는 `true` |
| `permalink` | ❌ | 생략 가능. 기존 포스트와 일관된 경로 사용 |

### ⚠️ 주의사항

- **구 포스트의 frontmatter 불일치**를 참고만 하되, 신규 포스트는 위 표준을 따릅니다.
  - `title:  "값"` (공백 2개) — Jekyll의 `title:` 파싱 호환을 위해 유지
  - `date:   YYYY-MM-DD` — 공백 2개
  - `comments: true` — 최신 포스트에서는 생기는 경우도 있음. 신규 포스트는 생략 가능
  - `author` — `Doowoong Lee` vs `Doowoong(David) Lee` 혼재. 신규 포스트는 `(David)` 포함으로 통일

---

## 2. 파일 네이밍

```
posts/YYYY-MM-DD-slug-title.md
```

- 날짜는 frontmatter `date` 필드와 **반드시 일치**
- 슬러그는 **영어 소문자 + 하이픈**
- 예: `posts/2026-09-10-llm-reasoning-breakthrough.md`

---

## 3. 콘텐츠 구조 표준

### 3.1 공통 패턴

모든 포스트는 다음 순서를 따릅니다:

```markdown
<!-- frontmatter -->

![alt-text](/img/filename.png)          <!-- 본문 첫 이미지 -->

## 제목 1                              <!-- H2로 시작 (H1은 frontmatter title) -->

본문...

### 제목 2                              <!-- H3 필요시 사용 -->

본문...

## 제목 1 (다음 섹션)

...
```

### 3.2 제목 규칙

- **H1 사용 금지** — frontmatter `title`이 H1 역할
- **H2 (`##`)** 로 섹션 시작
- **H3 (`###`)** 는 H2 하위 서브섹션에서만 사용
- 제목은 간결하게 (5~12단어 권장)
- 한국어 포스트는 한글 제목, 영문 포스트는 영문 제목

### 3.3 본문 스타일

| 요소 | 규칙 |
|---|---|
| 문단 | 빈 줄로 구분. 한 문단은 2~4문장 |
| 강조 | **굵게**로 핵심 개념. *이탤릭*은 용어 최초 등장 시 |
| 코드 | 인라인: `` `code` ``, 블록: ```language 코드 ``` |
| 수식 | LaTeX `$...$` (인라인), `$$...$$` (블록) — MathJax/Jekyll 호환 |
| 인용 | `> 인용문` — 출처는 괄호 또는 링크로 |
| 링크 | `[설명](URL)` — 새 탭 권장 (`target="_blank"`) |
| 이미지 | `![alt](/img/filename.png)` 또는 `![alt w:100](/img/filename.png)` (크기 지정) |
| 테이블 | Markdown 테이블. 정렬 기호 `:---` 사용 |
| 구분선 | `---` — 섹션 간 시각적 분리 |

---

## 4. 장르별 작성 패턴

기존 포스트는 크게 5가지 장르로 분류됩니다. 각 장르의 특징을 참고하세요.

### 4.1 기술 딥다이브 (Technical Deep Dive)

**예시:** `2023-11-24-model-quantization-en.md`

- **톤:** 학술적이지만 접근 가능한 기술 해설
- **구조:**
  1. 개념 정의 (What is ~?)
  2. 비유/아날로지 (이해 돕기)
  3. 방법론별 심층 분석 (각각 독립 섹션)
  4. 비교 테이블
- **특징:**
  - LaTeX 수식 적극 활용
  - 아키텍처 다이어그램 이미지 포함
  - 벤치마크 결과 표로 정리
  - citations: `[이름](URL) (저자, 년도)`
- **길이:** 3,000~6,000단어

### 4.2 경제/투자 분석 (Economic/Investment Analysis)

**예시:** `2024-12-21-boombust.md`

- **톤:** 분석적 + 실용적 조언
- **구조:**
  1. 관점 제시 (어느 학파/프레임워크로 보는가)
  2. 사이클 단계별 분석 (Early Boom → Recovery)
  3. 단계별 전략 (불릿 포인트)
  4. 전략 요약 테이블
  5. 면책 조항 (Disclaimer)
- **특징:**
  - 경제학파/이론명 명시
  - 투자 조언 아님을 명시 (Disclaimer 필수)
  - 실전 전략을 단계별로 제시
- **길이:** 1,500~3,000단어

### 4.3 철학/에세이 (Philosophy/Essay)

**예시:** `2026-09-09-fight-club-ubermensch.md`

- **톤:** 성찰적, 문학적, 개인적 경험과 학문적 분석의 결합
- **구조:**
  1. 개인적 회상/관찰로 시작 (20대의 경험 vs 현재의 시각)
  2. 개념적 분석 (니체의 정신 3단계 등)
  3. 함정/역설 제시 (사자의 함정)
  4. 자기 극복/해결책 (Selbstüberwindung)
  5. 결론: 삶의 태도로 연결
- **특징:**
  - 개인적 경험과 철학적 분석의 교차
  - 원어 용어 병기 (독일어: *Selbstüberwindung*, *Übermensch*)
  - 문학적 비유와 이미지
  - `&lt;strong&gt;` 태그도 사용됨 (HTML 인라인 강조)
- **길이:** 1,000~2,500단어

### 4.4 주간 연구 Digest (Research Weekly)

**예시:** `2022-10-28-AI-research-of-week.md`

- **톤:** 요약 중심, 빠르게 정보 전달
- **구조:**
  1. 연구 제목 + 링크
  2. 핵심 발견 (불릿 포인트)
  3. Approach/방법론 설명
  4. 정리/Implication (### 정리)
  5. `---` 구분선으로 다음 연구로
- **특징:**
  - 여러 논문을 한 포스트에 정리
  - 각 연구는 독립된 섹션
  - `### 정리` 서브섹션으로 핵심 메시지 한 줄
  - 이미지: 결과 그래프/다이어그램
- **길이:** 2,000~5,000단어 (논문 수에 따라 가변)

### 4.5 뉴스/사건 분석 (News/Event Analysis)

**예시:** `2022-12-03-ftx-crisis-us-regulation.md`

- **톤:** 중립적 분석 + 통찰
- **구조:**
  1. 목차 (TOC) — 긴 포스트인 경우
  2. 사건 배경 (Rise & Fall)
  3. 영향 (Impact) — 피해 사례 불릿
  4. 관련 이슈 심화 (규제 동향 등)
  5. 쟁점별 분석 (각 기관/기업별)
  6. 별첨/추가 이슈
- **특징:**
  - 날짜/시간 스탬프 중요
  - 인용 출처 `[1](URL)` 형식
  - `> TL;DR;` 또는 `> 인용문` 활용
  - "카더라" 등 추측은 명시적으로 표기
  - 긴 포스트는 `---`로 섹션 분리
- **길이:** 3,000~8,000단어

---

## 5. 저자 톤 & 스타일 가이드

### 5.1 공통 어조

| 요소 | 패턴 |
|---|---|
| 화자 | 1인칭 (`나는`, `I`) — 개인 블로그로서의 정체성 |
| 어미 | 한국어: 해라체/하십시오체 혼용 (기술 포스트는 해라체, 에세이는 해라체) / 영어: 서술체 |
| 전문용어 | 최초 등장 시 설명, 원어 병기 |
| 비유 | 일상적 비유로 복잡한 개념 설명 (이미지 압축 → 양자화 등) |
| 태도 | 지적 호기심 기반, 비판적 사고 존중, 확신보다 탐구 |

### 5.2 금지사항

- ❌ 과장된 표현 ("역사적", "혁명적" 등) — 대신 구체적 데이터/비교 사용
- ❌ 출처 없는 주장 — 모든 주장은 링크/인용 기반
- ❌ 가짜 인용 — 실제 존재하는 논문/자료만 인용
- ❌ 키워드 스푸핑 — 자연스러운 키워드 사용
- ❌ H1 태그 사용 — frontmatter title이 H1 역할

### 5.3 권장사항

- ✅ 독자 수준 고려 (초급자도 이해 가능하지만 깊이도 유지)
- ✅ 시각적 요소 적극 활용 (이미지, 테이블, 구분선)
- ✅ 실용적 takeaway 제공 (전략, 요약, 비교표)
- ✅ 관련 포스트/논문 링크 제공
- ✅ 면책 조항 (투자/법적 조언 포스트의 경우)

---

## 6. SEO 체크리스트

모든 포스트 작성 완료 후 확인:

- [ ] `excerpt` — 150자 이내, 핵심 키워드 포함
- [ ] `tags` — 5~10개, 검색 의도 기반
- [ ] `categories` — 1~3개, 정확한 분류
- [ ] `image` — 썸네일 이미지 존재, `/img/` 경로
- [ ] `permalink` — slug 기반의 읽기 쉬운 URL
- [ ] H2/H3 구조 — 논리적 계층
- [ ] 내부 링크 — 관련 기존 포스트 링크
- [ ] 외부 링크 — 출처 명확 (최소 3개 이상)
- [ ] alt 텍스트 — 모든 이미지에 설명 포함
- [ ] OG/Twitter Card — Jekyll 테마 자동 생성 확인

---

## 7. 신규 포스트 워크플로우

```
1. Content Strategist → 주제/키워드/타겟 독자 확정
2. Researcher → RESEARCH-BRIEF.md 작성 (자료, 인용, 출처)
3. Writer → posts/YYYY-MM-DD-slug.md 초안 작성 (이 가이드라인 준수)
4. SEO Specialist → SEO-AUDIT.md 작성, 메타데이터 검증
5. DevOps Engineer → 빌드 검증, 배포
```

---

## 8. 참고: 기존 포스트 frontmatter 비교표

| 포스트 | author | title 포맷 | date 포맷 | comments | locale |
|---|---|---|---|---|---|
| chomsky-llm.md | Doowoong Lee | `"한글"` | `2023-03-26` | ❌ | ❌ |
| chomsky-llm-en.md | Doowoong Lee | `"English"` | `2023-03-26` | ❌ | `en_US` |
| model-quantization.md | Doowoong(David) Lee | `"한글"` | `2023-11-24` | ❌ | ❌ |
| model-quantization-en.md | Doowoong(David) Lee | `"English"` | `2023-11-24` | ❌ | `en_US` |
| boombust.md | Doowoong(David) Lee | `"English"` | `2024-12-21` | ❌ | ❌ |
| boombust-en.md | Doowoong(David) Lee | `"English"` | `2024-12-21` | ❌ | `en_US` |
| fight-club-ubermensch.md | Doowoong(David) Lee | `"한글"` | `2026-09-09` | ❌ | ❌ |
| fight-club-ubermensch-en.md | Doowoong(David) Lee | `"English"` | `2026-09-09` | ❌ | `en_US` |
| AI-research-of-week.md | Doowoong(David) Lee | `"English"` | `2023-11-01` | `true` | `ko_KR` |
| AI-research-of-week-en.md | Doowoong(David) Lee | `"English"` | `2023-11-01` | `true` | `en_US` |
| ftx-crisis.md | Doowoong(David) Lee | `"한글"` | `2022-12-03` | `true` | `ko_KR` |
| ftx-crisis-en.md | Doowoong(David) Lee | `"English"` | `2022-12-03` | ❌ | `en_US` |

> **관찰:** 구 포스트들은 frontmatter 순서/포맷에 불일치가 많습니다. 신규 포스트는 Section 1의 표준을 따르되, 기존 포스트는 수정하지 않습니다 (Writer의 경계).
