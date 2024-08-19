// src/components/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './homePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container">
      <h1>Home Page</h1>
      <p>Bem vindo a página inicial do CRUD de clientes!</p>
      <Link to="/clients">
        <button className="navigate-button">Ver cadastro de clientes</button>
      </Link>
    </div>
  );
};

export default HomePage;
