const words = ["Su tesisatı", "Elektrik", "Kombi", "Beyaz eşya"];
export function Marquee() {
  const row = (k: string) => (
    <div className="mq-row" key={k} aria-hidden={k === "b" ? true : undefined}>
      {[...words, ...words].map((w, i) => (
        <span key={i} className="mq-i">
          <span className="mq-t">{w}</span>
          <svg className="mq-s" viewBox="0 0 24 24" aria-hidden><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" /></svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="mq" role="presentation">
      <div className="mq-track">{row("a")}{row("b")}</div>
    </div>
  );
}
