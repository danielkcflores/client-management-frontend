import axios from 'axios';

// Define a URL base para a API de compras
const apiUrl = 'http://192.168.15.103:3000/purchases';

// Função para criar uma nova compra
export const createPurchase = async (clienteId: number, productId: number) => {
  try {
    const response = await axios.post(`${apiUrl}/cadastrar`, {
      clienteId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

// Função para obter todas as compras
export const getPurchasesReport = async () => {
  try {
    const response = await axios.get(`${apiUrl}/relatorio`);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases report:', error);
    throw error;
  }
};

export const searchPurchases = async (searchText: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${apiUrl}/buscar`, {
      params: {
        searchText,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

