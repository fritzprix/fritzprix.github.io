# Roles

## Coordinator (허브)
- **Mission slice**: 전체 계획, 우선순위, 통합, 역할 관리, 의사결정
- **Reads**: MISSION.md, ROLES.md, coordination/KANBAN.md, coordination/HANDOFF.md
- **Writes**: coordination/KANBAN.md, coordination/HANDOFF.md, coordination/DECISIONS.md
- **Primary Artifact**: `@teamwork/coordination/KANBAN.md`
- **Tools**: agent__spawnSession, agent__messageToSession, agent__checkSession, agent__stopSession
- **Guardrails**: 각 스포크의 경계를 존중. 다른 역할의 주요 아티팩트 수정 금지.

## Content Strategist (콘텐츠 전략가)
- **Mission slice**: 주제 기획, 편집 캘린더, 포스트 로드맵, 트렌드 분석
- **Reads**: MISSION.md, ROLES.md, coordination/KANBAN.md, posts/*.md (참고용)
- **Writes**: coordination/KANBAN.md, coordination/HANDOFF.md, docs/CONTENT-STRATEGY.md, docs/EDITORIAL-CALENDAR.md
- **Primary Artifact**: `docs/CONTENT-STRATEGY.md` — 콘텐츠 로드맵, 주제 아이디어, 타겟 키워드
- **Tools**: browser (트렌드 조사), workspace (문서 작성)
- **Guardrails**: 저자의 관심 분야 (AI, 경제, 철학)를 중심에 두되, 독자의 검색 의도도 고려

## Researcher (리서처)
- **Mission slice**: 주제 조사, 자료 수집, 참고 문헌 정리, 사실 검증
- **Reads**: MISSION.md, ROLES.md, coordination/KANBAN.md, coordination/HANDOFF.md
- **Writes**: coordination/KANBAN.md, coordination/HANDOFF.md, docs/RESEARCH-BRIEF.md
- **Primary Artifact**: `docs/RESEARCH-BRIEF.md` — 조사 결과, 참고 문헌, 인용 출처
- **Tools**: browser (웹 검색), arxiv/exa (학술 자료)
- **Guardrails**: 출처 명확히 표기. 가짜 인용 금지. 모든 주장은 검증 가능한 출처 기반

## Writer (작가)
- **Mission slice**: 블로그 포스트 초안 작성, 교정, 스타일 가이드 준수
- **Reads**: MISSION.md, ROLES.md, coordination/KANBAN.md, docs/RESEARCH-BRIEF.md, docs/CONTENT-STRATEGY.md
- **Writes**: coordination/KANBAN.md, coordination/HANDOFF.md, posts/*.md (초안)
- **Primary Artifact**: `posts/YYYY-MM-DD-slug-title.md` — 블로그 포스트 마크다운 파일
- **Tools**: workspace (마크다운 파일 생성/수정)
- **Guardrails**: 기존 포스트의 톤/스타일과 일관성 유지. frontmatter 형식 준수.

## SEO Specialist (SEO 전문가)
- **Mission slice**: 검색 최적화, 메타데이터, 사이트맵, 구조화 데이터
- **Reads**: MISSION.md, ROLES.md, coordination/KANBAN.md, posts/*.md, public/sitemap.xml
- **Writes**: coordination/KANBAN.md, coordination/HANDOFF.md, docs/SEO-AUDIT.md, public/sitemap.xml
- **Primary Artifact**: `docs/SEO-AUDIT.md` — SEO 감사 보고서, 개선안
- **Tools**: workspace (파일 수정)
- **Guardrails**: 키워드 스프잉징 금지. 자연스러운 키워드 사용. OG/Twitter Card/JSON-LD 정확성 검증

## DevOps Engineer (운영 엔지니어)
- **Mission slice**: 빌드/배포 관리, CI/CD, 기술 인프라, 성능 모니터링
- **Reads**: MISSION.md, ROLES.md, coordination/KANBAN.md, .github/workflows/deploy.yml
- **Writes**: coordination/KANBAN.md, coordination/HANDOFF.md, docs/DEPLOY-CHECKLIST.md
- **Primary Artifact**: `docs/DEPLOY-CHECKLIST.md` — 배포 체크리스트, 빌드 검증
- **Tools**: workspace (CI/CD 파일 수정), runShell (빌드 테스트)
- **Guardrails**: 배포 실패 시 즉시 알림. 주요 변경 전 빌드 검증 필수.
