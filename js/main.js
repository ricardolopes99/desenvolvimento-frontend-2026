// js/main.js
// E3 — Desenvolvimento Frontend 2026.2
//
// Ponto de entrada. Aqui, e só aqui, mora a decisão de qual estado vale em
// cada momento — os outros módulos só executam o que este decide.

import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

async function iniciar() {
  // O estado de carregando é aplicado ANTES do await, não depois: se fosse
  // depois, uma resposta lenta deixaria a tela em branco até a Promise
  // resolver, exatamente o problema que o teste de "Slow 4G" expõe.
  renderizarEstado("carregando");

  try {
    const tarefas = await carregarTarefas();

    // Vazio é um resultado de sucesso (a pergunta foi respondida, a resposta
    // é "nenhuma tarefa"), não uma falha — por isso mora aqui, não no catch.
    if (tarefas.length === 0) {
      renderizarEstado("vazio");
    } else {
      renderizarEstado("sucesso", tarefas);
    }
  } catch (erro) {
    let mensagem;

    if (erro.name === "TypeError") {
      // fetch só rejeita a própria Promise em falha de rede/CORS/DNS —
      // nunca por causa de um status HTTP, mesmo 4xx ou 5xx.
      mensagem = "falha de rede. Verifique sua conexão e tente novamente.";
    } else if (erro.name === "SyntaxError") {
      // response.json() rejeitou: o corpo da resposta não é JSON válido.
      mensagem = "os dados recebidos não estão em um formato válido.";
    } else if (erro.name === "ErroHTTP") {
      // Lançado por js/api.js quando response.ok é false.
      mensagem = `o servidor respondeu com status ${erro.status}.`;
    } else {
      mensagem = erro.message || "ocorreu um erro inesperado.";
    }

    renderizarEstado("erro", mensagem);
  }
}

// Nenhum await de nível superior: a inicialização roda dentro de uma
// função async, chamada aqui de forma "solta" (fire-and-forget).
iniciar();
