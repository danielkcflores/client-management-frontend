import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAddresses, searchAddresses } from '../../services/addressService';
import AddressFormModal from '../../addressComponents/addressForms/addressForms';
import AddressTable from '../../addressComponents/addressTable/addressTable';
import './addressPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

interface Address {
  id: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

const AddressPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: clientId, name: clientName } = location.state || {};
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const toggleModal = () => setIsModalVisible(prev => !prev);

  const handleOrderClick = () => {
    const sortedAddresses = [...addresses].sort((a, b) => 
      order === 'asc'
        ? b.rua.localeCompare(a.rua)
        : a.rua.localeCompare(b.rua)
    );
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setAddresses(sortedAddresses);
  };

  const loadAddresses = async (clientId: string): Promise<void> => {
    try {
      const response: Address[] = await getAddresses(clientId);
      setAddresses(response);
    } catch (error: unknown) {
      console.error('Failed to load addresses', error);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = searchText
          ? await searchAddresses(clientId ?? '', searchText)
          : await getAddresses(clientId ?? '');
        setAddresses(response);
      } catch (error) {
        console.error('Error fetching addresses', error);
      }
    };
    fetchAddresses();
  }, [clientId, searchText]);

  return (
    <div className="app-container">
      <div className='address-menu'>
        <button onClick={() => navigate(-2)} className="back-address-button">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button onClick={() => navigate(-1)} className="back-address-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <header className="header">
        <h1 className="header-text">GERENCIAMENTO DE ENDEREÇOS - <span style={{color: '#F4D000'}}>{clientName}</span></h1>
      </header>
      <div className="header-buttons">
        <button onClick={handleOrderClick} style={{ backgroundColor: '#F4D000', borderColor: '#F4D000', whiteSpace: 'nowrap' }}>
          A - Z
        </button>
        <button onClick={toggleModal}>Cadastrar</button>
        <input
          placeholder="Pesquise um endereço..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ color: '#00B4FF' }}
        />
      </div>
      <AddressTable loadAddresses={() => loadAddresses(clientId ?? '')} addresses={addresses} clientId={clientId ?? ''} />
      {isModalVisible && (
        <AddressFormModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          address={null}
          isEditing={false}
          loadAddresses={() => loadAddresses(clientId ?? '')}
          clientId={clientId ?? ''}  
        />
      )}
    </div>
  );
};

export default AddressPage;
