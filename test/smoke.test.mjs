import assert from "node:assert/strict";
import fs from "node:fs";
import { parseUrlState, buildShareUrl } from "../src/lib/urlState.js";
import {
  collectAllowedHosts,
  isAllowedExternalUrl,
  sanitizeExternalUrl,
} from "../src/lib/urlSafety.js";
import { sanitizeCsvCell, toCsv } from "../src/lib/download.js";

const whitelist = JSON.parse(
  fs.readFileSync(new URL("../official_link_whitelist_asean.json", import.meta.url), "utf8")
);

const state = parseUrlState(
  "?country=vn<script>&tech=재생에너지&region=아시아&q=%3Cbad%3E&compare=VN,KE,CL,XX"
);
assert.equal(state.country, "VNSCRIPT");
assert.equal(state.technology, "재생에너지");
assert.equal(state.query, "bad");
assert.deepEqual(state.compare.slice(0, 3), ["VN", "KE", "CL"]);

const share = buildShareUrl(
  { country: "VN", technology: "재생에너지", region: "아시아", compare: ["VN", "KE"] },
  "https://strategy.example.org/"
);
assert.ok(share.includes("country=VN"));
assert.ok(share.includes("compare=VN%2CKE"));

const allowedHosts = collectAllowedHosts(whitelist);
assert.equal(
  isAllowedExternalUrl("https://data.worldbank.org/country/viet-nam", allowedHosts),
  true
);
assert.equal(isAllowedExternalUrl("javascript:alert(1)", allowedHosts), false);
assert.equal(sanitizeExternalUrl("https://not-allowed.example/", allowedHosts), "");

assert.equal(sanitizeCsvCell("=IMPORTXML(\"https://x\")"), "'=IMPORTXML(\"https://x\")");
const csv = toCsv([{ name: "베트남", formula: "+cmd" }]);
assert.ok(csv.includes("\"'+cmd\""));

const publicDataset = JSON.parse(
  fs.readFileSync(new URL("../public/ctis_visible_site_dataset.json", import.meta.url), "utf8")
);
assert.equal(publicDataset.country.nameKo, "베트남 사회주의 공화국");

console.log("smoke tests passed");
