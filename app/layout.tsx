import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { Cabecalho, Rodape } from "../components/Pecas.tsx";

const descricao = "Central telefônica open source operada por agentes de IA, instalada na sua VPS. O agente atende, executa ferramentas durante a conversa, pede aprovação a uma pessoa e segue trabalhando depois que a chamada termina.";

export const metadata: Metadata = {
  metadataBase: new URL("https://deskvoice.com.br"),
  title: { default: "DeskVoice: central telefônica open source operada por agentes de IA", template: "%s · DeskVoice" },
  description: descricao,
  alternates: { canonical: "./" },
  openGraph: { siteName: "DeskVoice", locale: "pt_BR", type: "website", description: descricao },
  twitter: { card: "summary_large_image" },
};

export const revalidate = 600;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="pular" href="#conteudo">Pular para o conteúdo</a>
        <Cabecalho />
        <div id="conteudo">{children}</div>
        <Rodape />
      </body>
    </html>
  );
}
