import type { Metadata } from "next";
import { Comando } from "../../components/Comando.tsx";
import { Folha, Parceira } from "../../components/Pecas.tsx";
import { Texto } from "../../components/Texto.tsx";
import { ANTES_DO_SERVIDOR, ATUALIZAR, DIAGNOSTICAR, CONFERIR_SAUDE, DEMO, INSTALAR_EM_UMA_LINHA, INSTALAR_PASSO_A_PASSO, PEDIDO_AO_ASSISTENTE } from "../../lib/comandos.ts";
import { REPO, ler, noRepo, tabela } from "../../lib/fonte.ts";

export const metadata: Metadata = {
  title: "Instalar",
  description: "Do “ainda não tenho servidor” ao painel aberto: o que ter em mãos, o comando de instalação e o que se configura pela tela.",
};

export default async function Instalar() {
  // Os requisitos são a tabela do README do produto, lida da main.
  const requisitos = tabela(await ler("README.md"), "O que ter em mãos");
  return (
    <Folha
      sobre="Guia de instalação"
      titulo="Instalar o DeskVoice na sua VPS"
      intro="Um servidor é um computador alugado que fica ligado o tempo todo; VPS é o nome usual desse aluguel. Este guia vai do “ainda não tenho servidor” até o painel aberto. Os comandos são os mesmos do repositório, letra por letra."
    >
      <ol className="passos">
        <li>
          <h2>Tenha um servidor</h2>
          <p>Já tem uma VPS com Ubuntu 22.04+, Debian 12+, AlmaLinux 9+ ou Rocky Linux 9+? Siga para o passo 2. Qualquer VPS com Docker funciona pelo mesmo comando, sem diferença de recurso.</p>
          <p>Se ainda não tem, a recomendada é a da parceira do projeto:</p>
          <Parceira titulo="h3" />
          <p>Prefere um comando a uma página? No seu computador (macOS ou Linux), antes de ter servidor, este comando só informa: o que é preciso, o tamanho da máquina, o link da parceria e o comando seguinte. Não instala nem coleta nada.</p>
          <Comando rotulo="No seu computador">{ANTES_DO_SERVIDOR}</Comando>
        </li>
        <li>
          <h2>Separe o que ter em mãos</h2>
          <dl className="requisitos">
            {requisitos.map(([item, observacao]) => (
              <div key={item}>
                <dt><Texto>{item}</Texto></dt>
                <dd><Texto>{observacao}</Texto></dd>
              </div>
            ))}
          </dl>
        </li>
        <li>
          <h2>Rode uma linha na VPS</h2>
          <p>SSH é o jeito de abrir, do seu computador, um terminal dentro do servidor; a empresa da VPS informa o endereço e a senha. Docker é o programa que roda as partes do DeskVoice, e o instalador o instala se faltar. Entre na VPS por SSH e rode:</p>
          <Comando rotulo="Na VPS">{INSTALAR_EM_UMA_LINHA}</Comando>
          <p>Ela baixa o DeskVoice em <code>~/DeskVoice</code> e abre o instalador. Prefere ler antes de rodar? O mesmo resultado, passo a passo:</p>
          <Comando rotulo="Na VPS, passo a passo">{INSTALAR_PASSO_A_PASSO}</Comando>
          <p>O instalador confere a máquina e a rede, pergunta o domínio, o nome da empresa, o seu nome, e-mail e senha, gera todos os segredos, sobe os serviços, cria o primeiro usuário e mostra o endereço do painel. Se faltar o Docker, ele pergunta e instala. Rodar de novo não quebra nada.</p>
        </li>
        <li>
          <h2>Configure pela tela</h2>
          <p>Daí em diante tudo se configura pelo painel: o tronco SIP, o número, a chave de IA e o agente. Nenhum recurso exige SSH para ser ligado.</p>
          <p>O passo a passo completo, do zero à primeira chamada, está em <a href={noRepo("docs/guides/primeira-ligacao.md")}>docs/guides/primeira-ligacao.md</a>.</p>
        </li>
        <li>
          <h2>Confira e mantenha</h2>
          <p>A checagem de saúde mostra o estado de cada parte, uma linha por vez. Ela nunca resume tudo em um “ok”.</p>
          <Comando rotulo="Na VPS, dentro de ~/DeskVoice">{CONFERIR_SAUDE}</Comando>
          <p>Para atualizar pelo terminal:</p>
          <Comando rotulo="Na VPS, dentro de ~/DeskVoice">{ATUALIZAR}</Comando>
          <p>O que muda em cada versão, e o que pede atenção antes de atualizar, está nas <a href="/changelog">notas de versão</a>. O guia é <a href={noRepo("docs/guides/atualizar.md")}>docs/guides/atualizar.md</a>.</p>
        </li>
      </ol>

      <section className="alternativas">
        <h2>Outros caminhos</h2>
        <div className="duas">
          <div>
            <h3>Instalar com um assistente de IA</h3>
            <p>Usa Claude Code, Codex, Cursor ou outro assistente de código? Cole isto nele. A primeira pergunta dele é se você já tem um servidor. Senha e chave não vão para a conversa: entram pelo instalador ou pela tela.</p>
            <Comando rotulo="Cole no assistente">{PEDIDO_AO_ASSISTENTE}</Comando>
          </div>
          <div>
            <h3>Ver uma chamada sem chave nem tronco</h3>
            <p>O repositório traz um motor de voz simulado. Ele roda uma chamada inteira, com saudação, ferramenta, pedido de aprovação, transferência e tarefa pós-chamada. Precisa de Docker: sobe um Postgres descartável e o remove ao sair.</p>
            <Comando rotulo="No seu computador">{DEMO}</Comando>
          </div>
        </div>
        <p className="miudo">A instalação falhou ou a ligação ficou muda? <a href={`${REPO}/issues`}>Abra uma issue</a> com o arquivo que <code>{DIAGNOSTICAR}</code> gera. Senhas, chaves e tokens saem ocultos nele.</p>
      </section>
    </Folha>
  );
}
