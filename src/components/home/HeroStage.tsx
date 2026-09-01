"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  HOME_HERO_SLIDE_MS,
  HOME_HERO_VIDEO_MAX_MS,
  homeHeroMediaPlaylist,
  type HomeHeroMediaItem,
} from "@/lib/home-hero-media";

const PLAYLIST = homeHeroMediaPlaylist;
const FIRST_IMAGE_INDEX = PLAYLIST.findIndex((item) => item.kind === "image");

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="home-hero-stage__glyph">
      <path d="M8.2 5.7v12.6c0 .7.8 1.1 1.4.7l9.2-6.3c.5-.4.5-1.1 0-1.5L9.6 5c-.6-.4-1.4 0-1.4.7Z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="home-hero-stage__glyph">
      <rect x="6.4" y="5.2" width="3.6" height="13.6" rx="1.1" />
      <rect x="14" y="5.2" width="3.6" height="13.6" rx="1.1" />
    </svg>
  );
}

function NudgeGlyph({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="home-hero-stage__nudge-icon">
      {dir === "prev" ? (
        <path
          d="M14.5 6.5 9 12l5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5 15 12l-5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function VideoBadge() {
  return (
    <span className="home-hero-stage__kind" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M8.4 6.4v11.2c0 .6.7 1 1.2.6l8.2-5.6c.5-.3.5-1 0-1.3L9.6 5.8c-.5-.4-1.2 0-1.2.6Z" />
      </svg>
    </span>
  );
}

function itemPoster(item: HomeHeroMediaItem): string {
  if (item.kind === "image") return item.src;
  return item.poster;
}

const VIDEO_MAX_S = HOME_HERO_VIDEO_MAX_MS / 1000;

function videoWindow(item: HomeHeroMediaItem, duration: number) {
  const start = item.kind === "video" ? (item.startSeconds ?? 0) : 0;
  const maxEnd = start + VIDEO_MAX_S;
  const naturalEnd =
    Number.isFinite(duration) && duration > 0 ? duration : maxEnd;
  const clipEnd =
    item.kind === "video" && item.endSeconds && item.endSeconds > start
      ? item.endSeconds
      : naturalEnd;
  return { start, end: Math.min(naturalEnd, clipEnd, maxEnd) };
}

function videoProgressRatio(node: HTMLVideoElement, item: HomeHeroMediaItem) {
  if (item.kind !== "video") return 0;
  const { start, end } = videoWindow(item, node.duration);
  const span = Math.max(end - start, 0.001);
  return Math.min(1, Math.max(0, (node.currentTime - start) / span));
}

function StageVisual({
  item,
  active,
  playing,
  priority,
  onComplete,
  onProgress,
}: {
  item: HomeHeroMediaItem;
  active: boolean;
  playing: boolean;
  priority: boolean;
  onComplete?: () => void;
  onProgress?: (ratio: number) => void;
}) {
  const fileRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLVideoElement>(null);
  const completeRef = useRef(onComplete);
  const progressRef = useRef(onProgress);
  const playingRef = useRef(playing);
  const finishedRef = useRef(false);
  completeRef.current = onComplete;
  progressRef.current = onProgress;
  playingRef.current = playing;

  useEffect(() => {
    if (!active || item.kind !== "video") return;

    const node = fileRef.current;
    const fill = fillRef.current;
    if (!node) return;

    finishedRef.current = false;
    const start = item.startSeconds ?? 0;

    const seekBoth = () => {
      if (start > 0) {
        node.currentTime = start;
        if (fill) fill.currentTime = start;
      }
    };

    const reportProgress = () => {
      progressRef.current?.(videoProgressRatio(node, item));
    };

    const finish = () => {
      if (finishedRef.current || !playingRef.current) return;
      finishedRef.current = true;
      progressRef.current?.(1);
      completeRef.current?.();
    };

    const onLoaded = () => {
      if (start > 0 && Math.abs(node.currentTime - start) > 0.2) {
        seekBoth();
        return;
      }
      if (fill && start > 0 && Math.abs(fill.currentTime - start) > 0.2) {
        fill.currentTime = start;
      }
      reportProgress();
    };
    const onTimeUpdate = () => {
      if (fill && Math.abs(fill.currentTime - node.currentTime) > 0.35) {
        fill.currentTime = node.currentTime;
      }
      const { end } = videoWindow(item, node.duration);
      if (node.currentTime >= end - 0.05) {
        node.pause();
        fill?.pause();
        finish();
        return;
      }
      reportProgress();
    };

    node.addEventListener("loadedmetadata", onLoaded);
    node.addEventListener("timeupdate", onTimeUpdate);
    node.addEventListener("ended", finish);
    if (node.readyState >= 1) onLoaded();

    return () => {
      node.removeEventListener("loadedmetadata", onLoaded);
      node.removeEventListener("timeupdate", onTimeUpdate);
      node.removeEventListener("ended", finish);
    };
  }, [active, item]);

  useEffect(() => {
    if (!active || item.kind !== "video") return;
    const node = fileRef.current;
    const fill = fillRef.current;
    if (!node) return;
    if (playing) {
      void node.play().catch(() => undefined);
      void fill?.play().catch(() => undefined);
    } else {
      node.pause();
      fill?.pause();
    }
  }, [active, item, playing]);

  const imageLayer = (layer: "fill" | "fit") => (
    <Image
      src={item.src}
      alt=""
      fill
      priority={priority && layer === "fit"}
      quality={layer === "fill" ? 55 : 80}
      sizes="100vw"
      className={`home-hero-stage__media home-hero-stage__media--${layer}`}
    />
  );

  if (item.kind === "image") {
    return (
      <>
        <div className="home-hero-stage__fill" aria-hidden>
          {imageLayer("fill")}
        </div>
        <div className="home-hero-stage__fit">{imageLayer("fit")}</div>
      </>
    );
  }

  return (
    <>
      <div className="home-hero-stage__fill" aria-hidden>
        {active ? (
          <video
            ref={fillRef}
            className="home-hero-stage__media home-hero-stage__media--fill home-hero-stage__file-video"
            src={item.src}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            tabIndex={-1}
            aria-hidden
            onContextMenu={(event) => event.preventDefault()}
          />
        ) : null}
      </div>
      <div className="home-hero-stage__fit">
        {active ? (
          <video
            ref={fileRef}
            className="home-hero-stage__media home-hero-stage__media--fit home-hero-stage__file-video"
            src={item.src}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            tabIndex={-1}
            aria-hidden
            onContextMenu={(event) => event.preventDefault()}
          />
        ) : null}
      </div>
    </>
  );
}

export function HeroStage() {
  const reduced = useReducedMotion();
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [userPlaying, setUserPlaying] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [pageVisible, setPageVisible] = useState(true);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const current = PLAYLIST[index] ?? PLAYLIST[0];
  const isPlaying = userPlaying && pageVisible && PLAYLIST.length > 1;

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const resetFill = useCallback(() => {
    elapsedRef.current = 0;
    if (fillRef.current) fillRef.current.style.transform = "scaleX(0)";
  }, []);

  const goTo = useCallback((next: number, resume = true) => {
    const length = PLAYLIST.length;
    if (length === 0) return;
    setIndex(((next % length) + length) % length);
    resetFill();
    if (resume) setUserPlaying(true);
  }, [resetFill]);

  const advance = useCallback(() => {
    resetFill();
    setIndex((currentIndex) => (currentIndex + 1) % PLAYLIST.length);
  }, [resetFill]);

  const onVideoProgress = useCallback((ratio: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${ratio})`;
  }, []);

  const updateOverflow = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const max = list.scrollWidth - list.clientWidth;
    setOverflow({
      left: list.scrollLeft > 6,
      right: max - list.scrollLeft > 6,
    });
  }, []);

  const scrollList = useCallback((direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    const distance = Math.min(list.clientWidth * 0.72, 260);
    list.scrollBy({
      left: direction * distance,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [reduced]);

  useEffect(() => {
    if (!isPlaying) return;
    if (current.kind === "video") return;

    let frame = 0;
    const started = performance.now() - elapsedRef.current;

    const tick = (now: number) => {
      const elapsed = now - started;
      if (elapsed >= HOME_HERO_SLIDE_MS) {
        advance();
        return;
      }
      elapsedRef.current = elapsed;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${elapsed / HOME_HERO_SLIDE_MS})`;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [advance, current.kind, isPlaying, index]);

  useEffect(() => {
    const button = itemRefs.current[index];
    const list = listRef.current;
    if (!button || !list) return;

    const itemRect = button.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const delta =
      itemRect.left + itemRect.width / 2 - (listRect.left + listRect.width / 2);
    list.scrollBy({
      left: delta,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [index, reduced]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    updateOverflow();
    list.addEventListener("scroll", updateOverflow, { passive: true });
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", updateOverflow);
      observer.disconnect();
    };
  }, [updateOverflow]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === " ") {
      const target = event.target as HTMLElement;
      if (target.closest("button")) return;
      event.preventDefault();
      setUserPlaying((value) => !value);
    }
  };

  if (!current) return null;

  const positionLabel = `${index + 1} / ${PLAYLIST.length}`;

  return (
    <div
      className={`home-hero__stage home-hero-stage${isPlaying ? "" : " is-paused"}`}
      role="region"
      aria-labelledby={labelId}
      onKeyDown={onKeyDown}
    >
      <div className="home-hero__stage-media" aria-hidden>
        {PLAYLIST.map((item, itemIndex) => (
          <div
            key={item.id}
            data-kind={item.kind}
            className={`home-hero-stage__slide home-hero-stage__slide--${item.kind}${
              itemIndex === index ? " is-active" : ""
            }`}
          >
            <StageVisual
              item={item}
              active={itemIndex === index}
              playing={isPlaying}
              priority={itemIndex === FIRST_IMAGE_INDEX}
              onComplete={itemIndex === index ? advance : undefined}
              onProgress={itemIndex === index ? onVideoProgress : undefined}
            />
          </div>
        ))}
      </div>

      <div className="home-hero__stage-shade" />

      <div
        className="home-hero-stage__deck"
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <div
          className="home-hero-stage__progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={
            current.kind === "image"
              ? HOME_HERO_SLIDE_MS / 1000
              : HOME_HERO_VIDEO_MAX_MS / 1000
          }
          aria-valuetext={`${current.title}, ${positionLabel}`}
          aria-label="표시 시간"
        >
          <span ref={fillRef} className="home-hero-stage__progress-fill" />
        </div>

        <div className="home-hero-stage__transport">
          <button
            type="button"
            className="home-hero-stage__play"
            aria-pressed={userPlaying}
            aria-label={userPlaying ? "일시정지" : "재생"}
            onClick={() => setUserPlaying((value) => !value)}
          >
            {userPlaying ? <PauseGlyph /> : <PlayGlyph />}
          </button>

          <div className="home-hero-stage__now">
            <p id={labelId} className="home-hero-stage__now-title" aria-live="polite">
              {current.title}
            </p>
            <p className="home-hero-stage__now-meta">
              {current.kind === "video" ? "영상" : "사진"}
              <span aria-hidden="true"> · </span>
              {positionLabel}
            </p>
          </div>
        </div>

        <div
          className={`home-hero-stage__scroller${overflow.left ? " has-left" : ""}${
            overflow.right ? " has-right" : ""
          }`}
        >
          {overflow.left ? (
            <button
              type="button"
              className="home-hero-stage__nudge home-hero-stage__nudge--prev"
              aria-label="이전 목록 보기"
              onClick={() => scrollList(-1)}
            >
              <NudgeGlyph dir="prev" />
            </button>
          ) : null}

          <ul
            ref={listRef}
            className="home-hero-stage__list"
            aria-label="재생 목록"
          >
            {PLAYLIST.map((item, itemIndex) => {
              const selected = itemIndex === index;
              return (
                <li key={item.id} className="home-hero-stage__entry">
                  <button
                    type="button"
                    ref={(node) => {
                      itemRefs.current[itemIndex] = node;
                    }}
                    className={`home-hero-stage__item${selected ? " is-active" : ""}`}
                    aria-current={selected ? "true" : undefined}
                    aria-label={`${item.title} ${item.kind === "video" ? "영상" : "사진"} 재생`}
                    onClick={() => goTo(itemIndex, true)}
                  >
                    <span className="home-hero-stage__thumb">
                      {item.kind === "image" ? (
                        <Image
                          src={item.src}
                          alt=""
                          fill
                          sizes="120px"
                          quality={55}
                          className="object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={itemPoster(item)} alt="" />
                      )}
                      {item.kind === "video" ? <VideoBadge /> : null}
                    </span>
                    <span className="home-hero-stage__item-title">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {overflow.right ? (
            <button
              type="button"
              className="home-hero-stage__nudge home-hero-stage__nudge--next"
              aria-label="다음 목록 보기"
              onClick={() => scrollList(1)}
            >
              <NudgeGlyph dir="next" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
