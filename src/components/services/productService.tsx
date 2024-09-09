import axios from 'axios';

const apiUrl = 'http://localhost:3000/products';

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

export const updateProduct = async (id: string, data: any): Promise<any> => {
  try {
    const response = await axios.put(`${apiUrl}/atualizar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(`${apiUrl}/deletar/${id}`);
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

export const verificarProduto = async (name: string, id?: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${apiUrl}/verificar-produto`, { name, id });
    return response.data.exists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
