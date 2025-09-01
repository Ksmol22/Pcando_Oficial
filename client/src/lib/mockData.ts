// Mock data para GitHub Pages (sin backend)
export const mockProducts = {
  cpu: [
    {
      id: "intel-i9-13900k",
      name: "Intel Core i9-13900K",
      brand: "Intel",
      price: 589.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        socket: "LGA1700",
        cores: "24 (8P+16E)",
        threads: 32,
        baseClock: "3.0 GHz",
        boostClock: "5.8 GHz",
        cache: "36 MB",
        tdp: "125W"
      },
      rating: 4.8,
      inStock: true
    },
    {
      id: "amd-7800x3d",
      name: "AMD Ryzen 7 7800X3D",
      brand: "AMD",
      price: 449.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        socket: "AM5",
        cores: 8,
        threads: 16,
        baseClock: "4.2 GHz",
        boostClock: "5.0 GHz",
        cache: "96 MB (64MB 3D V-Cache)",
        tdp: "120W"
      },
      rating: 4.9,
      inStock: true
    }
  ],
  gpu: [
    {
      id: "rtx-4090",
      name: "NVIDIA GeForce RTX 4090",
      brand: "NVIDIA",
      price: 1599.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        gpu: "AD102",
        memory: "24GB GDDR6X",
        coreClock: "2520 MHz",
        memoryClock: "21000 MHz",
        rtCores: 128,
        cudaCores: 16384,
        powerConsumption: "450W",
        length: "336mm"
      },
      rating: 4.7,
      inStock: true
    },
    {
      id: "rtx-4080",
      name: "NVIDIA GeForce RTX 4080",
      brand: "NVIDIA", 
      price: 1199.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        gpu: "AD103",
        memory: "16GB GDDR6X",
        coreClock: "2505 MHz",
        memoryClock: "22400 MHz",
        rtCores: 76,
        cudaCores: 9728,
        powerConsumption: "320W",
        length: "310mm"
      },
      rating: 4.6,
      inStock: true
    }
  ],
  ram: [
    {
      id: "corsair-vengeance-ddr5-32gb",
      name: "Corsair Vengeance DDR5-5600 32GB (2x16GB)",
      brand: "Corsair",
      price: 169.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        type: "DDR5",
        capacity: "32GB",
        speed: "5600 MHz",
        timings: "CL36",
        voltage: "1.25V",
        rgb: false
      },
      rating: 4.5,
      inStock: true
    }
  ],
  motherboard: [
    {
      id: "asus-rog-z790-hero",
      name: "ASUS ROG Strix Z790-E Gaming WiFi",
      brand: "ASUS",
      price: 479.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        socket: "LGA1700",
        formFactor: "ATX",
        chipset: "Z790",
        memorySlots: 4,
        maxMemory: "128GB",
        memoryType: "DDR5",
        wifi: "WiFi 6E",
        ethernet: "2.5Gb",
        usb: "USB 3.2 Gen2 Type-C, USB 3.2 Gen1"
      },
      rating: 4.7,
      inStock: true
    }
  ],
  storage: [
    {
      id: "samsung-980-pro-2tb",
      name: "Samsung 980 PRO 2TB NVMe SSD",
      brand: "Samsung",
      price: 199.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        type: "NVMe M.2",
        capacity: "2TB",
        interface: "PCIe 4.0 x4",
        readSpeed: "7000 MB/s",
        writeSpeed: "6900 MB/s",
        nand: "V-NAND 3-bit MLC",
        warranty: "5 years"
      },
      rating: 4.8,
      inStock: true
    }
  ],
  psu: [
    {
      id: "corsair-rm850x-80plus-gold",
      name: "Corsair RM850x 850W 80+ Gold Modular",
      brand: "Corsair",
      price: 149.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modular: "Fully Modular",
        fan: "135mm ML Series",
        warranty: "10 years"
      },
      rating: 4.6,
      inStock: true
    }
  ],
  case: [
    {
      id: "lian-li-o11-dynamic",
      name: "Lian Li O11 Dynamic Mid-Tower",
      brand: "Lian Li",
      price: 139.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        type: "Mid-Tower",
        motherboardSupport: "Mini-ITX, Micro-ATX, ATX, E-ATX",
        maxGpuLength: "420mm",
        maxCpuCoolerHeight: "155mm",
        weight: "12.9 kg",
        fanSlots: {
          top: "3x 120mm or 2x 140mm",
          bottom: "3x 120mm",
          side: "3x 120mm"
        }
      },
      rating: 4.8,
      inStock: true
    }
  ],
  cooler: [
    {
      id: "noctua-nh-d15",
      name: "Noctua NH-D15 CPU Cooler",
      brand: "Noctua",
      price: 109.99,
      imageUrl: "/api/placeholder/300/200",
      specifications: {
        type: "Air Cooler",
        fans: "2x NF-A15 PWM (140mm)",
        height: "165mm",
        sockets: ["LGA1700", "LGA1200", "AM5", "AM4"],
        rpm: "300-1500 RPM",
        noise: "24.6 dB(A)"
      },
      rating: 4.9,
      inStock: true
    }
  ]
};

export const getComponentsByType = (type: string) => {
  return mockProducts[type as keyof typeof mockProducts] || [];
};
