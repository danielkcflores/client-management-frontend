import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import Alert from '../../alert/alert';
import { createProduct, updateProduct } from "../../../services/productService";
import './productForm.css'; 
import ProductTable from "../productTable/productTable";

Modal.setAppElement('#root');

interface CreateProduct {
  name: string;
  price: number;
}

interface Product extends CreateProduct {
  id: string;
}

interface ProductFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product | null;
  isEditing: boolean;
  loadProducts: () => void;
  productList: Product[]; // Passando a lista de produtos para o formulário
}

const ProductForm: React.FC<ProductFormModalProps> = ({
  isVisible,
  onClose,
  product,
  isEditing,
  loadProducts,
  productList, // Recebendo a lista de produtos
}) => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number | ''>('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && product) {
      setName(product.name);
      setPrice(product.price);
    } else {
      setName('');
      setPrice('');
    }
  }, [isEditing, product]);

  const handleSubmit = async () => {
    if (!name || price === '') {
      setAlertMessage('Preencha todos os campos!');
      return;
    }

    const data: CreateProduct = {
      name,
      price: Number(price),
    };
  
    try {
      if (isEditing && product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
  
      // Atualize a lista de produtos após a criação ou atualização
      await loadProducts();
  
      // Limpa os campos após a submissão bem-sucedida
      setName('');
      setPrice('');
      setAlertMessage(null); 
    } catch (error) {
      console.error(error);
      setAlertMessage('Ocorreu um erro ao criar ou atualizar o produto. Por favor, tente novamente.');
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      overlayClassName="modal-products-overlay"
      className="modal-products"
    >
      <div className="modal-products-header">
        <h2>{isEditing ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
        <button onClick={onClose} className="close-btn" aria-label="Fechar modal">
          &times;
        </button>
      </div>
      <div className="modal-products-content">
        <div className="modal-products-form">
          <input
            placeholder="Nome..."
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            aria-label="Nome do Produto"
          />
          <input
            type="number"
            placeholder="Preço..."
            value={price === '' ? '' : price}
            min={0}
            step={1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              const regex = /^[0-9]*$/; 
              if (value.match(regex)) {
                setPrice(value !== '' ? Number(value) : '');
              }
            }}
            aria-label="Preço do Produto"
          />
          <div className="form-buttons">
            <button onClick={handleSubmit} style={{ backgroundColor: '#00B4FF' }}>
              Salvar
            </button>
          </div>
        </div>
        {alertMessage && <Alert message={alertMessage} onClose={handleAlertClose} />}
        
        {/* Passando a lista de produtos para a tabela */}
        <div className="modal-products-table">
          <ProductTable produtos={productList} loadProducts={loadProducts} isEditing={isEditing}/>
        </div>
      </div>
    </Modal>
  );
};

export default ProductForm;
