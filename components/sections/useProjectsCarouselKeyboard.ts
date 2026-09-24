"use client";

import type { KeyboardEvent } from "react";

type UseProjectsCarouselKeyboardArgs = {
  total: number;
  activeRef: { current: number };
  goTo: (
    index: number,
    interaction: "keyboard",
  ) => void;
};

export function useProjectsCarouselKeyboard({
  total,
  activeRef,
  goTo,
}: UseProjectsCarouselKeyboardArgs) {
  return (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || total === 0) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        goTo(activeRef.current + 1, "keyboard");
        break;
      case "ArrowLeft":
        event.preventDefault();
        goTo(activeRef.current - 1, "keyboard");
        break;
      case "Home":
        event.preventDefault();
        goTo(0, "keyboard");
        break;
      case "End":
        event.preventDefault();
        goTo(total - 1, "keyboard");
        break;
      default:
        break;
    }
  };
}
