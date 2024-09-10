import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './purchaseForm.css'; 
import { getClients, searchClientes } from '../../../services/clientService';
import { getProducts, searchProducts } from '../../../services/productService';
import { createPurchase } from '../../../services/purchaseService';
import Alert from '../../alert/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

interface Client {
  id: number;
  name: string;
  cpf: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface PurchaseModalFormProps {
  isVisible: boolean;
  onClose: () => void;
  onPurchaseCreated: () => void;
  products: Product[];
}

const PurchaseModalForm: React.FC<PurchaseModalFormProps> = ({
  isVisible,
  onClose,
  onPurchaseCreated,
  products,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clientInput, setClientInput] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productInput, setProductInput] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; unitPrice: number; totalPrice: number }[]>([]);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState<number | null>(null);

  useEffect(() => {
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

  const handleClientInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setClientInput(input);
    try {
      if (input.length > 2) {
        const results = await searchClientes(input);
        setFilteredClients(results);
      } else {
        setFilteredClients([]);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientInput(client.name);
    setFilteredClients([]);
  };

  const handleProductInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setProductInput(input);
    try {
      if (input.length > 2) {
        const results = await searchProducts(input);
        setFilteredProducts(results);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setProductInput(product.name);
    setFilteredProducts([]);
  };

  const handleAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      const existingItem = cartItems.find(item => item.product.id === selectedProduct.id);
      if (existingItem) {
        const updatedCart = cartItems.map(item =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
            : item
        );
        setCartItems(updatedCart);
      } else {
        const newItem = {
          product: selectedProduct,
          quantity,
          unitPrice: selectedProduct.price,
          totalPrice: quantity * selectedProduct.price,
        };
        setCartItems([...cartItems, newItem]);
      }
      setQuantity(0);
      setProductInput('');
      setSelectedProduct(null);
    }
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    setCartItems(prevItems => {
      return prevItems.reduce((acc, item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as typeof cartItems);
    });
  };

  const handleSubmit = async () => {
    if (selectedClient && cartItems.length > 0) {
      try {
        const purchaseData = {
          clienteId: selectedClient.id,
          products: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        };

        await createPurchase(purchaseData);
        resetForm();
        onPurchaseCreated();
        onClose();
      } catch (error) {
        console.error('Erro ao cadastrar compra:', error);
        setError('Erro ao cadastrar compra. Tente novamente.');
      }
    } else {
      setError('Selecione um cliente e adicione produtos ao carrinho.');
    }
  };

  const resetForm = () => {
    setClientInput('');
    setSelectedClient(null);
    setProductInput('');
    setSelectedProduct(null);
    setQuantity(0);
    setCartItems([]);
  };

  const getTotalCartPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleAlertClose = () => {
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'client' | 'product') => {
    if (e.key === 'Enter' && highlightedSuggestion !== null) {
      if (type === 'client' && filteredClients[highlightedSuggestion]) {
        handleClientSelect(filteredClients[highlightedSuggestion]);
      } else if (type === 'product' && filteredProducts[highlightedSuggestion]) {
        handleProductSelect(filteredProducts[highlightedSuggestion]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (highlightedSuggestion !== null) {
        setHighlightedSuggestion((prev) => (prev === filteredClients.length - 1 ? 0 : prev! + 1));
      }
    }
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
      <div className="modal-purchase-content">
        <div className="form-container">
          {error && <Alert message={error} onClose={handleAlertClose} />}
          <div className="select-container">
          <div className='quantity-container'>
              <label className='purchase-quantity-label' htmlFor="client">Cliente:</label>
            </div>
            <input
              type="text"
              id="client"
              placeholder="Digite o nome do cliente"
              value={clientInput}
              onChange={handleClientInputChange}
              onKeyDown={(e) => handleKeyDown(e, 'client')}
              className={filteredClients.length > 0 ? 'input-with-suggestions' : ''}
            />
            {filteredClients.length > 0 && (
              <div className="autocomplete-suggestions">
                {filteredClients.map((client, index) => (
                  <div
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className={`autocomplete-suggestion ${highlightedSuggestion === index ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHighlightedSuggestion(index)}
                  >
                    <span className="suggestion-text">
                      {client.name.substring(0, clientInput.length)}
                      <span className="missing-text">{client.name.substring(clientInput.length)}</span>
                    </span>
                    <div>{client.cpf}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="select-container">
            <div className='quantity-container'>
              <label className='purchase-quantity-label' htmlFor="product">Produto:</label>
            </div>
            <input
              type="text"
              id="product"
              placeholder="Digite o nome do produto"
              value={productInput}
              onChange={handleProductInputChange}
              onKeyDown={(e) => handleKeyDown(e, 'product')}
              className={filteredProducts.length > 0 ? 'input-with-suggestions' : ''}
            />
            {filteredProducts.length > 0 && (
              <div className="autocomplete-suggestions">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`autocomplete-suggestion ${highlightedSuggestion === index ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHighlightedSuggestion(index)}
                  >
                    <span className="suggestion-text">
                      {product.name.substring(0, productInput.length)}
                      <span className="missing-text">{product.name.substring(productInput.length)}</span>
                    </span>
                    <div>R${product.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='form-buttons'>
            <div className='quantity-container'>
              <label className='purchase-quantity-label' htmlFor="quantity">Quantidade:</label>
              <div className='quantity-controls'>
                <input
                  className="purchase-quantity-input"
                  type="number"
                  id="quantity"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  min={1}
                />
                <button className='add-cart-button' onClick={handleAddToCart}>
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-container">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>
                    <div className="quantity-controls">
                      <button className='quantity-controls-button' onClick={() => handleQuantityChange(item.product.id, -1)}>-</button>
                      {item.quantity}
                      <button className='quantity-controls-button' onClick={() => handleQuantityChange(item.product.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>R${item.unitPrice}</td>
                  <td>R${item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="submit-button" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faCheck} />
          </button>
          <div className="total-price-container">
            Total do Carrinho: R${getTotalCartPrice().toFixed(2)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseModalForm;

