"use client";

import { useEffect, useRef, useState } from "react";
import { KakaoIcon, NaverIcon } from "@/components/consultation/ConsultationIcons";
import { loadKakaoMaps } from "@/lib/kakao-map-loader";
import {
  getKakaoMapAppKey,
  getKakaoMapPlaceUrl,
  getNaverMapSearchUrl,
  getOpenStreetMapEmbedUrl,
  officeCoordinates,
  officeLocation,
} from "@/lib/office-location";
import { siteConfig } from "@/lib/site";

type MapMode = "loading" | "kakao" | "fallback";

const mapLinkBase =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors sm:min-h-12";

function MapExternalLinks() {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      <a
        href={getNaverMapSearchUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${mapLinkBase} bg-[#03C75A] text-white hover:opacity-90`}
      >
        <NaverIcon className="h-5 w-5 shrink-0" />
        네이버 지도에서 보기
      </a>
      <a
        href={getKakaoMapPlaceUrl(siteConfig.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${mapLinkBase} bg-[#FEE500] text-[#191919] hover:brightness-95`}
      >
        <KakaoIcon className="h-5 w-5 shrink-0" />
        카카오맵에서 보기
      </a>
    </div>
  );
}

function OpenStreetMapFallback() {
  return (
    <iframe
      title={`${siteConfig.name} 위치 지도`}
      src={getOpenStreetMapEmbedUrl()}
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

export function OfficeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appKey = getKakaoMapAppKey();
  const [mode, setMode] = useState<MapMode>(() => (appKey ? "loading" : "fallback"));

  useEffect(() => {
    if (!appKey) return;

    let cancelled = false;

    loadKakaoMaps(appKey)
      .then(() => {
        if (cancelled || !containerRef.current || !window.kakao?.maps) return;

        const { lat, lng } = officeCoordinates;
        const center = new window.kakao.maps.LatLng(lat, lng);
        const map = new window.kakao.maps.Map(containerRef.current, {
          center,
          level: 3,
        });
        const marker = new window.kakao.maps.Marker({ position: center });
        marker.setMap(map);

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:10px 12px;font-size:13px;line-height:1.5;min-width:180px;">
            <strong style="display:block;margin-bottom:4px;color:#1e3a5f;">${siteConfig.name}</strong>
            <span style="color:#475569;">${officeLocation.fullAddress}</span>
          </div>`,
          removable: true,
        });
        infoWindow.open(map, marker);

        if (!cancelled) setMode("kakao");
      })
      .catch(() => {
        if (!cancelled) setMode("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, [appKey]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-beige-dark bg-beige/20">
        <div
          className="relative h-[min(420px,62vh)] min-h-[280px] w-full"
          aria-label={`${siteConfig.name} 위치 지도`}
        >
          {mode === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-beige/30 text-sm text-navy/55">
              지도를 불러오는 중…
            </div>
          )}

          {mode === "fallback" && <OpenStreetMapFallback />}

          <div
            ref={containerRef}
            className={`h-full w-full ${mode === "kakao" ? "block" : "hidden"}`}
            role="region"
            aria-hidden={mode !== "kakao"}
          />
        </div>
      </div>

      <MapExternalLinks />
    </div>
  );
}
