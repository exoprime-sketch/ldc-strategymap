# 아키텍처 메모

## 모듈 구조

- `src/App.js`: public/admin route gate. 기본 public build에서는 admin을 lazy import하지 않습니다.
- `src/app/PublicApp.jsx`: 공개 앱의 상태 조립, URL state, shortlist, proxy hook 연결
- `src/features/map`: MapLibre 지도와 마커
- `src/features/explorer`: 필터, 국가 목록, 선택 국가 요약
- `src/features/evidence`: 공식 링크, 출처 유형, 데이터 한계 표시
- `src/features/compare`: 후보 비교 목록
- `src/features/download`: share URL, CSV/JSON 다운로드
- `src/features/admin`: 내부 운영자 전용 seed 관리 화면
- `src/lib`: URL sanitize, 다운로드 sanitize, proxy client, 데이터 변환
- `src/data`: 공개 copy, 국가 카탈로그, allowlist 연결
- `src/hooks`: CTIS public seed와 proxy 상태 로딩

## public/admin 분리

admin 화면은 `/admin` 경로와 `VITE_ENABLE_ADMIN=true`가 동시에 필요합니다. 기본값은 false입니다. public build에서는 관리자 업로드, draft, publish 이력 개념이 공개 UI에 노출되지 않습니다.

## 데이터 상태 모델

- `official`: allowlist에 등록된 공식 출처
- `curated`: 검토자가 선별한 공개 링크
- `derived`: 공식 링크 존재 여부와 공개 seed를 바탕으로 만든 탐색 요약
- `fallback`: proxy 실패 또는 세부 데이터 부재 시 사용하는 공개 seed
- `live`: same-origin proxy가 공개 API에서 받은 응답

## proxy

`server_pipeline_proxy_final.js`는 입력 길이를 제한하고, timeout과 메모리 cache를 적용합니다. 외부 API 오류는 상세 upstream URL이나 stack을 노출하지 않고 `UPSTREAM_UNAVAILABLE` fallback 형태로 응답합니다.

## MapLibre 로딩

MapLibre GL JS는 npm dependency로 번들링하지 않고 `StrategyMap.jsx`에서 런타임 로드합니다. public 초기 JS를 작게 유지하기 위한 선택이며, 기관 내부망 배포에서는 CDN URL을 내부 정적 asset 경로로 바꾸면 됩니다.
