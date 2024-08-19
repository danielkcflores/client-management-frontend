import React, { useState } from 'react';
import './addressTable.css';
import AddressFormModal from '../addressForms/addressForms';
import { deleteAddress } from '../../services/addressService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';

interface Address {
  id: string;  // id obrigatório aqui
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

interface AddressTableProps {
  loadAddresses: () => void;
  addresses: Address[];
  clientId: string;  // Adicione `clientId` ao AddressTableProps para garantir que seja passado
}

const AddressTable: React.FC<AddressTableProps> = ({ loadAddresses, addresses, clientId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Deseja realmente excluir o endereço?')) {
      await deleteAddress(clientId, addressId);  // Passar `clientId` e `addressId`
      loadAddresses();
    }
  };

  return (
    <div className="table-address-container">
      <h2 className="table-address-header">ENDEREÇOS</h2>
      <div className="table-address">
        <div className="table-address-row">
          <div className="table-address-cell">Rua</div>
          <div className="table-address-cell">Número</div>
          <div className="table-address-cell">Bairro</div>
          <div className="table-address-cell">Cidade</div>
          <div className="table-address-cell">UF</div>
          <div className="table-address-cell">CEP</div>
          <div className="table-address-cell">Ações</div>
        </div>
        {addresses.map((address) => (
          <div key={address.id} className="table-address-row">
            <div className="table-address-cell">{address.rua}</div>
            <div className="table-address-cell">{address.numero}</div>
            <div className="table-address-cell">{address.bairro}</div>
            <div className="table-address-cell">{address.cidade}</div>
            <div className="table-address-cell">{address.uf}</div>
            <div className="table-address-cell">{address.cep}</div>
            <div className="table-address-cell">
              <button className="address-edit-btn" onClick={() => handleEdit(address)}><FontAwesomeIcon icon={faWrench} /></button>
              <button className="address-delete-btn" onClick={() => handleDelete(address.id)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          </div>
        ))}
      </div>
      {isModalVisible && editingAddress && (
        <AddressFormModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          address={editingAddress}
          isEditing={true}
          loadAddresses={loadAddresses}
          clientId={clientId}  // Passar `clientId` corretamente aqui também
        />
      )}
    </div>
  );
};

export default AddressTable;
