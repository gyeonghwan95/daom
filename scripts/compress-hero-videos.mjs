#!/usr/bin/env node
/**
 * 히어로 mp4를 Cloudflare Pages 25 MiB 한도 안으로 맞춘다.
 * 플레이어는 음소거·최대 8초이므로 그 길이만 남긴다.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIDEO_DIR = path.join(ROOT, "public", "video");
const LIMIT_BYTES = 20 * 1024 * 1024;
const DURATION_S = "8.2";

const ffmpegPath = require("ffmpeg-static");
if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
  console.error("ffmpeg-static binary missing. npm i -D ffmpeg-static");
  process.exit(1);
}

const files = fs
  .readdirSync(VIDEO_DIR)
  .filter((name) => name.toLowerCase().endsWith(".mp4"));

if (files.length === 0) {
  console.error("[compress-hero-videos] public/video 에 mp4가 없습니다.");
  process.exit(1);
}

for (const name of files) {
  const src = path.join(VIDEO_DIR, name);
  const tmp = path.join(VIDEO_DIR, `.tmp-${name}`);
  const before = fs.statSync(src).size;
  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-i",
      src,
      "-t",
      DURATION_S,
      "-an",
      "-vf",
      "scale='min(1280,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      tmp,
    ],
    { stdio: "inherit" },
  );
  const after = fs.statSync(tmp).size;
  if (after >= LIMIT_BYTES) {
    fs.unlinkSync(tmp);
    console.error(
      `[compress-hero-videos] FAIL ${name} still ${(after / (1024 * 1024)).toFixed(2)} MiB`,
    );
    process.exit(1);
  }
  fs.renameSync(tmp, src);
  console.log(
    `[compress-hero-videos] ${name}: ${(before / (1024 * 1024)).toFixed(2)} → ${(after / (1024 * 1024)).toFixed(2)} MiB`,
  );
}
