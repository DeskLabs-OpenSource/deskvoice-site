import type { Metadata } from "next";
import { Folha } from "../../components/Pecas.tsx";
import { Texto } from "../../components/Texto.tsx";
import { dataBr, lerChangelog, noRepo } from "../../lib/fonte.ts";

export const metadata: Metadata = {
  title: "Notas de versão",
  description: "O que muda em cada versão do DeskVoice, na voz de quem opera a instalação. Lido do CHANGELOG do repositório.",
};

export default async function Changelog() {
  const versoes = await lerChangelog();
  return (
    <Folha
      sobre="Notas de versão"
      titulo="O que muda em cada versão"
      intro={<>Nada aqui é escrito no site: a página lê o <a href={noRepo("CHANGELOG.md")}>CHANGELOG.md</a> do repositório. Antes de atualizar, leia o que estiver em “Requer atenção”.</>}
    >
      <nav className="versoes-indice" aria-label="Versões">
        {versoes.map((v) => <a key={v.versao} className="data" href={`#v${v.versao}`}>{v.versao}</a>)}
      </nav>
      {versoes.map((v) => (
        <article key={v.versao} id={`v${v.versao}`} className="versao">
          <header>
            <h2>{v.versao}</h2>
            <time className="data" dateTime={v.data}>{dataBr(v.data)}</time>
          </header>
          {v.secoes.map((s) => (
            <section key={s.titulo} data-atencao={s.titulo.includes("atenção") || undefined}>
              <h3>{s.titulo}</h3>
              <ul>
                {s.itens.map((i) => (
                  <li key={i.titulo}>
                    <strong><Texto>{i.titulo}</Texto></strong>
                    <p><Texto>{i.corpo}</Texto></p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      ))}
    </Folha>
  );
}
