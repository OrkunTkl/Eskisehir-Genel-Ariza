"use client";
import { useEffect } from "react";

/** [data-rv] öğelerini görününce .in sınıfıyla içeri alır. */
export function Reveals() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    document.documentElement.classList.add("js");
    const scan = () => document.querySelectorAll("[data-rv]:not(.in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
