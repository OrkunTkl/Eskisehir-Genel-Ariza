"use client";
import { useEffect, useState } from "react";

export function Clock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const f = () =>
      setT(
        new Intl.DateTimeFormat("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        }).format(new Date()),
      );
    f();
    const id = setInterval(f, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono">Eskişehir {t}</span>;
}
