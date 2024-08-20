import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTelephones, searchTelephones } from '../../services/telephoneService';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TelephoneFormModal from '../../telephonesComponents/telephoneForms/telephoneForms';
import TelephoneTable from '../../telephonesComponents/telephoneTable/telephoneTable';
import './telephonePage.css'

interface Telephone {
  id: string;
  numero: string;
}

const TelephonePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: clientId, name: clientName } = location.state || {};

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [telephones, setTelephones] = useState<Telephone[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const toggleModal = () => setIsModalVisible(prev => !prev);

  const handleOrderClick = () => {
    const sortedTelephones = [...telephones].sort((a, b) =>
      order === 'asc'
        ? a.numero.localeCompare(b.numero)
        : b.numero.localeCompare(a.numero)
    );
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setTelephones(sortedTelephones);
  };

  const loadTelephones = async (clientId: string): Promise<void> => {
    try {
      const response: Telephone[] = await getTelephones(clientId);
      setTelephones(response);
    } catch (error: unknown) {
      console.error('Failed to load telephones', error);
    }
  };

  useEffect(() => {
    const fetchTelephones = async () => {
      try {
        const response = searchText
          ? await searchTelephones(clientId ?? '', searchText)
          : await getTelephones(clientId ?? '');
        setTelephones(response);
      } catch (error: unknown) {
        console.error('Error fetching telephones', error);
      }
    };

    fetchTelephones();
  }, [clientId, searchText]);

  return (
    <div className="app-container">
      <div className='telephone-menu'>
        <button onClick={() => navigate(-2)} className="back-telephone-button">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button onClick={() => navigate(-1)} className="back-telephone-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <header className="header">
        <h1 className="header-text">GERENCIAMENTO DE TELEFONES - <span style={{color: '#F4D000'}}>{clientName}</span></h1>
      </header>
      <div className="header-buttons">
        <button onClick={handleOrderClick} style={{ backgroundColor: '#F4D000', borderColor: '#F4D000', whiteSpace: 'nowrap' }}>
          A - Z
        </button>
        <button onClick={toggleModal}>Cadastrar</button>
        <input
          placeholder="Pesquise um telefone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ color: '#00B4FF' }}
        />
        <TelephoneFormModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          telephone={null}
          isEditing={false}
          loadTelephones={() => loadTelephones(clientId ?? '')}
          clientId={clientId ?? ''}
        />
      </div>
      <TelephoneTable 
        loadTelephones={() => loadTelephones(clientId ?? '')}
        telephones={telephones}
        clientId={clientId ?? ''}
      />
    </div>
  );
}

export default TelephonePage;