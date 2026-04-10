import React from "react";
import ExternalLink from "../../components/ExternalLink.jsx";
import SourceBadge from "../../components/SourceBadge.jsx";
import StatusNotice from "../../components/StatusNotice.jsx";
import { DATA_STATUS_COPY } from "../../data/platformCopy.js";

export default function EvidencePanel({
  country,
  links,
  ctisDatasetState,
  proxyState,
}) {
  const proxyMode =
    proxyState?.dashboard?.sourceMode ||
    proxyState?.projects?.sourceMode ||
    (proxyState?.error ? "fallback" : "not-connected");

  return (
    <section className="evidence-panel" id="evidence" aria-labelledby="evidence-title">
      <div className="section-heading">
        <p>근거와 한계</p>
        <h2 id="evidence-title">공식 링크, 공개 seed, proxy 상태를 구분합니다.</h2>
      </div>

      <div className="status-grid">
        <StatusNotice tone="success" title="외부 링크">
          allowlist에 등록된 공식·공개 출처만 열 수 있습니다.
        </StatusNotice>
        <StatusNotice tone={proxyState.error ? "warning" : "info"} title="실시간 연계">
          {proxyState.loading
            ? "same-origin proxy를 조회하는 중입니다."
            : proxyState.error || `proxy 상태: ${proxyMode}`}
        </StatusNotice>
        <StatusNotice
          tone={ctisDatasetState.error ? "warning" : "info"}
          title="CTIS 공개 seed"
        >
          {ctisDatasetState.loading
            ? "공개 seed를 불러오는 중입니다."
            : ctisDatasetState.error ||
              `${ctisDatasetState.data?.capturedAt || "갱신일 미확인"} 기준 공개 화면 구조`}
        </StatusNotice>
      </div>

      <div className="evidence-layout">
        <div className="source-table-wrap">
          <table className="source-table">
            <caption>{country.nameKo} 근거 링크 목록</caption>
            <thead>
              <tr>
                <th scope="col">유형</th>
                <th scope="col">출처</th>
                <th scope="col">링크</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={`${link.group}-${link.key}`}>
                  <td>
                    <SourceBadge type={link.sourceType} />
                  </td>
                  <td>
                    <strong>{link.groupLabel}</strong>
                    <span>{link.label}</span>
                  </td>
                  <td>
                    <ExternalLink href={link.href}>공식 페이지 열기</ExternalLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="method-box">
          <h3>읽는 방법</h3>
          <dl>
            {Object.entries(DATA_STATUS_COPY).map(([key, value]) => (
              <div key={key}>
                <dt>
                  <SourceBadge type={key} />
                </dt>
                <dd>{value.description}</dd>
              </div>
            ))}
          </dl>
          <h3>현재 한계</h3>
          <ul>
            <li>일부 국가의 세부 지자체·현장 좌표는 공개 seed가 아닌 후속 정규화가 필요합니다.</li>
            <li>proxy API가 실패하면 공식 링크 중심의 fallback 상태로 표시됩니다.</li>
            <li>표시된 기술 초점은 예비 탐색용이며 협력 우선순위 확정 결과가 아닙니다.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
