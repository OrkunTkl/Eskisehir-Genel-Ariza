"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis yumuşak kaydırma + #bağlantılar + şeridin "smooth-scroll-to" olayı. */
export function SmoothScroll() {
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = rm ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    if (lenis) raf = requestAnimationFrame(loop);

    const to = (y: number) => (lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y }));
    const onTo = (e: Event) => {
      const d = (e as CustomEvent).detail;
      d.handled = true;
      to(d.y);
    };
    const onStop = () => lenis?.stop();
    const onStart = () => lenis?.start();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      to(el.getBoundingClientRect().top + window.scrollY);
    };
    window.addEventListener("smooth-scroll-to", onTo);
    window.addEventListener("lenis-stop", onStop);
    window.addEventListener("lenis-start", onStart);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      window.removeEventListener("smooth-scroll-to", onTo);
      window.removeEventListener("lenis-stop", onStop);
      window.removeEventListener("lenis-start", onStart);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
