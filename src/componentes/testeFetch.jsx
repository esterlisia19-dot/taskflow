
function TesteFetch() {
const minhaPromise = new Promise((resolve, reject) => {

  setTimeout(() => {
    const operacaoDeuCerto = true;

    if (operacaoDeuCerto) {
      resolve("Dados chegaram!");
    } else {
      reject("Algo deu errado");
    }
  }, 5000);
});

function execPromise() {
  const minhaPromise = new Promise ((resolve, reject) => {

    setTimeout(() => {
      const operacaoDeuCerto = true; 
      
      
      if(operacaoDeuCerto) {
        resolve("Dados chegaram!");
      } else {
        reject("Algo deu errado");
      }
    }, 5000);
  });
  

   minhaPromise
    .then((mensagem) => {
      console.log("sucesso:", mensagem);
    })
    .catch((erro) => {
      console.error("Erro:", erro);
    });
  console.log("Promise criada, aguardando resultado...")
}
async function buscarUsuario(id) {
  try {
    const resposta = await fetch (
      'https://jsonplaceholder.typicode.com/users/' + id
    );
    const usuario = await resposta.json();
    console.log(usuario);
    console.log('Nome:', usuario.name);
    return usuario;
    
  } catch (erro) {
    console.log('Erro:', erro.massage);
    return null; 
  
  
  } finally {
    console.log('Finalizado');
  }
}



 return (
   <div>
     <button 
      onClick={() => {
       minhaPromise
         .then((mensagem) => {
           console.log("sucesso:", mensagem);
          })
          .catch((erro) => {
            console.error("Erro:", erro);
          });
      console.log("Promise criada, aguardando resultado...");
    }}
    >
      Testar Promisse
      </button>
      <button onClick={execPromise}>Testar Promise (função)</button>
      <button onClick={() => buscarUsuario(1)}>Testar Async/Await</button>
   </div>
 );
}
export default TesteFetch; 
