import React, { useEffect } from 'react';
import './purchaseTable.css';

interface Product {
  id: number;
  name: string;
}

interface OrderProduct {
  quantity: number;
  productPrice: string;
  totalPrice: string;
  product: Product;
}

interface Client {
  id: number;
  name: string;
  cpf: string;
}

interface Purchase {
  id: number;
  cliente: Client;
  orderProducts: OrderProduct[];
  createdAt: Date;
}

interface PurchaseTableProps {
  purchases: Purchase[];
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ purchases }) => {

  useEffect(() => {
    // Remove any logic for fetching purchases here, since purchases are passed in as props
  }, []);

  // Helper function to format the date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR') + ', ' + date.toLocaleTimeString('pt-BR', { hour12: false });
  };

  return (
    <div className="table-report-container">
      <div className="purchase-table-report">
        <table>
          <thead>
            <tr>
              <th>ID da Compra</th>
              <th>ID do Cliente</th>
              <th>Nome do Cliente</th>
              <th>CPF</th>
              <th>Data da Compra</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço do Produto</th>
              <th>Preço Total</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((purchase) => {
                const cliente = purchase.cliente || {};

                // Calcula o total do pedido
                const totalOrderPrice = purchase.orderProducts.reduce((total, orderProduct) => total + parseFloat(orderProduct.totalPrice), 0);

                return (
                  <React.Fragment key={purchase.id}>
                    {purchase.orderProducts.length > 0 ? (
                      purchase.orderProducts.map((orderProduct, index) => {
                        const product = orderProduct.product || {};
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              {index === 0 && (
                                <>
                                  <td rowSpan={purchase.orderProducts.length + 1}>{purchase.id}</td>
                                  <td rowSpan={purchase.orderProducts.length + 1}>{cliente.id || ''}</td>
                                  <td rowSpan={purchase.orderProducts.length + 1}>{cliente.name || ''}</td>
                                  <td rowSpan={purchase.orderProducts.length + 1}>{cliente.cpf || ''}</td>
                                  <td rowSpan={purchase.orderProducts.length + 1}>{formatDate(new Date(purchase.createdAt))}</td>
                                </>
                              )}
                              <td>{product.name || ''}</td>
                              <td>{orderProduct.quantity || ''}</td>
                              <td>R${orderProduct.productPrice}</td>
                              <td>R${orderProduct.totalPrice}</td>
                            </tr>
                            {index === purchase.orderProducts.length - 1 && (
                              <tr className="order-total-row">
                                <td colSpan={2}>Total do Pedido:</td>
                                <td colSpan={2}>R${totalOrderPrice.toFixed(2)}</td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td>{purchase.id}</td>
                        <td>{cliente.id || ''}</td>
                        <td>{cliente.name || ''}</td>
                        <td>{cliente.cpf || ''}</td>
                        <td colSpan={4}></td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={9}>Nenhuma compra encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseTable;
