"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -20, y: -20 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const updateEnabled = () => setEnabled(media.matches);
    updateEnabled();
    media.addEventListener("change", updateEnabled);
    if (!media.matches) return () => media.removeEventListener("change", updateEnabled);

    const move = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });
    const enter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setActive(Boolean(target.closest("a, button, [role='button'], article")));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    return () => {
      media.removeEventListener("change", updateEnabled);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
    };
  }, []);

  if (!enabled) return null;
  return <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"><span className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-all duration-300 ${active ? "h-2 w-2" : "h-1.5 w-1.5"}`} style={{ left: position.x, top: position.y }} /><span className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 mix-blend-difference transition-all duration-500 ${active ? "h-10 w-10" : "h-5 w-5"}`} style={{ left: position.x, top: position.y }} /></div>;
}
