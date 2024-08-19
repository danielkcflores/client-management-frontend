import axios from 'axios';

const apiUrl = 'http://192.168.15.103:3000/clientes';

export const getClients = async (): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/listar`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createClient = async (data: any): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/cadastrar`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateClient = async (cpf: string, data: any): Promise<any> => {
  try {
    const response = await axios.put(`${apiUrl}/atualizar/${cpf}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteClient = async (cpf: string): Promise<any> => {
  try {
    const response = await axios.delete(`${apiUrl}/deletar/${cpf}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchClientes = async (searchText: string): Promise<any> => {
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

export const verificarCpf = async (cpf: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${apiUrl}/verificar-cpf`, { cpf });
    return response.data.exists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
