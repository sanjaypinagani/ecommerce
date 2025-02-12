import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {LoginContextProvider} from './context/LoginContext'
import { CartContextProvider } from './context/CartContex';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartContextProvider>
    <LoginContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </LoginContextProvider>
  </CartContextProvider>
);

