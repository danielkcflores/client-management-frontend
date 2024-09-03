import React, { useState, useEffect } from 'react';
import './productTable.css';
import ProductForm from '../productForm/productForm';
import { deleteProduct } from '../../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../alert/alert';

interface ProductTableProps {
  produtos: Array<any>;
  loadProducts: () => void;
  isEditing: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const ProductTable: React.FC<ProductTableProps> = ({ produtos, loadProducts, isEditing }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productList, setProductList] = useState<any[]>(produtos);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    setProductList(produtos);
  }, [produtos]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    // Chama loadProducts somente se a edição for concluída
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Deseja realmente excluir o produto?')) {
      try {
        const result = await deleteProduct(productId);
        if (!result.status) {
          setAlertMessage(result.mensagem); // Exibe a mensagem de erro do backend
        } else {
          loadProducts();
        }
      } catch (error) {
        console.error('Erro ao excluir o produto:', error);
        setAlertMessage('Ocorreu um erro ao excluir o produto.');
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  return (
    <div className={`table-container ${isEditing ? 'disabled' : ''}`}>
      <h2 className="table-header">Lista de Produtos</h2>
      <div className="product-table">
        <div className="table-row">
          <div className="table-cell">Nome</div>
          <div className="table-cell">Preço</div>
          <div className="table-cell">Ações</div>
        </div>
        {productList.map((product, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">{product.name}</div>
            <div className="table-cell">{formatCurrency(product.price)}</div>
            <div className="table-cell">
              <button
                className='product-edit-btn'
                onClick={() => !isEditing && handleEdit(product)}
              >
                <FontAwesomeIcon icon={faWrench} />
              </button>
              <button
                className='product-delete-btn'
                onClick={() => !isEditing && handleDelete(product.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalVisible && (
        <ProductForm
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          product={editingProduct}
          isEditing={true}
          loadProducts={loadProducts}
          productList={productList}
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

export default ProductTable;
