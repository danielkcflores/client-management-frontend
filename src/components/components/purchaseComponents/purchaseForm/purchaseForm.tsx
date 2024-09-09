import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './purchaseForm.css'; // Certifique-se de que este CSS está correto para o seu modal
import { getClients, searchClientes } from '../../../services/clientService'; // Ajuste o caminho conforme necessário
import { getProducts, searchProducts } from '../../../services/productService'; // Ajuste o caminho conforme necessário
import { createPurchase } from '../../../services/purchaseService'; // Ajuste o caminho conforme necessário
import Alert from '../../alert/alert'; // Certifique-se de que o caminho está correto
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

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
  onPurchaseCreated: () => void; // Nova prop para a função de atualização
  products: Product[]; // Lista de produtos recebida como prop
}

const PurchaseModalForm: React.FC<PurchaseModalFormProps> = ({
  isVisible,
  onClose,
  onPurchaseCreated,
  products, // Recebe a lista de produtos
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clientInput, setClientInput] = useState<string>(''); // Input para o nome do cliente
  const [selectedClient, setSelectedClient] = useState<Client | null>(null); // Cliente selecionado
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productInput, setProductInput] = useState<string>(''); // Input para o nome do produto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Produto selecionado
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; unitPrice: number; totalPrice: number }[]>([]);

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
    setClientInput(client.name); // Preenche o input com o nome do cliente selecionado
    setFilteredClients([]); // Limpa as sugestões após a seleção
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
    setProductInput(product.name); // Preenche o input com o nome do produto selecionado
    setFilteredProducts([]); // Limpa as sugestões após a seleção
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
            quantity: item.quantity,  // Verifique se a quantidade está sendo passada corretamente
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
          <label className='purchase-quantity-label' htmlFor="quantity">Cliente:</label></div>
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              value={clientInput}
              onChange={handleClientInputChange}
            />
            {filteredClients.length > 0 && (
              <div className="autocomplete-suggestions">
                {filteredClients.map(client => (
                  <div
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="autocomplete-suggestion"
                  >
                    {client.name} - {client.cpf}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="select-container">
          <div className='quantity-container'>
          <label className='purchase-quantity-label' htmlFor="quantity">Produto:</label></div>
            <input
              type="text"
              placeholder="Digite o nome do produto"
              value={productInput}
              onChange={handleProductInputChange}
            />
            {filteredProducts.length > 0 && (
              <div className="autocomplete-suggestions">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="autocomplete-suggestion"
                  >
                    {product.name} - R$
                    {typeof product.price === 'string' ? product.price : 'Preço Indisponível'}
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
    Finalizar
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
