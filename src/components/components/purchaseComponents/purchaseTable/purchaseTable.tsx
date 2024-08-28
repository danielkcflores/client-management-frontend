import React, { useEffect } from 'react';
import './purchaseTable.css';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Client {
  id: number;
  name: string;
  cpf: string;
}

interface Purchase {
  id: number;
  cliente: Client;
  product: Product;
}

interface PurchaseTableProps {
  purchases: Purchase[]; // Adicione a prop purchases à interface
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ purchases }) => {

  useEffect(() => {
    // Remova a lógica de busca de compras, já que você está recebendo as compras como prop
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
              <th>ID do Produto</th>
              <th>Nome do Produto</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map(purchase => {
                const cliente = purchase.cliente || {};
                const product = purchase.product || {};

                return (
                  <tr key={purchase.id}>
                    <td>{purchase.id}</td>
                    <td>{cliente.id || 'N/A'}</td>
                    <td>{cliente.name || 'N/A'}</td>
                    <td>{cliente.cpf || 'N/A'}</td>
                    <td>{product.id || 'N/A'}</td>
                    <td>{product.name || 'N/A'}</td>
                    <td>R${product.price ? product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7}>Nenhuma compra encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseTable;