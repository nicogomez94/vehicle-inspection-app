import { InspeccionData, InspeccionResponse } from '../types/inspeccion';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface GetAllParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface GetAllResponse {
  data: InspeccionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

  getAll: async (params?: GetAllParams): Promise<GetAllResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${API_BASE_URL}/inspecciones${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error fetching inspections');
    }

    return response.json();
  },
};
