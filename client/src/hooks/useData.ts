import { useState, useEffect } from 'react';
import { db } from '../lib/db';

// Hook para componentes
export function useComponents(category?: string) {
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setIsLoading(true);
        const filter = category ? { category } : undefined;
        const data = await db.components.findMany({ where: filter });
        setComponents(data);
      } catch (err) {
        setError('Error al cargar componentes');
        console.error('Error fetching components:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComponents();
  }, [category]);

  const addComponent = async (componentData: any) => {
    try {
      const newComponent = await db.components.create(componentData);
      setComponents(prev => [...prev, newComponent]);
      return newComponent;
    } catch (err) {
      setError('Error al agregar componente');
      throw err;
    }
  };

  const updateComponent = async (id: string, updates: any) => {
    try {
      const updated = await db.components.update(id, updates);
      setComponents(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      setError('Error al actualizar componente');
      throw err;
    }
  };

  const deleteComponent = async (id: string) => {
    try {
      await db.components.delete(id);
      setComponents(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Error al eliminar componente');
      throw err;
    }
  };

  return {
    components,
    isLoading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
    refetch: () => {
      const fetchComponents = async () => {
        try {
          setIsLoading(true);
          const filter = category ? { category } : undefined;
          const data = await db.components.findMany({ where: filter });
          setComponents(data);
        } catch (err) {
          setError('Error al cargar componentes');
        } finally {
          setIsLoading(false);
        }
      };
      fetchComponents();
    }
  };
}

// Hook para builds
export function useBuilds(userId?: string) {
  const [builds, setBuilds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setIsLoading(true);
        const filter = userId ? { userId } : undefined;
        const data = await db.builds.findMany({ where: filter });
        setBuilds(data);
      } catch (err) {
        setError('Error al cargar builds');
        console.error('Error fetching builds:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilds();
  }, [userId]);

  const addBuild = async (buildData: any) => {
    try {
      const newBuild = await db.builds.create(buildData);
      setBuilds(prev => [...prev, newBuild]);
      return newBuild;
    } catch (err) {
      setError('Error al guardar build');
      throw err;
    }
  };

  const updateBuild = async (id: string, updates: any) => {
    try {
      const updated = await db.builds.update(id, updates);
      setBuilds(prev => prev.map(b => b.id === id ? updated : b));
      return updated;
    } catch (err) {
      setError('Error al actualizar build');
      throw err;
    }
  };

  const deleteBuild = async (id: string) => {
    try {
      await db.builds.delete(id);
      setBuilds(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError('Error al eliminar build');
      throw err;
    }
  };

  return {
    builds,
    isLoading,
    error,
    addBuild,
    updateBuild,
    deleteBuild,
    refetch: () => {
      const fetchBuilds = async () => {
        try {
          setIsLoading(true);
          const filter = userId ? { userId } : undefined;
          const data = await db.builds.findMany({ where: filter });
          setBuilds(data);
        } catch (err) {
          setError('Error al cargar builds');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBuilds();
    }
  };
}

// Hook para carrito de compras
export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('pcando_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pcando_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (component: any, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === component.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === component.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...component, quantity }];
    });
  };

  const removeFromCart = (componentId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== componentId));
  };

  const updateQuantity = (componentId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(componentId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === componentId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
}
