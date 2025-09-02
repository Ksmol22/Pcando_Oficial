import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from '@shared/schema';

// Mock data for development/demo purposes
export const mockComponents = [
  {
    id: "1",
    name: "Intel Core i7-13700K",
    category: "cpu",
    price: 450.00,
    imageUrl: "/images/cpu-intel.jpg",
    description: "Procesador Intel de 13va generación, 16 núcleos",
    specifications: {
      cores: 16,
      threads: 24,
      baseClock: "3.4 GHz",
      boostClock: "5.4 GHz",
      socket: "LGA 1700"
    },
    compatibility: ["motherboard-z790", "ddr5"],
    performanceScore: 95,
    stock: 10
  },
  {
    id: "2", 
    name: "AMD Ryzen 7 7700X",
    category: "cpu",
    price: 400.00,
    imageUrl: "/images/cpu-amd.jpg", 
    description: "Procesador AMD Zen 4, 8 núcleos de alta performance",
    specifications: {
      cores: 8,
      threads: 16,
      baseClock: "4.5 GHz",
      boostClock: "5.4 GHz",
      socket: "AM5"
    },
    compatibility: ["motherboard-x670", "ddr5"],
    performanceScore: 90,
    stock: 15
  },
  {
    id: "3",
    name: "NVIDIA RTX 4070 Super",
    category: "gpu", 
    price: 600.00,
    imageUrl: "/images/gpu-rtx4070.jpg",
    description: "Tarjeta gráfica de gama alta para gaming 4K",
    specifications: {
      memory: "12GB GDDR6X",
      baseClock: "1980 MHz",
      boostClock: "2475 MHz", 
      ports: ["3x DisplayPort", "1x HDMI"],
      power: "220W"
    },
    compatibility: ["pcie-4.0"],
    performanceScore: 88,
    stock: 8
  },
  {
    id: "4",
    name: "G.Skill Trident Z5 32GB DDR5",
    category: "memory",
    price: 180.00,
    imageUrl: "/images/ram-gskill.jpg",
    description: "Memoria RAM DDR5 de alta velocidad, 32GB (2x16GB)",
    specifications: {
      capacity: "32GB",
      speed: "6000 MHz",
      type: "DDR5",
      modules: "2x16GB",
      latency: "CL30"
    },
    compatibility: ["ddr5"],
    performanceScore: 92,
    stock: 20
  },
  {
    id: "5",
    name: "Samsung 980 PRO 1TB NVMe",
    category: "storage",
    price: 120.00,
    imageUrl: "/images/ssd-samsung.jpg",
    description: "SSD NVMe PCIe 4.0 de alta velocidad",
    specifications: {
      capacity: "1TB",
      interface: "NVMe PCIe 4.0",
      readSpeed: "7000 MB/s",
      writeSpeed: "5000 MB/s",
      type: "M.2 2280"
    },
    compatibility: ["nvme-m2"],
    performanceScore: 95,
    stock: 25
  }
];

export const mockBuilds = [
  {
    id: "1",
    name: "Gaming Pro Build",
    description: "Configuración optimizada para gaming en 1440p",
    components: ["1", "3", "4", "5"],
    totalPrice: 1350.00,
    performanceScore: 90,
    category: "gaming",
    userId: "demo-user"
  }
];

// Simple localStorage-based database simulation
class LocalStorageDB {
  private getKey(table: string): string {
    return `pcando_${table}`;
  }

  async select(table: string, conditions?: any): Promise<any[]> {
    const data = localStorage.getItem(this.getKey(table));
    let items = data ? JSON.parse(data) : [];
    
    // Initialize with mock data if empty
    if (items.length === 0) {
      if (table === 'components') {
        items = mockComponents;
        localStorage.setItem(this.getKey(table), JSON.stringify(items));
      } else if (table === 'builds') {
        items = mockBuilds;
        localStorage.setItem(this.getKey(table), JSON.stringify(items));
      }
    }
    
    // Apply simple filtering
    if (conditions) {
      items = items.filter((item: any) => {
        return Object.keys(conditions).every(key => {
          if (conditions[key] === undefined) return true;
          return item[key] === conditions[key];
        });
      });
    }
    
    return items;
  }

  async insert(table: string, data: any): Promise<any> {
    const items = await this.select(table);
    const newItem = { ...data, id: Date.now().toString() };
    items.push(newItem);
    localStorage.setItem(this.getKey(table), JSON.stringify(items));
    return newItem;
  }

  async update(table: string, id: string, data: any): Promise<any> {
    const items = await this.select(table);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...data };
      localStorage.setItem(this.getKey(table), JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const items = await this.select(table);
    const filteredItems = items.filter((item: any) => item.id !== id);
    localStorage.setItem(this.getKey(table), JSON.stringify(filteredItems));
    return filteredItems.length < items.length;
  }
}

// Create a singleton instance
export const localDb = new LocalStorageDB();

// Mock database object that mimics Drizzle ORM structure
export const db = {
  select: () => ({
    from: (table: any) => ({
      where: (condition: any) => localDb.select(table.name || 'components', condition),
      execute: () => localDb.select('components')
    })
  }),
  components: {
    findMany: (options?: any) => localDb.select('components', options?.where),
    findFirst: async (options?: any) => {
      const results = await localDb.select('components', options?.where);
      return results[0] || null;
    },
    create: (data: any) => localDb.insert('components', data),
    update: (id: string, data: any) => localDb.update('components', id, data),
    delete: (id: string) => localDb.delete('components', id)
  },
  builds: {
    findMany: (options?: any) => localDb.select('builds', options?.where),
    findFirst: async (options?: any) => {
      const results = await localDb.select('builds', options?.where);
      return results[0] || null;
    },
    create: (data: any) => localDb.insert('builds', data),
    update: (id: string, data: any) => localDb.update('builds', id, data),
    delete: (id: string) => localDb.delete('builds', id)
  }
};

export default db;
