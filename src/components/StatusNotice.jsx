import React from "react";

export default function StatusNotice({ tone = "info", title, children }) {
  return (
    <section className={`status-notice status-notice-${tone}`} aria-live="polite">
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </section>
  );
}

