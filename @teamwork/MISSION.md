# Mission

## Team
Blog Management Org

## Objective
fritzprix.github.io (nublog) 블로그의 콘텐츠 기획, 작성, SEO 최적화, 배포를 전담하는 조직을 구축하고 운영한다

## Original User Request
블로그 관리를 위한 조직을 구축하라

## Collaboration Model
hub-and-spoke (Coordinator 허브 + 5개 Specialist 스포크)

## Execution Substrate
Explicit org lineage via agent__createOrg(...) once from the root session, then agent__spawnSession(...) for org-visible children. Org-visible children inherit the governing session's effective workspace by default. Follow org for org-specific operating rules.

Active specialist skill: `org`

## Blog Context
- **저자**: Doowoong Lee (fritzprix)
- **기술 스택**: React 19 · Vite 6 · TypeScript 5.7 · Tailwind CSS 4 · shadcn/ui
- **호스팅**: GitHub Pages (CI/CD 자동 배포)
- **현재 포스트**: 6편 (AI 연구, 경제, 철학)
- **도메인**: fritzprix.github.io / fritzprix.dev

## Definition of Done
- [x] 조직 구조 스키폴딩 완료 (agents.md, MISSION.md, ROLES.md)
- [x] org 루트 생성 및 teamwork.json 갱신
- [x] 6개 역할별 세션 스폰 (Coordinator, Content Strategist, Researcher, Writer, SEO Specialist, DevOps Engineer)
- [ ] KANBAN에 첫 작업 할당 완료
- [ ] 첫 콘텐츠 워크플로우 테스트 (기획 → 조사 → 작성 → SEO → 배포)

## Deliverables
- `@teamwork/coordination/KANBAN.md` — 작업 보드
- `@teamwork/docs/CONTENT-STRATEGY.md` — 콘텐츠 로드맵
- `@teamwork/docs/EDITORIAL-CALENDAR.md` — 편집 캘린더
- `@teamwork/docs/SEO-AUDIT.md` — SEO 감사 및 개선안
- `@teamwork/docs/DEPLOY-CHECKLIST.md` — 배포 체크리스트
- `@teamwork/docs/CONTENT-STRATEGY.md` — 콘텐츠 로드맵
