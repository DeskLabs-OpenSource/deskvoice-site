import type { Metadata } from "next";
import { Comando } from "../../components/Comando.tsx";
import { Folha } from "../../components/Pecas.tsx";
import { DEMO, VERIFICAR_ANTES_DO_PR } from "../../lib/comandos.ts";
import { REPO, naPasta, noRepo } from "../../lib/fonte.ts";

export const metadata: Metadata = {
  title: "Contribuir",
  description: "Como fazer o primeiro PR no DeskVoice dar certo: por onde começar, o que o CI reprova e onde está cada regra.",
};

const LEITURAS: [string, string, string][] = [
  ["CONTRIBUTING.md", "O guia de contribuição", "Ramos, commits, o que o CI reprova e o que só a revisão vê."],
  ["AGENTS.md", "As convenções", "A autoridade para pessoa e para assistente de código."],
  ["ARCHITECTURE.md", "A arquitetura", "O caminho de uma ligação, em uma página."],
  ["ROADMAP.md", "O roadmap", "As frentes abertas, cada uma com tamanho e ponto de entrada no código."],
  ["GOVERNANCE.md", "A governança", "Quem decide o quê, e a fila de merge."],
  ["CREDITS.md", "Os créditos", "O que o projeto deve a outros projetos."],
];

export default function Contribuir() {
  return (
    <Folha
      sobre="Para quem desenvolve"
      titulo="O projeto foi montado para que o primeiro PR dê certo"
      intro="Esta página só aponta o caminho. As regras moram no repositório, e é lá que elas mudam: aqui não há cópia."
    >
      <ol className="passos">
        <li>
          <h2>Veja o sistema funcionando</h2>
          <p>Uma chamada inteira com o motor simulado, sem chave de IA e sem operadora. Precisa de Docker.</p>
          <Comando rotulo="No seu computador">{DEMO}</Comando>
        </li>
        <li>
          <h2>Abra o repositório no seu assistente de código</h2>
          <p>A skill <a href="/guias#deskvoice-contribuir"><code>deskvoice-contribuir</code></a> mede antes do PR o que a revisão e o CI medem depois, e arma os hooks de git.</p>
        </li>
        <li>
          <h2>Escolha uma peça</h2>
          <p>Ferramenta, motor de voz e rotina moram cada um no próprio arquivo e são descobertos pela pasta. Seu PR não disputa uma lista central com o PR de outra pessoa.</p>
          <ul className="lista-marcada">
            <li><a href={noRepo("docs/guides/adicionar-uma-ferramenta.md")}>Adicionar uma ferramenta</a> que o agente usa durante a chamada</li>
            <li><a href={noRepo("docs/guides/adicionar-um-motor-de-voz.md")}>Adicionar um motor de voz</a></li>
            <li><a href={`${REPO}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}>Issues marcadas como boas para começar</a></li>
          </ul>
        </li>
        <li>
          <h2>Rode a verificação antes de abrir o PR</h2>
          <p>Lint, tipos, cercas e testes. O check do seu PR só mede o seu diff: se o CI ficar vermelho por algo que você não tocou, a falha é do projeto, e a mensagem do job diz isso.</p>
          <Comando>{VERIFICAR_ANTES_DO_PR}</Comando>
        </li>
      </ol>

      <section className="alternativas">
        <h2>Onde está cada regra</h2>
        <ul className="leituras">
          {LEITURAS.map(([arquivo, nome, texto]) => (
            <li key={arquivo}>
              <a href={noRepo(arquivo)}><strong>{nome}</strong><span className="data">{arquivo}</span></a>
              <p>{texto}</p>
            </li>
          ))}
          <li>
            <a href={naPasta("docs/doctrine")}><strong>A doutrina</strong><span className="data">docs/doctrine</span></a>
            <p>As leis do projeto, cada uma com o erro que a originou.</p>
          </li>
        </ul>
        <p className="miudo">Dúvida que não é bug? <a href={`${REPO}/discussions`}>Abra uma discussão</a>. Achou uma falha de segurança? Siga o <a href={noRepo("SECURITY.md")}>SECURITY.md</a>, sem abrir issue pública.</p>
      </section>
    </Folha>
  );
}
