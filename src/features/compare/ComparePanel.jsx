import React from "react";

export default function ComparePanel({
  countries,
  shortlist,
  onToggleShortlist,
  onClearShortlist,
}) {
  const rows = shortlist
    .map((iso2) => countries.find((country) => country.iso2 === iso2))
    .filter(Boolean);

  return (
    <section className="compare-panel" id="compare" aria-labelledby="compare-title">
      <div className="section-heading">
        <p>비교</p>
        <h2 id="compare-title">선택한 후보를 공개 근거 기준으로 나란히 봅니다.</h2>
      </div>
      {rows.length ? (
        <>
          <div className="compare-actions">
            <button className="ghost-action" type="button" onClick={onClearShortlist}>
              비교 목록 비우기
            </button>
          </div>
          <div className="compare-grid" role="list">
            {rows.map((country) => (
              <article className="compare-item" key={country.iso2} role="listitem">
                <div>
                  <span>{country.iso2}</span>
                  <h3>{country.nameKo}</h3>
                  <p>{country.nameEn}</p>
                </div>
                <dl>
                  <div>
                    <dt>기술 초점</dt>
                    <dd>{country.primaryTech}</dd>
                  </div>
                  <div>
                    <dt>권역</dt>
                    <dd>{country.focusRegion}</dd>
                  </div>
                  <div>
                    <dt>근거 링크</dt>
                    <dd>{country.linkCount}개</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="ghost-action"
                  onClick={() => onToggleShortlist(country.iso2)}
                >
                  제거
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="empty-state">
          국가 카드에서 “비교 목록에 담기”를 누르면 공개 근거, 기술 초점,
          링크 범위를 비교할 수 있습니다.
        </p>
      )}
    </section>
  );
}
