import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api';

import { Container, BoxLogo, Username, Password, Button } from './styles';

function Login() {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const showLoginError = () => {
    toast.error('Usuário ou Senha incorretos', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await api.post('session', { username, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id', response.data.id);
      history.push('/faturamento');
    } catch (err) {
      showLoginError();
    }
  }

  return (
    <Container>
      <BoxLogo />

      <Username onChange={event => setUsername(event.target.value)} />
      <Password onChange={event => setPassword(event.target.value)} />
      <Button onClick={handleLogin}>ACESSAR</Button>
    </Container>
  )
}

export default Login;