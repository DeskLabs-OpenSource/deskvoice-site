// Gera os arquivos da marca. A fonte oficial é a pasta brand/ do repositório do produto:
// rode este script, confira o resultado e leve os arquivos para lá por PR. public/marca/ é cópia,
// e tests/paridade.test.ts reprova se ela divergir da main do produto.
//
// O símbolo: quatro barras de voz que descem até um ponto de cobre. As barras desenham o D de
// Desk; o ponto é o desfecho, na cor que o produto reserva para o que está vivo.
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const OUT = path.resolve(import.meta.dirname, "../public/marca");
const FONT = path.resolve(import.meta.dirname, "../node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff");

// Os mesmos valores de apps/panel/src/design/tokens.css no produto.
const LIGHT = { ink: "#1b1e17", accent: "#a2552f", bg: "#f6f7f2" };
const DARK = { ink: "#f1f3ea", accent: "#dd8f63", bg: "#14160f" };

const HEIGHTS = [56, 54, 46, 32];
const symbol = (c, dx = 0, dy = 0) => {
  let x = 4 + dx;
  let out = "";
  for (const h of HEIGHTS) {
    out += `<rect x="${x}" y="${32 - h / 2 + dy}" width="8" height="${h}" rx="4" fill="${c.ink}"/>`;
    x += 12;
  }
  return out + `<circle cx="${x + 4}" cy="${32 + dy}" r="5" fill="${c.accent}"/>`;
};
const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const font = opentype.parse(fs.readFileSync(FONT).buffer);
const SIZE = 50;
const wordmark = (c, x, baseline) => {
  const p = font.getPath("DeskVoice", x, baseline, SIZE);
  // toPathData() do opentype.js 2.0.0 devolve NaN em alguns números; os comandos crus estão certos.
  const n = (v) => +v.toFixed(2);
  const d = p.commands
    .map((k) => (k.type === "Z" ? "Z" : k.type === "Q" ? `Q${n(k.x1)} ${n(k.y1)} ${n(k.x)} ${n(k.y)}` : k.type === "C" ? `C${n(k.x1)} ${n(k.y1)} ${n(k.x2)} ${n(k.y2)} ${n(k.x)} ${n(k.y)}` : `${k.type}${n(k.x)} ${n(k.y)}`))
    .join("");
  if (d.includes("NaN")) throw new Error("traçado do nome saiu com NaN");
  return { d, box: p.getBoundingBox(), fill: c.ink };
};

const write = (name, content) => fs.writeFileSync(path.join(OUT, name), content);

for (const [tema, c] of [["light", LIGHT], ["dark", DARK]]) {
  write(`deskvoice-symbol-${tema}.svg`, svg(64, 64, symbol(c), "DeskVoice"));
  // Marca horizontal: a linha de base do nome fica onde a altura das maiúsculas centra no símbolo.
  const capHeight = (font.tables.os2.sCapHeight / font.unitsPerEm) * SIZE;
  const wm = wordmark(c, 78, 32 + capHeight / 2);
  const w = Math.ceil(wm.box.x2 + 4);
  write(`deskvoice-logo-${tema}.svg`, svg(w, 64, symbol(c) + `<path d="${wm.d}" fill="${wm.fill}"/>`, "DeskVoice"));
}

// Ícone: o símbolo claro sobre o fundo escuro do produto. Serve de favicon, de ícone do painel e de avatar.
const k = 0.62;
write(
  "deskvoice-icon.svg",
  svg(64, 64, `<rect width="64" height="64" rx="14" fill="${DARK.bg}"/><g transform="translate(${32 - 32 * k} ${32 - 32 * k}) scale(${k})">${symbol(DARK)}</g>`, "DeskVoice"),
);
console.log("marca gerada em", OUT);

// Os PNG saem do Chrome, a partir dos arquivos acima:
//   capa (brand/deskvoice-cover.png e app/opengraph-image.png):
//     chrome --headless --screenshot=capa.png --window-size=1280,640 scripts/capa.html
//   avatar (brand/deskvoice-avatar.png): deskvoice-icon.svg renderizado em 512 × 512.
