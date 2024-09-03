import React, { useState } from 'react';
import './clientTable.css';
import FormularioModal from '../clientForms/clientForms';
import { deleteClient } from '../../../services/clientService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTrash, faPersonBreastfeeding, faMapMarkerAlt, faWrench } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../alert/alert';

interface ClientTableProps {
  loadClients: () => void;
  clientes: Array<any>;
}

const ClientTable: React.FC<ClientTableProps> = ({ loadClients, clientes }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleEdit = (cliente: any) => {
    setEditingClient(cliente);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingClient(null);
  };

  const handleDelete = async (clienteCpf: string) => {
    if (window.confirm('Deseja realmente excluir o cliente?')) {
      try {
        const result = await deleteClient(clienteCpf);
        if (!result.status) {
          setAlertMessage(result.mensagem);
        } else {
          loadClients();
        }
      } catch (error) {
        console.error('Erro ao excluir o cliente:', error);
        setAlertMessage('Ocorreu um erro ao excluir o cliente.');
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  return (
    <div className="table-container">
      <h2 className="table-header">CLIENTES</h2>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">Nome</div>
          <div className="table-cell">CPF</div>
          <div className="table-cell">Ações</div>
        </div>
        {clientes.map((cliente, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">{cliente.name}</div>
            <div className="table-cell">{cliente.cpf}</div>
            <div className="table-cell">
              <Link 
                to="/telephones" 
                state={{ id: cliente.id, name: cliente.name }}
              >
                <button className="client-link-telephone"><FontAwesomeIcon icon={faPhone} /></button>
              </Link>
              <Link 
                to="/dependents" 
                state={{ id: cliente.id, name: cliente.name }}
              >
                <button className="client-link-dependents"><FontAwesomeIcon icon={faPersonBreastfeeding} /></button>
              </Link>
              <Link 
                to="/enderecos" 
                state={{ id: cliente.id, name: cliente.name }}
              >
                <button className="client-link-address"><FontAwesomeIcon icon={faMapMarkerAlt} /></button>
              </Link>
              <button className="client-edit-btn" onClick={() => handleEdit(cliente)}><FontAwesomeIcon icon={faWrench} /></button>
              <button className="client-delete-btn" onClick={() => handleDelete(cliente.cpf)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          </div>
        ))}
      </div>
      {isModalVisible && (
        <FormularioModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          client={editingClient}
          isEditing={true}
          loadClients={loadClients}
        />
      )}
      {alertMessage && (
        <Alert
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default ClientTable;
