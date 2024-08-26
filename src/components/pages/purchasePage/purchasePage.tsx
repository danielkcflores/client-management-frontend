import React, { useState, useEffect } from 'react';
import './purchasePage.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import ProductForm from '../../components/productComponents/productForm/productForm';
import { getProducts } from '../../services/productService';
import { PurchaseModalForm } from '../../components/purchaseComponents/purchaseForm/purchaseForm';
import PurchaseTable from '../../../components/components/purchaseComponents/purchaseTable/purchaseTable';

const PurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const [isProductFormModalVisible, setIsProductFormModalVisible] = useState(false);
  const [isPurchaseFormModalVisible, setIsPurchaseFormModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [productList, setProductList] = useState([]);

  // Função para carregar os produtos
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProductList(data);
      console.log('Produtos carregados:', data);
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleProductFormModal = () => {
    setIsProductFormModalVisible(!isProductFormModalVisible);
  };

  const togglePurchaseFormModal = () => {
    setIsPurchaseFormModalVisible(!isPurchaseFormModalVisible);
  };

  return (
    <div className="app-container">
      <div className="purchase-menu">
        <button onClick={() => navigate(-1)} className="back-purchase-button">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="add-product-button" onClick={toggleProductFormModal}>
          <FontAwesomeIcon icon={faPlus} style={{ position: 'relative', left: '-0.5em', top: '-0.7em', height: '0.7em' }} />
          <FontAwesomeIcon icon={faBoxOpen} style={{ position: 'relative', top: '-0.95em', height: '1.2em' }} />
        </button>
      </div>
      <header className="header">
        <h1 className="header-text">GERENCIAMENTO DE COMPRAS</h1>
      </header>
      <div className="header-buttons">
        <button style={{ backgroundColor: '#F4D000', borderColor: '#F4D000', whiteSpace: 'nowrap' }}>
          A - Z
        </button>
        <button onClick={togglePurchaseFormModal}>
          Cadastrar
        </button>
        <input
          placeholder="Pesquise uma compra..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ color: '#00B4FF' }}
        />
      </div>
      <ProductForm
        isVisible={isProductFormModalVisible}
        onClose={toggleProductFormModal}
        product={null}
        isEditing={false}
        loadProducts={loadProducts} // Passa a função para recarregar produtos
        productList={productList} // Passa a lista de produtos para o ProductForm
      />
      <PurchaseModalForm
        isVisible={isPurchaseFormModalVisible}
        onClose={togglePurchaseFormModal}
      />
      <PurchaseTable />
    </div>
  );
};

export default PurchasePage;
