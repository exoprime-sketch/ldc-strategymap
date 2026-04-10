import React from "react";
import { PLATFORM_META, PUBLIC_NAV_ITEMS } from "../data/platformCopy.js";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#explore">
        본문으로 바로가기
      </a>
      <div className="brand-lockup" aria-label={PLATFORM_META.serviceName}>
        <img src="/icon-192.png" alt="" width="32" height="32" />
        <div>
          <span>{PLATFORM_META.serviceName}</span>
          <small>{PLATFORM_META.shortName}</small>
        </div>
      </div>
      <nav aria-label="주요 섹션">
        {PUBLIC_NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
