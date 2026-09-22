import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08070A",
          color: "#F5F2F7",
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
              background: "#B8FF00",
            }}
          />

          <div
            style={{
              display: "flex",
            }}
          >
            {siteConfig.domain}
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
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {siteConfig.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 38,
              lineHeight: 1.25,
              marginTop: 28,
              color: "#C9C4CE",
            }}
          >
            {siteConfig.role} ·{" "}
            {siteConfig.specialty}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#C9C4CE",
            }}
          >
            {siteConfig.city} —{" "}
            {siteConfig.region}
          </div>

          <div
            style={{
              display: "flex",
              width: 220,
              height: 12,
              background: "#672F96",
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