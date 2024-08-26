import React, { useEffect, useState } from 'react';
import { getClientsReport } from '../../../services/clientReportService';
import './purchaseTable.css';

interface Purchase {
  id: number;
  name: string;
  cpf: number;
  produtos: { name: string, price: number }[]; // Array de telefones detalhados
}

const PurchaseTable = () => {
  const [clients, setClients] = useState<Purchase[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClientsReport(); 
        console.log('Dados recebidos:', data);
        setClients(data);
      } catch (error) {
        setError('Erro ao buscar dados dos clientes.');
        console.error('Erro ao buscar dados dos clientes:', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="table-report-container">
      <div className="purchase-table-report">
        <div className="table-report-row">
          <div className="table-report-cell">ID</div>
          <div className="table-report-cell">Cliente</div>
          <div className="table-report-cell">CPF</div>
          <div className="table-report-cell">Produtos</div>
        </div>
        {clients.map(client => (
          <div key={client.id} className="table-report-row">
            <div className="table-report-cell">{client.id}</div>
            <div className="table-report-cell">{client.name}</div>
            <div className="table-report-cell">{client.cpf}</div>
            <div className="table-report-cell">
              {client.produtos && client.produtos.length > 0 
                ? client.produtos.map((produto, index) => (
                    <div key={produto.name + produto.price}>
                      {`${produto.name}, R$${produto.price}`}
                      <div style={{ height: '10px' }}></div>
                    </div>
                    
                  ))
                : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseTable;