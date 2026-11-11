import { noRepo } from "../lib/fonte.ts";

/** Texto vindo do repositório: só negrito, código e link. Link relativo aponta para o arquivo no GitHub. */
export function Texto({ children }: { children: string }) {
  const partes = children.split(/(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {partes.map((p, i) => {
        if (p.startsWith("**")) return <strong key={i}><Texto>{p.slice(2, -2)}</Texto></strong>;
        if (p.startsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
        if (link) return <a key={i} href={/^https?:/.test(link[2]) ? link[2] : noRepo(link[2])} rel={link[2].includes("hostgator") ? "sponsored noopener" : undefined}><Texto>{link[1]}</Texto></a>;
        return p;
      })}
    </>
  );
}
