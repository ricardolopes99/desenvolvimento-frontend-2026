// js/estados.js
// E3 — Desenvolvimento Frontend 2026.2
//
// Responsabilidade única: decidir qual das quatro telas está valendo
// (carregando, sucesso, vazio, erro) e desenhá-la. Não faz nenhuma
// requisição — quem chamou já decidiu, antes de chamar, qual estado é este.

import { renderizarTarefas } from "./renderizacao.js";

const quadro = document.getElementById("quadro-status");
const mensagem = document.getElementById("mensagem-estado");
const regiaoStatus = document.getElementById("regiao-status");

const classesDeEstado = [
  "mensagem-estado--carregando",
  "mensagem-estado--vazio",
  "mensagem-estado--erro",
];

function mostrarMensagem(texto, classeModificadora) {
  quadro.hidden = true;
  mensagem.hidden = false;
  mensagem.classList.remove(...classesDeEstado);
  if (classeModificadora) mensagem.classList.add(classeModificadora);
  mensagem.textContent = texto;
}

function mostrarQuadro() {
  mensagem.hidden = true;
  mensagem.classList.remove(...classesDeEstado);
  quadro.hidden = false;
}

/**
 * @param {"carregando"|"sucesso"|"vazio"|"erro"} estado
 * @param {Array|string} [dados] array de tarefas no sucesso, texto da causa no erro
 */
export function renderizarEstado(estado, dados) {
  switch (estado) {
    case "carregando": {
      const texto = "Carregando tarefas…";
      mostrarMensagem(texto, "mensagem-estado--carregando");
      regiaoStatus.textContent = texto;
      break;
    }

    case "sucesso": {
      mostrarQuadro();
      renderizarTarefas(dados);
      regiaoStatus.textContent = `${dados.length} ${
        dados.length === 1 ? "tarefa carregada" : "tarefas carregadas"
      }.`;
      break;
    }

    case "vazio": {
      const texto = "Nenhuma tarefa cadastrada no momento.";
      mostrarMensagem(texto, "mensagem-estado--vazio");
      regiaoStatus.textContent = texto;
      break;
    }

    case "erro": {
      const texto = `Não foi possível carregar as tarefas: ${dados}`;
      mostrarMensagem(texto, "mensagem-estado--erro");
      regiaoStatus.textContent = texto;
      break;
    }

    default:
      throw new Error(`Estado desconhecido: ${estado}`);
  }
}
