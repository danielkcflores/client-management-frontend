// clientPage.tsx
import React, { useState, useEffect } from 'react';
import { getClients, searchClientes } from '../../services/clientService';
import FormularioModal from '../../clientComponents/clientForms/clientForms';
import ClientTable from '../../clientComponents/clientTable/clientTable';
import './clientPage.css'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPaste } from '@fortawesome/free-solid-svg-icons';

const ClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [clientes, setClientes] = useState<Array<any>>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOrderClick = () => {
    const sortedClients = [...clientes].sort((a, b) => {
      return order === 'asc'
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setClientes(sortedClients);
  };

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClientes(response);
    } catch (error) {
      console.error('Failed to load clients', error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = searchText
          ? await searchClientes(searchText)
          : await getClients();
        setClientes(response);
      } catch (error) {
        console.error('Error fetching clients', error);
      }
    };
    fetchClients();
  }, [searchText]);

  return (
    <div className="app-container">
      <div className="client-menu">
        <button onClick={() => navigate(-1)} className="back-client-button">
          <FontAwesomeIcon icon={faHome} />
        </button>
      </div>
      <header className="header">
        <h1 className="header-text">GERENCIAMENTO DE CLIENTES</h1>
      </header>
      <div className="header-buttons">
        <button onClick={handleOrderClick}
          style={{ backgroundColor: '#F4D000', borderColor: '#F4D000', whiteSpace: 'nowrap' }}>
          A - Z
        </button>
        <button onClick={toggleModal}>
          Cadastrar
        </button>
        <input
          placeholder="Pesquise um cliente..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ color: '#00B4FF' }}
        />
      </div>
      <ClientTable loadClients={loadClients} clientes={clientes} />
      <FormularioModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        client={null}
        isEditing={false}
        loadClients={loadClients}
      />
      <Link to="/reports">
        <button className="report-button"><FontAwesomeIcon icon={faPaste} /></button>
      </Link>
    </div>
  );
};

export default ClientPage;