import fs from "node:fs";

const path = "src/app/globals.css";
let css = fs.readFileSync(path, "utf8");

const reps = [
  [
    "height: calc(100dvh - var(--header-height));",
    "height: calc(100svh - var(--header-height));",
  ],
  [
    "100dvh - var(--header-height) - var(--mobile-cta-height) -",
    "100svh - var(--header-height) - var(--mobile-cta-height) -",
  ],
  [
    "height: clamp(17.5rem, 34dvh, 24rem);",
    "height: clamp(17.5rem, 34svh, 24rem);",
  ],
  [
    "height: clamp(20rem, 38dvh, 28rem);",
    "height: clamp(20rem, 38svh, 28rem);",
  ],
  [
    "height: clamp(22rem, 40dvh, 30rem);",
    "height: clamp(22rem, 40svh, 30rem);",
  ],
  [
    "min-height: calc(100dvh - var(--header-height));",
    "min-height: calc(100svh - var(--header-height));",
  ],
];

for (const [a, b] of reps) {
  if (!css.includes(a)) console.log("MISSING:", a.slice(0, 72));
  else css = css.split(a).join(b);
}

css = css.replace(
  `  .marquee-v-root {
    position: relative;
    container-type: size;
    overflow: hidden;`,
  `  .marquee-v-root {
    position: relative;
    overflow: hidden;
    isolation: isolate;`,
);

css = css.replace(
  `    will-change: transform;
  }

  .marquee-v-set {`,
  `    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }

  .marquee-v-set {`,
);

css = css.replace(
  `  .marquee-v-root--pause:hover .marquee-v-track {
    animation-play-state: paused;
  }

  @keyframes marquee-v-scroll {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-50%);
    }
  }`,
  `  .marquee-v-root--pause:hover .marquee-v-track,
  .marquee-v-root--scrolling .marquee-v-track {
    animation-play-state: paused;
  }

  @keyframes marquee-v-scroll {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, -50%, 0);
    }
  }`,
);

css = css.replace(
  `  .home-hero__slide {
    height: auto;
    aspect-ratio: 4 / 3;
    min-height: 11rem;
    max-height: 18rem;
    box-shadow: 0 12px 32px -8px rgba(30, 58, 95, 0.12);
  }`,
  `  .home-hero__slide {
    height: auto;
    aspect-ratio: 4 / 3;
    min-height: 11rem;
    max-height: 18rem;
    box-shadow: 0 12px 32px -8px rgba(30, 58, 95, 0.12);
    backface-visibility: hidden;
    transform: translateZ(0);
  }`,
);

if (!css.includes(".home-hero__frame.marquee-v-root::before")) {
  css = css.replace(
    "  .home-hero__frame--static {",
    `  @media (hover: none) and (pointer: coarse) {
    .home-hero__frame.marquee-v-root {
      -webkit-mask-image: none;
      mask-image: none;
    }

    .home-hero__frame.marquee-v-root::before,
    .home-hero__frame.marquee-v-root::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      z-index: 2;
      height: 12%;
      pointer-events: none;
    }

    .home-hero__frame.marquee-v-root::before {
      top: 0;
      background: linear-gradient(
        to bottom,
        var(--cream) 0%,
        color-mix(in srgb, var(--cream) 55%, transparent) 55%,
        transparent 100%
      );
    }

    .home-hero__frame.marquee-v-root::after {
      bottom: 0;
      background: linear-gradient(
        to top,
        var(--cream) 0%,
        color-mix(in srgb, var(--cream) 55%, transparent) 55%,
        transparent 100%
      );
    }
  }

  .home-hero__frame--static {`,
  );
}

if (!css.includes(".mobile-bottom-cta__btn--reservation")) {
  css = css.replace(
    `.mobile-bottom-cta__btn--naver-map {
  background: #fff;
  color: #03c75a;
}`,
    `.mobile-bottom-cta__btn--naver-map {
  background: #fff;
  color: #03c75a;
}

.mobile-bottom-cta__btn--reservation {
  background: #fff;
  color: var(--navy);
}

.mobile-bottom-cta__btn--reservation:hover {
  background: var(--beige);
}

.mobile-bottom-cta__btn--inquiry {
  background: var(--cream);
  color: var(--navy);
}

.mobile-bottom-cta__btn--inquiry:hover {
  background: var(--beige);
}`,
  );
}

const qiCss = `
/* Quick Inquiry */
.quick-inquiry-float {
  display: none;
}

@media (min-width: 64rem) {
  .quick-inquiry-float {
    display: block;
    position: fixed;
    right: 1rem;
    bottom: 6.25rem;
    z-index: 40;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .floating-cta {
    bottom: 1.5rem;
  }
}

.quick-inquiry-float__btn {
  display: inline-flex;
  min-height: 2.75rem;
  min-width: 2.75rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 999px;
  border: 1px solid var(--beige-dark);
  background: var(--surface);
  padding: 0.65rem 1.1rem;
  font-size: 0.9375rem;
  font-weight: 650;
  color: var(--navy);
  box-shadow: 0 10px 28px -12px rgba(30, 58, 95, 0.28);
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    border-color 0.2s ease;
}

.quick-inquiry-float__btn:hover {
  background: var(--beige);
  border-color: var(--beige-muted);
}

.quick-inquiry-float__btn:active {
  transform: scale(0.97);
}

.quick-inquiry-float__icon {
  font-size: 0.95rem;
  line-height: 1;
  color: var(--navy-light);
}

.quick-inquiry-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 64rem) {
  .quick-inquiry-overlay {
    align-items: center;
    justify-content: flex-end;
    padding: 1.25rem;
  }
}

.quick-inquiry-overlay__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(15, 31, 51, 0.42);
  cursor: pointer;
}

.quick-inquiry-panel {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 28rem;
  max-height: min(92svh, 40rem);
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.25rem 1.25rem 0 0;
  border: 1px solid var(--beige-dark);
  background: var(--surface);
  box-shadow: 0 -8px 32px rgba(30, 58, 95, 0.16);
  animation: quick-inquiry-sheet-in 0.28s ease;
}

@media (min-width: 64rem) {
  .quick-inquiry-panel {
    max-height: min(88vh, 38rem);
    border-radius: 1.25rem;
    box-shadow: 0 24px 48px -16px rgba(30, 58, 95, 0.28);
    animation: quick-inquiry-slide-in 0.28s ease;
  }
}

.quick-inquiry-panel--reduced {
  animation: none;
}

@keyframes quick-inquiry-sheet-in {
  from {
    transform: translateY(1.25rem);
    opacity: 0.6;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes quick-inquiry-slide-in {
  from {
    transform: translateX(1rem);
    opacity: 0.6;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quick-inquiry-panel {
    animation: none;
  }
}

.quick-inquiry-panel__chrome {
  position: relative;
  flex-shrink: 0;
  border-bottom: 1px solid var(--beige-dark);
  background: var(--cream);
  padding: 1.15rem 1.25rem 1rem;
  padding-right: 3rem;
}

.quick-inquiry-panel__close {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  display: inline-flex;
  min-height: 2.75rem;
  min-width: 2.75rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
}

.quick-inquiry-panel__close:hover {
  background: var(--beige);
  color: var(--navy);
}

.quick-inquiry-panel__title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
}

.quick-inquiry-panel__desc {
  margin-top: 0.45rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.quick-inquiry-panel__body {
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom, 0px));
  -webkit-overflow-scrolling: touch;
}

.quick-inquiry__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.quick-inquiry__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.quick-inquiry__label {
  font-size: 0.875rem;
  font-weight: 650;
  color: var(--text-primary);
}

.quick-inquiry__textarea,
.quick-inquiry__input {
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid var(--beige-muted);
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.7rem 0.85rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.quick-inquiry__textarea {
  min-height: 7rem;
  resize: vertical;
}

.quick-inquiry__textarea:focus,
.quick-inquiry__input:focus,
.quick-inquiry__checkbox:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.quick-inquiry__caution {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--warning-text);
  background: var(--warning-bg);
  border: 1px solid var(--warning-border);
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
}

.quick-inquiry__consent {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.quick-inquiry__checkbox {
  margin-top: 0.2rem;
  width: 1.15rem;
  height: 1.15rem;
  min-width: 1.15rem;
  accent-color: var(--navy);
}

.quick-inquiry__consent-label {
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--text-body);
}

.quick-inquiry__error {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #9b1c1c;
}

.quick-inquiry__form-error {
  border-radius: 0.75rem;
  border: 1px solid #f1c0c0;
  background: #fff5f5;
  padding: 0.75rem 0.85rem;
  font-size: 0.875rem;
  color: #7f1d1d;
}

.quick-inquiry__submit {
  width: 100%;
  min-height: 2.75rem;
  justify-content: center;
  position: sticky;
  bottom: 0;
}

.quick-inquiry__hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.quick-inquiry__turnstile {
  min-height: 0;
}

.quick-inquiry__success {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.85rem;
  text-align: center;
}

.quick-inquiry__success-badge {
  display: flex;
  justify-content: center;
  color: var(--navy);
}

.quick-inquiry__success-check {
  width: 3.25rem;
  height: 3.25rem;
}

.quick-inquiry__success-title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
}

.quick-inquiry__success-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.quick-inquiry__success-phone-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.25rem;
  border-radius: 0.9rem;
  border: 1px solid var(--beige-dark);
  background: var(--cream);
  padding: 0.95rem 1rem;
  text-align: left;
}

.quick-inquiry__success-phone-hint {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-body);
}

.quick-inquiry__success-call {
  width: 100%;
  min-height: 2.75rem;
  flex-direction: column;
  gap: 0.15rem;
  justify-content: center;
  line-height: 1.25;
}

.quick-inquiry__success-phone-num {
  font-size: 0.8125rem;
  font-weight: 500;
  opacity: 0.88;
  letter-spacing: 0.02em;
}

.quick-inquiry__success-actions {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.quick-inquiry__success-actions .btn-secondary {
  width: 100%;
  justify-content: center;
}

.quick-inquiry-inline {
  border-radius: 1rem;
  border: 1px solid var(--beige-dark);
  background: var(--surface-muted);
  padding: 1.15rem 1.2rem;
}

.quick-inquiry-inline__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.quick-inquiry-inline__desc {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.quick-inquiry-inline__btn {
  margin-top: 0.9rem;
  min-height: 2.75rem;
}
`;

if (!css.includes("/* Quick Inquiry */")) {
  css += `\n${qiCss}\n`;
}

fs.writeFileSync(path, css, "utf8");

const out = fs.readFileSync(path);
let i = 0;
let bad = 0;
while (i < out.length) {
  const c = out[i];
  if (c <= 0x7f) {
    i += 1;
    continue;
  }
  if ((c & 0xe0) === 0xc0 && i + 1 < out.length && (out[i + 1] & 0xc0) === 0x80) {
    i += 2;
    continue;
  }
  if (
    (c & 0xf0) === 0xe0 &&
    i + 2 < out.length &&
    (out[i + 1] & 0xc0) === 0x80 &&
    (out[i + 2] & 0xc0) === 0x80
  ) {
    i += 3;
    continue;
  }
  if (
    (c & 0xf8) === 0xf0 &&
    i + 3 < out.length &&
    (out[i + 1] & 0xc0) === 0x80 &&
    (out[i + 2] & 0xc0) === 0x80 &&
    (out[i + 3] & 0xc0) === 0x80
  ) {
    i += 4;
    continue;
  }
  bad += 1;
  i += 1;
}

console.log("patched len", css.length, "utf8 bad", bad);
