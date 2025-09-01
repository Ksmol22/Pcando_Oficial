import { useState, useEffect } from 'react';
import { mockProducts, getComponentsByType } from '@/lib/mockData';

// Hook para detectar si estamos en GitHub Pages
export const useGitHubPages = () => {
  const isGitHubPages = window.location.hostname.includes('github.io');
  return isGitHubPages;
};

// Hook para obtener componentes (mock o API)
export const useComponents = (type?: string) => {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isGitHubPages = useGitHubPages();

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isGitHubPages) {
          // Usar datos mock en GitHub Pages
          if (type) {
            const mockData = getComponentsByType(type);
            setComponents(mockData);
          } else {
            // Obtener todos los componentes
            const allComponents = Object.values(mockProducts).flat();
            setComponents(allComponents);
          }
        } else {
          // Usar API real en desarrollo
          const endpoint = type ? `/api/components?type=${type}` : '/api/components';
          const response = await fetch(endpoint);
          
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          
          const data = await response.json();
          setComponents(data);
        }
      } catch (err) {
        console.error('Error fetching components:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        
        // Fallback a datos mock si la API falla
        if (type) {
          const mockData = getComponentsByType(type);
          setComponents(mockData);
        } else {
          const allComponents = Object.values(mockProducts).flat();
          setComponents(allComponents);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [type, isGitHubPages]);

  return { components, loading, error, isGitHubPages };
};
