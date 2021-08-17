import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../contexts/auth';

import { DefaultContainer } from '../../components/DefaultContainer';
import { BoxLogo, Username, Password, Button } from './styles';

function Login() {
  const { signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const showLoginError = () => {
    toast.error('Usuário ou Senha incorretos', {
      position: "top-right",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const signed = await signIn(username, password);
    if(!signed){
      showLoginError();
      setIsSubmitting(false);
    }
  }

  return (
    <DefaultContainer center>
      <BoxLogo />
    
      <Username onChange={event => setUsername(event.target.value)} />
      <Password onChange={event => setPassword(event.target.value)} />
      <Button onClick={handleLogin} disabled={isSubmitting || username==="" || password===""}>ACESSAR</Button>

    </DefaultContainer>

  )
}

export default Login;