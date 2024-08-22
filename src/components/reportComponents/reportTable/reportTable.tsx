import React, { useEffect, useState } from 'react';
import { getClientsReport } from '../../services/clientReportService';
import './reportTable.css';

interface Client {
  id: number;
  name: string;
  cpf: string;
  enderecos: { rua: string, numero: string, bairro: string, cidade: string, uf: string, cep: string }[]; // Array de endereços detalhados
  dependentes: { id: number, nome: string }[]; // Array de dependentes detalhados
  telefones: { numero: string }[]; // Array de telefones detalhados
}

const ClientReport = () => {
  const [clients, setClients] = useState<Client[]>([]);
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
      <div className="table-report">
        <div className="table-report-row">
          <div className="table-report-cell">ID</div>
          <div className="table-report-cell">Cliente</div>
          <div className="table-report-cell">CPF</div>
          <div className="table-report-cell">Endereços</div>
          <div className="table-report-cell">Dependentes</div>
          <div className="table-report-cell">Telefones</div>
        </div>
        {clients.map(client => (
          <div key={client.id} className="table-report-row">
            <div className="table-report-cell">{client.id}</div>
            <div className="table-report-cell">{client.name}</div>
            <div className="table-report-cell">{client.cpf}</div>
            <div className="table-report-cell">
              {client.enderecos && client.enderecos.length > 0 
                ? client.enderecos.map((endereco, index) => (
                    <div key={endereco.rua + endereco.numero}>
                      {`${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`}
                      {/* Linha em branco após cada endereço */}
                      <div style={{ height: '10px' }}></div>
                    </div>
                  ))
                : ''}
            </div>
            <div className="table-report-cell">
              {client.dependentes && client.dependentes.length > 0 
                ? client.dependentes.map((dependent, index) => (
                    <div key={dependent.id}>
                      {dependent.nome}
                      {/* Linha em branco após cada dependente */}
                      <div style={{ height: '10px' }}></div>
                    </div>
                  ))
                : ''}
            </div>
            <div className="table-report-cell">
              {client.telefones && client.telefones.length > 0 
                ? client.telefones.map((telefone, index) => (
                    <div key={telefone.numero}>
                      {telefone.numero}
                      {/* Linha em branco após cada telefone */}
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

export default ClientReport;