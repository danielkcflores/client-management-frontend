import axios from 'axios';

// Define a URL base para a API de compras
const apiUrl = 'http://localhost:3000/purchases';

export const createPurchase = async (purchase: { clienteId: number; products: { productId: number; quantity: number }[] }) => {
  try {
    const response = await axios.post(`${apiUrl}`, purchase);
    return response.data;
  } catch (error: any) {
    console.error('Error creating purchase:', error.response ? error.response.data : error.message);
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

