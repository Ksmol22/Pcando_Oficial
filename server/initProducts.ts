import { products } from '../shared/productDatabase';
import { storage } from './storage';

export async function initializeProducts() {
  try {
    console.log('🔄 Inicializando productos en la base de datos...');
    
    // Verificar si ya hay productos en la base de datos
    const existingComponents = await storage.getComponents();
    
    if (existingComponents.length > 0) {
      console.log(`✅ Ya existen ${existingComponents.length} productos en la base de datos`);
      return;
    }

    // Convertir productos de productDatabase.ts al formato de la base de datos
    let addedCount = 0;
    for (const product of products) {
      try {
        // Mapear categorías del productDatabase al formato de la BD
        let dbCategory = product.category;
        
        // Mapear categorías específicas
        switch (product.category) {
          case 'processors':
            dbCategory = 'cpu';
            break;
          case 'graphics_cards':
            dbCategory = 'gpu';
            break;
          case 'memory':
            dbCategory = 'ram';
            break;
          case 'motherboards':
            dbCategory = 'motherboard';
            break;
          // Las demás categorías ya coinciden: storage, psu, case, cooler
        }

        const componentData = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          type: dbCategory as any,
          model: null, // Campo opcional ahora
          imageUrl: product.images?.[0] || null,
          specifications: product.specifications || {},
          basePrice: product.price.toString(),
          isActive: product.isActive ?? true,
          createdAt: new Date(product.createdAt || new Date()),
          updatedAt: new Date(product.updatedAt || new Date())
        };

        await storage.createComponent(componentData);
        addedCount++;
        
      } catch (error) {
        console.error(`❌ Error adding product ${product.id}:`, error);
      }
    }

    console.log(`✅ Agregados ${addedCount} productos a la base de datos`);
    
  } catch (error) {
    console.error('❌ Error inicializando productos:', error);
  }
}
