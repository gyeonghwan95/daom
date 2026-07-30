import fs from "fs";

const files = [
  "src/lib/building-intent/content/display-change.ts",
  "src/lib/building-intent/content/split-special-regional.ts",
  "src/lib/corporate-intent/content/phase-gaps.ts",
];

for (const rel of files) {
  let text = fs.readFileSync(rel, "utf8");
  const before = text;
  // Fix broken pattern: ",,\n    "PARA",\n  ],\n    officeLine
  text = text.replace(
    /",,\n\s*"([^"]+)",\n\s*\],\n\s*officeLine/g,
    '",\n    "$1",\n    ],\n    officeLine',
  );
  // Also fix if trailing comma before closing got mangled differently
  text = text.replace(/",,\n\s*"([^"]+)",\n\s*\],/g, '",\n    "$1",\n  ],');
  if (text !== before) {
    fs.writeFileSync(rel, text);
    console.log("fixed", rel);
  } else {
    console.log("no fix needed", rel);
  }
}
