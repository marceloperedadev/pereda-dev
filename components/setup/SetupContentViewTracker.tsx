"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics/events";

export function SetupContentViewTracker({ contentType, contentId, title }: { contentType: "game" | "guide" | "setup"; contentId: string; title: string }) {
  const pathname = usePathname();
  useEffect(() => {
    track("setup_content_view", { content_type: contentType, content_id: contentId, content_title: title, page_path: pathname });
  }, [contentId, contentType, pathname, title]);
  return null;
}
