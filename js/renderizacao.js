// js/renderizacao.js
// Aulas 5-6 — Desenvolvimento Frontend 2026.2
//
// Responsabilidade única: transformar um array de tarefas em cartões dentro
// das colunas de status que já existem no HTML. Não sabe de onde os dados
// vieram (array local, fetch, o que for) e não faz nenhuma requisição.
//
// A partir da E3, este arquivo não deve mais ser alterado: qualquer mudança
// na origem dos dados tem que ser resolvida em outro módulo, sem tocar aqui.

const colunasPorStatus = {
  "a-fazer": document.querySelector(".coluna-status--a-fazer .lista-tarefas"),
  "em-andamento": document.querySelector(".coluna-status--em-andamento .lista-tarefas"),
  "em-revisao": document.querySelector(".coluna-status--em-revisao .lista-tarefas"),
  "concluida": document.querySelector(".coluna-status--concluida .lista-tarefas"),
};

const rotulosPrioridade = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

function criarCartao(tarefa) {
  const item = document.createElement("li");

  const artigo = document.createElement("article");
  artigo.className = "cartao";
  artigo.setAttribute("aria-labelledby", `tarefa-${tarefa.id}-titulo`);

  const titulo = document.createElement("h3");
  titulo.id = `tarefa-${tarefa.id}-titulo`;
  titulo.textContent = tarefa.titulo;

  const projeto = document.createElement("p");
  projeto.textContent = `Projeto: ${tarefa.projeto ?? "—"}`;

  const responsavel = document.createElement("p");
  responsavel.textContent = `Responsável: ${tarefa.responsavel ?? "—"}`;

  const prioridade = document.createElement("p");
  const rotuloPrioridade = rotulosPrioridade[tarefa.prioridade] ?? tarefa.prioridade;
  prioridade.className = `cartao__prioridade cartao__prioridade--${tarefa.prioridade}`;
  prioridade.textContent = `Prioridade: ${rotuloPrioridade}`;

  const prazo = document.createElement("p");
  prazo.className = "cartao__prazo";
  prazo.textContent = `Prazo: ${tarefa.prazo}`;

  // Ordem real no DOM: título, projeto, responsável, prioridade, prazo.
  // A ordem visual final é decidida pelo CSS (propriedade order dos itens).
  artigo.append(titulo, projeto, responsavel, prioridade, prazo);
  item.appendChild(artigo);
  return item;
}

/**
 * Desenha o array de tarefas nas colunas de status.
 * Cada chamada sincroniza o conteúdo das colunas com o array recebido:
 * replaceChildren descarta os cartões antigos e põe os novos no lugar,
 * em vez de ir acumulando cartões a cada chamada.
 *
 * @param {Array<{id:string, titulo:string, status:string, prioridade:string, prazo:string}>} tarefas
 */
export function renderizarTarefas(tarefas) {
  Object.values(colunasPorStatus).forEach((lista) => {
    lista?.replaceChildren();
  });

  tarefas.forEach((tarefa) => {
    const lista = colunasPorStatus[tarefa.status];
    if (!lista) return;
    lista.appendChild(criarCartao(tarefa));
  });
}
