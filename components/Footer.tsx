import { sites } from "@/data/sites";
import { Clock } from "./Clock";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-bar" aria-hidden>
        {sites.map((s) => (
          <i key={s.slug} style={{ background: s.accent }} />
        ))}
      </div>
      <div className="ftr-g pad-x">
        <div className="ftr-c">
          <a href="#top" className="logo" aria-label="Başa dön">
            <span className="logo-sq" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="logo-t">
              Eskişehir <b>Genel Arıza</b>
            </span>
          </a>
          <p>
            Hizmeti kendisi vermeyen bir yönlendirme sayfasıdır. Arıza türünü
            seçersiniz, sizi ilgili bilgilendirme sitesine götürür.
          </p>
        </div>
        <nav className="ftr-c" aria-label="Arıza hatları">
          <p className="ftr-h">Arıza hatları</p>
          <ul>
            {sites.map((s) => (
              <li key={s.slug} style={{ ["--a" as string]: s.accent }}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <i aria-hidden />
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ftr-c ftr-r">
          <Clock />
          <a href="#top" className="up" data-cursor="">
            Başa dön <span aria-hidden>↑</span>
          </a>
        </div>
      </div>
      <p className="ftr-copy pad-x mono">
        © {new Date().getFullYear()} Eskişehir Genel Arıza
      </p>
    </footer>
  );
}
