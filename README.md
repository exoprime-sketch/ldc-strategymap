# 개도국 협력 전략지도

개도국 기후기술 협력 후보를 국가, 기술, 지역, 공식 근거 링크 기준으로 탐색하는 React/Vite 공개형 지도 플랫폼입니다. MapLibre GL JS로 국가 후보를 지도에 표시하고, `official_link_whitelist_asean.json` allowlist를 기준으로 외부 링크를 안전하게 엽니다.

## 이번 open-ready 정비 핵심

- `src/App.js`를 public/admin 라우팅만 담당하는 얇은 entry로 축소했습니다.
- 공개 앱은 `src/app`, `src/features`, `src/components`, `src/lib`, `src/data`, `src/hooks`로 분리했습니다.
- 기본 public build에서는 `/admin` 운영자 UI가 보이지 않으며, `VITE_ENABLE_ADMIN=true`일 때만 lazy route로 로드됩니다.
- CTIS 공개 seed, 공식 링크, proxy 조회, fallback 상태를 사용자에게 구분해 표시합니다.
- 외부 링크 allowlist, `noopener noreferrer`, URL state sanitize, CSV 셀 sanitize를 유지했습니다.
- MapLibre GL JS는 public bundle을 작게 유지하기 위해 지도 컴포넌트에서 필요 시 CDN으로 로드합니다. 폐쇄망 배포에서는 `src/features/map/StrategyMap.jsx`의 asset URL을 내부 mirror로 바꾸세요.

## 실행

```bash
npm install
npm run dev
```

PowerShell 실행 정책으로 `npm`이 막히면 Windows에서는 `npm.cmd install`, `npm.cmd run dev`를 사용하세요.
개발 서버는 기본적으로 `127.0.0.1`에만 바인딩됩니다. 외부 기기 테스트가 필요할 때만 Vite `--host` 옵션을 별도 검토하세요.

proxy까지 확인하려면 별도 터미널에서 실행합니다.

```bash
npm run dev:proxy
```

## 빌드

```bash
npm run build
npm run preview
```

운영자 화면을 포함한 내부 확인 빌드는 다음처럼 실행합니다. 공개 배포에는 사용하지 마세요.

```bash
VITE_ENABLE_ADMIN=true npm run build
```

Windows PowerShell:

```powershell
$env:VITE_ENABLE_ADMIN="true"; npm.cmd run build
```

## 데이터

- `public/ctis_visible_site_dataset.json`: public 화면에서 읽는 CTIS 공개 seed
- `public/ctis_admin_seed_dataset.sample.json`: 내부 운영자 화면의 샘플 seed
- `official_link_whitelist_asean.json`: 외부 링크 allowlist와 국가별 공식 링크 묶음
- `server_pipeline_proxy_final.js`: same-origin proxy로 World Bank 등 공개 API와 curated link를 묶어 제공

## 테스트

```bash
npm run test:smoke
```

테스트는 URL state 파싱, 링크 allowlist 처리, CSV sanitize, proxy health 기본 응답을 점검합니다.
