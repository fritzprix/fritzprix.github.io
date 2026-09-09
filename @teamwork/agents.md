# Team Workspace Instructions — Blog Management Org

This workspace is the canonical operating system for the Blog Management Org.

## Objective

fritzprix.github.io (nublog) 블로그의 콘텐츠 기획, 작성, SEO 최적화, 배포를 전담하는 조직을 구축하고 운영한다

## Original User Request

블로그 관리를 위한 조직을 구축하라

## Collaboration Model

hub-and-spoke — Coordinator(허브)가 5개 Specialist(스포크)를 관리하고 통합

## Execution Substrate

Explicit org lineage via `agent__createOrg(...)` once from the root session, then `agent__spawnSession(...)` for org-visible children.

Active specialist skill: `org`

## Active Roles

1. **Coordinator** — 전체 계획, 우선순위, 통합, 역할 관리
2. **Content Strategist** — 주제 기획, 편집 캘린더, 포스트 로드맵
3. **Researcher** — 주제 조사, 자료 수집, 참고 문헌 정리
4. **Writer** — 블로그 포스트 초안 작성, 교정
5. **SEO Specialist** — 검색 최적화, 메타데이터, 사이트맵
6. **DevOps Engineer** — 빌드/배포 관리, CI/CD, 기술 인프라

## Canonical Files

| 파일 | 설명 | 소유자 |
|---|---|---|
| `MISSION.md` | 목표, 제약사항, 성공 기준 | Coordinator |
| `ROLES.md` | 역할 경계, 허용 작업, 소유권 | Coordinator |
| `coordination/KANBAN.md` | 작업 상태 및 소유자 | Coordinator |
| `coordination/HANDOFF.md` | 역할 간 이관 (append-only) | 전역 |
| `coordination/DECISIONS.md` | 영속적 의사결정 | Coordinator |
| `coordination/RISKS.md` | 활성 리스크 및 완화책 | 전역 |
| `coordination/DISCUSSION.md` | 작업 메모 (최종 결정 아님) | 전역 |
| `docs/CONTENT-STRATEGY.md` | 콘텐츠 로드맵 | Content Strategist |
| `docs/EDITORIAL-CALENDAR.md` | 편집 캘린더 | Content Strategist |
| `docs/RESEARCH-BRIEF.md` | 조사 결과 | Researcher |
| `docs/SEO-AUDIT.md` | SEO 감사 | SEO Specialist |
| `docs/DEPLOY-CHECKLIST.md` | 배포 체크리스트 | DevOps Engineer |
| `posts/*.md` | 블로그 포스트 | Writer |

## Required Operating Rules

1. Read `.libragent/teamwork.json` to confirm the active execution substrate before working.
2. Read `MISSION.md`, `ROLES.md`, and `coordination/KANBAN.md` before meaningful work.
3. Claim or update work in `coordination/KANBAN.md` before starting execution.
4. Write durable status changes to the canonical coordination files, not only to chat.
5. Append handoffs to `coordination/HANDOFF.md` instead of rewriting previous entries.
6. Promote durable choices into `coordination/DECISIONS.md`.
7. Record blockers and active risks honestly in `coordination/KANBAN.md` and `coordination/RISKS.md`.
8. Stay inside your role boundary. Do not silently rewrite another role's primary artifact.
9. The governing coordinator must keep working in this workspace.
10. If the scaffold is incomplete or stale, repair the workspace constitution before pushing new directives.

## Blog-Specific Rules

- **포스트 네이밍**: `posts/YYYY-MM-DD-slug-title.md` 형식
- **frontmatter 필수**: `title`, `date`, `author`, `tags`, `excerpt` 포함
- **톤**: 저자의 기존 포스트 스타일 일관성 유지 (기술적 but 접근 가능한 영어)
- **SEO**: 모든 포스트에 OG/Twitter Card/JSON-LD 메타데이터 포함
- **배포**: `main` 브랜치 푸시 시 자동 CI/CD → GitHub Pages

## Refresh And Resume Notes

- Changes to `agents.md` and other workspace constitution files do not instantly rewrite the current session prompt.
- Newly created workspace skills apply in a later execution step, not retroactively in the same turn.
- Use `.libragent/teamwork.json` as the machine-readable contract for execution mode and refresh expectations.
