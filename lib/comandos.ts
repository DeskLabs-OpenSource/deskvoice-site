/**
 * Os comandos que o site mostra. São cópia do kit de instalação do produto, e
 * tests/paridade.test.ts reprova qualquer um que não seja, letra por letra, uma linha de comando na main de lá.
 */
export const INSTALAR_EM_UMA_LINHA = "curl -fsSL https://raw.githubusercontent.com/DeskLabs-OpenSource/DeskVoice/main/install/get.sh | bash";
export const INSTALAR_PASSO_A_PASSO = "git clone https://github.com/DeskLabs-OpenSource/DeskVoice.git && cd DeskVoice && bash install/install.sh";
export const ANTES_DO_SERVIDOR = "curl -fsSL https://raw.githubusercontent.com/DeskLabs-OpenSource/DeskVoice/main/install/start.sh | bash";
export const DEMO = "git clone https://github.com/DeskLabs-OpenSource/DeskVoice.git && cd DeskVoice\npnpm install && pnpm demo";
export const PEDIDO_AO_ASSISTENTE = "Me ajude a instalar o DeskVoice: https://github.com/DeskLabs-OpenSource/DeskVoice\nLeia o AGENTS.md do repositório e siga a skill deskvoice-instalar.";
export const ATUALIZAR = "bash install/update.sh";
export const CONFERIR_SAUDE = "bash install/healthcheck.sh";
export const VERIFICAR_ANTES_DO_PR = "pnpm verify";
export const DIAGNOSTICAR = "bash install/diagnose.sh";
export const RODAR_DEMO = "pnpm install && pnpm demo";

export const TODOS = [INSTALAR_EM_UMA_LINHA, INSTALAR_PASSO_A_PASSO, ANTES_DO_SERVIDOR, DEMO, PEDIDO_AO_ASSISTENTE, ATUALIZAR, CONFERIR_SAUDE, VERIFICAR_ANTES_DO_PR, DIAGNOSTICAR, RODAR_DEMO];
