import { ImageResponse } from "next/og";

import { getProject } from "@/lib/data/projects";
import { siteConfig } from "@/lib/config/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = `Projeto de ${siteConfig.name} — ${siteConfig.role}`;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  const name = project?.name ?? "Projeto";
  const category = project?.category ?? "Portfólio";

  const background = project?.cover.art.bg ?? "#35154F";
  const foreground = project?.cover.art.fg ?? "#F5F2F7";
  const accent = project?.cover.art.accent ?? "#B8FF00";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background,
          color: foreground,
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: accent,
            }}
          />

          <div
            style={{
              display: "flex",
            }}
          >
            Projeto · {siteConfig.domain}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: name.length > 24 ? 82 : 104,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 38,
              lineHeight: 1.25,
              marginTop: 24,
              opacity: 0.82,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            fontSize: 28,
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {siteConfig.name} — {siteConfig.role}
          </div>

          <div
            style={{
              display: "flex",
              width: 180,
              height: 10,
              background: accent,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}