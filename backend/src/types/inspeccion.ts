export interface Inspeccion {
  id?: number;
  ownerName: string;
  brandModel: string;
  plate: string;
  notes?: string;
  photos: string[];
  signature: string;
  createdAt: string;
}

export interface InspeccionDB {
  id: number;
  owner_name: string;
  brand_model: string;
  plate: string;
  notes?: string;
  photos: string[];
  signature: string;
  created_at: Date;
}
