import React, { useEffect, useState } from "react";
import "../../styles.css";

const DRAFT_KEY = "CTIS_ADMIN_DRAFT_V2";
const PUBLIC_DATASET_PATH = "/ctis_admin_seed_dataset.sample.json";

export default function AdminApp() {
  const [dataset, setDataset] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(DRAFT_KEY);
    if (stored) {
      setDataset(JSON.parse(stored));
      setMessage("브라우저 draft를 불러왔습니다.");
      return;
    }
    fetch(PUBLIC_DATASET_PATH)
      .then((res) => res.json())
      .then((data) => {
        setDataset(data);
        setMessage("sample dataset을 불러왔습니다.");
      })
      .catch(() => setMessage("sample dataset을 불러오지 못했습니다."));
  }, []);

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = JSON.parse(String(reader.result || "{}"));
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
        setDataset(next);
        setMessage("JSON draft를 브라우저 저장소에 보관했습니다. 실제 배포 데이터 교체는 운영 절차에 따라 진행하세요.");
      } catch {
        setMessage("JSON 형식이 올바르지 않습니다.");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <p>운영자 전용</p>
        <h1>CTIS 공개 seed 관리</h1>
        <p>
          이 화면은 <code>VITE_ENABLE_ADMIN=true</code> 빌드에서만 접근됩니다.
          public build에는 관리자 동선이 노출되지 않습니다.
        </p>
        <label className="upload-control">
          공개 seed JSON 업로드
          <input type="file" accept="application/json,.json" onChange={handleUpload} />
        </label>
        <div aria-live="polite" className="admin-message">
          {message}
        </div>
        {dataset ? (
          <pre>{JSON.stringify({ source: dataset.source, capturedAt: dataset.capturedAt, country: dataset.country?.nameKo }, null, 2)}</pre>
        ) : null}
      </section>
    </main>
  );
}
