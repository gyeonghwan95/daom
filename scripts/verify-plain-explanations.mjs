import { GLOSSARY_PLAIN_EXPLANATIONS } from "../src/lib/glossary/plain-explanations.ts";

const nationwidePattern = /전국|지역에 관계없|지역과 관계없|어디서든/;

for (const [slug, paras] of Object.entries(GLOSSARY_PLAIN_EXPLANATIONS)) {
  const text = paras.join("");
  const len = text.length;
  const nationwide = nationwidePattern.test(text);
  const ok = len >= 1500 && len <= 2100;
  console.log(
    `${slug}\t${len}\t${ok ? "ok" : "LEN"}\t${nationwide ? "NW" : "local"}`,
  );
}
