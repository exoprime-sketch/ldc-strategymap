import React, { lazy, Suspense } from "react";
import PublicApp from "./app/PublicApp.jsx";

const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN === "true";
const AdminApp = ADMIN_ENABLED
  ? lazy(() => import("./features/admin/AdminApp.jsx"))
  : null;

export default function App() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  if (ADMIN_ENABLED && AdminApp && pathname.startsWith("/admin")) {
    return (
      <Suspense
        fallback={
          <main className="app-shell admin-loading" aria-busy="true">
            <p>운영자 화면을 불러오는 중입니다.</p>
          </main>
        }
      >
        <AdminApp />
      </Suspense>
    );
  }

  return <PublicApp />;
}
