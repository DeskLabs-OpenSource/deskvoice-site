# Contrato de marca do site

## Quem visita

1. **Quem tem uma empresa que atende por telefone** e ouviu falar do projeto. Não programa, e pode
   não saber o que é um servidor.
2. **Quem instala e mantém sistemas para empresas.** Quer saber se dá para confiar e quanto custa.
3. **Quem programa** e quer contribuir ou avaliar o código.
4. **Assistentes de IA**, que leem o texto servido e o `/llms.txt`, sem executar scripts.

## Para que o site serve

Dizer o que o DeskVoice é, mostrar até onde foi provado, ensinar a instalar e encaminhar para o
repositório e para a parceira de infraestrutura. Ele não vende: o software é gratuito.

## A personalidade

Calmo, direto, verificável.

- **Calmo:** neutros quentes, uma tipografia legível, movimento curto. O cobre aparece só no que
  está vivo e na ação principal.
- **Direto:** cada seção responde uma pergunta de quem visita. Seção sem pergunta sai.
- **Verificável:** toda afirmação técnica aponta para o arquivo do repositório onde se confere.

## O que o site nunca faz

- Não promete o que não foi medido: tempo de instalação, tamanho mínimo de máquina, economia.
- Não escreve número social à mão. Estrelas e versão são lidas da fonte, e somem se a leitura falha.
- Não diz que a VPS da parceira é obrigatória, nem esconde que o link é de parceria. O link leva
  `rel="sponsored"` e o endereço é o de `install/partner.env` do produto, letra por letra.
- Não pressupõe que a pessoa sabe o que é um servidor, SSH ou Docker sem dizer o que é ou apontar
  para quem explica.
- Não usa exclamação, superlativo nem adjetivo vazio.
- Não usa cor fora dos tokens do produto. A única exceção é o bloco da parceira, com as cores dela.
- Não facilita nem sugere disparo de ligações em massa.

## Acessibilidade

- Todo o conteúdo está no HTML servido; a interação é uma camada por cima.
- Contraste AA nos dois temas (os tokens vêm do painel, conferidos lá).
- Foco visível, navegação por teclado, ligação "pular para o conteúdo".
- `prefers-reduced-motion` desliga as animações sem esconder o estado.
- Tema claro e escuro seguem o sistema de quem visita.
