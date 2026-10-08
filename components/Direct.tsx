import { sites } from "@/data/sites";

/** Doğrudan bağlantılar: JS'siz de çalışır, arama motorları için de net. */
export function Direct() {
  return (
    <section id="dogrudan" className="direct pad-x" aria-labelledby="dg">
      <div className="direct-h" data-rv>
        <p className="mono">03 — Doğrudan git</p>
        <h2 id="dg" className="display d-lg">Ne olduğunu <span className="serif">biliyorsanız.</span></h2>
      </div>
      <ul className="direct-l">
        {sites.map((s) => (
          <li key={s.slug} data-rv style={{ ["--a" as string]: s.accent, ["--on" as string]: s.on }}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" data-cursor="Git">
              <span className="mono d-no">{s.no}</span>
              <span className="display d-md d-t">{s.title}</span>
              <span className="d-h mono">{new URL(s.url).host}</span>
              <span className="d-ar" aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
