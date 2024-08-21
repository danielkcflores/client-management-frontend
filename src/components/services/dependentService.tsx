import axios from 'axios';

const apiUrl = 'http://192.168.15.103:3000';

interface CreateDependent {
  nome: string;
}

interface Dependent extends CreateDependent {
  id: string;  // id é obrigatório
}

export const getDependents = async (clientId: string): Promise<Dependent[]> => {
  const response = await axios.get(`${apiUrl}/dependents/${clientId}`);
  return response.data;
};

export const searchDependents = async (clientId: string, query: string): Promise<Dependent[]> => {
  const response = await axios.get(`${apiUrl}/dependents/${clientId}/search?searchText=${query}`);
  return response.data;
};

export const createDependent = async (clientId: string, data: CreateDependent): Promise<Dependent> => {
  const response = await axios.post(`${apiUrl}/dependents/${clientId}`, data);
  return response.data;
};

export const updateDependent = async (clientId: string, dependentId: string, data: CreateDependent): Promise<Dependent> => {
  const response = await axios.put(`${apiUrl}/dependents/${clientId}/${dependentId}`, data);
  return response.data;
};

export const deleteDependent = async (clientId: string, dependentId: string): Promise<void> => {
  await axios.delete(`${apiUrl}/dependents/${clientId}/${dependentId}`);
};