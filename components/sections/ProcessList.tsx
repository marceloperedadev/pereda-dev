"use client";

import { useEffect, useRef } from "react";

import styles from "./Process.module.css";

type Step = {
  title: string;
  tagline: string;
  text: string;
};

export function ProcessList({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const items = Array.from(
      element.querySelectorAll<HTMLElement>("[data-step]"),
    );

    if (reducedMotion) {
      element.style.setProperty("--p", "1");

      for (const item of items) {
        item.dataset.active = "true";
      }

      return;
    }

    element.dataset.js = "true";

    let frameId: number | null = null;
    let listening = false;

    const update = () => {
      frameId = null;

      const bounds = element.getBoundingClientRect();

      if (bounds.height <= 0) {
        return;
      }

      const triggerPosition = window.innerHeight * 0.62;

      const progress = Math.max(
        0,
        Math.min(
          1,
          (triggerPosition - bounds.top) / bounds.height,
        ),
      );

      element.style.setProperty(
        "--p",
        progress.toFixed(3),
      );

      const currentPosition = progress * element.offsetHeight;

      for (const item of items) {
        item.dataset.active = String(
          item.offsetTop <= currentPosition + 8,
        );
      }
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!listening) {
            listening = true;

            window.addEventListener(
              "scroll",
              scheduleUpdate,
              { passive: true },
            );
          }

          scheduleUpdate();
          return;
        }

        if (listening) {
          listening = false;

          window.removeEventListener(
            "scroll",
            scheduleUpdate,
          );
        }
      },
      {
        rootMargin: "20% 0px 20% 0px",
      },
    );

    observer.observe(element);

    update();

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "scroll",
        scheduleUpdate,
      );

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className={styles.list} ref={ref}>
      <span
        className={styles.rail}
        aria-hidden="true"
      >
        <span className={styles.railFill} />
      </span>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={styles.step}
            data-step=""
            data-active="false"
          >
            <span
              className={styles.num}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className={styles.body}>
              <h3 className={styles.stepTitle}>
                {step.title}
              </h3>

              <p className={styles.tagline}>
                {step.tagline}
              </p>

              <p className={styles.stepText}>
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}