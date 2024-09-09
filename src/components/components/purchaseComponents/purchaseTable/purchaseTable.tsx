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
  createdAt: Date;
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
}

interface PurchaseTableProps {
  purchases: Purchase[];
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ purchases }) => {

  useEffect(() => {
    // Remove any logic for fetching purchases here, since purchases are passed in as props
  }, []);

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

            return (
              <React.Fragment key={purchase.id}>
                {purchase.orderProducts.length > 0 ? (
                  purchase.orderProducts.map((orderProduct, index) => {
                    const product = orderProduct.product || {};
                    return (
                      <tr key={index}>
                        {index === 0 && (
                          <>
                            <td rowSpan={purchase.orderProducts.length}>{purchase.id}</td>
                            <td rowSpan={purchase.orderProducts.length}>{cliente.id || ''}</td>
                            <td rowSpan={purchase.orderProducts.length}>{cliente.name || ''}</td>
                            <td rowSpan={purchase.orderProducts.length}>{cliente.cpf || ''}</td>
                          </>
                        )}
                        <td>{new Date(orderProduct.createdAt).toLocaleString('pt-BR')}</td>
                        <td>{product.name || ''}</td>
                        <td>{orderProduct.quantity || ''}</td>
                        <td>R${orderProduct.productPrice}</td>
                        <td>R${orderProduct.totalPrice}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>{purchase.id}</td>
                    <td>{cliente.id || ''}</td>
                    <td>{cliente.name || ''}</td>
                    <td>{cliente.cpf || ''}</td>
                    <td colSpan={5}></td>
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
