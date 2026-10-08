"use client";
import { useEffect, useRef } from "react";
import { sites } from "@/data/sites";

/**
 * Açılış: sayaç 0→100 sayarken dört şerit sırayla kendi renginde dolar,
 * sonra şeritler tek tek yukarı kalkıp hero'yu açar. Aynı oturumda bir kez gösterilir.
 */
export function Loader() {
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    try {
      sessionStorage.setItem("eg-seen", "1");
    } catch {}
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 2.2);
      if (num.current)
        num.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="loader" aria-hidden>
      <div className="ls-wrap">
        {sites.map((s, i) => (
          <i
            key={s.slug}
            className="ls"
            style={{ ["--c" as string]: s.accent, ["--i" as string]: i }}
          />
        ))}
      </div>
      <div className="loader-in">
        <p className="loader-t">
          Eskişehir
          <br />
          <span className="serif">Genel Arıza</span>
        </p>
        <span ref={num} className="loader-num display">
          000
        </span>
      </div>
    </div>
  );
}
