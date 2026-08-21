// teste ok!!! aaaaaa
import Header from '../componentes/Header';
import ListaTarefas from '../componentes/ListaTarefas';
import { useState, useEffect } from 'react';
import axios from "axios";

const URL_API = 'https://[seu-id].mockapi.io/tarefas';

function Kanban() {

    const [tarefas, setTarefas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [texto, setTexto] = useState('');
    const [prioridade, setPrioridade] = useState('media');
    const [cep, setCep] =useState('');
    
    useEffect(() => {
      async function carregarTarefas() {
        try {
          setCarregando(true);
          setErro('');

          const resposta = await axios.get(URL_API);

          setTarefas(resposta.data);

        } catch (e) {
          setErro('Erro ao carregar tarefas. Verifique a conexão.');
          console.error(e);
        } finally {
          setCarregando(false);
        }
      }
      carregarTarefas();
    }, []);

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
  }


  async function salvarTarefa(dados) {
    try {
      if (dados.id !== undefined) {
        const {data: tarefaEditada} = await axios.put(URL_API + '/' + dados.id,
          {
            texto: dados.texto,
            prioridade: dados.prioridade,
            cidade: dados.cidade,
            coluna: dados.coluna,
          }
        );
        setTarefas(tarefasAtuais => tarefasAtuais.map(t => t.id === dados.id ? 
          tarefaEditada : t));
      } else {
        const { data: novaTarefa } = await axios.post(URL_API, dados);
        setTarefas(tarefasAtuais => [...tarefasAtuais, novaTarefa]);
      }
    } catch (e) {
      setErro('Erro ao salvar tarefa.');
      console.log(e);
    }
  }

  async function deletarTarefa(id) {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;
    try {
      await axios.delete(URL_API +'/' + id);

      setTarefas(tarefasAtuais => 
        tarefasAtuais.filter(t => t.id !== id)
      );
    } catch (e) {
      setErro('Erro ao deletar tarefa. Tente novamente.');
      console.error(e);
    }
  }

  async function moverTarefa(id, novaColuna) {
    try {
      const { data: tarefaMovida } = await axios.patch(
        URL_API + '/' + id,
        {coluna: novaColuna}
      );

      setTarefas(tarefasAtuais => 
        tarefasAtuais.map(t => 
          t.id === id ? tarefaMovida : t
        )
      );
    } catch (e) {
      setErro('Erro ao mover tarefa. Tente novamente.');
      console.error(e);
    }
  }
 
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
          {carregando && (<p style={{ textAlign: 'center', color:'#94A3B8'
          }}>Carregando tarefas...</p>)}
            {erro && (<p style={{ textAlign:'center', 
            color:'#EF4444'}}>{erro}</p>)}
              {!carregando && !erro && (

        <div className='kanban-quadro'>
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
