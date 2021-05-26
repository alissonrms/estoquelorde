import React from 'react';
import { toast } from 'react-toastify';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';

import Routes from './routes';

toast.configure();

function App() {
  return (
    <Routes />
  )
}

export default App;