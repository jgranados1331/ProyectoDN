import axios, { type AxiosResponse, AxiosError } from 'axios';
import { type Victim } from '../types/victim';
import { type ApiError } from '../types/victim';
import { type DeathDetails } from '../types/victim';

const API_URL = '/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addVictim = async (victim: Omit<Victim, 'id'>): Promise<Victim> => {
  try {
    const response: AxiosResponse<Victim> = await axios.post(`${API_URL}/victims`, victim);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw new Error(err.response?.data?.message || 'Error al registrar víctima');
  }
};

export const getVictims = async (): Promise<Victim[]> => {
  try {
    const response = await axios.get('/api/victims');
    return response.data ?? []; // Nullish coalescing para array vacío
  } catch (error) {
    throw new Error('Error al obtener víctimas');
  }
};

export const addDeathDetails = async (victimId: number, details: DeathDetails) => {
  try {
    const response = await api.put(`/victims/${victimId}/death-details`, details, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en addDeathDetails:', error);
    throw error; // Propaga el error completo
  }
};

/**
 * Actualiza los detalles de una víctima
 */
export const updateVictim = async (
  victimId: number,
  updates: Partial<Victim>
): Promise<Victim> => {
  try {
    const response = await api.patch<Victim>(
      `/victims/${victimId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error('Error updating victim:', error);
    throw new Error('Error al actualizar la víctima');
  }
};

/**
 * Elimina una víctima (soft delete)
 */
export const deleteVictim = async (victimId: number): Promise<void> => {
  try {
    await api.delete(`/victims/${victimId}`);
  } catch (error) {
    console.error('Error deleting victim:', error);
    throw new Error('Error al eliminar la víctima');
  }
};