export interface InspeccionData {
  ownerName: string;
  brandModel: string;
  plate: string;
  notes?: string;
  photos: string[];
  signature: string;
  createdAt: string;
}

export interface InspeccionResponse extends InspeccionData {
  id: number;
}

// Versión ligera para listado (sin fotos pesadas)
export interface InspeccionListItem {
  id: number;
  ownerName: string;
  brandModel: string;
  plate: string;
  notes?: string;
  photoCount: number;
  createdAt: string;
}
