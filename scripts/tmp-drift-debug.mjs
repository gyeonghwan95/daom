import fs from "node:fs";

const samples = ["부산등기법무사", "부산법인법무사", "해운대법무사", "index"];
for (const s of samples) {
  const file = s === "index" ? "out/index.html" : `out/${s}.html`;
  const h = fs.readFileSync(file, "utf8");
  console.log(
    s,
    "specialist?",
    h.includes("부산상속전문법무사"),
    "hub?",
    h.includes("부산상속법무사"),
  );
}

// Compare body char deltas from manifests
const before = JSON.parse(
  fs.readFileSync(".cache/inheritance-reset/before/manifest.json", "utf8"),
);
const after = JSON.parse(
  fs.readFileSync(".cache/inheritance-reset/after/manifest.json", "utf8"),
);
const deltas = [];
for (const url of Object.keys(before.pages)) {
  const b = before.pages[url];
  const a = after.pages[url];
  if (!a || b.missing || a.missing) continue;
  if (b.bodyChars !== a.bodyChars) {
    deltas.push({ url, d: a.bodyChars - b.bodyChars });
  }
}
deltas.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));
console.log("char delta samples", deltas.slice(0, 15));
const sameLen = deltas.filter((d) => d.d === 0).length;
console.log("same length but hash diff?", sameLen);
