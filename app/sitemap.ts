import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/instalar", "/guias", "/contribuir", "/changelog", "/marca"].map((p) => ({ url: `https://deskvoice.com.br${p}` }));
}
