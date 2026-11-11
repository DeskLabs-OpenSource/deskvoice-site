import type { Metadata } from "next";
import { Folha } from "../../components/Pecas.tsx";
import { interpretarCores, ler, naPasta, noRepo } from "../../lib/fonte.ts";

export const metadata: Metadata = {
  title: "Marca",
  description: "A identidade do DeskVoice: o símbolo, o nome, as cores e a tipografia, com os arquivos para baixar.",
};

const ARQUIVOS: [string, string, "claro" | "escuro"][] = [
  ["deskvoice-logo-light.svg", "Marca completa, para fundo claro", "claro"],
  ["deskvoice-logo-dark.svg", "Marca completa, para fundo escuro", "escuro"],
  ["deskvoice-symbol-light.svg", "Símbolo, para fundo claro", "claro"],
  ["deskvoice-symbol-dark.svg", "Símbolo, para fundo escuro", "escuro"],
  ["deskvoice-icon.svg", "Ícone", "claro"],
];

export default async function PaginaMarca() {
  // As cores são lidas do arquivo de tokens do painel, na main do produto.
  const cores = interpretarCores(await ler("apps/panel/src/design/tokens.css"));
  return (
    <Folha
      sobre="Identidade"
      titulo="A marca do DeskVoice"
      intro="Calma, direta, com uma cor só para o que está vivo. A marca nasce do design system do painel: as mesmas cores, a mesma tipografia."
    >
      <section className="marca-bloco">
        <h2>O símbolo</h2>
        <div className="duas">
          <p>Quatro barras de voz que descem até um ponto. As barras são a conversa e desenham o D de Desk. O ponto de cobre é o desfecho: o que ficou feito quando a ligação acabou.</p>
          <p>O nome se escreve <strong>DeskVoice</strong>, junto, com D e V maiúsculos. O cobre é reservado para o que está vivo e para a ação principal. Se tudo é cobre, nada está vivo.</p>
        </div>
        <ul className="arquivos">
          {ARQUIVOS.map(([arquivo, nome, fundo]) => (
            <li key={arquivo}>
              <a href={`/marca/${arquivo}`} download data-fundo={fundo}>
                <img src={`/marca/${arquivo}`} alt="" height={48} />
              </a>
              <span>{nome}</span>
              <span className="data">{arquivo}</span>
            </li>
          ))}
        </ul>
        <p className="miudo">A fonte oficial é a pasta <a href={naPasta("brand")}>brand/</a> do repositório, com as regras de uso.</p>
      </section>

      <section className="marca-bloco">
        <h2>As cores</h2>
        <p>Neutros quentes puxados para o verde, da família do DeskcommCRM, com um acento próprio. Cada cor declara o valor do tema claro e o do escuro no mesmo lugar: <a href={noRepo("apps/panel/src/design/tokens.css")}>tokens.css</a>.</p>
        <ul className="cores">
          {cores.map((c) => (
            <li key={c.nome}>
              <span className="amostra" style={{ background: `linear-gradient(to right, ${c.claro} 50%, ${c.escuro} 50%)` }} aria-hidden />
              <span className="data">{c.nome}</span>
              <span className="data mudo">{c.claro} · {c.escuro}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="marca-bloco">
        <h2>A tipografia</h2>
        <div className="duas">
          <div>
            <p className="amostra-tipo">A ligação é o começo de um trabalho.</p>
            <p className="miudo">Atkinson Hyperlegible, para tudo o que se lê. Foi desenhada para legibilidade, e é a mesma do painel.</p>
          </div>
          <div>
            <p className="amostra-tipo data">02:14 · R$ 0,38 · +55 11 5555-0142</p>
            <p className="miudo">IBM Plex Mono, só para dado: duração, custo, telefone, horário, comando. Os valores desta linha são inventados.</p>
          </div>
        </div>
      </section>

      <section className="marca-bloco">
        <h2>A voz</h2>
        <ul className="lista-marcada">
          <li>Profissional e calma. Sem exclamação e sem adjetivo vazio.</li>
          <li>Diz o que foi medido e o que ainda não foi. Não promete prazo.</li>
          <li>Toda afirmação técnica aponta para onde conferir.</li>
          <li>Não pressupõe que a pessoa sabe o que é um servidor.</li>
        </ul>
      </section>
    </Folha>
  );
}
