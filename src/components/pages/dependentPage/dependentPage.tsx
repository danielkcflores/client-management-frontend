import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDependents, searchDependents } from '../../services/dependentService';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DependentFormModal from '../../dependentsComponents/dependentForms/dependentForms'; // Certifique-se de que o caminho está correto
import DependentTable from '../../dependentsComponents/dependentTable/dependentTable'; // Certifique-se de que o caminho está correto
import './dependentPage.css'

interface Dependent {
  id: string;
  nome: string;
}

const DependentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: clientId, name: clientName } = location.state || {};

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const toggleModal = () => setIsModalVisible(prev => !prev);

  const handleOrderClick = () => {
    const sortedDependents = [...dependents].sort((a, b) =>
      order === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome)
    );
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setDependents(sortedDependents);
  };

  const loadDependents = async (clientId: string): Promise<void> => {
    try {
      const response: Dependent[] = await getDependents(clientId);
      setDependents(response);
    } catch (error: unknown) {
      console.error('Failed to load dependents', error);
    }
  };

  useEffect(() => {
    const fetchDependents = async () => {
      try {
        const response = searchText
          ? await searchDependents(clientId ?? '', searchText)
          : await getDependents(clientId ?? '');
        setDependents(response);
      } catch (error: unknown) {
        console.error('Error fetching dependents', error);
      }
    };

    fetchDependents();
  }, [clientId, searchText]);

  return (
    <div className="app-container">
      <div className='dependent-menu'>
        <button onClick={() => navigate(-2)} className="back-dependent-button">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button onClick={() => navigate(-1)} className="back-dependent-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <header className="header">
        <h1 className="header-text">GERENCIAMENTO DE DEPENDENTES - <span style={{color: '#F4D000'}}>{clientName}</span></h1>
      </header>
      <div className="header-buttons">
        <button onClick={handleOrderClick} style={{ backgroundColor: '#F4D000', borderColor: '#F4D000', whiteSpace: 'nowrap' }}>
          A - Z
        </button>
        <button onClick={toggleModal}>Cadastrar</button>
        <input
          placeholder="Pesquise um dependente..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ color: '#00B4FF' }}
        />
        <DependentFormModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          dependent={null}
          isEditing={false}
          loadDependentes={() => loadDependents(clientId ?? '')}
          clientId={clientId ?? ''}
        />
      </div>
      <DependentTable 
        loadDependents={() => loadDependents(clientId ?? '')}
        dependents={dependents}
        clientId={clientId ?? ''}
      />
    </div>
  );
}

export default DependentPage;