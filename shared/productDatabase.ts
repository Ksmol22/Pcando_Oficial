// Base de datos completa de productos de PC
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  description: string;
  specifications: Record<string, any>;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  compatibility: string[];
  warranty: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
  image: string;
}

// Categorías de productos
export const productCategories: ProductCategory[] = [
  {
    id: 'processors',
    name: 'Procesadores',
    description: 'CPUs Intel y AMD para todas las necesidades',
    subcategories: ['Intel', 'AMD', 'Gaming', 'Profesional'],
    image: '/images/categories/processors.jpg'
  },
  {
    id: 'graphics_cards',
    name: 'Tarjetas Gráficas',
    description: 'GPUs NVIDIA y AMD para gaming y trabajo profesional',
    subcategories: ['NVIDIA RTX', 'AMD Radeon', 'Gaming', 'Profesional'],
    image: '/images/categories/graphics.jpg'
  },
  {
    id: 'motherboards',
    name: 'Placas Madre',
    description: 'Motherboards para diferentes sockets y necesidades',
    subcategories: ['Intel LGA', 'AMD AM4/AM5', 'Gaming', 'Profesional'],
    image: '/images/categories/motherboards.jpg'
  },
  {
    id: 'memory',
    name: 'Memoria RAM',
    description: 'Módulos DDR4 y DDR5 de diferentes velocidades',
    subcategories: ['DDR4', 'DDR5', 'Gaming', 'Profesional'],
    image: '/images/categories/memory.jpg'
  },
  {
    id: 'storage',
    name: 'Almacenamiento',
    description: 'SSDs, HDDs y almacenamiento NVMe',
    subcategories: ['SSD', 'HDD', 'NVMe', 'Externo'],
    image: '/images/categories/storage.jpg'
  },
  {
    id: 'power_supplies',
    name: 'Fuentes de Poder',
    description: 'PSUs certificadas 80+ de diferentes potencias',
    subcategories: ['500W-700W', '700W-1000W', '1000W+', 'Modulares'],
    image: '/images/categories/psu.jpg'
  },
  {
    id: 'cases',
    name: 'Gabinetes',
    description: 'Cases de diferentes tamaños y estilos',
    subcategories: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'],
    image: '/images/categories/cases.jpg'
  },
  {
    id: 'cooling',
    name: 'Refrigeración',
    description: 'Sistemas de enfriamiento por aire y líquido',
    subcategories: ['Aire', 'Líquido', 'Ventiladores', 'Pasta Térmica'],
    image: '/images/categories/cooling.jpg'
  }
];

// Base de datos completa de productos
export const products: Product[] = [
  // PROCESADORES INTEL
  {
    id: 'intel-i9-13900k',
    name: 'Intel Core i9-13900K',
    brand: 'Intel',
    category: 'processors',
    subcategory: 'Intel',
    price: 589.99,
    currency: 'USD',
    description: 'Procesador Intel de 13va generación con 24 núcleos (8P+16E) y 32 hilos',
    specifications: {
      cores: '24 (8P+16E)',
      threads: 32,
      baseClock: '3.0 GHz',
      maxClock: '5.8 GHz',
      cache: '36 MB',
      socket: 'LGA 1700',
      tdp: '125W',
      architecture: 'Raptor Lake',
      process: '10nm'
    },
    images: ['/images/products/intel-i9-13900k-1.jpg', '/images/products/intel-i9-13900k-2.jpg'],
    stock: 45,
    rating: 4.8,
    reviews: 1247,
    features: ['Overclocking', 'Intel UHD Graphics 770', 'DDR5 Support', 'PCIe 5.0'],
    compatibility: ['LGA 1700', 'Z790', 'B760', 'H770'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'intel-i7-13700k',
    name: 'Intel Core i7-13700K',
    brand: 'Intel',
    category: 'processors',
    subcategory: 'Intel',
    price: 409.99,
    currency: 'USD',
    description: 'Procesador Intel ideal para gaming y productividad con 16 núcleos',
    specifications: {
      cores: '16 (8P+8E)',
      threads: 24,
      baseClock: '3.4 GHz',
      maxClock: '5.4 GHz',
      cache: '30 MB',
      socket: 'LGA 1700',
      tdp: '125W',
      architecture: 'Raptor Lake',
      process: '10nm'
    },
    images: ['/images/products/intel-i7-13700k-1.jpg'],
    stock: 67,
    rating: 4.7,
    reviews: 892,
    features: ['Overclocking', 'Intel UHD Graphics 770', 'DDR5 Support'],
    compatibility: ['LGA 1700', 'Z790', 'B760'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'intel-i5-13600k',
    name: 'Intel Core i5-13600K',
    brand: 'Intel',
    category: 'processors',
    subcategory: 'Intel',
    price: 319.99,
    currency: 'USD',
    description: 'Excelente procesador para gaming con gran relación precio-rendimiento',
    specifications: {
      cores: '14 (6P+8E)',
      threads: 20,
      baseClock: '3.5 GHz',
      maxClock: '5.1 GHz',
      cache: '24 MB',
      socket: 'LGA 1700',
      tdp: '125W',
      architecture: 'Raptor Lake',
      process: '10nm'
    },
    images: ['/images/products/intel-i5-13600k-1.jpg'],
    stock: 89,
    rating: 4.6,
    reviews: 1556,
    features: ['Overclocking', 'Intel UHD Graphics 770', 'Excelente para gaming'],
    compatibility: ['LGA 1700', 'Z790', 'B760'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // PROCESADORES AMD
  {
    id: 'amd-7950x',
    name: 'AMD Ryzen 9 7950X',
    brand: 'AMD',
    category: 'processors',
    subcategory: 'AMD',
    price: 699.99,
    currency: 'USD',
    description: 'Procesador AMD Zen 4 de 16 núcleos para máximo rendimiento',
    specifications: {
      cores: 16,
      threads: 32,
      baseClock: '4.5 GHz',
      maxClock: '5.7 GHz',
      cache: '64 MB',
      socket: 'AM5',
      tdp: '170W',
      architecture: 'Zen 4',
      process: '5nm'
    },
    images: ['/images/products/amd-7950x-1.jpg'],
    stock: 23,
    rating: 4.9,
    reviews: 743,
    features: ['AMD RDNA 2 Graphics', 'DDR5 Support', 'PCIe 5.0', 'Precision Boost 2'],
    compatibility: ['AM5', 'X670E', 'X670', 'B650E'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'amd-7800x3d',
    name: 'AMD Ryzen 7 7800X3D',
    brand: 'AMD',
    category: 'processors',
    subcategory: 'AMD',
    price: 449.99,
    currency: 'USD',
    description: 'El mejor procesador para gaming con tecnología 3D V-Cache',
    specifications: {
      cores: 8,
      threads: 16,
      baseClock: '4.2 GHz',
      maxClock: '5.0 GHz',
      cache: '96 MB (64MB 3D V-Cache)',
      socket: 'AM5',
      tdp: '120W',
      architecture: 'Zen 4',
      process: '5nm'
    },
    images: ['/images/products/amd-7800x3d-1.jpg'],
    stock: 34,
    rating: 4.9,
    reviews: 2156,
    features: ['3D V-Cache', 'Mejor para gaming', 'AMD RDNA 2 Graphics', 'DDR5'],
    compatibility: ['AM5', 'X670E', 'X670', 'B650E'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // TARJETAS GRÁFICAS NVIDIA
  {
    id: 'rtx-4090',
    name: 'NVIDIA GeForce RTX 4090',
    brand: 'NVIDIA',
    category: 'graphics_cards',
    subcategory: 'NVIDIA RTX',
    price: 1599.99,
    currency: 'USD',
    description: 'La tarjeta gráfica más potente para gaming 4K y creación de contenido',
    specifications: {
      gpu: 'AD102',
      memory: '24GB GDDR6X',
      memoryBus: '384-bit',
      coreClock: '2230 MHz',
      boostClock: '2520 MHz',
      cudaCores: 16384,
      rtCores: 128,
      tensorCores: 512,
      powerConsumption: '450W',
      connectors: ['3x DisplayPort 1.4a', '1x HDMI 2.1']
    },
    images: ['/images/products/rtx-4090-1.jpg', '/images/products/rtx-4090-2.jpg'],
    stock: 12,
    rating: 4.8,
    reviews: 892,
    features: ['Ray Tracing', 'DLSS 3', '4K Gaming', 'Content Creation', 'AV1 Encoding'],
    compatibility: ['PCIe 4.0 x16', '850W+ PSU recomendada'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'rtx-4080',
    name: 'NVIDIA GeForce RTX 4080',
    brand: 'NVIDIA',
    category: 'graphics_cards',
    subcategory: 'NVIDIA RTX',
    price: 1199.99,
    currency: 'USD',
    description: 'Excelente rendimiento para gaming 4K y 1440p',
    specifications: {
      gpu: 'AD103',
      memory: '16GB GDDR6X',
      memoryBus: '256-bit',
      coreClock: '2205 MHz',
      boostClock: '2505 MHz',
      cudaCores: 9728,
      rtCores: 76,
      tensorCores: 304,
      powerConsumption: '320W'
    },
    images: ['/images/products/rtx-4080-1.jpg'],
    stock: 28,
    rating: 4.7,
    reviews: 654,
    features: ['Ray Tracing', 'DLSS 3', '4K Gaming', 'AV1 Encoding'],
    compatibility: ['PCIe 4.0 x16', '750W+ PSU recomendada'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'rtx-4070-ti',
    name: 'NVIDIA GeForce RTX 4070 Ti',
    brand: 'NVIDIA',
    category: 'graphics_cards',
    subcategory: 'NVIDIA RTX',
    price: 799.99,
    currency: 'USD',
    description: 'Ideal para gaming 1440p con ray tracing',
    specifications: {
      gpu: 'AD104',
      memory: '12GB GDDR6X',
      memoryBus: '192-bit',
      coreClock: '2310 MHz',
      boostClock: '2610 MHz',
      cudaCores: 7680,
      rtCores: 60,
      tensorCores: 240,
      powerConsumption: '285W'
    },
    images: ['/images/products/rtx-4070ti-1.jpg'],
    stock: 45,
    rating: 4.6,
    reviews: 1234,
    features: ['Ray Tracing', 'DLSS 3', '1440p Gaming', 'Eficiencia energética'],
    compatibility: ['PCIe 4.0 x16', '700W+ PSU recomendada'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // TARJETAS GRÁFICAS AMD
  {
    id: 'rx-7900xtx',
    name: 'AMD Radeon RX 7900 XTX',
    brand: 'AMD',
    category: 'graphics_cards',
    subcategory: 'AMD Radeon',
    price: 999.99,
    currency: 'USD',
    description: 'Tarjeta gráfica de alto rendimiento con 24GB de memoria',
    specifications: {
      gpu: 'Navi 31',
      memory: '24GB GDDR6',
      memoryBus: '384-bit',
      coreClock: '1855 MHz',
      boostClock: '2500 MHz',
      streamProcessors: 6144,
      powerConsumption: '355W'
    },
    images: ['/images/products/rx-7900xtx-1.jpg'],
    stock: 19,
    rating: 4.5,
    reviews: 456,
    features: ['Ray Tracing', 'FSR 3', '4K Gaming', '24GB VRAM'],
    compatibility: ['PCIe 4.0 x16', '850W+ PSU recomendada'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // MEMORIA RAM
  {
    id: 'corsair-vengeance-ddr5-32gb',
    name: 'Corsair Vengeance DDR5-5600 32GB (2x16GB)',
    brand: 'Corsair',
    category: 'memory',
    subcategory: 'DDR5',
    price: 169.99,
    currency: 'USD',
    description: 'Memoria DDR5 de alta velocidad para sistemas modernos',
    specifications: {
      capacity: '32GB (2x16GB)',
      type: 'DDR5',
      speed: '5600 MHz',
      timings: 'CL36',
      voltage: '1.25V',
      heatspreader: 'Aluminio',
      rgb: false
    },
    images: ['/images/products/corsair-ddr5-32gb-1.jpg'],
    stock: 156,
    rating: 4.7,
    reviews: 892,
    features: ['DDR5-5600', 'Low Profile', 'Overclocking', 'Lifetime Warranty'],
    compatibility: ['Intel 12th Gen+', 'AMD Ryzen 7000+', 'DDR5 Motherboards'],
    warranty: 'De por vida',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'gskill-trident-rgb-ddr5-32gb',
    name: 'G.Skill Trident Z5 RGB DDR5-6000 32GB (2x16GB)',
    brand: 'G.Skill',
    category: 'memory',
    subcategory: 'DDR5',
    price: 219.99,
    currency: 'USD',
    description: 'Memoria DDR5 premium con iluminación RGB',
    specifications: {
      capacity: '32GB (2x16GB)',
      type: 'DDR5',
      speed: '6000 MHz',
      timings: 'CL30-38-38-96',
      voltage: '1.35V',
      heatspreader: 'Aluminio',
      rgb: true
    },
    images: ['/images/products/gskill-rgb-ddr5-1.jpg'],
    stock: 78,
    rating: 4.8,
    reviews: 567,
    features: ['RGB Lighting', 'DDR5-6000', 'Premium Design', 'Overclocking'],
    compatibility: ['Intel 12th Gen+', 'AMD Ryzen 7000+', 'RGB Software'],
    warranty: 'De por vida',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

export default { products, productCategories };
