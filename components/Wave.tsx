"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";
import { sites, type Site } from "@/data/sites";
import { SiteWindow } from "./SiteWindow";

const n = sites.length;
const GAP = 8;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// Tüm kartlar aynı vertex shader'dan geçer: şerit ekran x'ine göre TEK yüzey gibi eğilir ve dalgalanır.
const VS = `uniform float uHW; uniform float uV; uniform float uZ; varying vec2 vUv; varying float vN;
void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); float nx=w.x/uHW; vN=nx;
 float d=nx+0.17-uV*0.2;
 float B=d<0. ? 0.5+0.5*cos(3.14159*max(d,-1.)) : (d<0.6 ? 0.5+0.5*cos(3.14159*d/0.6) : 0.33*smoothstep(0.6,0.93,d));
 float sc=1.+0.6*B*(1.+0.15*abs(uV));
 w.z+=uZ*(1.-1./sc);
 gl_Position=projectionMatrix*viewMatrix*w; }`;
const FS = `uniform sampler2D uMap; varying vec2 vUv; varying float vN;
void main(){ vec4 c=texture2D(uMap,vUv); float f=1.-smoothstep(1.2,1.8,abs(vN)); gl_FragColor=vec4(c.rgb,c.a*f); }`;

function drawCard(img: HTMLImageElement, s: Site) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const g = c.getContext("2d")!;
  g.beginPath();
  g.roundRect(0, 0, 1024, 640, 44);
  g.clip();
  g.drawImage(img, 0, 0, 1024, 640);
  const hl = g.createLinearGradient(0, 0, 1024, 640);
  hl.addColorStop(0, "rgba(255,255,255,.14)");
  hl.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = hl;
  g.fillRect(0, 0, 1024, 640);
  const gr = g.createLinearGradient(0, 300, 0, 640);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, "rgba(0,0,0,.82)");
  g.fillStyle = gr;
  g.fillRect(0, 300, 1024, 340);
  // numara rozeti
  g.fillStyle = s.accent;
  g.beginPath();
  g.roundRect(36, 36, 92, 52, 26);
  g.fill();
  g.fillStyle = s.on;
  g.font = "600 28px ui-monospace, monospace";
  g.textBaseline = "middle";
  g.fillText(s.no, 36 + 26, 36 + 27);
  g.textBaseline = "alphabetic";
  // başlıklar
  g.fillStyle = s.accent;
  g.font = "500 22px ui-monospace, monospace";
  g.fillText(s.kicker.toUpperCase(), 40, 540);
  g.fillStyle = "#f3f1ec";
  g.font = '600 56px "Bricolage Grotesque Variable", system-ui, sans-serif';
  g.fillText(s.title, 40, 600);
  // ok
  g.fillStyle = s.accent;
  g.beginPath();
  g.arc(952, 572, 38, 0, 7);
  g.fill();
  g.strokeStyle = s.on;
  g.lineWidth = 5;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(936, 588);
  g.lineTo(968, 556);
  g.moveTo(947, 556);
  g.lineTo(968, 556);
  g.lineTo(968, 577);
  g.stroke();
  // kenar
  g.strokeStyle = "rgba(255,255,255,.28)";
  g.lineWidth = 6;
  g.beginPath();
  g.roundRect(0, 0, 1024, 640, 44);
  g.stroke();
  return c;
}

export function Wave() {
  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const pos = useRef(0);
  const pushed = useRef(false);
  const [open, setOpen] = useState<string | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [closing, setClosing] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const openRef = useRef<string | null>(null);
  openRef.current = open;

  // Dikey scroll, sabitlenmiş sahnede şeridi yatay kaydırır (pos = kart cinsinden konum).
  const update = useCallback(() => {
    const o = outer.current,
      st = stage.current;
    if (!o || !st) return;
    const range = o.offsetHeight - st.clientHeight;
    const p = clamp(-o.getBoundingClientRect().top / range, 0, 1);
    pos.current = p * (n - 1);
    if (counter.current)
      counter.current.textContent = `${String(Math.round(pos.current) + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  }, []);

  const goTo = (i: number) => {
    const o = outer.current,
      st = stage.current;
    if (!o || !st) return;
    const range = o.offsetHeight - st.clientHeight;
    const y =
      o.getBoundingClientRect().top +
      window.scrollY +
      (clamp(i, 0, n - 1) / (n - 1)) * range;
    const ev = new CustomEvent("smooth-scroll-to", {
      detail: { y, handled: false },
    });
    window.dispatchEvent(ev);
    if (!ev.detail.handled) window.scrollTo({ top: y, behavior: "smooth" });
  };

  const openSite = useCallback(
    (slug: string, rect?: DOMRect | null, push = true) => {
      if (openRef.current) return;
      setOrigin(rect ?? null);
      setClosing(false);
      setOpen(slug);
      if (push) {
        history.pushState({ site: slug }, "", `#${slug}`);
        pushed.current = true;
      }
    },
    [],
  );

  const requestClose = useCallback(() => {
    if (pushed.current) history.back();
    else setClosing(true);
  }, []);

  const onClosed = useCallback(() => {
    setOpen(null);
    setClosing(false);
    pushed.current = false;
    if (location.hash)
      history.replaceState(null, "", location.pathname + location.search);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const pop = () => {
      const slug =
        sites.find((x) => `#${x.slug}` === location.hash)?.slug ?? null;
      if (openRef.current && !slug) setClosing(true);
      else if (!openRef.current && slug) openSite(slug, null, false);
    };
    const ext = (e: Event) => {
      const d = (e as CustomEvent).detail as { slug: string; rect?: DOMRect };
      openSite(d.slug, d.rect);
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("open-site", ext);
    // Doğrudan #slug ile gelindiyse pencereyi aç.
    const first = sites.find((x) => `#${x.slug}` === location.hash)?.slug;
    if (first) openSite(first, null, false);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("open-site", ext);
    };
  }, [update, openSite]);

  // WebGL sahnesi
  useEffect(() => {
    let dead = false,
      raf = 0,
      cleanup = () => {};
    (async () => {
      try {
        const THREE = await import("three");
        const st = stage.current;
        if (!st || dead) return;
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.domElement.className = "gl";
        renderer.domElement.setAttribute("aria-hidden", "true");
        st.prepend(renderer.domElement);
        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(30, 1, 10, 20000);
        const fog = new THREE.Fog(0x0a0c0f, 1, 2);
        scene.fog = fog;
        const grid = new THREE.GridHelper(8000, 80, 0x4a4a4e, 0x2a2a2d);
        scene.add(grid);
        const uni = { uHW: { value: 1 }, uV: { value: 0 }, uZ: { value: 0 } };
        const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let W = 600,
          H = 375,
          h = 1;
        const geo = new THREE.PlaneGeometry(1, 1, 48, 1);
        const meshes: (Mesh | undefined)[] = [];
        await document.fonts?.ready;
        sites.forEach((s, i) => {
          const img = new window.Image();
          img.onload = () => {
            if (dead) return;
            const tex = new THREE.CanvasTexture(drawCard(img, s));
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 8;
            const mat = new THREE.ShaderMaterial({
              uniforms: { ...uni, uMap: { value: tex } },
              vertexShader: VS,
              fragmentShader: FS,
              transparent: true,
            });
            const m = new THREE.Mesh(geo, mat);
            m.scale.set(W, H, 1);
            scene.add(m);
            meshes[i] = m;
            st.classList.add("gl-on");
          };
          img.src = s.image;
        });
        const resize = () => {
          const w = st.clientWidth;
          h = st.clientHeight;
          renderer.setSize(w, h, false);
          W = Math.min(h * 0.36 * 1.6, w * (w < 768 ? 0.8 : 0.5));
          H = W * 0.625;
          const z = h / 2 / Math.tan((15 * Math.PI) / 180);
          cam.aspect = w / h;
          cam.position.set(0, 50, z);
          cam.lookAt(0, -20, 0);
          cam.updateProjectionMatrix();
          uni.uHW.value = w / 2;
          uni.uZ.value = z;
          fog.near = z * 0.8;
          fog.far = z * 3.5;
          grid.position.y = h * 0.04 - H / 2 - 20;
          meshes.forEach((m) => m?.scale.set(W, H, 1));
          cards.current.forEach((a) => {
            if (a) {
              a.style.width = `${W}px`;
              a.style.height = `${H}px`;
            }
          });
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(st);
        let vis = true;
        const io = new IntersectionObserver(([e]) => {
          vis = e.isIntersecting;
        });
        io.observe(st);
        let s = pos.current,
          v = 0,
          last = performance.now();
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;
          if (!vis) return;
          s += (pos.current - s) * (1 - Math.exp(-dt * 5));
          const tv = rm ? 0 : clamp((pos.current - s) * 3, -1.5, 1.5);
          v += (tv - v) * (1 - Math.exp(-dt * 7));
          uni.uV.value = v;
          meshes.forEach((m, i) =>
            m?.position.set((i - s) * (W + GAP), h * 0.04, 0),
          );
          cards.current.forEach((a, i) => {
            if (a)
              a.style.transform = `translate(-50%,-50%) translateX(${(i - s) * (W + GAP)}px)`;
          });
          renderer.render(scene, cam);
        };
        tick(performance.now());
        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          renderer.dispose();
          renderer.domElement.remove();
        };
        if (dead) cleanup();
      } catch {
        // WebGL yoksa kartlar CSS görseliyle gösterilir.
        setNoGL(true);
      }
    })();
    return () => {
      dead = true;
      cleanup();
    };
  }, []);

  const current = sites.find((s) => s.slug === open);

  return (
    <section
      ref={outer}
      id="hatlar"
      aria-labelledby="hizmetler"
      style={{ height: `${100 + (n - 1) * 85}vh` }}
      className={`wave${noGL ? " no-gl" : ""}`}
    >
      <div ref={stage} className="wave-st">
        <div className="wave-top pad-x">
          <h2 id="hizmetler" className="mono">
            01 — Arıza hattını seç
          </h2>
          <p className="mono wave-hint">Kaydır · karta tıkla</p>
        </div>
        {sites.map((s, i) => (
          <a
            key={s.slug}
            href={s.url}
            ref={(el) => {
              cards.current[i] = el;
            }}
            onFocus={() => goTo(i)}
            onClick={(e) => {
              e.preventDefault();
              openSite(s.slug, e.currentTarget.getBoundingClientRect());
            }}
            data-cursor="İncele"
            className="wcard"
            style={noGL ? { backgroundImage: `url(${s.image})` } : undefined}
          >
            <span className="sr-only">{s.title}: önizlemeyi aç</span>
          </a>
        ))}
        <div className="wave-bot pad-x">
          <span ref={counter} className="mono" aria-hidden>
            01 / {String(n).padStart(2, "0")}
          </span>
          <span className="wave-bar" aria-hidden>
            <span ref={bar} />
          </span>
          <div className="wave-btns">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                aria-label={dir < 0 ? "Önceki hat" : "Sonraki hat"}
                onClick={() => goTo(Math.round(pos.current) + dir)}
                data-cursor=""
              >
                {dir < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {current && (
        <SiteWindow
          site={current}
          index={sites.indexOf(current)}
          total={n}
          origin={origin}
          closing={closing}
          onRequestClose={requestClose}
          onClosed={onClosed}
        />
      )}
    </section>
  );
}
