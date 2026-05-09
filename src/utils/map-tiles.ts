// Locale-aware map tile config for Leaflet instances.
// Keeps the chrome minimal (no political emphasis, no flags); chooses a
// tile source whose labels match the current UI language.

import { i18n } from "@/boot/i18n";

export interface TileConfig {
  url: string;
  subdomains: string[];
  maxZoom: number;
}

// Sources:
// - CartoDB Positron: muted light-grey style, Latin labels everywhere.
// - OSM France "osmfr": renders labels in the feature's native language
//   (Russian text in Russia, Vietnamese in Vietnam, etc.). Standard OSM
//   cartography — same as global Mapnik but hosted by OSM-FR for rate
//   reasons.
const SOURCES: Record<string, TileConfig> = {
  en: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    subdomains: ["a", "b", "c", "d"],
    maxZoom: 20,
  },
  ru: {
    // OsmAnd HD: OSM-based renderer that uses the primary "name" tag,
    // which is Cyrillic in Russia, Vietnamese in Vietnam, etc.
    url: "https://tile.osmand.net/hd/{z}/{x}/{y}.png",
    subdomains: [],
    maxZoom: 19,
  },
  vi: {
    url: "https://tile.osmand.net/hd/{z}/{x}/{y}.png",
    subdomains: [],
    maxZoom: 19,
  },
};

export function getTileConfig(): TileConfig {
  const locale = (i18n?.global?.locale?.value as string) || "en";
  return SOURCES[locale] ?? SOURCES.en;
}

// Inline SVG pin as a data URL — no broken-image problem when Leaflet's
// PNG assets fail to resolve under Vite, and it stays crisp at any zoom.
const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
  <path d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 24 12 24s12-15.5 12-24C24 5.373 18.627 0 12 0z"
        fill="#1089d3" stroke="#ffffff" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="4" fill="#ffffff"/>
</svg>`.trim();

export function pinIcon(L: typeof import("leaflet")) {
  return L.divIcon({
    html: PIN_SVG,
    className: "mdm-pin-icon",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -32],
  });
}
