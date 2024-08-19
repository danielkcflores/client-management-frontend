// AddressFormModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import './addressForms.css';
import { createAddress, updateAddress } from '../../services/addressService';
import Alert from '../../alert/alert';

Modal.setAppElement('#root');

interface CreateAddress {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

interface Address extends CreateAddress {
  id: string;  // id é obrigatório aqui
}

interface AddressFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  address: Address | null;
  isEditing: boolean;
  loadAddresses: () => void;
  clientId: string;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isVisible,
  onClose,
  address,
  isEditing,
  loadAddresses,
  clientId,
}) => {
  const [rua, setRua] = useState(address?.rua || '');
  const [numero, setNumero] = useState(address?.numero || '');
  const [bairro, setBairro] = useState(address?.bairro || '');
  const [cidade, setCidade] = useState(address?.cidade || '');
  const [uf, setUf] = useState(address?.uf || '');
  const [cep, setCep] = useState(address?.cep || '');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleCepMask = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  }, []);

  const validateInputs = useCallback(() => {
    if (!rua || !numero || !bairro || !cidade || !uf || !cep) {
      setAlertMessage('Preencha todos os campos!');
      return false;
    }

    if (uf.length !== 2) {
      setAlertMessage('UF deve ter 2 dígitos!');
      return false;
    }

    if (cep.replace(/\D/g, '').length !== 8) {
      setAlertMessage('CEP deve ter 8 dígitos!');
      return false;
    }

    return true;
  }, [rua, numero, bairro, cidade, uf, cep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    const addressData: CreateAddress = { rua, numero, bairro, cidade, uf, cep }; // `id` não é necessário para criação

    try {
      if (isEditing && address?.id) {
        await updateAddress(clientId, address.id, addressData);
      } else {
        await createAddress(clientId, addressData);
      }
      loadAddresses();
      onClose();
    } catch (error) {
      console.error('Error saving address', error);
      setAlertMessage('Oops... algo deu errado. Tente novamente.');
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  useEffect(() => {
    if (address) {
      setRua(address.rua);
      setNumero(address.numero);
      setBairro(address.bairro);
      setCidade(address.cidade);
      setUf(address.uf);
      setCep(address.cep);
    }
  }, [address]);

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      className="modal-addresses"
      overlayClassName="modal-addresses-overlay"
    >
      <div className="modal-addresses-header">
        <h2>{isEditing ? 'Editar Endereço' : 'Cadastrar Endereço'}</h2>
        <button onClick={onClose} className="close-btn" aria-label="Fechar modal">
          &times;
        </button>
      </div>
      <div className="modal-addresses-form">
        <form onSubmit={handleSubmit} className="address-form">
          <input
            type="text"
            placeholder="Rua"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            aria-label="Rua"
          />
          <input
            type="text"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            aria-label="Número"
          />
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            aria-label="Bairro"
          />
          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            aria-label="Cidade"
          />
          <input
            type="text"
            placeholder="UF"
            value={uf}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.toUpperCase();
              if (value.length <= 2) {
                setUf(value);
              }
            }}
            aria-label="UF"
          />
          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value.replace(/\D/g, '').length <= 8) {
                setCep(handleCepMask(value));
              }
            }}
            aria-label="CEP"
          />
          <div className="form-buttons">
            <button type="submit">{isEditing ? 'Atualizar' : 'Cadastrar'}</button>
          </div>
        </form>
      </div>
      {alertMessage && <Alert message={alertMessage} onClose={handleAlertClose} />}
    </Modal>
  );
};

export default AddressFormModal;