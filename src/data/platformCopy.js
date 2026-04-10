export const PLATFORM_META = {
  serviceName: "개도국 협력 전략지도",
  shortName: "LDC Strategy Map",
  description:
    "개도국 기후기술 협력 후보를 국가, 기술, 지역, 공식 근거 링크 기준으로 함께 검토하는 공개형 지도 플랫폼입니다.",
  publicReleaseDate: "2026-04-10",
};

export const PUBLIC_NAV_ITEMS = [
  { href: "#explore", label: "탐색" },
  { href: "#evidence", label: "근거" },
  { href: "#compare", label: "비교" },
  { href: "#methodology", label: "방법론" },
  { href: "#release", label: "공개 범위" },
];

export const DATA_STATUS_COPY = {
  official: {
    label: "공식 출처",
    description: "정부, 국제기구, 다자기금, 공공 데이터 포털 등 allowlist에 등록된 링크입니다.",
  },
  curated: {
    label: "선별 링크",
    description: "플랫폼 검토 과정에서 국가별 근거로 묶은 공개 웹 링크입니다.",
  },
  derived: {
    label: "파생 요약",
    description: "공식 링크와 공개 데이터의 존재 여부를 바탕으로 만든 탐색용 요약입니다.",
  },
  fallback: {
    label: "기본 표시",
    description: "실시간 API가 연결되지 않아도 화면 이해를 돕기 위해 제공되는 공개 seed입니다.",
  },
  live: {
    label: "프록시 조회",
    description: "same-origin proxy가 World Bank 등 공개 API를 조회해 만든 응답입니다.",
  },
};

export const METHODOLOGY_NOTES = [
  "이 플랫폼은 협력 후보를 확정하거나 순위를 공표하는 도구가 아니라, 공개 근거를 빠르게 모아 사전 검토를 돕는 탐색 도구입니다.",
  "국가별 링크는 allowlist에 등록된 공식·공개 출처만 외부 이동 대상으로 사용합니다.",
  "World Bank 등 일부 실시간 API는 proxy를 통해 조회하며, 실패 시 공식 링크와 공개 seed 중심으로 상태를 명시합니다.",
  "CTIS visible seed는 2026-04-02에 공개 화면 구조를 기준으로 정리한 샘플 공개 데이터이며, 세부 운영 데이터와 혼동하지 않도록 표시합니다.",
];

export const RELEASE_SCOPE_ITEMS = [
  "공개 화면에서는 운영자 업로드, draft, publish 이력 UI를 노출하지 않습니다.",
  "운영자 화면은 /admin 경로와 VITE_ENABLE_ADMIN=true 빌드 플래그가 모두 있을 때만 접근됩니다.",
  "외부 링크는 새 창에서 열리며 noopener, noreferrer 보안 속성을 적용합니다.",
  "다운로드 파일명과 CSV 셀 값은 기본적인 spreadsheet injection 방어 처리를 거칩니다.",
];
