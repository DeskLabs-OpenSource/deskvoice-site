import Link from "next/link";
import type { ReactNode } from "react";
import { REPO, dataBr, lerChangelog, lerEstrelas, lerParceira, noRepo } from "../lib/fonte.ts";

export function Marca({ altura = 28 }: { altura?: number }) {
  // Os dois arquivos da pasta de marca; o CSS mostra o do tema em uso.
  return (
    <span className="marca">
      <img className="so-claro" src="/marca/deskvoice-logo-light.svg" alt="DeskVoice" height={altura} />
      <img className="so-escuro" src="/marca/deskvoice-logo-dark.svg" alt="DeskVoice" height={altura} />
    </span>
  );
}

export async function Cabecalho() {
  const estrelas = await lerEstrelas();
  return (
    <header className="topo">
      <div className="largura topo-linha">
        <Link href="/" aria-label="DeskVoice, página inicial"><Marca /></Link>
        <nav aria-label="Principal">
          <Link href="/#como">Como trabalha</Link>
          <Link href="/#provas">Provas</Link>
          <Link href="/instalar">Instalar</Link>
          <Link href="/guias">Guias</Link>
          <Link href="/contribuir">Contribuir</Link>
          <Link href="/changelog">Versões</Link>
        </nav>
        <a className="github" href={REPO}>
          GitHub{estrelas !== null && <span className="data"> ★ {estrelas}</span>}
        </a>
        <Link className="botao pequeno" href="/instalar">Instalar</Link>
      </div>
    </header>
  );
}

export async function Rodape() {
  const [ultima] = await lerChangelog();
  return (
    <footer className="rodape">
      <div className="largura rodape-grade">
        <div>
          <Marca altura={24} />
          <p>Central telefônica open source operada por agentes de IA, instalada na sua VPS.</p>
        </div>
        <Coluna titulo="Produto">
          <Link href="/#como">Como trabalha</Link>
          <Link href="/#provas">O que já foi provado</Link>
          <Link href="/#custos">Custos</Link>
          <Link href="/instalar">Instalar</Link>
        </Coluna>
        <Coluna titulo="Documentação">
          <Link href="/guias">Guias do assistente</Link>
          <a href={noRepo("docs/guides/primeira-ligacao.md")}>Primeira ligação</a>
          <a href={noRepo("ARCHITECTURE.md")}>Arquitetura</a>
          <a href={noRepo("docs/doctrine/sistema-vivo.md")}>Doutrina do sistema vivo</a>
          <a href={noRepo("docs/guides/ganhar-dinheiro-implementando.md")}>Para quem implementa</a>
        </Coluna>
        <Coluna titulo="Comunidade">
          <Link href="/contribuir">Contribuir</Link>
          <a href={`${REPO}/discussions`}>Discussões</a>
          <a href={`${REPO}/issues`}>Issues</a>
          <a href={noRepo("ROADMAP.md")}>Roadmap</a>
        </Coluna>
        <Coluna titulo="Projeto">
          <Link href="/changelog">Notas de versão</Link>
          <Link href="/marca">Marca</Link>
          <a href={noRepo("LICENSE")}>Licença MIT</a>
          <a href={noRepo("SECURITY.md")}>Segurança</a>
          <a href="https://www.deskcomm.com.br">DeskcommCRM, o projeto irmão</a>
        </Coluna>
      </div>
      <div className="largura rodape-fim">
        <span>DeskVoice · MIT · Feito no Brasil</span>
        <span className="data">Versão {ultima.versao}, de {dataBr(ultima.data)}</span>
      </div>
    </footer>
  );
}

function Coluna({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <nav aria-label={titulo}>
      <h2>{titulo}</h2>
      {children}
    </nav>
  );
}

/** A parceira, declarada. Nome, endereço e texto da oferta vêm de install/partner.env do produto. */
export async function Parceira({ titulo = "h2" }: { titulo?: "h2" | "h3" }) {
  const p = await lerParceira();
  const T = titulo;
  return (
    <aside className="parceira" aria-label={`Parceria de infraestrutura: ${p.nome}`}>
      <div>
        <p className="sobre">Parceria de infraestrutura</p>
        <T>O DeskVoice é gratuito. Quem sustenta o projeto é a parceria com a {p.nome}.</T>
        <p>O kit de instalação foi feito pensando na VPS dela: um comando, poucas perguntas, nenhuma variável para editar.</p>
      </div>
      <div className="parceira-acao">
        <a className="botao-parceira" href={p.url} rel="sponsored noopener">Contratar a VPS da {p.nome} pelo link da parceria <span aria-hidden>→</span></a>
        <p className="miudo">{p.oferta}</p>
      </div>
    </aside>
  );
}

export function Secao({ id, sobre, titulo, children, vivo }: { id?: string; sobre: string; titulo: ReactNode; children: ReactNode; vivo?: boolean }) {
  return (
    <section id={id} className="secao" data-vivo={vivo || undefined}>
      <div className="largura">
        <p className="sobre">{sobre}</p>
        <h2>{titulo}</h2>
        {children}
      </div>
    </section>
  );
}

export function Folha({ sobre, titulo, intro, children }: { sobre: string; titulo: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="folha">
      <div className="largura">
        <p className="sobre">{sobre}</p>
        <h1>{titulo}</h1>
        <p className="intro">{intro}</p>
        {children}
      </div>
    </main>
  );
}
