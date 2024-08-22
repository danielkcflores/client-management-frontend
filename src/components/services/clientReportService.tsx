// src/services/clientService.ts
import axios from 'axios';

const apiUrl = 'http://192.168.15.103:3000/clientes';

export const getClientsReport = async () => {
  try {
    const response = await axios.get(`${apiUrl}/report`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatório de clientes:', error);
    throw error; // Re-throw para que o componente possa lidar com o erro
  }
};