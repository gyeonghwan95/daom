#!/usr/bin/env node
/**
 * RSS 피드 생성 (prebuild)
 * @see scripts/rss/build-feed.mjs
 */
import { writeRssFeed } from "./rss/build-feed.mjs";

const { outputPath, itemCount } = writeRssFeed();
console.log(`Generated ${outputPath} (${itemCount} items)`);
