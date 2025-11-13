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
