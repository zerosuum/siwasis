// scripts/strip-dark.js
// Pakai: node scripts/strip-dark.js        (dry-run, hanya preview)
//       node scripts/strip-dark.js --write  (tulis perubahan)

import fs from "node:fs";
import path from "node:path";

const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const roots = ["src/components", "src/app"]; // boleh tambah folder lain di sini
const WRITE = process.argv.includes("--write");

const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else if (exts.has(path.extname(p))) files.push(p);
  }
}

for (const r of roots) if (fs.existsSync(r)) walk(r);

let totalHits = 0;
let changed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");

  // 1) hapus semua util tailwind yg diawali "dark:"
  // contoh: dark:bg-gray-900, dark:border-[#111], dark:text-gray-50, dll
  let after = before.replace(/\bdark:[^\s"'`]+/g, "");

  // 2) rapihin spasi gandanya di dalam kelas
  after = after.replace(/[ \t]{2,}/g, " ");

  if (after !== before) {
    changed++;
    const hits = (before.match(/\bdark:[^\s"'`]+/g) || []).length;
    totalHits += hits;

    if (WRITE) {
      fs.writeFileSync(file, after, "utf8");
      console.log(`✍️  ${file}  —  removed ${hits} dark:* token(s)`);
    } else {
      console.log(`🔎 ${file}  —  would remove ${hits} dark:* token(s)`);
    }
  }
}

console.log(
  `${
    WRITE ? "✅ WROTE" : "👀 PREVIEW"
  } — files changed: ${changed}, tokens removed: ${totalHits}`
);
