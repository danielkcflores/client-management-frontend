import React, { useState, useEffect } from 'react';
import './purchasePage.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import ProductForm from '../../components/productComponents/productForm/productForm';
import { getProducts } from '../../services/productService';
import PurchaseModalForm from '../../components/purchaseComponents/purchaseForm/purchaseForm';
import PurchaseTable from '../../../components/components/purchaseComponents/purchaseTable/purchaseTable';
import { searchPurchases } from '../../services/purchaseService';

const PurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const [isProductFormModalVisible, setIsProductFormModalVisible] = useState<boolean>(false);
  const [isPurchaseFormModalVisible, setIsPurchaseFormModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [productList, setProductList] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]); // Estado para as compras
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Função para carregar os produtos
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProductList(data);
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    }
  };

  // Função para buscar as compras
  const searchPurchasesByText = async (text: string) => {
    try {
      const data = await searchPurchases(text);
      setPurchases(data);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
    }
  };

  // Carregar produtos e compras inicialmente
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    searchPurchasesByText(searchText); // Buscar compras sempre que searchText mudar
  }, [searchText]);

  const toggleProductFormModal = () => {
    setIsProductFormModalVisible(!isProductFormModalVisible);
  };

  const togglePurchaseFormModal = () => {
    setIsPurchaseFormModalVisible(!isPurchaseFormModalVisible);
  };

  const handleOrderClick = () => {
    const sortedPurchases = [...purchases].sort((a, b) => {
      if (order === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setPurchases(sortedPurchases);
  };

  // Função para atualizar as compras após um cadastro
  const refreshPurchases = () => {
    searchPurchasesByText(searchText); // Recarrega as compras
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
        <button onClick={handleOrderClick} style={{ backgroundColor: '#F4D000', borderColor: '#F4D000', whiteSpace: 'nowrap' }}>
          A - Z
        </button>
        <button onClick={togglePurchaseFormModal}>
          Cadastrar
        </button>
        <input
          placeholder="Pesquise uma compra pela compra, cliente ou produto..."
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
        loadProducts={loadProducts}
        productList={productList}
      />
      <PurchaseModalForm
        isVisible={isPurchaseFormModalVisible}
        onClose={togglePurchaseFormModal}
        onPurchaseCreated={refreshPurchases} // Passa a função para atualizar as compras
        products={productList} // Passa a lista de produtos atualizada
      />
      <PurchaseTable purchases={purchases} /> {/* Passa as compras para a tabela */}
    </div>
  );
};

export default PurchasePage;
