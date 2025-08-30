// Mock database for development without PostgreSQL
import * as schema from "@shared/schema";

// Mock data
const mockUsers = [
  {
    id: "dev-user-123",
    email: "developer@pcando.com",
    firstName: "Developer",
    lastName: "User", 
    profileImageUrl: "https://via.placeholder.com/150",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockComponents = [
  {
    id: "cpu-1",
    name: "AMD Ryzen 7 7800X3D",
    type: "cpu" as const,
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
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "gpu-1", 
    name: "NVIDIA RTX 4080",
    type: "gpu" as const,
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
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockBuilds = [
  {
    id: "build-1",
    userId: "dev-user-123",
    name: "Gaming PC 2024",
    description: "High-end gaming build for 1440p gaming",
    isPublic: true,
    useCase: "gaming",
    totalPrice: "2500.00",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Mock storage implementation
export const mockStorage = {
  async getUser(id: string) {
    return mockUsers.find(u => u.id === id);
  },

  async upsertUser(userData: any) {
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      Object.assign(existingUser, userData, { updatedAt: new Date() });
      return existingUser;
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newUser);
      return newUser;
    }
  },

  async getComponents() {
    return mockComponents.filter(c => c.isActive);
  },

  async getComponentsByType(type: string) {
    return mockComponents.filter(c => c.type === type && c.isActive);
  },

  async getComponent(id: string) {
    return mockComponents.find(c => c.id === id);
  },

  async getBuilds(userId?: string) {
    if (userId) {
      return mockBuilds.filter(b => b.userId === userId);
    }
    return mockBuilds.filter(b => b.isPublic);
  },

  async getBuild(id: string) {
    return mockBuilds.find(b => b.id === id);
  }
};

// Mock pool and db exports to match the real db.ts interface
export const pool = {
  query: async () => ({ rows: [] }),
  connect: async () => {},
  end: async () => {}
};

export const db = {
  select: () => ({ from: () => ({ where: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
  delete: () => ({ where: () => Promise.resolve() })
};
