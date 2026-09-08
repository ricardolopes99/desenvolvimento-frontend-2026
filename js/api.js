// js/api.js
// Aula 6 / E3 — Desenvolvimento Frontend 2026.2
//
// Responsabilidade única: buscar as tarefas e devolver o array já pronto.
// Não toca no DOM e não decide o que a tela deve mostrar — isso é trabalho
// de js/estados.js. Aqui só existe "buscar dados", nada de "desenhar dados".

/**
 * Erro de protocolo: a requisição chegou ao servidor e ele respondeu,
 * mas com um status que não representa sucesso (404, 500, etc.).
 * Tem nome próprio para poder ser distinguido de erro de rede (TypeError)
 * e de erro de formato (SyntaxError) por erro.name, no catch de quem chamar.
 */
class ErroHTTP extends Error {
  constructor(status) {
    super(`A resposta chegou, mas com status ${status}.`);
    this.name = "ErroHTTP";
    this.status = status;
  }
}

/**
 * Busca o arquivo de tarefas e devolve o array já interpretado.
 * Não faz try/catch aqui dentro — quem chama decide como reagir a cada
 * tipo de falha (rede, protocolo ou formato), então os erros só sobem.
 *
 * @returns {Promise<Array>} o array de tarefas
 */
export async function carregarTarefas() {
  const resposta = await fetch("./dados.json");

  if (!resposta.ok) {
    throw new ErroHTTP(resposta.status);
  }

  const dados = await resposta.json();
  return dados.tarefas;
}
