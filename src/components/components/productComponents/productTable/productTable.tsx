import React, { useState, useEffect } from 'react';
import './productTable.css';
import ProductForm from '../productForm/productForm';
import { deleteProduct } from '../../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';

interface ProductTableProps {
  produtos: Array<any>;
  loadProducts: () => void;
  isEditing: boolean; // Adicionado para controlar a edição
}

const ProductTable: React.FC<ProductTableProps> = ({ produtos, loadProducts, isEditing }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productList, setProductList] = useState<any[]>(produtos);

  useEffect(() => {
    setProductList(produtos); // Atualiza a lista de produtos quando o prop mudar
  }, [produtos]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Deseja realmente excluir o produto?')) {
      try {
        await deleteProduct(productId);
        loadProducts(); // Recarregar os produtos após a exclusão
      } catch (error) {
        console.error('Erro ao excluir o produto:', error);
      }
    }
  };

  return (
    <div className="table-container">
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
            <div className="table-cell">{product.price}</div>
            <div className="table-cell">
              {/* Botão Editar */}
              <button
                className={`product-edit-btn ${isEditing ? 'disabled' : ''}`}
                onClick={() => !isEditing && handleEdit(product)}
                disabled={isEditing} // Desabilitar se estiver em modo edição
              >
                <FontAwesomeIcon icon={faWrench} />
              </button>
              {/* Botão Excluir */}
              <button
                className={`product-delete-btn ${isEditing ? 'disabled' : ''}`}
                onClick={() => !isEditing && handleDelete(product.id)}
                disabled={isEditing} // Desabilitar se estiver em modo edição
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
          productList={productList} // Passa a lista atualizada para o formulário
        />
      )}
    </div>
  );
};

export default ProductTable;
