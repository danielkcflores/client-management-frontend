import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/pages/homePage/homePage';
import ClientPage from './components/pages/clientPage/clientPage';
import AddressPage from './components/pages/addressPage/addressPage';
import DependentPage from './components/pages/dependentPage/dependentPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/enderecos" element={<AddressPage />} />
        <Route path="/dependents" element={<DependentPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

