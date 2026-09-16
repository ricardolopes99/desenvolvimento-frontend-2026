// js/main.js

import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { estado } from "./estado.js";

const campoBusca = document.querySelector("#busca-titulo");
const filtrosStatus = document.querySelectorAll(
  'input[name="filtro-status"]'
);
const filtrosPrioridade = document.querySelectorAll(
  'input[name="filtro-prioridade"]'
);
const campoOrdenacao = document.querySelector("#ordenacao");
const botaoLimpar = document.querySelector("#limpar-filtros");
const contagemVisivel = document.querySelector("#contagem-visivel");

function obterTarefasVisiveis() {
  let tarefas = [...estado.tarefas];

  // Busca pelo título
  if (estado.busca.trim() !== "") {
    const textoBusca = estado.busca.toLowerCase().trim();

    tarefas = tarefas.filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(textoBusca)
    );
  }

  // Filtro por status
  if (estado.status !== "todos") {
    tarefas = tarefas.filter(
      (tarefa) => tarefa.status === estado.status
    );
  }

  // Filtro por prioridade
  if (estado.prioridade !== "todas") {
    tarefas = tarefas.filter(
      (tarefa) => tarefa.prioridade === estado.prioridade
    );
  }

  // Ordenação por prazo
  tarefas.sort((a, b) => {
    const prazoA = new Date(a.prazo);
    const prazoB = new Date(b.prazo);

    if (estado.ordenacao === "prazo-desc") {
      return prazoB - prazoA;
    }

    return prazoA - prazoB;
  });

  return tarefas;
}

function atualizarInterface() {
  const tarefasVisiveis = obterTarefasVisiveis();

  contagemVisivel.textContent =
    `${tarefasVisiveis.length} tarefa(s) encontrada(s).`;

  if (tarefasVisiveis.length === 0) {
    renderizarEstado("vazio");
  } else {
    renderizarEstado("sucesso", tarefasVisiveis);
  }
}

function configurarEventos() {
  campoBusca.addEventListener("input", (evento) => {
    estado.busca = evento.target.value;
    atualizarInterface();
  });

  filtrosStatus.forEach((filtro) => {
    filtro.addEventListener("change", (evento) => {
      estado.status = evento.target.value;
      atualizarInterface();
    });
  });

  filtrosPrioridade.forEach((filtro) => {
    filtro.addEventListener("change", (evento) => {
      estado.prioridade = evento.target.value;
      atualizarInterface();
    });
  });

  campoOrdenacao.addEventListener("change", (evento) => {
    estado.ordenacao = evento.target.value;
    atualizarInterface();
  });

  botaoLimpar.addEventListener("click", () => {
    estado.busca = "";
    estado.status = "todos";
    estado.prioridade = "todas";
    estado.ordenacao = "prazo-asc";

    campoBusca.value = "";

    document.querySelector("#status-todos").checked = true;
    document.querySelector("#prioridade-todas").checked = true;

    campoOrdenacao.value = "prazo-asc";

    atualizarInterface();
  });
}

async function iniciar() {
  estado.carregamento = "carregando";
  estado.erro = null;

  renderizarEstado("carregando");

  try {
    const tarefas = await carregarTarefas();

    estado.tarefas = tarefas;

    if (estado.tarefas.length === 0) {
      estado.carregamento = "vazio";
      renderizarEstado("vazio");
    } else {
      estado.carregamento = "sucesso";
      configurarEventos();
      atualizarInterface();
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