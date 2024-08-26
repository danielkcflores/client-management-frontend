import React from 'react';
import Modal from 'react-modal';
import './purchaseForm.css'; // Certifique-se de que este CSS está correto para o seu modal

Modal.setAppElement('#root');

interface PurchaseModalFormProps {
  isVisible: boolean;
  onClose: () => void;
  // Inclua outras propriedades que seu componente precisa
}

export const PurchaseModalForm: React.FC<PurchaseModalFormProps> = ({
  isVisible,
  onClose,
  // Outras props
}) => {
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
        <div className="select-container">
          <select>
            <option value="">Selecione um cliente</option>
            {/* Inclua op es para os clientes aqui */}
          </select>
        </div>
        <div className="select-container">
          <select>
            <option value="">Selecione um produto</option>
            {/* Inclua op es para os produtos aqui */}
          </select>
        </div>
        <div className='form-buttons'>
          <button type='submit'>
            Cadastrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
