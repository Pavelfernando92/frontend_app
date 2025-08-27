"use client";

import { ImageIcon } from "lucide-react";

interface PromotionImageProps {
  imageUrl?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export const PromotionImage: React.FC<PromotionImageProps> = ({ 
  imageUrl, 
  alt, 
  className = "w-full h-48 object-cover rounded-lg",
  fallbackText = "Sin imagen"
}) => {
  if (!imageUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <span className="text-gray-500 text-sm">{fallbackText}</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      onError={(e) => {
        // Fallback a placeholder en caso de error
        const target = e.currentTarget;
        target.style.display = 'none';
        
        // Crear elemento fallback
        const fallback = document.createElement('div');
        fallback.className = className + ' bg-gray-200 flex items-center justify-center';
        fallback.innerHTML = `
          <div class="text-center">
            <svg class="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-gray-500 text-sm">Error al cargar imagen</span>
          </div>
        `;
        
        target.parentNode?.insertBefore(fallback, target.nextSibling);
      }}
    />
  );
};
