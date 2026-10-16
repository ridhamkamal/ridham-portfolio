/**
 * Shared-element navigation via the View Transitions API, where supported.
 * The card and the case-study hero share a `view-transition-name`; the
 * destination page calls `finishViewTransition()` once it has mounted.
 */
let pending: (() => void) | null = null;

type DocWithVT = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };

export function supportsViewTransition(): boolean {
  return typeof document !== "undefined" && typeof (document as DocWithVT).startViewTransition === "function";
}

export function navigateWithTransition(navigate: () => void): boolean {
  const doc = document as DocWithVT;
  if (!doc.startViewTransition) return false;
  doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => {
          pending = null;
          resolve();
        }, 800);
        pending = () => {
          window.clearTimeout(timer);
          pending = null;
          resolve();
        };
        navigate();
      }),
  );
  return true;
}

export function finishViewTransition() {
  pending?.();
}

export const vtName = (slug: string) => `project-${slug}`;
