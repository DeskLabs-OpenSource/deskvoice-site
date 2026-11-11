import type { Metadata } from "next";
import { Folha } from "../../components/Pecas.tsx";
import { Texto } from "../../components/Texto.tsx";
import { lerSkills, naPasta, noRepo } from "../../lib/fonte.ts";

export const metadata: Metadata = {
  title: "Guias do assistente",
  description: "As skills que o repositório do DeskVoice traz para o seu assistente de código: instalar, operar, contribuir, criar ferramenta e motor de voz.",
};

export default async function Guias() {
  // Uma entrada por skill do repositório do produto. A lista é a do AGENTS.md; o texto, o cabeçalho de cada SKILL.md.
  const skills = await lerSkills();
  return (
    <Folha
      sobre="Guias do assistente"
      titulo="Descreva a situação. O guia já está no repositório."
      intro={<>O repositório traz {skills.length} skills: roteiros escritos para um assistente de código ler antes de agir. Abra o repositório no assistente, peça o assunto em português ou chame a skill pelo nome. Como cada assistente carrega as skills ainda não foi medido aqui. Esta página é montada a partir do cabeçalho de cada skill na <code>main</code>.</>}
    >
      <div className="skills">
        {skills.map((s) => (
          <article key={s.nome} id={s.nome}>
            <p className="sobre">{s.nome}</p>
            <h2><Texto>{s.situacao}</Texto></h2>
            <p><Texto>{s.descricao}</Texto></p>
            {s.frases.length > 0 && (
              <>
                <h3>Frases que a acionam</h3>
                <ul className="frases">
                  {s.frases.map((f) => <li key={f}>“{f}”</li>)}
                </ul>
              </>
            )}
            <a href={noRepo(`.agents/skills/${s.nome}/SKILL.md`)}>Abrir a skill no repositório</a>
          </article>
        ))}
      </div>
      <p className="miudo">
        As skills moram em <a href={naPasta(".agents/skills")}>.agents/skills</a>, e o <a href={noRepo("AGENTS.md")}>AGENTS.md</a> é a autoridade que todo assistente lê. Guias longos para pessoas ficam em <a href={naPasta("docs/guides")}>docs/guides</a>.
      </p>
    </Folha>
  );
}
