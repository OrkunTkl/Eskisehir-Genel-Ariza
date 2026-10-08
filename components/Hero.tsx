"use client";
import { sites } from "@/data/sites";

export function Hero() {
  const open = (slug: string, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent("open-site", { detail: { slug, rect } }),
    );
  };

  return (
    <section id="top" className="hero" aria-labelledby="h1">
      <div className="hero-in pad-x">
        <h1 id="h1" className="hero-h">
          <span className="ln">
            <span className="display d-hero">Ne bozuldu?</span>
          </span>
          <span className="ln hero-l2">
            <span className="serif hero-s">doğru kapıyı bulun.</span>
          </span>
        </h1>
      </div>

      <div className="panels" role="group" aria-label="Arıza türünü seç">
        {sites.map((s) => (
          <button
            key={s.slug}
            className="panel"
            style={{ ["--a" as string]: s.accent, ["--on" as string]: s.on }}
            onClick={(e) => open(s.slug, e)}
            data-cursor=""
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="panel-img"
              src={s.image}
              alt=""
              draggable={false}
              loading="lazy"
            />
            <span className="panel-top">
              <span className="panel-dot" aria-hidden />
              <span className="panel-ar" aria-hidden>
                ↗
              </span>
            </span>
            <span className="panel-b">
              <b>{s.title}</b>
              <span>{s.chip}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
