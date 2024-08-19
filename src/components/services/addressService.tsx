import axios from 'axios';

const apiUrl = 'http://192.168.15.103:3000/clients'

interface CreateAddress {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

interface Address extends CreateAddress {
  id: string;  // id é obrigatório
}

export const getAddresses = async (clientId: string): Promise<Address[]> => {
  const response = await axios.get(`${apiUrl}/${clientId}/addresses`);
  return response.data;
};

export const searchAddresses = async (clientId: string, query: string): Promise<Address[]> => {
  const response = await axios.get(`${apiUrl}/${clientId}/addresses/search?searchText=${query}`);
  return response.data;
};

export const createAddress = async (clientId: string, data: CreateAddress): Promise<Address> => {
  const response = await axios.post(`${apiUrl}/${clientId}/addresses`, data);
  return response.data;
};

export const updateAddress = async (clientId: string, addressId: string, data: CreateAddress): Promise<Address> => {
  const response = await axios.put(`${apiUrl}/${clientId}/addresses/${addressId}`, data);
  return response.data;
};

export const deleteAddress = async (clientId: string, addressId: string): Promise<void> => {
  await axios.delete(`${apiUrl}/${clientId}/addresses/${addressId}`);
};
