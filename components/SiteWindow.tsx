"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Site } from "@/data/sites";

type Props = {
  site: Site;
  index: number;
  total: number;
  origin: DOMRect | null;
  closing: boolean;
  onRequestClose: () => void;
  onClosed: () => void;
};

type Media = { kind: "video" | "image"; src: string; poster?: string };

const EASE = "cubic-bezier(.76,0,.24,1)";

/** Karttan genişleyen geniş pencere: sitenin görselleri/videosu + işlevleri + siteye git. */
export function SiteWindow({ site, index, total, origin, closing, onRequestClose, onClosed }: Props) {
  const win = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const from = useRef("inset(30% 30% 30% 30% round 28px)");
  const [m, setM] = useState(0);
  const [ready, setReady] = useState(false);

  const media: Media[] = [
    ...(site.video ? [{ kind: "video" as const, src: site.video, poster: site.images[0] }] : []),
    ...site.images.map((src) => ({ kind: "image" as const, src })),
  ];
  const go = useCallback((d: number) => setM((v) => (v + d + media.length) % media.length), [media.length]);

  // Açılış: kartın dikdörtgeninden tam pencereye
  useLayoutEffect(() => {
    const w = win.current!;
    const r = w.getBoundingClientRect();
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const o = origin ?? new DOMRect(innerWidth / 2 - 160, innerHeight / 2 - 100, 320, 200);
    from.current = `inset(${Math.max(o.top - r.top, 0)}px ${Math.max(r.right - o.right, 0)}px ${Math.max(r.bottom - o.bottom, 0)}px ${Math.max(o.left - r.left, 0)}px round 24px)`;
    w.animate([{ clipPath: from.current }, { clipPath: "inset(0px 0px 0px 0px round 28px)" }], {
      duration: rm ? 1 : 900,
      easing: EASE,
      fill: "both",
    });
    back.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: rm ? 1 : 500, fill: "both" });
    const t = setTimeout(() => setReady(true), rm ? 0 : 380);
    window.dispatchEvent(new Event("lenis-stop"));
    document.body.style.overflow = "hidden";
    win.current?.focus({ preventScroll: true });
    return () => {
      clearTimeout(t);
      window.dispatchEvent(new Event("lenis-start"));
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kapanış animasyonu
  useEffect(() => {
    if (!closing) return;
    const w = win.current!;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReady(false);
    const a = w.animate([{ clipPath: "inset(0px 0px 0px 0px round 28px)" }, { clipPath: from.current }], {
      duration: rm ? 1 : 650,
      easing: EASE,
      fill: "both",
    });
    back.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: rm ? 1 : 650, fill: "both" });
    a.onfinish = () => onClosed();
    return () => a.cancel();
  }, [closing, onClosed]);

  // Klavye: Esc, ok tuşları, Tab tuzağı
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRequestClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const f = win.current?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        if (!f?.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go, onRequestClose]);

  const cur = media[m];
  return (
    <div className="sw" role="dialog" aria-modal="true" aria-label={site.title} style={{ ["--a" as string]: site.accent, ["--on" as string]: site.on }}>
      <div ref={back} className="sw-back" onClick={onRequestClose} />
      <div ref={win} tabIndex={-1} className={`sw-win${ready ? " ready" : ""}`}>
        <div className="sw-media">
          <div className="sw-stage">
            {media.map((it, i) =>
              it.kind === "video" ? (
                <video key={it.src} className={i === m ? "on" : ""} src={it.src} poster={it.poster} muted loop playsInline autoPlay={i === m} preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={it.src} className={i === m ? "on" : ""} src={it.src} alt={i === m ? `${site.title} sitesinden önizleme ${m + 1}` : ""} draggable={false} loading="eager" />
              ),
            )}
            <div className="sw-cap mono">
              <span>{cur.kind === "video" ? "Video" : "Önizleme"}</span>
              <span>{String(m + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span>
            </div>
            <div className="sw-nav">
              <button onClick={() => go(-1)} aria-label="Önceki görsel" data-cursor="">←</button>
              <button onClick={() => go(1)} aria-label="Sonraki görsel" data-cursor="">→</button>
            </div>
          </div>
          <div className="sw-thumbs" role="tablist" aria-label="Görseller">
            {media.map((it, i) => (
              <button key={it.src} role="tab" aria-selected={i === m} aria-label={`Görsel ${i + 1}`} className={i === m ? "on" : ""} onClick={() => setM(i)} data-cursor="">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.kind === "video" ? (it.poster ?? site.images[0]) : it.src} alt="" draggable={false} />
                {it.kind === "video" && <b aria-hidden>▶</b>}
              </button>
            ))}
          </div>
        </div>

        <div className="sw-info">
          <div className="sw-row mono">
            <span>{site.no} / {String(total).padStart(2, "0")}</span>
            <button ref={closeBtn} className="sw-x" onClick={onRequestClose} data-cursor="">Kapat <kbd>Esc</kbd></button>
          </div>
          <p className="mono sw-kick">{site.kicker}</p>
          <h3 className="display sw-title">{site.title}</h3>
          <p className="sw-desc">{site.desc}</p>
          <p className="mono sw-fh">İşlevler</p>
          <ul className="sw-f">
            {site.features.map((f, i) => (
              <li key={f.t} style={{ ["--i" as string]: i }}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <div><b>{f.t}</b><p>{f.d}</p></div>
              </li>
            ))}
          </ul>
          <div className="sw-go">
            <a className="sw-btn" href={site.url} target="_blank" rel="noopener noreferrer" data-cursor="Git">
              Siteye git <span aria-hidden>↗</span>
            </a>
            <span className="mono sw-host">{new URL(site.url).host}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
