import Link from "next/link";
import { Chamada } from "../components/Chamada.tsx";
import { Comando } from "../components/Comando.tsx";
import { Parceira, Secao } from "../components/Pecas.tsx";
import { Texto } from "../components/Texto.tsx";
import { INSTALAR_EM_UMA_LINHA, RODAR_DEMO } from "../lib/comandos.ts";
import { REPO, type Estado, interpretarProvas, ler, lerChangelog, lerEstrelas, naPasta, noRepo } from "../lib/fonte.ts";

const ESTADOS: { estado: Estado; nome: string; explica: string }[] = [
  { estado: "real", nome: "Provado numa instalação real", explica: "Rodou numa VPS de teste, do jeito e até o ponto que a linha descreve." },
  { estado: "simulacao", nome: "Provado em simulação", explica: "Coberto por teste de ponta a ponta com o motor simulado, que percorre a chamada inteira sem operadora e sem chave." },
  { estado: "parcial", nome: "Testado, sem prova completa", explica: "Fora das três categorias do README. Leia a linha: ela diz o que foi testado e o que falta." },
  { estado: "aguardando", nome: "Aguardando prova real", explica: "Implementado e testado contra servidores falsos, mas ainda sem uma ligação feita por operadora real." },
];

export default async function Inicial() {
  const [readme, [ultima], estrelas] = await Promise.all([ler("README.md"), lerChangelog(), lerEstrelas()]);
  const provas = interpretarProvas(readme);

  return (
    <main>
      <section className="abertura">
        <div className="largura abertura-grade">
          <div>
            <p className="sobre">Central telefônica open source · agentes de IA · na sua VPS</p>
            <h1>A ligação não é o produto. É o começo de um <em>trabalho</em>.</h1>
            <p className="intro">
              O DeskVoice atende o telefone com um agente de IA que executa ferramentas durante a conversa, pede aprovação a uma pessoa quando precisa, transfere quando é o caso e deixa tarefas rodando depois que a chamada termina.
            </p>
            <div className="acoes">
              <Link className="botao" href="/instalar">Instalar na minha VPS</Link>
              <a className="botao contorno" href={REPO}>Ver o código no GitHub{estrelas !== null && <span className="data"> ★ {estrelas}</span>}</a>
            </div>
            <ul className="selos">
              <li>Licença MIT</li>
              <li>Sem versão paga</li>
              <li>Banco de dados na sua VPS</li>
            </ul>
            <p className="estado">
              <span className="data">v{ultima.versao}</span> Fundação em construção. <a href="#provas">Veja até onde cada capacidade foi provada</a>.
            </p>
          </div>
          <Chamada />
        </div>
      </section>

      <Secao sobre="O problema" titulo="Um robô que atende bem e não faz nada é uma secretária eletrônica cara.">
        <div className="duas">
          <p>
            Quando alguém liga para uma empresa, quer que algo aconteça: marcar, remarcar, saber onde está o pedido, falar com a pessoa certa. A conversa por voz é só a parte audível.
          </p>
          <p>
            O trabalho de verdade é o que acontece durante e depois: consultar um sistema, avisar alguém, pedir uma autorização, registrar o que foi combinado, cumprir o combinado. O DeskVoice existe para esse resto. A tese inteira está em <a href={noRepo("VISION.md")}>VISION.md</a>.
          </p>
        </div>
      </Secao>

      <Secao id="como" sobre="Como trabalha" titulo="Durante a ligação, com uma pessoa no meio, e depois que desliga." vivo>
        <ol className="tres">
          <li>
            <span className="data">durante</span>
            <h3>O agente executa ferramentas no meio da conversa</h3>
            <p>Avisar alguém, pedir aprovação, transferir, chamar um webhook. Cada ferramenta é um arquivo, e cada uso vira um evento na linha do tempo da chamada.</p>
            <a href={naPasta("packages/tools/src/tools")}>Ver as ferramentas no código</a>
          </li>
          <li>
            <span className="data">no meio</span>
            <h3>Uma pessoa decide, sem a ligação cair</h3>
            <p>O agente pergunta “posso dar este desconto?” a alguém de verdade enquanto o cliente espera. Se ninguém responder no prazo, vale a resposta padrão que o dono definiu.</p>
            <a href={noRepo("docs/doctrine/sistema-vivo.md")}>Ler a doutrina do sistema vivo</a>
          </li>
          <li>
            <span className="data">depois</span>
            <h3>O trabalho continua quando a chamada termina</h3>
            <p>Resumo, avisos e tarefas de acompanhamento entram numa fila e são executados por um processo separado. Toda chamada termina com um desfecho registrado.</p>
            <a href={naPasta("apps/routines/src/routines")}>Ver as rotinas no código</a>
          </li>
        </ol>
        <div className="principios">
          <div>
            <h3>Silêncio é defeito</h3>
            <p>Se o modelo de IA cai, quem ligou ouve um sinal de aviso e é transferido, ou a chamada é encerrada. A tela mostra o que houve. Uma mensagem gravada no lugar do sinal ainda não existe: está em <a href={noRepo("SECURITY.md")}>SECURITY.md</a>.</p>
          </div>
          <div>
            <h3>Custo à vista</h3>
            <p>Cada chamada mostra quanto custou, e cada agente tem um teto de custo e de duração por chamada.</p>
          </div>
          <div>
            <h3>Configuração tem tela</h3>
            <p>Tronco, número, chave de IA e agente se configuram pelo painel. Nenhum recurso exige SSH para ser ligado.</p>
          </div>
        </div>
        <p className="miudo">O caminho de uma ligação, da operadora ao painel, está em <a href={noRepo("ARCHITECTURE.md")}>ARCHITECTURE.md</a>.</p>
      </Secao>

      <Secao id="provas" sobre="Provas" titulo="Até onde cada capacidade foi provada.">
        <p className="lead">
          O DeskVoice é uma fundação recém-lançada. Para ninguém instalar esperando o que ainda não foi provado, o repositório mantém esta tabela. O site a lê do <a href={`${noRepo("README.md")}#o-que-ele-faz-hoje`}>README</a>: quando uma prova muda lá, muda aqui.
        </p>
        <div className="provas">
          {ESTADOS.map(({ estado, nome, explica }) => {
            const linhas = provas.filter((p) => p.estado === estado);
            if (linhas.length === 0) return null;
            return (
              <section key={estado} data-estado={estado}>
                <h3><span className="pino" aria-hidden />{nome} <span className="data">{linhas.length}</span></h3>
                <p className="miudo">{explica}</p>
                <ul>
                  {linhas.map((p) => (
                    <li key={p.capacidade}>
                      <strong><Texto>{p.capacidade}</Texto></strong>
                      <span><Texto>{p.prova}</Texto></span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <p className="miudo">Fez a primeira ligação real? <a href={`${REPO}/issues`}>Conte como foi numa issue</a>: é a contribuição mais valiosa neste momento. O que ainda não existe e o que está aberto para a comunidade está no <a href={noRepo("ROADMAP.md")}>roadmap</a>.</p>
      </Secao>

      <Secao id="instalar" sobre="Instalação" titulo="Uma linha na sua VPS. O resto é pela tela.">
        <div className="duas">
          <div>
            <Comando rotulo="No terminal da VPS">{INSTALAR_EM_UMA_LINHA}</Comando>
            <p>O instalador confere a máquina e a rede, faz poucas perguntas, gera todos os segredos, sobe os serviços, cria o primeiro usuário e mostra o endereço do painel. Você não edita variável de ambiente à mão.</p>
            <Link className="botao contorno" href="/instalar">Abrir o guia de instalação</Link>
          </div>
          <ul className="lista-marcada">
            <li><strong>Uma VPS com Ubuntu 22.04 ou mais novo.</strong> Qualquer VPS com Docker serve.</li>
            <li><strong>Um domínio apontado para a VPS.</strong> Opcional para testar.</li>
            <li><strong>Um tronco SIP com um número,</strong> da operadora de sua escolha.</li>
            <li><strong>Uma chave de IA de voz:</strong> Gemini ou OpenAI.</li>
            <li><strong>Ainda sem nada disso?</strong> <code>{RODAR_DEMO}</code> roda uma chamada inteira no seu computador.</li>
          </ul>
        </div>
      </Secao>

      <Secao id="custos" sobre="Custos" titulo="O software é gratuito. Você paga três coisas, direto ao fornecedor.">
        <ol className="tres">
          <li><span className="data">01</span><h3>A VPS</h3><p>O servidor onde o DeskVoice e o banco de dados rodam. É seu.</p></li>
          <li><span className="data">02</span><h3>A telefonia</h3><p>Depende do tronco que você contratar com a operadora.</p></li>
          <li><span className="data">03</span><h3>A IA de voz</h3><p>Paga por uso ao provedor do modelo. O painel mostra o custo medido de cada chamada.</p></li>
        </ol>
        <p className="miudo">Não existe versão paga nem recurso travado. Como estimar a sua conta está em <a href={noRepo("docs/guides/custos.md")}>docs/guides/custos.md</a>.</p>
      </Secao>

      <Secao sobre="Limites" titulo="Ligações de saída nascem desligadas.">
        <div className="duas">
          <p>
            O agente pode fazer ligações, e o recurso vem desligado. Quem é dono da instalação liga pela tela, depois de declarar a finalidade. O DeskVoice não foi feito para disparo em massa e não aceita contribuição que facilite isso. Leia o guia de <a href={noRepo("docs/guides/conformidade-brasil.md")}>conformidade no Brasil</a> antes de ligar o recurso.
          </p>
          <ul className="lista-marcada">
            <li>Teto diário de chamadas por linha</li>
            <li>Lista de não ligar</li>
            <li>Janela de horário</li>
            <li>Limite de tentativas por pessoa</li>
            <li>Aviso de gravação no início da chamada</li>
          </ul>
        </div>
      </Secao>

      <section className="secao">
        <div className="largura"><Parceira /></div>
      </section>

      <Secao sobre="Quem constrói" titulo="Construído em público, com a comunidade.">
        <div className="duas">
          <p>
            O DeskVoice foi criado por Rafael Melgaço e é irmão do <a href="https://www.deskcomm.com.br">DeskcommCRM</a>. Um não precisa do outro. Crédito é regra: quem contribui mantém a autoria do commit e tem o nome nas notas da versão.
          </p>
          <div className="acoes">
            <Link className="botao contorno" href="/contribuir">Como contribuir</Link>
            <Link className="botao contorno" href="/guias">Guias do assistente</Link>
            <a className="botao contorno" href={noRepo("docs/guides/ganhar-dinheiro-implementando.md")}>Ganhar dinheiro implementando</a>
          </div>
        </div>
      </Secao>

      <Secao sobre="Perguntas frequentes" titulo="O que costumam perguntar antes de instalar.">
        <div className="perguntas">
          <details>
            <summary>Preciso saber programar para instalar?</summary>
            <p>Programar, não. Você precisa abrir um terminal no servidor e colar um comando; o instalador faz poucas perguntas e não pede edição de arquivo. Se você usa um assistente de código, ele conduz a instalação pela skill <code>deskvoice-instalar</code>. O caminho completo está em <Link href="/instalar">Instalar</Link>.</p>
          </details>
          <details>
            <summary>Preciso do DeskcommCRM para usar o DeskVoice?</summary>
            <p>Não. São sistemas independentes. O motivo da separação está em <a href={noRepo("docs/decisions/0001-fronteira-com-o-deskcomm.md")}>uma decisão registrada</a>.</p>
          </details>
          <details>
            <summary>Já dá para atender ligações de uma operadora?</summary>
            <p>O caminho está implementado e testado contra um Asterisk de verdade, mas a ligação por operadora real ainda aguarda prova. A <a href="#provas">tabela de provas</a> mostra o estado de cada capacidade.</p>
          </details>
          <details>
            <summary>Onde ficam os dados das ligações?</summary>
            <p>Num Postgres dentro da sua VPS, e o sistema não depende de serviço de nuvem para subir. Durante a chamada, a conversa passa pelo provedor de IA que você contratou, sob os termos dele. Veja o guia de <a href={noRepo("docs/guides/conformidade-brasil.md")}>conformidade no Brasil</a>.</p>
          </details>
          <details>
            <summary>O DeskVoice grava o áudio das ligações?</summary>
            <p>Ainda não. A fundação guarda a transcrição e a linha do tempo de eventos. Gravação com retenção configurável está no <a href={noRepo("ROADMAP.md")}>roadmap</a>, sem data.</p>
          </details>
          <details>
            <summary>Posso instalar para clientes e cobrar por isso?</summary>
            <p>Pode. A licença é MIT, e há um <a href={noRepo("docs/guides/ganhar-dinheiro-implementando.md")}>guia para quem implementa</a>.</p>
          </details>
        </div>
      </Secao>
    </main>
  );
}
