"use client";
import { useEffect, useState } from "react";

export function Header() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const f = () =>
      setTime(new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date()));
    f();
    const id = setInterval(f, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <header className="hdr">
      <a href="#top" className="logo" aria-label="Eskişehir Genel Arıza, başa dön" data-cursor="">
        <span className="logo-sq" aria-hidden><i /><i /><i /><i /></span>
        <span className="logo-t">Eskişehir <b>Genel Arıza</b></span>
      </a>
      <div className="hdr-r">
        <span className="mono hdr-time" aria-hidden>Eskişehir {time || "--:--"}</span>
        <a href="#hatlar" className="pill" data-cursor="">Arıza seç <span aria-hidden>↓</span></a>
      </div>
    </header>
  );
}
