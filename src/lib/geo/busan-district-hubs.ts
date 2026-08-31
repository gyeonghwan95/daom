/** 부산 16개 구·군 법무사 허브 — 기존 URL만. 「부산 법무사」 exact는 HOME. */
export const BUSAN_DISTRICT_HUBS = [
  { href: "/중구법무사", label: "중구 법무사", hint: "남포·원도심 상가·주택" },
  { href: "/서구법무사", label: "서구 법무사", hint: "충무·동대신·송도 생활권" },
  { href: "/동구법무사", label: "동구 법무사", hint: "부산역·초량·범일" },
  { href: "/영도구법무사", label: "영도구 법무사", hint: "남항·동삼·봉래" },
  { href: "/부산진구법무사", label: "부산진구 법무사", hint: "서면·부전·전포" },
  { href: "/동래구법무사", label: "동래구 법무사", hint: "온천·사직·명륜" },
  { href: "/남구법무사", label: "남구 법무사", hint: "대연·용호·문현" },
  { href: "/북구법무사", label: "북구 법무사", hint: "덕천·화명·구포" },
  { href: "/해운대법무사", label: "해운대 법무사", hint: "센텀·재송·우동·좌동" },
  { href: "/사하구법무사", label: "사하구 법무사", hint: "하단·괴정·다대" },
  { href: "/금정구법무사", label: "금정구 법무사", hint: "부곡·장전·구서" },
  { href: "/강서구법무사", label: "강서구 법무사", hint: "명지·녹산·대저" },
  { href: "/연제구법무사", label: "연제구 법무사", hint: "연산·거제" },
  { href: "/수영구법무사", label: "수영구 법무사", hint: "광안·민락·남천" },
  { href: "/사상구법무사", label: "사상구 법무사", hint: "주례·감전·엄궁" },
  { href: "/기장군법무사", label: "기장군 법무사", hint: "정관·일광·기장읍" },
] as const;

export const BUSAN_DISTRICT_HUB_PATHS = BUSAN_DISTRICT_HUBS.map(
  (hub) => hub.href,
);

export function isBusanDistrictHubPath(path: string): boolean {
  return (BUSAN_DISTRICT_HUB_PATHS as readonly string[]).includes(path);
}

/** local-landing regionKey + case-region district key → 구·군(또는 생활권) 허브 */
const REGION_KEY_TO_HUB: Record<string, { href: string; label: string }> = {
  yeonje: { href: "/연제구법무사", label: "연제구 법무사" },
  haeundae: { href: "/해운대법무사", label: "해운대 법무사" },
  centum: { href: "/센텀법무사", label: "센텀 법무사" },
  jaesong: { href: "/재송동법무사", label: "재송동 법무사" },
  banyeo: { href: "/반여동법무사", label: "반여동 법무사" },
  suyeong: { href: "/수영구법무사", label: "수영구 법무사" },
  gwanganri: { href: "/광안리법무사", label: "광안리 법무사" },
  dongnae: { href: "/동래구법무사", label: "동래구 법무사" },
  busanjin: { href: "/부산진구법무사", label: "부산진구 법무사" },
  namgu: { href: "/남구법무사", label: "남구 법무사" },
  nam: { href: "/남구법무사", label: "남구 법무사" },
  munhyeon: { href: "/문현동법무사", label: "문현동 법무사" },
  buk: { href: "/북구법무사", label: "북구 법무사" },
  geumjeong: { href: "/금정구법무사", label: "금정구 법무사" },
  sasang: { href: "/사상구법무사", label: "사상구 법무사" },
  saha: { href: "/사하구법무사", label: "사하구 법무사" },
  junggu: { href: "/중구법무사", label: "중구 법무사" },
  jung: { href: "/중구법무사", label: "중구 법무사" },
  seogu: { href: "/서구법무사", label: "서구 법무사" },
  seo: { href: "/서구법무사", label: "서구 법무사" },
  donggu: { href: "/동구법무사", label: "동구 법무사" },
  dong: { href: "/동구법무사", label: "동구 법무사" },
  yeongdo: { href: "/영도구법무사", label: "영도구 법무사" },
  gangseo: { href: "/강서구법무사", label: "강서구 법무사" },
  myeongji: { href: "/명지법무사", label: "명지 법무사" },
  gijang: { href: "/기장군법무사", label: "기장군 법무사" },
  jeonggwan: { href: "/정관법무사", label: "정관 법무사" },
};

export function hubPathForRegionKey(
  regionKey: string,
): { href: string; label: string } | null {
  return REGION_KEY_TO_HUB[regionKey] ?? null;
}

/** 인접 구 허브 — 연제구(법원·등기국) inbound를 키우되 16구 exact-match 팜은 만들지 않음 */
export const ADJACENT_DISTRICT_HUBS: Record<
  string,
  { href: string; label: string }[]
> = {
  "/연제구법무사": [
    { href: "/동래구법무사", label: "동래구 법무사" },
    { href: "/부산진구법무사", label: "부산진구 법무사" },
    { href: "/수영구법무사", label: "수영구 법무사" },
  ],
  "/동래구법무사": [{ href: "/연제구법무사", label: "연제구 법무사" }],
  "/부산진구법무사": [{ href: "/연제구법무사", label: "연제구 법무사" }],
  "/수영구법무사": [{ href: "/연제구법무사", label: "연제구 법무사" }],
};
