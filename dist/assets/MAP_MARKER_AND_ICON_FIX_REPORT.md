# 지도 위치·기술 아이콘 수정 보고서

## 1) 확인된 문제

### 위치 불일치
- 멕시코 사례처럼 카드/라벨은 해당 국가를 가리키지만 지도상의 기술 아이콘이 본토가 아닌 바다 쪽으로 밀려 보일 수 있었습니다.
- 원인은 **좌표값 자체보다 DOM Marker의 시각 앵커 구조**에 있었습니다.
- 기존 마커는 아이콘 박스와 오른쪽 칩(텍스트 배지)을 하나의 DOM 요소로 만들고 `anchor: "center"`로 올렸습니다.
- 이 경우 MapLibre는 **전체 DOM 폭의 중앙**을 좌표에 맞추므로, 실제 눈에 보이는 아이콘 박스는 좌표보다 왼쪽으로 밀려 보였습니다.
- 서쪽 해안/도서/긴 국토 국가일수록 사용자가 보기에는 “아이콘이 바다 위에 뜬다”는 인상을 더 강하게 주는 구조였습니다.

### 기술 아이콘 fallback
- 태양광 외 다른 기술들이 시계 아이콘으로 보이던 원인은 `getTechMarkerIconSvg()` / `getTechMarkerLabel()`가 소수 기술만 하드코딩 분기하고, 나머지는 모두 **기본 시계 SVG**로 fallback 하던 구조 때문입니다.
- 특히 실제 추천 데이터는 다음과 같은 **legacy 기술명**을 사용합니다.
  - `태양광 발전`
  - `재난 예측 및 조기경보`
  - `수자원 관리`
  - `맹그로브/산림 생태계 복원`
  - `친환경 폐기물 처리`
  - `탄소 포집 및 저장 (CCUS)`
- 앱 내부에서는 이를 `normalizeTechName()`으로 업데이트된 CTIS 기술명으로 바꾸지만, 기존 아이콘 분기 로직은 이 **정규화된 이름을 충분히 커버하지 못해** 다수가 시계 fallback으로 빠졌습니다.

## 2) Root cause

### A. 위치 문제 root cause
1. `createTechMarkerElement()`가 아이콘 + 텍스트 칩을 한 DOM에 포함
2. `syncTechMarkers()`가 `new maplibregl.Marker({ anchor: "center" })`로 해당 DOM을 좌표에 올림
3. 칩이 오른쪽으로 길어질수록 DOM 전체 폭이 커짐
4. 결과적으로 아이콘 시각 중심이 실제 좌표보다 서쪽으로 밀림

### B. 시계 아이콘 root cause
1. `getTechMarkerIconSvg()`가 몇 개 기술만 문자열 includes로 분기
2. `normalizeTechName()` 이후 기술명이 `물 부문 기술`, `산림·생태계 부문 기술`, `기후변화 감시 및 진단 기술` 등으로 변환됨
3. 기존 분기 조건은 `수자원`, `폐기물`, `조기경보` 같은 일부 키워드 중심이라 정규화 후 이름과 어긋남
4. 매핑되지 않은 기술이 기본 clock SVG로 fallback

## 3) 수정 내용

### `src/App.js`
- `TECH_MARKER_PROFILE_LIBRARY` 추가
  - 태양광, 태양열, 풍력, 해양, 수자원, 지열, 바이오, 농업, 수소, 원자력, 산업, CCUS, 순환경제, 전력망, 열·건물, 모빌리티, 기후정보, 위험관리, 보건, 국토·연안, 생태계, 적응기반, 기본 아이콘으로 구성
- `TECH_TO_MARKER_PROFILE_KEY` 추가
  - CTIS 38대 기술 체계의 정규화된 기술명을 각 아이콘군에 매핑
- `getTechMarkerProfile(tech)` 추가
  - 정규화 이름 기준으로 먼저 exact match
  - 예외 케이스는 토큰 기반 fallback으로 2차 보정
- `getTechMarkerIconSvg()` / `getTechMarkerLabel()`를 새 프로파일 기반으로 교체
- `createTechMarkerElement()`에서 `aria-pressed`, `data-tech` 부여

### DOM marker 스타일 개선 (`src/App.js` 내부 style block)
- `.ct-marker` 폭/높이는 아이콘 쉘 기준으로 유지
- `.ct-marker-chip`은 absolute로 분리해 **좌표 앵커 계산에서 시각적 영향 최소화**
- 칩은 기본 숨김, hover / focus / active에서만 표시되도록 변경
- hover / active 시 shell 강조 추가

## 4) 전수 점검 결과

추천 후보 데이터 기준으로 다음 기술군을 점검했습니다.
- CCUS
- 태양광
- 기후정보/조기경보
- 수자원
- 생태계 복원
- 순환경제/폐기물

추가로 기술 체계 전체(CTIS 38대 기술)도 아이콘군 매핑을 넣어, 현재 추천 데이터 외 기술이 추가되더라도 다시 clock fallback으로 빠질 가능성을 크게 낮췄습니다.

### 좌표/위치 점검
- 추천 후보의 `lon/lat`, `countryCenter` 값은 모두 유효 범위 내로 확인
- 즉, 핵심 문제는 좌표 오입력보다는 **DOM marker anchor 시각 오프셋**이었습니다.
- 기존 좌표 정규화 헬퍼(`getRecommendationPointCoords`, `getRecommendationCountryCenterCoords`)는 유지하고, 시각 오프셋을 줄이는 방향으로 수정했습니다.

## 5) 빌드/검증
- `node node_modules/vite/bin/vite.js build`로 빌드 통과 확인
- 결과 `dist/` 갱신 완료

## 6) 실행 방법
```bash
npm install
npm run dev
```

빌드:
```bash
npm run build
```

만약 ZIP 안의 포함된 `node_modules` 상태 때문에 Vite 실행이 꼬이면, 아래처럼 한번 정리 후 다시 설치하면 됩니다.
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```
