"use client";
import { useEffect, useRef } from "react";

/** Masaüstü imleci: [data-cursor="Metin"] üzerinde büyür ve metni gösterir. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ring.current!;
    document.documentElement.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const txt = t?.dataset.cursor ?? "";
      if (label.current && label.current.textContent !== txt) label.current.textContent = txt;
      el.dataset.on = t ? (txt ? "label" : "link") : "";
    };
    const leave = () => (el.style.opacity = "0");
    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ring} className="cursor" aria-hidden>
      <span ref={label} />
    </div>
  );
}
