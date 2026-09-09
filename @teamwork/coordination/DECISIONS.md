# DECISIONS

## 2026-09-09 — 조직 구조
- **결정**: hub-and-spoke 모델 채택
- **이유**: Coordinator가 기획/배포/SEO를 통합 관리하는 것이 블로그 운영에 효율적
- **영향**: 모든 작업은 Coordinator를 통해 배분되고 통합됨

## 2026-09-09 — 실행 기질
- **결정**: explicit org lineage 사용
- **이유**: org UI에서 조직 가시성 확보, 세션 이력 영속성, 워크스페이스 공유
- **영향**: org__createOrg 호출 후 모든 자식 세션이 org root의 워크스페이스 상속
