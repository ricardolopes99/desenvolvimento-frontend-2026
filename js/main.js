// js/main.js

// E4 — Estado único da aplicação

import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { estado } from "./estado.js";

async function iniciar() {
  // Mostra o estado de carregamento antes de esperar a resposta.
  estado.carregamento = "carregando";
  estado.erro = null;

  renderizarEstado("carregando");

  try {
    // Busca as tarefas através do módulo da API.
    const tarefas = await carregarTarefas();

    // Armazena as tarefas originais no estado único.
    estado.tarefas = tarefas;

    if (estado.tarefas.length === 0) {
      estado.carregamento = "vazio";
      renderizarEstado("vazio");
    } else {
      estado.carregamento = "sucesso";
      renderizarEstado("sucesso", estado.tarefas);
    }
  } catch (erro) {
    let mensagem;

    if (erro.name === "TypeError") {
      mensagem =
        "falha de rede. Verifique sua conexão e tente novamente.";
    } else if (erro.name === "SyntaxError") {
      mensagem =
        "os dados recebidos não estão em um formato válido.";
    } else if (erro.name === "ErroHTTP") {
      mensagem = `o servidor respondeu com status ${erro.status}.`;
    } else {
      mensagem = erro.message || "ocorreu um erro inesperado.";
    }

    estado.carregamento = "erro";
    estado.erro = mensagem;

    renderizarEstado("erro", mensagem);
  }
}

iniciar();