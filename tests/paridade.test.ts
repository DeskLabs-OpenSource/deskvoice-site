/**
 * O que o site copia do produto, comparado com a main do produto. Roda no CI e antes de todo build.
 * Se o produto mudar um comando, um token ou a marca, este teste fica vermelho até a cópia acompanhar.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { TODOS } from "../lib/comandos.ts";
import { interpretarCabecalho, interpretarChangelog, interpretarCores, interpretarParceira, interpretarProvas, interpretarSkills, tabela } from "../lib/fonte.ts";

const RAW = "https://raw.githubusercontent.com/DeskLabs-OpenSource/DeskVoice/main/";
const raiz = path.resolve(import.meta.dirname, "..");
const local = (p: string) => fs.readFileSync(path.join(raiz, p), "utf8");
const cache = new Map<string, Promise<Response>>();
const pedir = (p: string) => cache.get(p) ?? cache.set(p, fetch(RAW + p)).get(p)!;
const fonte = async (p: string) => {
  const r = (await pedir(p)).clone();
  assert.equal(r.status, 200, `${p} não existe na main do produto`);
  return r.text();
};

test("os comandos do site estão, letra por letra, no produto", async () => {
  const docs = (await Promise.all(["README.md", "install/README.md", "docs/guides/atualizar.md", "CONTRIBUTING.md"].map(fonte))).join("\n");
  // A linha inteira precisa bater (com ou sem comentário depois): "sudo bash install/update.sh" não passa por "bash install/update.sh".
  const linhas = docs.split("\n").map((l) => l.trim());
  const bate = (c: string) => linhas.some((l) => l === c || (l.startsWith(c) && /^\s+#/.test(l.slice(c.length))));
  for (const comando of TODOS) for (const linha of comando.split("\n")) assert.ok(bate(linha), `comando fora do produto: ${linha}`);
});

test("os tokens do site são os do painel", async () => {
  assert.equal(local("app/tokens.css"), await fonte("apps/panel/src/design/tokens.css"));
});

test("a marca do site é a da pasta brand/ do produto", async () => {
  const arquivos = fs.readdirSync(path.join(raiz, "public/marca")).filter((a) => a.endsWith(".svg"));
  assert.ok(arquivos.length >= 5);
  for (const a of arquivos) assert.equal(local(`public/marca/${a}`), await fonte(`brand/${a}`), `brand/${a} diverge`);
  assert.equal(local("app/icon.svg"), local("public/marca/deskvoice-icon.svg"));
});

test("todo arquivo do produto que o site aponta existe", async () => {
  const caminhos = new Set<string>();
  const pastas = new Set<string>();
  const varrer = (dir: string) => {
    for (const e of fs.readdirSync(path.join(raiz, dir), { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) varrer(p);
      else {
        for (const m of local(p).matchAll(/noRepo\("([^"`$]+)"\)/g)) caminhos.add(m[1]);
        for (const m of local(p).matchAll(/naPasta\("([^"`$]+)"\)/g)) pastas.add(m[1]);
        // Caminho montado em tempo de execução escapa desta conferência. Só dois podem: o de cada skill
        // (conferido no teste de formato) e o de link vindo do próprio texto do produto.
        const montados = [...local(p).matchAll(/(?:noRepo|naPasta)\((?!")([^)]*)\)/g)].map((m) => m[1]).filter((a) => a !== "link[2]" && a !== "`.agents/skills/${s.nome}/SKILL.md`");
        assert.deepEqual(montados, [], `${p}: caminho do produto que não é literal`);
      }
    }
  };
  ["app", "components"].forEach(varrer);
  assert.ok(caminhos.size > 10);
  await Promise.all([...caminhos].map(fonte));
  for (const pasta of pastas) {
    const r = await fetch(`https://github.com/DeskLabs-OpenSource/DeskVoice/tree/main/${pasta}`, { method: "HEAD" });
    assert.equal(r.status, 200, `a pasta ${pasta} não existe na main do produto`);
  }
});

test("a fonte ainda tem o formato que o site lê", async () => {
  const readme = await fonte("README.md");
  assert.ok(interpretarChangelog(await fonte("CHANGELOG.md")).every((v) => v.secoes.some((s) => s.itens.length > 0)));
  const provas = interpretarProvas(readme);
  assert.ok(provas.length > 5);
  // Os três estados do README precisam continuar sendo reconhecidos; se sumirem, o prefixo mudou lá.
  for (const estado of ["real", "simulacao", "aguardando"]) assert.ok(provas.some((p) => p.estado === estado), `nenhuma prova no estado ${estado}`);
  assert.ok(tabela(readme, "O que ter em mãos").every((linha) => linha.length === 2));
  assert.match(interpretarParceira(await fonte("install/partner.env")).url, /^https:\/\//);
  assert.ok(interpretarCores(await fonte("apps/panel/src/design/tokens.css")).length > 10);
  const skills = interpretarSkills(await fonte("AGENTS.md"));
  assert.ok(skills.length >= 6);
  for (const s of skills) assert.ok(interpretarCabecalho(await fonte(`.agents/skills/${s.nome}/SKILL.md`)).descricao.length > 20, s.nome);
});

test("nenhum endereço da parceira escrito à mão no site", () => {
  const varrer = (dir: string): string[] => fs.readdirSync(path.join(raiz, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? varrer(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
  for (const p of ["app", "components", "lib"].flatMap(varrer)) assert.doesNotMatch(local(p), /hostgator\.com/, `${p} escreve o endereço da parceira; ele vem de install/partner.env`);
});
