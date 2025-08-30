import { db } from "./db";
import { components, suppliers, componentPrices } from "@shared/schema";

// Datos de ejemplo para probar la aplicación
export async function seedDatabase() {
  console.log("🌱 Iniciando seed de la base de datos...");

  try {
    // Insertar proveedores
    const [amazon, newegg, bestbuy] = await db
      .insert(suppliers)
      .values([
        {
          name: "Amazon",
          website: "https://amazon.com",
          logoUrl: "https://logo.clearbit.com/amazon.com",
          shippingInfo: "Envío gratis con Prime",
        },
        {
          name: "Newegg",
          website: "https://newegg.com",
          logoUrl: "https://logo.clearbit.com/newegg.com",
          shippingInfo: "Envío desde $4.99",
        },
        {
          name: "Best Buy",
          website: "https://bestbuy.com",
          logoUrl: "https://logo.clearbit.com/bestbuy.com",
          shippingInfo: "Recogida en tienda disponible",
        },
      ])
      .returning();

    // Insertar componentes de ejemplo
    const cpus = await db
      .insert(components)
      .values([
        {
          name: "AMD Ryzen 7 7800X3D",
          type: "cpu",
          brand: "AMD",
          model: "7800X3D",
          basePrice: "449.99",
          specifications: {
            cores: 8,
            threads: 16,
            baseClock: "4.2 GHz",
            boostClock: "5.0 GHz",
            cache: "96MB L3",
            tdp: "120W",
            socket: "AM5",
          },
        },
        {
          name: "Intel Core i7-13700K",
          type: "cpu",
          brand: "Intel",
          model: "13700K",
          basePrice: "409.99",
          specifications: {
            cores: 16,
            threads: 24,
            baseClock: "3.4 GHz",
            boostClock: "5.4 GHz",
            cache: "30MB L3",
            tdp: "125W",
            socket: "LGA1700",
          },
        },
      ])
      .returning();

    const gpus = await db
      .insert(components)
      .values([
        {
          name: "NVIDIA RTX 4080",
          type: "gpu",
          brand: "NVIDIA",
          model: "RTX 4080",
          basePrice: "1199.99",
          specifications: {
            memory: "16GB GDDR6X",
            coreClock: "2205 MHz",
            boostClock: "2505 MHz",
            memoryBandwidth: "736 GB/s",
            rtCores: 76,
            tensorCores: 304,
            powerConsumption: "320W",
          },
        },
        {
          name: "AMD RX 7800 XT",
          type: "gpu",
          brand: "AMD",
          model: "RX 7800 XT",
          basePrice: "499.99",
          specifications: {
            memory: "16GB GDDR6",
            baseClock: "1295 MHz",
            gameClock: "2124 MHz",
            boostClock: "2430 MHz",
            memoryBandwidth: "624 GB/s",
            powerConsumption: "263W",
          },
        },
      ])
      .returning();

    const ram = await db
      .insert(components)
      .values([
        {
          name: "Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200",
          type: "ram",
          brand: "Corsair",
          model: "Vengeance LPX",
          basePrice: "129.99",
          specifications: {
            capacity: "32GB",
            type: "DDR4",
            speed: "3200 MHz",
            latency: "CL16",
            voltage: "1.35V",
            modules: "2x16GB",
          },
        },
        {
          name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000",
          type: "ram",
          brand: "G.Skill",
          model: "Trident Z5 RGB",
          basePrice: "199.99",
          specifications: {
            capacity: "32GB",
            type: "DDR5",
            speed: "6000 MHz",
            latency: "CL36",
            voltage: "1.35V",
            modules: "2x16GB",
            rgb: true,
          },
        },
      ])
      .returning();

    // Insertar precios de ejemplo
    await db.insert(componentPrices).values([
      // Precios para AMD Ryzen 7 7800X3D
      {
        componentId: cpus[0].id,
        supplierId: amazon.id,
        price: "449.99",
        stock: 15,
      },
      {
        componentId: cpus[0].id,
        supplierId: newegg.id,
        price: "459.99",
        stock: 8,
        shippingCost: "9.99",
      },
      // Precios para RTX 4080
      {
        componentId: gpus[0].id,
        supplierId: amazon.id,
        price: "1199.99",
        stock: 5,
      },
      {
        componentId: gpus[0].id,
        supplierId: bestbuy.id,
        price: "1249.99",
        stock: 12,
      },
    ]);

    console.log("✅ Seed de la base de datos completado exitosamente!");
    console.log(`📊 Insertados:`);
    console.log(`   - ${3} proveedores`);
    console.log(`   - ${6} componentes`);
    console.log(`   - ${4} precios`);

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

// Ejecutar si el archivo se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Proceso de seed completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error fatal durante el seed:", error);
      process.exit(1);
    });
}
