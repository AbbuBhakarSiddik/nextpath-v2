import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css'; // Custom styles for the intro page
import './styles/Register.css'; // Custom styles for the register page
import App from './App';
import reportWebVitals from './reportWebVitals';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

      <BrowserRouter>
        <App />
      </BrowserRouter>

  </React.StrictMode>
);

reportWebVitals();
