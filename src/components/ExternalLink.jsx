import React from "react";
import { ALLOWED_EXTERNAL_HOSTS } from "../data/officialLinks.js";
import {
  externalLinkSecurityProps,
  sanitizeExternalUrl,
} from "../lib/urlSafety.js";

export default function ExternalLink({ href, children, className = "" }) {
  const safeHref = sanitizeExternalUrl(href, ALLOWED_EXTERNAL_HOSTS);

  if (!safeHref) {
    return (
      <span className={`external-link blocked ${className}`}>
        허용되지 않은 링크
      </span>
    );
  }

  return (
    <a
      className={`external-link ${className}`}
      href={safeHref}
      {...externalLinkSecurityProps()}
    >
      {children}
    </a>
  );
}

