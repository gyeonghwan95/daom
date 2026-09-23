/**
 * Desktop nav flyouts: keep one menu open while the pointer stays in the
 * sticky <header> (panel is a DOM descendant, including the fixed dropdown).
 * Closing is driven by header mouseleave — not the tiny trigger wrapper.
 */

type CloseFn = () => void;

let activeClose: CloseFn | null = null;

/** Ensure only one desktop flyout is open at a time. */
export function claimDesktopNavFlyout(close: CloseFn): () => void {
  if (activeClose && activeClose !== close) {
    activeClose();
  }
  activeClose = close;
  return () => {
    if (activeClose === close) {
      activeClose = null;
    }
  };
}
