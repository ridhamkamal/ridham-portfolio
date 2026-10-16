"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { HeroFallback } from "./HeroFallback";

function HeroSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <div className="relative h-[52%] w-[52%] max-w-[420px]">
        <div className="skeleton absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60" />
        <div className="skeleton absolute top-[10%] left-0 h-20 w-28 rounded-xl opacity-40" />
        <div className="skeleton absolute top-[20%] right-0 h-20 w-28 rounded-xl opacity-40" />
        <div className="skeleton absolute bottom-0 left-1/2 h-20 w-28 -translate-x-1/2 rounded-xl opacity-40" />
      </div>
    </div>
  );
}

// R3F + drei are split into their own chunk and only load in the browser.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => <HeroSkeleton /> });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Decorative 3D hero. aria-hidden, never focusable, pointer-transparent.
 * Pauses when offscreen or when motion is off; falls back to SVG without WebGL.
 */
export function HeroCanvas() {
  const m = useMotionPrefs();
  const wrap = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => setWebgl(supportsWebGL()), []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { threshold: 0 });
    io.observe(el);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.offsetHeight || window.innerHeight;
        scroll.current = Math.min(1, Math.max(0, window.scrollY / h));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const showFallback = webgl === false || failed;

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
      tabIndex={-1}
    >
      {webgl === null && <HeroSkeleton />}
      <noscript>
        <HeroFallback />
      </noscript>
      {showFallback && <HeroFallback />}
      {webgl && !failed && (
        <SceneBoundary onError={() => setFailed(true)}>
          <HeroScene
            scroll={scroll}
            intensity={m.enabled ? m.scale : 0}
            frameloop={!visible ? "never" : m.enabled ? "always" : "demand"}
            onContextLost={() => setFailed(true)}
          />
        </SceneBoundary>
      )}
    </div>
  );
}
