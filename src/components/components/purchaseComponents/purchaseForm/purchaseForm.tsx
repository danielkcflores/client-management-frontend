import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './purchaseForm.css'; // Certifique-se de que este CSS está correto para o seu modal
import { getClients } from '../../../services/clientService'; // Ajuste o caminho conforme necessário
import { createPurchase } from '../../../services/purchaseService'; // Ajuste o caminho conforme necessário
import Alert from '../../alert/alert'; // Certifique-se de que o caminho está correto

Modal.setAppElement('#root');

interface PurchaseModalFormProps {
  isVisible: boolean;
  onClose: () => void;
  onPurchaseCreated: () => void; // Nova prop para a função de atualização
  products: any[]; // Lista de produtos recebida como prop
}

const PurchaseModalForm: React.FC<PurchaseModalFormProps> = ({
  isVisible,
  onClose,
  onPurchaseCreated,
  products, // Recebe a lista de produtos
}) => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | ''>('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar clientes
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setError('Erro ao buscar clientes. Tente novamente.');
      }
    };

    fetchClients();
  }, []);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(Number(e.target.value) || '');
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(Number(e.target.value) || '');
  };

  const handleSubmit = async () => {
    if (selectedClient && selectedProduct) {
      try {
        await createPurchase(selectedClient, selectedProduct);
        onPurchaseCreated(); // Chama a função de atualização após o cadastro
        onClose(); // Fecha o modal após o cadastro da compra
      } catch (error) {
        console.error('Erro ao cadastrar compra:', error);
        setError('Erro ao cadastrar compra. Tente novamente.');
      }
    } else {
      setError('Selecione um cliente e um produto.');
    }
  };

  const handleAlertClose = () => {
    setError(null);
  };

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      overlayClassName="modal-purchase-overlay"
      className="modal-purchase"
    >
      <div className="modal-purchase-header">
        <h2>Cadastro de Compra</h2>
        <button onClick={onClose} className="close-btn" aria-label="Fechar modal">
          &times;
        </button>
      </div>
      <div className="modal-purchase-form">
        {error && <Alert message={error} onClose={handleAlertClose} />}
        <div className="select-container">
          <select value={selectedClient} onChange={handleClientChange}>
            <option value="">Selecione um cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div className="select-container">
          <select value={selectedProduct} onChange={handleProductChange}>
            <option value="">Selecione um produto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className='form-buttons'>
          <button type='button' onClick={handleSubmit}>
            Cadastrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseModalForm;