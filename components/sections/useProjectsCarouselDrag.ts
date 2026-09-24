"use client";

import {
  useCallback,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type PointerEvent,
  type RefObject,
  type SetStateAction,
} from "react";

export type DragState = {
  id: number;
  x: number;
  y: number;
  dx: number;
  startedAt: number;
  decided: boolean;
  horizontal: boolean;
};

type UseProjectsCarouselDragArgs = {
  total: number;
  activeRef: MutableRefObject<number>;
  trackRef: RefObject<HTMLDivElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  hintRef: RefObject<HTMLSpanElement | null>;
  goTo: (index: number, interaction: "drag") => void;
  setSuppressClick: Dispatch<SetStateAction<boolean>>;
};

export function useProjectsCarouselDrag({
  total,
  activeRef,
  trackRef,
  viewportRef,
  hintRef,
  goTo,
  setSuppressClick,
}: UseProjectsCarouselDragArgs) {
  const drag = useRef<DragState | null>(null);
  const suppressClick = useRef(false);

  const resetDrag = useCallback(() => {
    const element = trackRef.current;

    if (!element) {
      return;
    }

    element.style.setProperty("--drag", "0px");
    delete element.dataset.dragging;
  }, [trackRef]);

  const onPointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      startedAt: performance.now(),
      decided: false,
      horizontal: false,
    };
  };

  const onPointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType === "mouse" &&
      hintRef.current &&
      viewportRef.current
    ) {
      const bounds = viewportRef.current.getBoundingClientRect();
      const target = event.target;
      const overControl =
        target instanceof HTMLElement
          ? Boolean(target.closest("a, button"))
          : false;

      hintRef.current.style.transform =
        `translate3d(${event.clientX - bounds.left + 16}px, ${event.clientY - bounds.top + 16
        }px, 0)`;
      hintRef.current.dataset.visible =
        overControl ? "false" : "true";
    }

    const state = drag.current;

    if (!state || state.id !== event.pointerId) {
      return;
    }

    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;

    if (!state.decided) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
        return;
      }

      state.decided = true;
      state.horizontal = Math.abs(dx) > Math.abs(dy);

      if (state.horizontal) {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is not available in every browser/context.
        }

        if (trackRef.current) {
          trackRef.current.dataset.dragging = "true";
        }
      }
    }

    if (!state.horizontal) {
      return;
    }

    state.dx = dx;

    const atStart = activeRef.current === 0 && dx > 0;
    const atEnd = activeRef.current === total - 1 && dx < 0;
    const displacement = atStart || atEnd ? dx * 0.3 : dx;

    trackRef.current?.style.setProperty(
      "--drag",
      `${displacement}px`,
    );
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;

    if (!state || state.id !== event.pointerId) {
      return;
    }

    drag.current = null;

    if (!state.horizontal) {
      return;
    }

    const elapsed = Math.max(
      1,
      performance.now() - state.startedAt,
    );
    const velocity = state.dx / elapsed;

    if (state.dx < -60 || velocity < -0.5) {
      goTo(activeRef.current + 1, "drag");
    } else if (state.dx > 60 || velocity > 0.5) {
      goTo(activeRef.current - 1, "drag");
    }

    resetDrag();
    suppressClick.current = true;
    setSuppressClick(true);
    window.setTimeout(() => {
      suppressClick.current = false;
      setSuppressClick(false);
    }, 60);
  };

  const shouldSuppressClick = useCallback(
    () => suppressClick.current,
    [],
  );

  return {
    onPointerDown,
    onPointerMove,
    endDrag,
    shouldSuppressClick,
  };
}
