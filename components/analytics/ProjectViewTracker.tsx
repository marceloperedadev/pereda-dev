"use client";

import { useEffect } from "react";

import {
  projectParams,
  track,
} from "@/lib/analytics/events";

import {
  readConsent,
} from "@/lib/analytics/consent";

type ProjectViewTrackerProps = {
  name: string;
  type: string;
};

/**
 * Dispara project_view quando a página de um case é aberta.
 *
 * O evento só é enviado quando existe consentimento explícito
 * para Analytics. O tracker não utiliza atraso artificial para
 * tentar sincronizar com o carregamento do Google Analytics.
 */
export function ProjectViewTracker({
  name,
  type,
}: ProjectViewTrackerProps) {
  useEffect(() => {
    if (
      readConsent() !== "granted"
    ) {
      return;
    }

    track(
      "project_view",
      projectParams({
        name,
        type,
      }),
    );
  }, [name, type]);

  return null;
}