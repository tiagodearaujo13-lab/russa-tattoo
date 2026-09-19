"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealDirection = "left" | "right" | "bottom" | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: ScrollRevealDirection;
  delay?: number;
  className?: string;
};

const hiddenClasses: Record<ScrollRevealDirection, string> = {
  left: "-translate-x-12 opacity-0",
  right: "translate-x-12 opacity-0",
  bottom: "translate-y-12 opacity-0",
  scale: "scale-95 opacity-0",
};

export default function ScrollReveal({
  children,
  direction = "bottom",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transform-gpu transition-all duration-700 ease-out will-change-transform",
        !isVisible && hiddenClasses[direction],
        isVisible && "translate-x-0 translate-y-0 scale-100 opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}
