# 배포 가이드

## public 배포 기본값

`.env` 또는 배포 환경에서 다음 값을 기본으로 둡니다.

```bash
VITE_ENABLE_ADMIN=false
```

이 값이 기본값이면 `/admin` 접근 시 운영자 UI 대신 public build 비활성화 안내만 표시됩니다. 공개 배포물에 admin chunk가 포함되는지 `dist/assets`를 최종 확인하세요.

## 정적 앱 배포

```bash
npm install
npm run build
npm run preview
```

정적 호스팅에는 `dist/`를 배포합니다. `server_pipeline_proxy_final.js`를 함께 쓰는 환경에서는 `/api`와 `/health`를 proxy 서버로 라우팅하세요.

## proxy 배포

```bash
PORT=3001 node server_pipeline_proxy_final.js
```

권장 운영 설정:

- `PORT`: proxy listening port
- `PROXY_TIMEOUT_MS`: 외부 API timeout. 기본 12000ms
- `PROXY_MAX_CACHE_ITEMS`: 메모리 cache 최대 항목 수. 기본 200

proxy는 같은 origin 뒤에 두고 Vite 개발 서버 또는 reverse proxy에서 `/api`, `/health`를 연결합니다. 외부 오류는 public fallback 메시지로 축약해 내려보냅니다.

## 캐시와 데이터 갱신

- public seed 교체: `public/ctis_visible_site_dataset.json`을 검증 후 교체합니다.
- allowlist 교체: `official_link_whitelist_asean.json`에 국가별 공식 링크만 반영합니다.
- 변경 후 `npm run test:smoke`와 `npm run build`를 수행합니다.
