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
  },

  // MOTHERBOARDS
  {
    id: 'asus-rog-z790-hero',
    name: 'ASUS ROG Strix Z790-E Gaming WiFi',
    brand: 'ASUS',
    category: 'motherboard',
    subcategory: 'Intel LGA1700',
    price: 479.99,
    currency: 'USD',
    description: 'Placa base premium Z790 con WiFi 6E y PCIe 5.0',
    specifications: {
      socket: 'LGA 1700',
      chipset: 'Intel Z790',
      ramSlots: 4,
      maxRam: '128GB',
      ramType: 'DDR5',
      pciSlots: 'PCIe 5.0 x16 (2), PCIe 4.0 x16 (1)',
      m2Slots: 4,
      ethernet: 'Intel 2.5Gb',
      wifi: 'WiFi 6E',
      bluetooth: '5.3',
      usb: 'USB 3.2 Gen2 Type-C, USB 3.2 Gen1',
      audio: 'SupremeFX 7.1',
      formFactor: 'ATX'
    },
    images: ['/images/products/asus-z790-hero.jpg'],
    stock: 45,
    rating: 4.8,
    reviews: 234,
    features: ['WiFi 6E', 'PCIe 5.0', 'DDR5 Support', 'RGB Aura Sync', 'Premium Audio'],
    compatibility: ['Intel 12th/13th Gen', 'DDR5 Memory', 'ATX Cases'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'msi-b550-tomahawk',
    name: 'MSI MAG B550 TOMAHAWK',
    brand: 'MSI',
    category: 'motherboard',
    subcategory: 'AMD AM4',
    price: 179.99,
    currency: 'USD',
    description: 'Placa base B550 confiable para AMD Ryzen',
    specifications: {
      socket: 'AM4',
      chipset: 'AMD B550',
      ramSlots: 4,
      maxRam: '128GB',
      ramType: 'DDR4',
      pciSlots: 'PCIe 4.0 x16 (1), PCIe 3.0 x16 (1)',
      m2Slots: 2,
      ethernet: 'Realtek RTL8125B 2.5Gb',
      wifi: 'No',
      usb: 'USB 3.2 Gen2, USB 3.2 Gen1',
      audio: 'Realtek ALC1200',
      formFactor: 'ATX'
    },
    images: ['/images/products/msi-b550-tomahawk.jpg'],
    stock: 67,
    rating: 4.6,
    reviews: 445,
    features: ['AMD B550', 'PCIe 4.0', 'M.2 Shield', 'Pre-installed I/O Shield'],
    compatibility: ['AMD Ryzen 3000/5000', 'DDR4 Memory', 'ATX Cases'],
    warranty: '3 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // ALMACENAMIENTO
  {
    id: 'samsung-980-pro-2tb',
    name: 'Samsung 980 PRO 2TB NVMe SSD',
    brand: 'Samsung',
    category: 'storage',
    subcategory: 'NVMe SSD',
    price: 199.99,
    currency: 'USD',
    description: 'SSD NVMe PCIe 4.0 de alto rendimiento',
    specifications: {
      capacity: '2TB',
      type: 'NVMe M.2',
      interface: 'PCIe 4.0 x4',
      formFactor: '2280',
      readSpeed: '7,000 MB/s',
      writeSpeed: '5,100 MB/s',
      nand: 'V-NAND 3-bit MLC',
      controller: 'Samsung Elpis',
      warranty: '5 years'
    },
    images: ['/images/products/samsung-980-pro.jpg'],
    stock: 89,
    rating: 4.9,
    reviews: 1234,
    features: ['PCIe 4.0', 'High Performance', 'Low Power', 'Samsung Magician'],
    compatibility: ['M.2 Slots', 'PCIe 4.0/3.0', 'PS5 Compatible'],
    warranty: '5 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'wd-black-sn850x-1tb',
    name: 'WD Black SN850X 1TB NVMe SSD',
    brand: 'Western Digital',
    category: 'storage',
    subcategory: 'NVMe SSD',
    price: 129.99,
    currency: 'USD',
    description: 'SSD gaming de alta velocidad con heatsink',
    specifications: {
      capacity: '1TB',
      type: 'NVMe M.2',
      interface: 'PCIe 4.0 x4',
      formFactor: '2280',
      readSpeed: '7,300 MB/s',
      writeSpeed: '6,600 MB/s',
      nand: '3D NAND',
      heatsink: 'Incluido',
      warranty: '5 years'
    },
    images: ['/images/products/wd-black-sn850x.jpg'],
    stock: 156,
    rating: 4.7,
    reviews: 887,
    features: ['Gaming SSD', 'Heatsink Incluido', 'WD_BLACK Dashboard', 'PCIe 4.0'],
    compatibility: ['Gaming Motherboards', 'PS5 Ready', 'PCIe 4.0'],
    warranty: '5 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // FUENTES DE PODER
  {
    id: 'corsair-rm850x-80plus-gold',
    name: 'Corsair RM850x 850W 80+ Gold Modular',
    brand: 'Corsair',
    category: 'psu',
    subcategory: 'Modular',
    price: 149.99,
    currency: 'USD',
    description: 'Fuente modular 80+ Gold de alta eficiencia',
    specifications: {
      wattage: '850W',
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      fan: '135mm ML Series',
      protection: 'OVP, OCP, OTP, SCP, UVP',
      connectors: {
        'ATX 24-pin': 1,
        'EPS 8-pin': 2,
        'PCIe 6+2-pin': 6,
        'SATA': 8,
        'Molex': 4
      }
    },
    images: ['/images/products/corsair-rm850x.jpg'],
    stock: 78,
    rating: 4.8,
    reviews: 1567,
    features: ['80+ Gold', 'Fully Modular', 'Zero RPM Mode', '10 Year Warranty'],
    compatibility: ['ATX Systems', 'High-End Gaming', 'Workstations'],
    warranty: '10 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'evga-supernova-750-g6',
    name: 'EVGA SuperNOVA 750 G6 80+ Gold',
    brand: 'EVGA',
    category: 'psu',
    subcategory: 'Modular',
    price: 119.99,
    currency: 'USD',
    description: 'Fuente compacta y eficiente 80+ Gold',
    specifications: {
      wattage: '750W',
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      fan: '135mm Fluid Dynamic Bearing',
      protection: 'OVP, OCP, OTP, SCP, UVP, OPP',
      size: '150mm (Compact)',
      connectors: {
        'ATX 24-pin': 1,
        'EPS 8-pin': 2,
        'PCIe 6+2-pin': 4,
        'SATA': 8,
        'Molex': 4
      }
    },
    images: ['/images/products/evga-750-g6.jpg'],
    stock: 92,
    rating: 4.7,
    reviews: 1123,
    features: ['Compact Design', '80+ Gold', 'Fully Modular', 'Quiet Operation'],
    compatibility: ['Compact Cases', 'Gaming Systems', 'ATX'],
    warranty: '10 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // GABINETES
  {
    id: 'lian-li-o11-dynamic',
    name: 'Lian Li O11 Dynamic Mid-Tower',
    brand: 'Lian Li',
    category: 'case',
    subcategory: 'Mid-Tower',
    price: 139.99,
    currency: 'USD',
    description: 'Gabinete mid-tower con panel lateral de cristal',
    specifications: {
      type: 'Mid-Tower',
      motherboard: 'E-ATX, ATX, Micro-ATX, Mini-ITX',
      dimensions: '445 x 285 x 465mm',
      weight: '12.9 kg',
      sidePanels: 'Tempered Glass',
      frontPanels: 'Tempered Glass',
      maxGpuLength: '420mm',
      maxCpuCoolerHeight: '165mm',
      maxPsuLength: '200mm',
      fanSlots: {
        front: '3x 120mm',
        top: '3x 120mm',
        bottom: '3x 120mm'
      },
      radiatorSupport: '360mm'
    },
    images: ['/images/products/lian-li-o11.jpg'],
    stock: 34,
    rating: 4.9,
    reviews: 2345,
    features: ['Tempered Glass', 'Excellent Airflow', 'Cable Management', 'Premium Build'],
    compatibility: ['E-ATX Motherboards', 'Long GPUs', '360mm Radiators'],
    warranty: '2 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'fractal-meshify-c',
    name: 'Fractal Design Meshify C',
    brand: 'Fractal Design',
    category: 'case',
    subcategory: 'Mid-Tower',
    price: 109.99,
    currency: 'USD',
    description: 'Gabinete compacto con excelente flujo de aire',
    specifications: {
      type: 'Mid-Tower',
      motherboard: 'ATX, Micro-ATX, Mini-ITX',
      dimensions: '395 x 212 x 440mm',
      weight: '7.5 kg',
      sidePanels: 'Tempered Glass',
      frontPanels: 'Mesh',
      maxGpuLength: '315mm',
      maxCpuCoolerHeight: '170mm',
      maxPsuLength: '175mm',
      fanSlots: {
        front: '2x 120mm (included)',
        rear: '1x 120mm (included)',
        top: '2x 120mm'
      },
      radiatorSupport: '280mm'
    },
    images: ['/images/products/fractal-meshify-c.jpg'],
    stock: 67,
    rating: 4.8,
    reviews: 1789,
    features: ['Mesh Front Panel', 'Compact Design', 'Great Airflow', 'Easy Build'],
    compatibility: ['ATX Motherboards', 'Standard Components', 'AIO Coolers'],
    warranty: '2 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },

  // REFRIGERACIÓN
  {
    id: 'noctua-nh-d15',
    name: 'Noctua NH-D15 CPU Cooler',
    brand: 'Noctua',
    category: 'cooler',
    subcategory: 'Air Cooling',
    price: 109.99,
    currency: 'USD',
    description: 'Cooler por aire de doble torre premium',
    specifications: {
      type: 'Air Cooler',
      height: '165mm',
      fans: '2x NF-A15 PWM (140mm)',
      heatpipes: '6x 6mm',
      compatibility: 'Intel LGA1700, AMD AM4/AM5',
      maxTdp: '220W',
      noise: '24.6 dB(A)',
      rpm: '300-1500 RPM',
      mounting: 'SecuFirm2'
    },
    images: ['/images/products/noctua-nh-d15.jpg'],
    stock: 123,
    rating: 4.9,
    reviews: 3456,
    features: ['Premium Performance', 'Ultra Quiet', '6 Year Warranty', 'Easy Installation'],
    compatibility: ['Intel LGA1700/1200/115x', 'AMD AM4/AM5', 'Tall Cases'],
    warranty: '6 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'corsair-h100i-elite-capellix',
    name: 'Corsair H100i Elite Capellix 240mm AIO',
    brand: 'Corsair',
    category: 'cooler',
    subcategory: 'Liquid Cooling',
    price: 149.99,
    currency: 'USD',
    description: 'Refrigeración líquida AIO de 240mm con RGB',
    specifications: {
      type: 'AIO Liquid Cooler',
      radiatorSize: '240mm',
      fans: '2x ML120 RGB PWM (120mm)',
      pumpRpm: '2400 RPM',
      compatibility: 'Intel LGA1700, AMD AM4/AM5',
      tubing: '400mm Low-Permeation',
      rgb: 'Capellix RGB',
      software: 'iCUE Compatible',
      warranty: '5 years'
    },
    images: ['/images/products/corsair-h100i.jpg'],
    stock: 87,
    rating: 4.7,
    reviews: 2234,
    features: ['240mm Radiator', 'RGB Lighting', 'iCUE Software', 'Zero RPM Mode'],
    compatibility: ['Most Modern CPUs', '240mm Radiator Support', 'RGB Systems'],
    warranty: '5 años',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

export default { products, productCategories };
