import React from "react";
import { DATA_STATUS_COPY } from "../data/platformCopy.js";

export default function SourceBadge({ type = "curated" }) {
  const meta = DATA_STATUS_COPY[type] || DATA_STATUS_COPY.curated;
  return (
    <span className={`source-badge source-badge-${type}`} title={meta.description}>
      {meta.label}
    </span>
  );
}

