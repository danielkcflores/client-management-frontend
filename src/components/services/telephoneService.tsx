import axios from 'axios';

const apiUrl = 'http://localhost:3000';

interface CreateTelephone {
  numero: string;
}

interface Telephone extends CreateTelephone {
  id: string;
}

export const getTelephones = async (clientId: string): Promise<Telephone[]> => {
  const response = await axios.get(`${apiUrl}/telephones/${clientId}`);
  return response.data;
};

export const searchTelephones = async (clientId: string, query: string): Promise<Telephone[]> => {
  const response = await axios.get(`${apiUrl}/telephones/${clientId}/search?searchText=${query}`);
  return response.data;
};

export const createTelephone = async (clientId: string, data: CreateTelephone): Promise<Telephone> => {
  const response = await axios.post(`${apiUrl}/telephones/${clientId}`, data);
  return response.data;
};

export const updateTelephone = async (clientId: string, telephoneId: string, data: CreateTelephone): Promise<Telephone> => {
  const response = await axios.put(`${apiUrl}/telephones/${clientId}/${telephoneId}`, data);
  return response.data;
};

export const deleteTelephone = async (clientId: string, telephoneId: string): Promise<void> => {
  await axios.delete(`${apiUrl}/telephones/${clientId}/${telephoneId}`);
};

// Nova função para verificar se o telefone está registrado
export const checkTelephoneRegistered = async (clientId: string, number: string): Promise<boolean> => {
  const response = await axios.get(`${apiUrl}/telephones/${clientId}/check-telephone`, { params: { number } });
  return response.data.isRegistered;
};
