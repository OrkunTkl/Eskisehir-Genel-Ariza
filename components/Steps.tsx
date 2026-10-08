const steps = [
  { n: "1", t: "Arızayı seç", d: "Dört hattan birini seçin. Kartlara tıklayınca o sitenin önizlemesi ve işlevleri açılır." },
  { n: "2", t: "İlk adımı gör", d: "İlgili sitede güvenli ilk adımları ve ne zaman usta gerektiğini okuyun." },
  { n: "3", t: "Ustaya ulaş", d: "Telefon ya da WhatsApp ile tek mesaj gönderin, uygun servis sağlayıcıya yönlendirilin." },
];
export function Steps() {
  return (
    <section className="steps on-paper pad-x" aria-labelledby="nasil">
      <div className="steps-h" data-rv>
        <p className="mono">02 — Nasıl çalışır</p>
        <h2 id="nasil" className="display d-lg">Üç adım.<br /><span className="serif">Dolaşmadan.</span></h2>
      </div>
      <ol className="steps-l">
        {steps.map((s) => (
          <li key={s.n} data-rv>
            <span className="num display" aria-hidden>{s.n}</span>
            <div>
              <h3 className="display d-sm">{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
