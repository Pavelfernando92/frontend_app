export interface PromocionInterface {
  id: number;
  title: string;
  description: string;
  image?: string;        // URL de la imagen (opcional)
  validUntil: string;    // Fecha de validez
  status: boolean;
  createdAt: string;     // Fecha de creación
  updatedAt: string;     // Fecha de actualización
}

// Interfaz para crear promociones
export interface CreatePromocionData {
  title: string;
  description: string;
  validUntil: string;
  image?: File;
}

// Interfaz para actualizar promociones
export interface UpdatePromocionData {
  title?: string;
  description?: string;
  validUntil?: string;
  status?: boolean;
  image?: File;
}
