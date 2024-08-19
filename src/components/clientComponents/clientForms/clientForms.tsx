// FormularioModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import './clientForms.css';
import { createClient, updateClient, verificarCpf } from '../../services/clientService';
import Alert from '../../alert/alert';

Modal.setAppElement('#root');

interface FormularioModalProps {
  isVisible: boolean;
  onClose: () => void;
  client: any;
  isEditing: boolean;
  loadClients: () => void;
}

const FormularioModal: React.FC<FormularioModalProps> = ({
  isVisible,
  onClose,
  client,
  isEditing,
  loadClients,
}) => {
  const [name, setName] = useState(client?.name || '');
  const [cpf, setCpf] = useState(client?.cpf || '');
  const [telefone, setTelefone] = useState(client?.telefone || '');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleCpfMask = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  const handleTelefoneMask = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }, []);

  useEffect(() => {
    setCpf(handleCpfMask(client?.cpf || ''));
    setTelefone(handleTelefoneMask(client?.telefone || ''));
  }, [client, handleCpfMask, handleTelefoneMask]);

  const validateInputs = useCallback(() => {
    if (!name || !cpf || !telefone) {
      setAlertMessage('Preencha todos os campos!');
      return false;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      setAlertMessage('CPF deve ter 11 dígitos!');
      return false;
    }

    if (telefone.replace(/\D/g, '').length !== 11) {
      setAlertMessage('Telefone deve ter 11 dígitos!');
      return false;
    }

    return true;
  }, [name, cpf, telefone]);

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      if (!isEditing) {
        const cpfExists = await verificarCpf(cpf);
        if (cpfExists) {
          setAlertMessage('CPF já cadastrado!');
          return;
        }
      }

      const data = {
        name,
        cpf,
        telefone,
      };

      if (isEditing) {
        await updateClient(client.cpf, data);
      } else {
        await createClient(data);
      }

      loadClients();
      setName('');
      setCpf('');
      setTelefone('');
      onClose();
    } catch (error) {
      console.error(error);
      setAlertMessage('Oops... algo deu errado. Tente novamente.');
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      className="modal-clientes"
      overlayClassName="modal-clientes-overlay"
    >
      <div className="modal-clientes-header">
        <h2>{isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
        <button onClick={onClose} className="close-btn" aria-label="Fechar modal">
          &times;
        </button>
      </div>
      <div className="modal-clientes-form">
        <input
          placeholder="Nome..."
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          aria-label="Nome do cliente"
        />
        <input
          placeholder="CPF..."
          value={cpf}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(handleCpfMask(e.target.value))}
          disabled={isEditing}
          style={isEditing ? { color: '#00B4FF80' } : {}}
          aria-label="CPF do cliente"
        />
        <input
          placeholder="Telefone..."
          value={telefone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone(handleTelefoneMask(e.target.value))}
          aria-label="Telefone do cliente"
        />
        <div className="form-buttons">
          <button onClick={handleSubmit} style={{ backgroundColor: '#00B4FF' }}>
            Salvar
          </button>
        </div>
      </div>
      {alertMessage && <Alert message={alertMessage} onClose={handleAlertClose} />}
    </Modal>
  );
};

export default FormularioModal;