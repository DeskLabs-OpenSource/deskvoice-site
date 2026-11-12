# deskvoice-site

O site de [deskvoice.com.br](https://deskvoice.com.br): apresenta o
[DeskVoice](https://github.com/DeskLabs-OpenSource/DeskVoice), ensina a instalar e encaminha para
o código e para a parceira de infraestrutura.

**Repositório separado do produto, de propósito.** O DeskVoice é instalado na VPS de quem usa. Se
a página de apresentação morasse dentro do painel, toda instalação a serviria.

## Quase nada aqui é escrito aqui

| Página | De onde vem |
|---|---|
| `/` | Escrita no site. A tabela de provas e a versão vêm do `README.md` e do `CHANGELOG.md` do produto |
| `/instalar` | Requisitos lidos do `README.md` do produto; comandos copiados, com teste de paridade |
| `/guias` | Uma entrada por skill: a lista vem do `AGENTS.md`, o texto do cabeçalho de cada `SKILL.md` |
| `/contribuir` | Só ligações para os arquivos do produto |
| `/changelog` | Lido do `CHANGELOG.md` do produto |
| `/marca` | Arquivos de `brand/` e cores de `tokens.css` do produto |
| `/llms.txt` | O resumo para assistentes de IA, montado das mesmas fontes |

A leitura é feita em `lib/fonte.ts`, da `main` do produto, com revalidação a cada dez minutos.
Uma versão nova, uma skill nova ou uma prova nova aparece aqui sem ninguém tocar neste repositório.
Quando a leitura falha, a página falha: o Next continua servindo a última versão boa.

O que é cópia (`lib/comandos.ts`, `app/tokens.css`, `public/marca/`) tem teste em
`tests/paridade.test.ts`, que compara com a `main` do produto. O endereço da parceira não é
escrito em lugar nenhum: vem de `install/partner.env`.

## Rodar

```bash
pnpm install
pnpm dev
```

## Conferir

```bash
pnpm typecheck
pnpm test     # paridade com o produto; roda sozinho antes do `pnpm build`
pnpm build
```

Os três rodam no CI a cada PR e a cada push na `main`.

## Publicar

O projeto na Vercel está ligado a este repositório: cada push na `main` publica em
[deskvoice.com.br](https://deskvoice.com.br), e cada PR ganha um endereço de prévia. O build de lá
roda `pnpm build`, com os testes de paridade antes. Se eles falham, a versão anterior continua no ar.

## Marca

O contrato do site (quem visita, a personalidade, o que ele nunca faz) está em
[`MARCA.md`](MARCA.md). Os arquivos da marca são gerados por `node scripts/gerar-marca.mjs` e a
fonte oficial deles é a pasta `brand/` do produto.

## Idiomas

Hoje, só português. O painel do produto existe em português, inglês e espanhol; o site ainda não.
