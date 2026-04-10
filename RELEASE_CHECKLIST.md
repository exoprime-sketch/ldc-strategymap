# 공개 전 체크리스트

- [ ] `VITE_ENABLE_ADMIN=false` 상태로 public build를 생성했다.
- [ ] `/admin`이 운영자 UI를 렌더링하지 않는지 확인했다.
- [ ] `dist/assets`에 admin chunk가 의도치 않게 포함되지 않았는지 확인했다.
- [ ] `official_link_whitelist_asean.json`의 모든 URL이 공식·공개 출처인지 확인했다.
- [ ] `public/ctis_visible_site_dataset.json`의 `capturedAt`, 출처, 공개 범위 문구가 최신인지 확인했다.
- [ ] proxy `/health`, `/api/live/v1/country-dashboard?country=VN`, `/api/pipeline/v1/projects?country=VN` 응답을 확인했다.
- [ ] 모바일 폭 390px, 태블릿, 데스크톱에서 지도·필터·근거 표가 깨지지 않는지 확인했다.
- [ ] 다운로드 CSV/JSON 파일명이 이상한 문자 없이 생성되는지 확인했다.
- [ ] 브라우저 콘솔에 렌더링 오류가 없는지 확인했다.
- [ ] MapLibre CDN 접근 또는 내부 mirror 경로가 배포망에서 허용되는지 확인했다.
- [ ] README, DEPLOY, ARCHITECTURE 문서를 배포 환경에 맞게 마지막으로 확인했다.
