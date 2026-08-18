import axios from "axios";
import { useState } from "react";


function TesteAxios() {
  const [cep, setCep] = useState(""); 


  async function exemplo() {
    try {

      const resposta = await axios.get(
        'https://jsonplaceholder.typicode.com/users/1'
      );

      
      console.log('Response', resposta);
      console.log('Response Data', resposta.data);
      console.log(resposta.data.name); 
    } catch (erro) {
      console.log(erro.message);
    }
  }



    async function consultaCEP() {
   try {
    const resposta = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`);
    
     console.log('CEP Data', resposta.data);
    }   catch (erro) {
      console.log(erro.message);
    }
}
return (
  <div>
    <button onClick={exemplo}>Testar Axios</button>
       <br/>
    <input 
    type="text"
    placeholder="Digite o CEP"
    value={cep}
    onChange={(e) => setCep(e.target.value)}
/>
    <button onClick={() => consultaCEP(cep)}>Consultar CEP</button>
    
    </div>
    
    );
}

export default TesteAxios;