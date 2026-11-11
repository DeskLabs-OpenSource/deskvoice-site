import { RODAR_DEMO } from "../lib/comandos.ts";
import { noRepo } from "../lib/fonte.ts";

/**
 * A chamada de demonstração do repositório, como linha do tempo. As falas e as ferramentas são as
 * de apps/voice/src/demo-script.ts no produto: é o que `pnpm demo` executa.
 */
const PASSOS: { lado: "quem-ligou" | "agente" | "evento"; tom?: "vivo" | "ok"; rotulo: string; texto: string }[] = [
  { lado: "quem-ligou", rotulo: "Marina, na linha", texto: "Tenho uma limpeza de pele marcada para quinta às duas da tarde e preciso remarcar. E queria saber se consigo um desconto fechando o pacote de três sessões." },
  { lado: "agente", rotulo: "Lia, agente da recepção", texto: "Claro, Marina. Vou deixar o pedido de remarcação anotado para a recepção confirmar o novo horário com você." },
  { lado: "evento", rotulo: "notify_human", texto: "A recepção recebe o aviso no painel: remarcar de quinta às 14h para sexta de manhã." },
  { lado: "agente", rotulo: "Lia", texto: "Sobre o desconto no pacote, eu não posso decidir sozinha." },
  { lado: "evento", tom: "vivo", rotulo: "request_approval", texto: "“Posso dar 10% de desconto no pacote de três sessões?” Uma pessoa responde pelo painel, com prazo, enquanto a Marina espera na linha." },
  { lado: "agente", rotulo: "Lia", texto: "Obrigada por aguardar, Marina. Já tenho a resposta da responsável." },
  { lado: "evento", rotulo: "transfer_to_human", texto: "A ligação vai para a recepção. O resumo do que já foi dito fica no painel." },
  { lado: "evento", tom: "ok", rotulo: "depois da chamada", texto: "Resumo, avisos e tarefas de acompanhamento entram na fila. O custo fica registrado na linha do tempo." },
];

export function Chamada() {
  return (
    <figure className="chamada">
      <header>
        <span className="live-dot" aria-hidden />
        <strong>Chamada recebida</strong>
        <span className="data">Clínica Bem Viver</span>
        <span className="voice-bars" aria-hidden><span /><span /><span /><span /><span /></span>
      </header>
      <ol className="fio">
        {PASSOS.map((p, i) => (
          <li key={i} data-lado={p.lado} data-tom={p.tom} style={{ animationDelay: `${0.25 + i * 0.32}s` }}>
            <span className="no" aria-hidden />
            <div>
              <span className={p.lado === "evento" ? "rotulo data" : "rotulo"}>{p.rotulo}</span>
              <p>{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption>
        Este é o roteiro da <a href={noRepo("apps/voice/src/demo-script.ts")}>chamada de demonstração</a> do repositório. <code>{RODAR_DEMO}</code> a executa no seu computador, sem chave de IA e sem operadora.
      </figcaption>
    </figure>
  );
}
