import { InspeccionData, InspeccionResponse } from '../types/inspeccion';

const API_BASE_URL = '/api';

export const inspeccionesApi = {
  create: async (data: InspeccionData): Promise<InspeccionResponse> => {
    const response = await fetch(`${API_BASE_URL}/inspecciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error creating inspection');
    }

    return response.json();
  },

  getById: async (id: number): Promise<InspeccionResponse> => {
    const response = await fetch(`${API_BASE_URL}/inspecciones/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error fetching inspection');
    }

    return response.json();
  },
};
