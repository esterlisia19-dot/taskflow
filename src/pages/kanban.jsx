import Header from '../componentes/Header';
import ListaTarefas from '../componentes/ListaTarefas';
import Contador from '../componentes/Contador';
import { useState, useEffect } from 'react';
import axios from "axios";


function Kanban() {
  const [proximaId, setProximaId] = useState(1);
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return [];
    const tarefasConvertidas = JSON.parse(tarefasSalvas);
    setProximaId(
      tarefasConvertidas[tarefasConvertidas.length - 1]?.id + 1 || 1,
    );
    return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
  });

  const [texto, setTexto] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [cep, setCep] = useState("");


  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const consultarCidade = async (cep) => {
    if (cep.trim() === "") return;
    try {

      const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (resposta.data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      return resposta.data.localidade
        ? resposta.data.localidade + "/" + resposta.data.uf : "-";
    } catch (erro) {
      alert("Erro ao consultar CEP: " + erro.message);
    }
  };


  const adicionarTarefa = async () => {
    if (texto.trim() === "") return;
    if (cep.trim() === "") return;

    const cidade = await consultarCidade(cep);

    const novaTarefa = {
      id: proximaId,
      texto: texto,
      cidade: cidade,
      concluida: false,
      prioridade: prioridade,
      coluna: "afazer",
    };

    setTarefas([...tarefas, novaTarefa]);
    setProximaId(proximaId + 1);
    setTexto("");
    setPrioridade("media");
  };

  const deletarTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };
  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      )
    );
  };

  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, coluna: novaColuna }
          : tarefa,
      ),
    );
  };

  return (
    <>
      <Header titulo="TaskFlow" subtitulo="Gerencie suas tarefas" tarefas={tarefas} />

      <main className="container">
        <section id="formulario">
          <div className="campo-linha">
            <input
              id="input-tarefa"
              type="text"
              placeholder="Nova tarefa..."
              required
              autoComplete="off"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />

            < select
              id="sel-prioridade"
              value={prioridade}
              onChange={e => setPrioridade(e.target.value)}
            >
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>
            <button id="btn-adicionar" type="button" onClick={adicionarTarefa}>
              Adicionar
            </button>
          </div>
        </section>

        <div className="kanban-quadro">
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "afazer").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "andamento").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "concluido").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
      </main>

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Prof. Alan Glei &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban; 
