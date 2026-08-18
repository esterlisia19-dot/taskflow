import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import './Login.css';

function Login() {
 const {login} = useAuth(); 

 const [usuario, setUsuario] = useState('');
 const [senha, setSenha] = useState('');
 const [erro, setErro] = useState('');
 const [shake, setShake] = useState('');
 const navigate = useNavigate();

 function handleLogin() {
    if (usuario === 'admin' && senha === '1234') {
     login(); 
     navigate('/'); 
     return;
     }
    setErro('Usuário ou senha incorretos');
   }


 return (
   <div className='login-container'>
      <div className='login-card'>
         <h1 className='login-logo'>TaskFlow</h1>
      <p className='login-subtitulo'>
         Faça login para continuar
      </p>

    <input 
    className='login-input' 
       type='text'
        placeholder='Usuário' 
        value={usuario}
       onChange={e => setUsuario(e.target.value)} 
      />

    <input 
    className='login-input' 
       type='password'
        placeholder='Senha' 
        value={senha}
       onChange={e => setSenha(e.target.value)}
       onKeyDown={e => e.key === 'Enter' && handleLogin()}
      />


      {erro && <p 
    className='login-erro'>{erro}</p>}

    <button className='login-btn' onClick={handleLogin}>
      Entrar
   </button>

   <p className='login-aviso'>
            Este login é apenas para fins didáticos.
            Credenciais reais vêm no módulo back-end.
          </p>
        </div>
      </div>

   );
}
export default Login;




































