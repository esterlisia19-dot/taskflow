import ModalTarefa from '../componentes/ModalTarefa';

const [modalAberto, setModalAberto] = useState(false);
const [tarefaEditando, setTarefaEditando] = useState(null);
const [colunaAtiva, setColunaAtiva] = useState('afazer');

function abrirModalCriar(coluna) {
 setTarefaEditando(null); 
 setColunaAtiva(coluna);
 setModalAberto(true);
}
function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
}
function salvarTarefa(dados) {
    if(dados.id) {
        setTarefas(tarefas.map(t => 
            t.id === dados.id ? { ...t, ...dados } : tarefaEditando
        ));
    } else {
        setTarefas([...tarefas, { ...dados, id: Date.now() }]);
    }
}
<div className='kanban-coluna-header'>
    <h3> A Fazer </h3>
    <div style={{ display: 'flex', gap:'8px', alignItems:'center'}}>
        <span className='kanban-contador'>
            {tarefas.filter(t => t.coluna === 'afazer') .length}
        </span>
        <button classeName='kanban-btn-add'
        onClick={ () => abrirModalCriar('afazer')}>
            +
        </button>
    </div>
</div>

<ListaTarefas 
    tarefas={tarefas.filter(t => t.coluna === 'afazer')}
    onDeletar={deletarTarefa}
    onEditar={abrirModalEditar}
    onMover={moverTarefa}
    colunaAnterior={null}
    colunaProxima='andamento'
    />
<ModalTarefa
    aberto={modalAberto}
    onFechar={() => setModalAberto(false)}
    onSalvar={salvarTarefa}
    tarefa={tarefaEditando}
    coluna={colunaAtiva}
    />