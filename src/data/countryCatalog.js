import { OFFICIAL_LINK_WHITELIST } from "./officialLinks.js";
import { safeLinkRowsForCountry } from "../lib/countryData.js";

export const TECHNOLOGY_OPTIONS = [
  "전체 기술",
  "기후위험·적응",
  "재생에너지",
  "물·농업",
  "산림·토지",
  "도시·인프라",
  "그린수소·산업",
];

const COUNTRY_PROFILES = {
  VN: {
    iso3: "VNM",
    nameKo: "베트남",
    nameEn: "Viet Nam",
    region: "아시아",
    subregion: "동남아시아",
    center: [108.2772, 14.0583],
    focusRegion: "메콩 델타 및 남부 지역",
    primaryTech: "기후위험·적응",
    secondaryTechs: ["물·농업", "도시·인프라"],
    useCase:
      "수해, 염해, 기후위험 관측 자료와 적응 정책·프로젝트 근거를 함께 검토합니다.",
    publicNote:
      "CTIS visible seed와 국가별 공식 링크가 함께 연결된 공개 검토 사례입니다.",
  },
  KH: {
    iso3: "KHM",
    nameKo: "캄보디아",
    nameEn: "Cambodia",
    region: "아시아",
    subregion: "동남아시아",
    center: [104.991, 12.5657],
    focusRegion: "농업·수자원 취약 지역",
    primaryTech: "물·농업",
    secondaryTechs: ["기후위험·적응", "산림·토지"],
    useCase:
      "농업 적응, 수자원, 국가 기후정책 근거를 선별해 초기 협력 검토에 사용합니다.",
  },
  LA: {
    iso3: "LAO",
    nameKo: "라오스",
    nameEn: "Lao PDR",
    region: "아시아",
    subregion: "동남아시아",
    center: [102.4955, 19.8563],
    focusRegion: "산림·수자원 관리 권역",
    primaryTech: "산림·토지",
    secondaryTechs: ["물·농업", "기후위험·적응"],
    useCase:
      "산림 MRV, 수자원, 국가 적응계획 관련 공식 링크를 중심으로 검토합니다.",
  },
  MX: {
    iso3: "MEX",
    nameKo: "멕시코",
    nameEn: "Mexico",
    region: "라틴아메리카",
    subregion: "북중미",
    center: [-102.5528, 23.6345],
    focusRegion: "국가 단위 에너지·환경 정책",
    primaryTech: "도시·인프라",
    secondaryTechs: ["재생에너지", "기후위험·적응"],
    useCase:
      "NDC, 국가 프로그램, 환경부 공식 포털을 함께 열람해 정책 연계성을 봅니다.",
  },
  KE: {
    iso3: "KEN",
    nameKo: "케냐",
    nameEn: "Kenya",
    region: "아프리카",
    subregion: "동아프리카",
    center: [37.9062, -0.0236],
    focusRegion: "재생에너지 및 건조지역 적응",
    primaryTech: "재생에너지",
    secondaryTechs: ["기후위험·적응", "물·농업"],
    useCase:
      "전력 접근성, 재생에너지, 기후위험 자료와 프로젝트 링크를 함께 확인합니다.",
  },
  CL: {
    iso3: "CHL",
    nameKo: "칠레",
    nameEn: "Chile",
    region: "라틴아메리카",
    subregion: "남아메리카",
    center: [-71.543, -35.6751],
    focusRegion: "아타카마 및 에너지 전환 권역",
    primaryTech: "그린수소·산업",
    secondaryTechs: ["재생에너지", "기후위험·적응"],
    useCase:
      "NDC, 그린수소, 재생에너지 협력 근거를 공식 링크 기준으로 모아 봅니다.",
  },
  FJ: {
    iso3: "FJI",
    nameKo: "피지",
    nameEn: "Fiji",
    region: "오세아니아",
    subregion: "태평양 도서국",
    center: [178.065, -17.7134],
    focusRegion: "연안·도서 취약 지역",
    primaryTech: "기후위험·적응",
    secondaryTechs: ["도시·인프라", "물·농업"],
    useCase:
      "해수면 상승, 연안 회복력, 도서국 적응 협력의 공개 근거를 확인합니다.",
  },
  BR: {
    iso3: "BRA",
    nameKo: "브라질",
    nameEn: "Brazil",
    region: "라틴아메리카",
    subregion: "남아메리카",
    center: [-51.9253, -14.235],
    focusRegion: "산림·바이오경제 권역",
    primaryTech: "산림·토지",
    secondaryTechs: ["재생에너지", "도시·인프라"],
    useCase:
      "산림, 토지이용, 공공 데이터 포털의 근거를 국가 단위로 점검합니다.",
  },
  GH: {
    iso3: "GHA",
    nameKo: "가나",
    nameEn: "Ghana",
    region: "아프리카",
    subregion: "서아프리카",
    center: [-1.0232, 7.9465],
    focusRegion: "도시·폐기물·물 관리 권역",
    primaryTech: "도시·인프라",
    secondaryTechs: ["물·농업", "재생에너지"],
    useCase:
      "도시 인프라, 폐기물, 수자원 관련 공개 프로젝트와 국가 지표를 검토합니다.",
  },
  SN: {
    iso3: "SEN",
    nameKo: "세네갈",
    nameEn: "Senegal",
    region: "아프리카",
    subregion: "서아프리카",
    center: [-14.4524, 14.4974],
    focusRegion: "에너지 접근 및 연안 적응 권역",
    primaryTech: "재생에너지",
    secondaryTechs: ["기후위험·적응", "도시·인프라"],
    useCase:
      "에너지 접근성, 연안 적응, 국제기구 프로젝트 링크를 함께 살펴봅니다.",
  },
};

export function buildCountryCatalog(whitelist = OFFICIAL_LINK_WHITELIST) {
  const countryCodes = whitelist?.meta?.countries || Object.keys(COUNTRY_PROFILES);
  return countryCodes
    .map((iso2) => {
      const profile = COUNTRY_PROFILES[iso2];
      if (!profile) return null;
      const links = safeLinkRowsForCountry(whitelist, iso2);
      const linkGroups = new Set(links.map((item) => item.group));
      return {
        iso2,
        ...profile,
        technologies: [profile.primaryTech, ...profile.secondaryTechs],
        linkCount: links.length,
        evidenceGroups: [...linkGroups],
        dataStatus: {
          official: links.filter((item) => item.sourceType === "official").length,
          curated: links.filter((item) => item.sourceType === "curated").length,
          derived: 1,
          fallback: iso2 === "VN" ? 1 : 0,
        },
      };
    })
    .filter(Boolean);
}

export const COUNTRY_CATALOG = buildCountryCatalog();
