// src/components/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './homePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste } from '@fortawesome/free-solid-svg-icons';

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container">
      <h1>CRUD CLIENTES</h1>
      <p>Bem vindo a página inicial do CRUD de clientes!</p>
      <Link to="/clients">
        <button className="navigate-button">Ver cadastro de clientes</button>
      </Link>
      <Link to="/reports">
        <button className="report-button"><FontAwesomeIcon icon={faPaste} /></button>
      </Link>
    </div>
  );
};

export default HomePage;
