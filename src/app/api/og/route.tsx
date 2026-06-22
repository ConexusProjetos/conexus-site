import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors
const CYAN = "#00A5B7";
const DARK = "#0A0F1E";
const DARK2 = "#0F1629";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "#B0BAC9";

type OGType = "post" | "project" | "page" | "default";

/**
 * Dynamic Open Graph image generator.
 *
 * Usage:
 *   /api/og?title=Post+Title&description=...&type=post
 *   /api/og?title=Project+Name&type=project&category=Dashboard
 *
 * Query params:
 *   title       - Main headline (required)
 *   description - Subtitle / excerpt (optional)
 *   type        - "post" | "project" | "page" | "default"
 *   category    - Category label shown as a badge (optional)
 *   author      - Author name for posts (optional)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? "Conexus Tecnologia";
  const description = searchParams.get("description");
  const type = (searchParams.get("type") ?? "default") as OGType;
  const category = searchParams.get("category");
  const author = searchParams.get("author");

  // Truncate for layout
  const displayTitle = title.length > 70 ? title.slice(0, 67) + "…" : title;
  const displayDesc = description
    ? description.length > 120
      ? description.slice(0, 117) + "…"
      : description
    : null;

  const typeLabel: Record<OGType, string> = {
    post: "Blog",
    project: "Portfólio",
    page: "Conexus",
    default: "Conexus Tecnologia",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: DARK,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,165,183,0.18), transparent)`,
          }}
        />

        {/* Circuit dots pattern */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            width: 320,
            height: 320,
            opacity: 0.06,
            backgroundImage: `radial-gradient(circle, ${CYAN} 1.5px, transparent 1.5px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "56px 72px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top: Logo + type label */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo mark */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: CYAN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 22,
                color: DARK,
              }}
            >
              C
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: TEXT_PRIMARY,
                letterSpacing: "-0.3px",
              }}
            >
              Conexus
            </span>

            {/* Divider */}
            <div
              style={{
                width: 1,
                height: 20,
                background: "rgba(255,255,255,0.15)",
                margin: "0 4px",
              }}
            />

            {/* Type label */}
            <span
              style={{
                fontSize: 16,
                color: TEXT_SECONDARY,
                fontWeight: 400,
              }}
            >
              {typeLabel[type]}
            </span>
          </div>

          {/* Middle: Category + Title + Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
            {/* Category badge */}
            {category && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(0,165,183,0.12)",
                  border: `1px solid rgba(0,165,183,0.35)`,
                  borderRadius: 999,
                  padding: "5px 14px",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: CYAN,
                  }}
                />
                <span style={{ fontSize: 14, color: CYAN, fontWeight: 600 }}>
                  {category}
                </span>
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: displayTitle.length > 45 ? 44 : 52,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                lineHeight: 1.15,
                letterSpacing: "-0.8px",
              }}
            >
              {displayTitle}
            </div>

            {/* Description */}
            {displayDesc && (
              <div
                style={{
                  fontSize: 20,
                  color: TEXT_SECONDARY,
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {displayDesc}
              </div>
            )}
          </div>

          {/* Bottom: Author or tagline */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {author ? (
                <>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(0,165,183,0.15)",
                      border: `1px solid rgba(0,165,183,0.3)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: CYAN,
                    }}
                  >
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 15, color: TEXT_SECONDARY }}>
                    {author}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontSize: 15,
                    color: TEXT_SECONDARY,
                    fontStyle: "italic",
                  }}
                >
                  Tecnologia que resolve. Simples assim.
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.25)",
                fontWeight: 400,
              }}
            >
              conexus.com.br
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }
  );
}
