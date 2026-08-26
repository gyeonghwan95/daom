"use client";

import { useEffect, useRef, useState } from "react";
import { KakaoIcon } from "@/components/consultation/ConsultationIcons";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { loadKakaoMaps } from "@/lib/kakao-map-loader";
import {
  getKakaoMapAppKey,
  getKakaoMapPlaceUrl,
  getOpenStreetMapEmbedUrl,
  officeCoordinates,
  officeLocation,
} from "@/lib/office-location";
import { siteConfig } from "@/lib/site";

type MapMode = "loading" | "kakao" | "fallback";

type OfficeMapProps = {
  compact?: boolean;
};

const mapLinkBase =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors sm:min-h-12";

function MapExternalLinks({ compact = false }: { compact?: boolean }) {
  const linkClass = compact
    ? "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors"
    : mapLinkBase;

  return (
    <div className={`mt-3 grid gap-2 sm:grid-cols-2${compact ? " home-place__map-links" : ""}`}>
      <NaverSmartPlaceCta
        variant="map"
        placement="map_widget"
        tone="brand"
        fullWidth
        size={compact ? "sm" : "md"}
        label="네이버 지도"
      />
      <a
        href={getKakaoMapPlaceUrl(siteConfig.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} bg-[#FEE500] text-[#191919] hover:brightness-95`}
      >
        <KakaoIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        카카오맵
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

export function OfficeMap({ compact = false }: OfficeMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const appKey = getKakaoMapAppKey();
  const [mode, setMode] = useState<MapMode>(() => (appKey ? "loading" : "fallback"));
  const [shouldLoad, setShouldLoad] = useState(!appKey);

  useEffect(() => {
    if (!appKey || shouldLoad) return;
    const el = rootRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(t);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [appKey, shouldLoad]);

  useEffect(() => {
    if (!appKey || !shouldLoad) return;

    let cancelled = false;

    loadKakaoMaps(appKey)
      .then(() => {
        if (cancelled || !containerRef.current || !window.kakao?.maps) {
          if (!cancelled) setMode("fallback");
          return;
        }

        const { lat, lng } = officeCoordinates;
        const center = new window.kakao.maps.LatLng(lat, lng);
        const map = new window.kakao.maps.Map(containerRef.current, {
          center,
          level: 3,
        });
        mapRef.current = map;

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

        // 스와이퍼·레이아웃 직후 0크기 초기화를 피하기 위해 relayout
        requestAnimationFrame(() => {
          if (cancelled) return;
          map.relayout();
          map.setCenter(center);
          setMode("kakao");
        });
      })
      .catch(() => {
        if (!cancelled) setMode("fallback");
      });

    return () => {
      cancelled = true;
      mapRef.current = null;
    };
  }, [appKey, shouldLoad]);

  useEffect(() => {
    if (mode !== "kakao" || !mapRef.current || !containerRef.current || !window.kakao?.maps) {
      return;
    }
    const map = mapRef.current;
    const el = containerRef.current;
    const center = new window.kakao.maps.LatLng(
      officeCoordinates.lat,
      officeCoordinates.lng,
    );
    const relayout = () => {
      map.relayout();
      map.setCenter(center);
    };
    relayout();
    const frame = window.requestAnimationFrame(relayout);
    const observer = new ResizeObserver(() => relayout());
    observer.observe(el);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [mode]);

  return (
    <div
      ref={rootRef}
      className={compact ? "office-map office-map--fill" : "office-map"}
    >
      <div className="office-map__frame relative overflow-hidden rounded-xl border border-beige-dark bg-beige/20">
        <div
          className={
            compact
              ? "office-map__canvas"
              : "relative h-[min(420px,62vh)] min-h-[280px] w-full"
          }
          aria-label={`${siteConfig.name} 위치 지도`}
        >
          {mode === "fallback" ? (
            <OpenStreetMapFallback />
          ) : (
            <>
              {mode === "loading" && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-beige/30 text-sm text-navy/55">
                  지도를 불러오는 중…
                </div>
              )}
              {/* display:none 이면 카카오맵이 빈 화면이 됨 — 항상 레이아웃에 둠 */}
              <div
                ref={containerRef}
                className="h-full w-full"
                role="region"
                aria-hidden={mode !== "kakao"}
              />
            </>
          )}
        </div>
      </div>

      <MapExternalLinks compact={compact} />
    </div>
  );
}
