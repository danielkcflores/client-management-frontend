import axios from 'axios';

const apiUrl = 'http://192.168.15.103:3000/products';

export const getProducts = async (): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/listar`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProduct = async (data: any): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/cadastrar`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProduct = async (cpf: string, data: any): Promise<any> => {
  try {
    const response = await axios.put(`${apiUrl}/atualizar/${cpf}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProduct = async (cpf: string): Promise<any> => {
  try {
    const response = await axios.delete(`${apiUrl}/deletar/${cpf}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchProducts = async (searchText: string): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/buscar`, {
      params: {
        searchText,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
