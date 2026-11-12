# AGENTS.md

Para qualquer assistente de código neste repositório: o site de [deskvoice.com.br](https://deskvoice.com.br).

- **Quase nada aqui é escrito aqui.** A tabela de provas, a versão, os requisitos, os guias e as
  notas de versão são lidos da `main` do [produto](https://github.com/DeskLabs-OpenSource/DeskVoice)
  por `lib/fonte.ts`. Para mudar o que o site diz sobre o produto, mude o produto. O mapa está no
  [`README.md`](README.md).
- **O que é cópia tem teste de paridade.** `tests/paridade.test.ts` compara `lib/comandos.ts`,
  `app/tokens.css` e `public/marca/` com a `main` do produto. Mudou lá? Copie aqui na mesma leva.
  O endereço da parceira nunca é escrito aqui: vem de `install/partner.env` do produto.
- **Conferir antes do PR:** `pnpm typecheck` e `pnpm test`. A `main` exige PR e o check `verificar`.
- **Publicar espera o dono.** Mesclar não publica: o deploy na Vercel é manual e só acontece com o
  sim do Rafael.
- **Tom e marca:** o contrato está em [`MARCA.md`](MARCA.md).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
