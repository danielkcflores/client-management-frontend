import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import Alert from '../../alert/alert';
import { createProduct, searchProducts, updateProduct, verificarProduto } from "../../../services/productService";
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
  productList: Product[];
}

const ProductForm: React.FC<ProductFormModalProps> = ({
  isVisible,
  onClose,
  product,
  isEditing,
  loadProducts,
  productList,
}) => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>(''); // Mantendo como string para formatação
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Array<Product>>(productList);

  useEffect(() => {
    if (isEditing && product) {
      setName(product.name);
      const priceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price);
      setPrice(priceValue.toFixed(2).replace('.', ',')); // Formata para duas casas decimais e substitui ponto por vírgula
    } else {
      setName('');
      setPrice('');
    }
  }, [isEditing, product]);

  useEffect(() => {
    setProducts(productList);
  }, [productList]);

  useEffect(() => {
    if (!isEditing) { // Só busca se não estiver editando
      const fetchProducts = async () => {
        try {
          const response = await searchProducts(searchText);
          setProducts(response);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
        }
      };

      fetchProducts();
    }
  }, [searchText, isEditing]);

  const handleSubmit = async () => {
    if (!name || price === '') {
      setAlertMessage('Preencha todos os campos!');
      return;
    }
  
    const data: CreateProduct = {
      name,
      price: parseFloat(price.replace(',', '.')), // Converte a string para número, substituindo vírgula por ponto
    };
  
    try {
      const productExists = await verificarProduto(name, isEditing ? product?.id : undefined);
  
      if (productExists) {
        setAlertMessage('Já existe um produto com esse nome!');
        return; // Interrompe a execução se o produto já existir
      }
  
      if (isEditing && product) {
        // Se estiver editando, atualiza o produto
        await updateProduct(product.id, data);
        onClose(); // Fecha o modal após a atualização
      } else {
        // Se estiver criando, cria um novo produto
        await createProduct(data);
      }
  
      // Reseta o estado e carrega os produtos após a criação ou atualização
      setSearchText('');
      setName('');
      setPrice('');
      setAlertMessage(null);
      loadProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error(error);
      setAlertMessage('Ocorreu um erro ao criar ou atualizar o produto. Por favor, tente novamente.');
    }
  };
  
  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!isEditing) { // Só atualiza o texto de busca se não estiver editando
      setSearchText(e.target.value); // Atualiza o texto de busca
    }
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
            onChange={handleNameChange}
            aria-label="Nome do Produto"
          />
          <input
            type="text" // Mantendo como texto para permitir vírgulas
            placeholder="Preço..."
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              const regex = /^(\d+([.,]\d{0,2})?|[.,]\d{1,2})?$/; // Regex para permitir números fracionados com vírgula
              if (value === '' || regex.test(value)) {
                setPrice(value);
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
        
        <div className="modal-products-table">
          <ProductTable produtos={products} loadProducts={loadProducts} isEditing={isEditing} />
        </div>
      </div>
    </Modal>
  );
};

export default ProductForm;
