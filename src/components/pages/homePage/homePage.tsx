// src/components/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './homePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste, faUser, faStore } from '@fortawesome/free-solid-svg-icons';

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container">
      <h1>CRUD CLIENTES</h1>
      <p>Bem vindo a página inicial do CRUD de clientes!</p>
      <div className='home-menu'>
      <Link to="/clients">
        <button className="navigate-button"><FontAwesomeIcon icon={faUser}/></button>

      </Link>
      <Link to="/purchases">
        <button className="navigate-purchase-button"><FontAwesomeIcon icon={faStore} /></button>
      </Link>
      </div>
      <Link to="/reports">
        <button className="report-button"><FontAwesomeIcon icon={faPaste} /></button>
      </Link>
    </div>
  );
};

export default HomePage;
