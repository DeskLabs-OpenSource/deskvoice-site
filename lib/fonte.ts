/**
 * Tudo o que o site afirma sobre o produto e que pode vir do repositório, vem de lá: notas de
 * versão, tabela de provas, requisitos, parceira, skills e tokens. Nada disso é escrito aqui.
 *
 * Quando a leitura falha, a função LANÇA. Numa regeneração em segundo plano o Next continua
 * servindo a última página boa; num `next build` a implantação falha e a anterior fica no ar.
 * Devolver vazio publicaria "nenhuma versão" por cima da página certa.
 */
export const REPO = "https://github.com/DeskLabs-OpenSource/DeskVoice";
const RAW = "https://raw.githubusercontent.com/DeskLabs-OpenSource/DeskVoice/main/";
const REVALIDAR = 600;

/** Endereço de um arquivo do produto no GitHub. Um teste confere que cada caminho usado existe. */
export const noRepo = (caminho: string) => `${REPO}/blob/main/${caminho}`;
export const naPasta = (caminho: string) => `${REPO}/tree/main/${caminho}`;

export async function ler(caminho: string): Promise<string> {
  const r = await fetch(RAW + caminho, { next: { revalidate: REVALIDAR } });
  if (!r.ok) throw new Error(`Fonte indisponível: ${caminho} respondeu ${r.status}`);
  return r.text();
}

// ── Notas de versão ──────────────────────────────────────────────────────────

export type Item = { titulo: string; corpo: string };
export type Versao = { versao: string; data: string; secoes: { titulo: string; itens: Item[] }[] };

export function interpretarChangelog(md: string): Versao[] {
  const versoes: Versao[] = [];
  for (const linha of md.split("\n")) {
    const v = /^## \[(\d+\.\d+\.\d+)\]\s*[—–-]\s*(\d{4}-\d{2}-\d{2})/.exec(linha);
    if (v) {
      versoes.push({ versao: v[1], data: v[2], secoes: [] });
      continue;
    }
    // Cabeçalho de versão num formato novo (pré-versão, sem data) não pode cair dentro da versão de cima.
    if (linha.startsWith("## ")) throw new Error(`CHANGELOG: cabeçalho de versão não reconhecido: ${linha}`);
    const atual = versoes.at(-1);
    if (!atual) continue;
    if (linha.startsWith("### ")) {
      atual.secoes.push({ titulo: linha.slice(4).trim(), itens: [] });
      continue;
    }
    const itens = atual.secoes.at(-1)?.itens;
    const item = /^- \*\*(.+?)\*\*\s*(.*)$/.exec(linha);
    if (item && itens) itens.push({ titulo: item[1], corpo: item[2] });
    else if (linha.startsWith("- ")) throw new Error(`CHANGELOG: item sem título em negrito: ${linha}`);
    else if (linha.trim() && itens?.length) itens.at(-1)!.corpo += ` ${linha.trim()}`;
  }
  if (versoes.length === 0) throw new Error("CHANGELOG sem nenhuma versão: o formato mudou?");
  return versoes;
}
export const lerChangelog = async () => interpretarChangelog(await ler("CHANGELOG.md"));

// ── Tabelas do README ────────────────────────────────────────────────────────

/** As linhas da tabela cujo cabeçalho começa com `primeiraColuna`. Lança se a tabela sumiu. */
export function tabela(md: string, primeiraColuna: string): string[][] {
  const linhas = md.split("\n");
  const inicio = linhas.findIndex((l) => l.startsWith(`| ${primeiraColuna} |`));
  if (inicio === -1) throw new Error(`Tabela "${primeiraColuna}" não encontrada na fonte`);
  const celulas = (l: string) => l.slice(1, l.lastIndexOf("|")).split(" | ").map((c) => c.trim());
  const colunas = celulas(linhas[inicio]).length;
  const corpo: string[][] = [];
  for (const l of linhas.slice(inicio + 2)) {
    if (!l.startsWith("|")) break;
    const linha = celulas(l);
    // Uma barra dentro da célula partiria a linha em colunas a mais; melhor falhar do que mostrar metade.
    if (linha.length !== colunas) throw new Error(`Tabela "${primeiraColuna}": linha com ${linha.length} colunas, esperadas ${colunas}: ${l}`);
    corpo.push(linha);
  }
  if (corpo.length === 0) throw new Error(`Tabela "${primeiraColuna}" veio vazia`);
  return corpo;
}

export type Estado = "real" | "simulacao" | "aguardando" | "parcial";
export type Prova = { capacidade: string; prova: string; estado: Estado };

export function interpretarProvas(readme: string): Prova[] {
  return tabela(readme, "Capacidade").map(([capacidade, prova]) => ({
    capacidade,
    prova,
    estado: prova.startsWith("Provado numa instalação real") ? "real" : prova.startsWith("Provado em simulação") ? "simulacao" : prova.startsWith("Aguardando prova real") ? "aguardando" : "parcial",
  }));
}

// ── Parceira ─────────────────────────────────────────────────────────────────

export type Parceira = { nome: string; url: string; oferta: string };

export function interpretarParceira(env: string): Parceira {
  const campo = (chave: string) => {
    const m = new RegExp(`^${chave}="(.*)"$`, "m").exec(env);
    if (!m) throw new Error(`install/partner.env sem ${chave}`);
    return m[1];
  };
  return { nome: campo("PARTNER_NAME"), url: campo("PARTNER_URL"), oferta: campo("PARTNER_OFFER") };
}
export const lerParceira = async () => interpretarParceira(await ler("install/partner.env"));

// ── Skills ───────────────────────────────────────────────────────────────────

export type Skill = { nome: string; situacao: string; descricao: string; frases: string[] };

/** A tabela "Situação → skill" do AGENTS.md diz quais skills existem e para que situação. */
export function interpretarSkills(agents: string): { nome: string; situacao: string }[] {
  return tabela(agents, "Situação").map(([situacao, skill]) => ({ situacao, nome: skill.replaceAll("`", "") }));
}

/** Do cabeçalho da skill: a primeira frase da descrição e as frases entre aspas que a acionam. */
export function interpretarCabecalho(skillMd: string): { descricao: string; frases: string[] } {
  const m = /^description:\s*'([\s\S]*?)'\s*$/m.exec(skillMd);
  if (!m) throw new Error("SKILL.md sem description no cabeçalho");
  const texto = m[1].replaceAll("''", "'");
  return { descricao: texto.split(/\. (?=[A-ZÀ-Ú])/)[0].replace(/\.$/, "") + ".", frases: [...texto.matchAll(/"([^"]+)"/g)].map((f) => f[1]) };
}

export async function lerSkills(): Promise<Skill[]> {
  const lista = interpretarSkills(await ler("AGENTS.md"));
  return Promise.all(lista.map(async (s) => ({ ...s, ...interpretarCabecalho(await ler(`.agents/skills/${s.nome}/SKILL.md`)) })));
}

// ── Tokens ───────────────────────────────────────────────────────────────────

export type Cor = { nome: string; claro: string; escuro: string };

export function interpretarCores(css: string): Cor[] {
  return [...css.matchAll(/(--dv-[a-z-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/gi)].map((m) => ({ nome: m[1], claro: m[2], escuro: m[3] }));
}

// ── Número social ────────────────────────────────────────────────────────────

/** Estrelas do repositório. Se a leitura falha, devolve null e o número some da página. */
export async function lerEstrelas(): Promise<number | null> {
  try {
    const r = await fetch("https://api.github.com/repos/DeskLabs-OpenSource/DeskVoice", { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    const n = ((await r.json()) as { stargazers_count?: unknown }).stargazers_count;
    return typeof n === "number" ? n : null;
  } catch {
    return null;
  }
}

export const dataBr = (iso: string) => iso.split("-").reverse().join("/");
