
import { Product, Review, CatalogData } from './types';

const MOCK_DELAY_MS = 500;

const data: CatalogData = {
  "products": [
    {
      "productId": "AETHER-CORE-15",
      "productName": "AetherTech Core 15 Pro Laptop",
      "manufacturer": "AetherTech",
      "category": "Laptop",
      "price": 1899.99,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Premium 15-inch powerhouse for creative professionals and demanding users.",
      "longDescription": "The AetherTech Core 15 Pro features a stunning Edge-to-Edge OLED display, latest-gen Intel Core processors, and powerful discrete graphics, making it ideal for video editing, graphic design, and intensive productivity tasks. Its sleek unibody design ensures durability and style.",
      "specifications": {
        "processor": "Intel Core i7-13700H (14-core)",
        "graphicsCard": "NVIDIA GeForce RTX 4060 8GB GDDR6",
        "ram": "32GB DDR5 4800MHz",
        "storage": "1TB PCIe Gen4 NVMe SSD",
        "display": "15.6-inch OLED, 3.5K (3456 x 2160), Touch, 400 nits, 100% DCI-P3",
        "batteryLifeHours": 10,
        "weightKg": 1.92,
        "ports": ["2x Thunderbolt 4 (USB-C)", "1x USB 3.2 Gen 2 Type-C", "SD Card Reader", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Home",
        "webcam": "1080p FHD"
      },
      "features": [
        "Edge-to-Edge OLED Display",
        "Precision-milled aluminum chassis",
        "Ultra-responsive Trackpad",
        "Spatial Audio",
        "Advanced Thermal Design"
      ],
      "availableColors": ["Space Grey", "Lunar Silver"]
    },
    {
      "productId": "STREAMLINE-STUDIOBOOK-14",
      "productName": "StreamLine StudioBook 14 (S3 Pro)",
      "manufacturer": "StreamLine Computing",
      "category": "Laptop",
      "price": 2299.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Compact creative powerhouse with incredible efficiency and stunning display.",
      "longDescription": "The 14-inch StreamLine StudioBook with the S3 Pro chip delivers groundbreaking performance for demanding professional workflows. Its Retina XDR display is unparalleled, and the legendary battery life means you can create on the go for extended periods. Perfect for coding, video editing, and music production.",
      "specifications": {
        "processor": "StreamLine S3 Pro chip (11-core CPU, 14-core GPU)",
        "graphicsCard": "Integrated StreamLine S3 Pro 14-core GPU",
        "ram": "18GB Unified Memory",
        "storage": "512GB SSD",
        "display": "14.2-inch Liquid Retina XDR, 3024 x 1964, 1600 nits peak, ProMotion",
        "batteryLifeHours": 18,
        "weightKg": 1.62,
        "ports": ["3x SuperPort 4 (USB-C)", "HDMI", "UHS-II Card slot", "MagLink 3", "Headphone Jack"],
        "operatingSystem": "ArtisanOS Sonoma",
        "webcam": "1080p StudioCam HD"
      },
      "features": [
        "Liquid Retina XDR Display",
        "ProMotion Dynamic Refresh",
        "Unibody Aluminum Design",
        "Immersive Spatial Audio",
        "Ergonomic TouchPad"
      ],
      "availableColors": ["Obsidian Black", "Titanium Silver"]
    },
    {
      "productId": "FUSION-APEX-16",
      "productName": "Fusion Dynamics Apex 16 Gaming Laptop",
      "manufacturer": "Fusion Dynamics",
      "category": "Gaming Laptop",
      "price": 2499.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtaW5nJTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtaW5nJTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Unleash ultimate gaming power with the Fusion Dynamics Apex 16.",
      "longDescription": "Experience unparalleled gaming performance with the Fusion Dynamics Apex 16. Equipped with the latest Intel Core i9 processor and a top-tier NVIDIA RTX 4080, this machine is built for competitive gaming and demanding tasks. Its high-refresh-rate QHD display ensures smooth, immersive visuals, while advanced cooling keeps everything running optimally.",
      "specifications": {
        "processor": "Intel Core i9-14900HX (24-core)",
        "graphicsCard": "NVIDIA GeForce RTX 4080 12GB GDDR6",
        "ram": "64GB DDR5 5600MHz",
        "storage": "2TB PCIe Gen4 NVMe SSD",
        "display": "16-inch QHD (2560 x 1600), 240Hz, 500 nits, Fusion-Sync",
        "batteryLifeHours": 6,
        "weightKg": 2.6,
        "ports": ["1x SuperPort 4 (USB-C)", "2x USB 3.2 Gen 2 Type-A", "HDMI 2.1", "RJ45 Ethernet", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Pro",
        "webcam": "1080p FHD"
      },
      "features": [
        "Vapor Chamber Cooling System",
        "Customizable RGB mechanical keyboard",
        "Dynamic Audio Engine",
        "Reinforced Magnesium-Aluminum Chassis",
        "Dedicated MUX Switch"
      ],
      "availableColors": ["Cosmic Black", "Deep Red"]
    },
    {
      "productId": "ZENITH-AURAFLOW-13",
      "productName": "Zenith AuraFlow 13 Ultrabook",
      "manufacturer": "Zenith Tech",
      "category": "Ultrabook",
      "price": 1299.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1589561084266-07412adeb710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dWx0cmFib29rfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1589561084266-07412adeb710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dWx0cmFib29rfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Ultra-portable and elegant for on-the-go productivity.",
      "longDescription": "The Zenith AuraFlow 13 combines a stunning, vibrant display with an ultra-lightweight design, making it the perfect companion for business professionals, developers (great for programming), and students. Its efficient Intel Core Ultra processor delivers excellent battery life and snappy performance for everyday tasks, web Browse, and document editing.",
      "specifications": {
        "processor": "Intel Core Ultra 7 155H (16-core)",
        "graphicsCard": "Integrated Intel Arc Graphics",
        "ram": "16GB LPDDR5X 7467MHz",
        "storage": "512GB PCIe Gen4 NVMe SSD",
        "display": "13.3-inch QHD+ (2880 x 1800) OLED, Touch, 600 nits, 100% DCI-P3",
        "batteryLifeHours": 15,
        "weightKg": 0.98,
        "ports": ["2x SuperPort 4 (USB-C)", "1x USB 3.2 Gen 1 Type-A", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Home",
        "webcam": "1080p FHD IR (VisionSense)"
      },
      "features": [
        "Ultra-light Magnesium Alloy Chassis",
        "ErgoLift Hinge Design",
        "AI-powered Noise Cancellation",
        "Hyper-speed Wi-Fi 7",
        "Integrated Fingerprint Reader"
      ],
      "availableColors": ["Luna White", "Midnight Grey"]
    },
    {
      "productId": "VIRTUO-PROBOOK-15",
      "productName": "VirtuoSystems ProBook 15",
      "manufacturer": "VirtuoSystems",
      "category": "Laptop",
      "price": 799.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcHxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcHxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Reliable and affordable 15-inch laptop for daily productivity and learning.",
      "longDescription": "The VirtuoSystems ProBook 15 is designed for dependable daily performance, perfect for students, small businesses, and home users (personal use). It features a responsive Intel Core i5 processor, ample storage, and a comfortable keyboard, making it ideal for web Browse, office applications, and online learning. Built for durability and value.",
      "specifications": {
        "processor": "Intel Core i5-1235U (10-core)",
        "graphicsCard": "Integrated Intel Iris Xe Graphics",
        "ram": "8GB DDR4 3200MHz",
        "storage": "256GB PCIe NVMe SSD",
        "display": "15.6-inch FHD (1920 x 1080), IPS, 250 nits",
        "batteryLifeHours": 8,
        "weightKg": 1.7,
        "ports": ["1x USB 3.2 Gen 1 Type-C", "2x USB 3.2 Gen 1 Type-A", "HDMI 1.4b", "RJ45 Ethernet", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Home",
        "webcam": "720p HD"
      },
      "features": [
        "Durable Chassis",
        "Full-size Numeric Keypad",
        "Fast SSD Storage",
        "Stereo Speakers",
        "Integrated Security Chip"
      ],
      "availableColors": ["Graphite Black"]
    },
     {
      "productId": "TECHFORGE-CREATORX-17",
      "productName": "TechForge CreatorX 17 Pro Workstation",
      "manufacturer": "TechForge Innovations",
      "category": "Workstation",
      "price": 3199.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1504707748692-419802cf939d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhcHRvcHxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1504707748692-419802cf939d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhcHRvcHxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Unleash professional creativity with a large, color-accurate display and extreme power.",
      "longDescription": "The TechForge CreatorX 17 is engineered for ultimate performance in creative and professional applications. Its expansive 17-inch 4K Mini-LED display offers unparalleled color accuracy and brightness, perfect for video editing, 3D rendering, and graphic design. Paired with a desktop-class processor and a high-end professional GPU, this laptop handles the most demanding tasks with ease.",
      "specifications": {
        "processor": "Intel Core i9-14900HX (24-core)",
        "graphicsCard": "NVIDIA GeForce RTX 4090 16GB GDDR6",
        "ram": "64GB DDR5 5600MHz",
        "storage": "4TB (2x 2TB) PCIe Gen4 NVMe SSD RAID 0",
        "display": "17.0-inch 4K (3840 x 2400) Mini-LED, 1000 nits, 100% Adobe RGB, Delta E < 1",
        "batteryLifeHours": 7,
        "weightKg": 2.9,
        "ports": ["2x Thunderbolt 4 (USB-C)", "3x USB 3.2 Gen 2 Type-A", "HDMI 2.1", "Mini DisplayPort 1.4", "SD Express Reader", "RJ45 Ethernet", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Pro",
        "webcam": "1080p FHD IR"
      },
      "features": [
        "Calibrated Mini-LED Display",
        "Vapor Chamber Cooling Pro",
        "Durable Magnesium-Aluminum Chassis",
        "Large Haptic Trackpad",
        "Advanced Security Suite"
      ],
      "availableColors": ["Creator Black"]
    },
    {
      "productId": "CHRONOS-GAMING-15",
      "productName": "Chronos Gaming 15",
      "manufacturer": "Chronos Systems",
      "category": "Gaming Laptop",
      "price": 1499.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtaW5nJTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtaW5nJTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Affordable gaming laptop for entry-level and casual gamers.",
      "longDescription": "The Chronos Gaming 15 offers a great balance of performance and price for gamers. With a dedicated NVIDIA GPU and a high-refresh-rate display, it's ready for popular esports titles and many AAA games at medium settings. Its robust cooling system ensures stable performance during extended gaming sessions, making it ideal for student gamers and casual use.",
      "specifications": {
        "processor": "AMD Ryzen 7 7735HS (8-core)",
        "graphicsCard": "NVIDIA GeForce RTX 4050 6GB GDDR6",
        "ram": "16GB DDR5 4800MHz",
        "storage": "512GB PCIe Gen4 NVMe SSD",
        "display": "15.6-inch FHD (1920 x 1080), 144Hz, IPS, 300 nits",
        "batteryLifeHours": 7,
        "weightKg": 2.2,
        "ports": ["1x USB 3.2 Gen 2 Type-C (DisplayPort)", "2x USB 3.2 Gen 1 Type-A", "HDMI 2.1", "RJ45 Ethernet", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Home",
        "webcam": "720p HD"
      },
      "features": [
        "Optimized Cooling System",
        "Backlit Gaming Keyboard",
        "Immersive Audio",
        "Expandable Storage Slots"
      ],
      "availableColors": ["Onyx Black"]
    },
    {
      "productId": "COSMOS-ULTRA-13",
      "productName": "Cosmos Ultra 13 Business Laptop",
      "manufacturer": "Cosmos Computing",
      "category": "Business Laptop",
      "price": 1699.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVzaW5lc3MlMjBsYXB0b3B8ZW58MHx8MHx8fDA&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVzaW5lc3MlMjBsYXB0b3B8ZW58MHx8MHx8fDA&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Secure, sleek, and powerful for modern business professionals.",
      "longDescription": "The Cosmos Ultra 13 is designed for the discerning business user, offering enterprise-grade security features, robust performance, and a stunning 2-in-1 convertible design. Its long battery life and lightweight chassis make it perfect for travel and presentations, while the integrated security features protect sensitive data. Ideal for professional and business use.",
      "specifications": {
        "processor": "Intel Core Ultra 7 155H (16-core)",
        "graphicsCard": "Integrated Intel Arc Graphics",
        "ram": "32GB LPDDR5X 7467MHz",
        "storage": "1TB PCIe Gen4 NVMe SSD",
        "display": "13.3-inch QHD+ (2880 x 1800) OLED, Touch, 360-hinge, 500 nits",
        "batteryLifeHours": 12,
        "weightKg": 1.2,
        "ports": ["2x Thunderbolt 4 (USB-C)", "1x USB 3.2 Gen 1 Type-A", "HDMI 2.0", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Pro",
        "webcam": "1080p FHD IR (Windows Hello)"
      },
      "features": [
        "2-in-1 Convertible Design",
        "Hardware-level Security (TPM 2.0)",
        "Spill-resistant Keyboard",
        "Long-range Microphones",
        "Integrated Stylus Support"
      ],
      "availableColors": ["Business Black"]
    },
    {
      "productId": "ESSENTIAL-NOTEBOOK-15",
      "productName": "Essential Notebook 15",
      "manufacturer": "ValueTech",
      "category": "Budget Laptop",
      "price": 499.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVkZ2V0JTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVkZ2V0JTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "An entry-level laptop for everyday tasks and web Browse.",
      "longDescription": "The Essential Notebook 15 is built for simplicity and affordability, perfect for students, casual home users, and those primarily needing a device for web Browse, email, and basic document work. It offers a comfortable typing experience and a reliable performance for essential computing needs, making it a great personal or student laptop.",
      "specifications": {
        "processor": "Intel Core i3-1215U (6-core)",
        "graphicsCard": "Integrated Intel UHD Graphics",
        "ram": "8GB DDR4 2666MHz",
        "storage": "256GB SATA SSD",
        "display": "15.6-inch HD (1366 x 768), TN, 220 nits",
        "batteryLifeHours": 6,
        "weightKg": 1.8,
        "ports": ["1x USB 3.2 Gen 1 Type-C", "2x USB 3.2 Gen 1 Type-A", "HDMI 1.4", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Home (S Mode)",
        "webcam": "720p HD"
      },
      "features": [
        "Lightweight for its size",
        "Numeric Keypad",
        "Quiet Operation",
        "Affordable Price Point"
      ],
      "availableColors": ["Charcoal Grey"]
    },
    {
      "productId": "STUDENT-PRO-14",
      "productName": "Student Pro 14",
      "manufacturer": "EduTech",
      "category": "Student Laptop",
      "price": 899.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZGVudCUyMGxhcHRvcHxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZGVudCUyMGxhcHRvcHxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Robust and versatile for all academic needs, with great portability.",
      "longDescription": "The Student Pro 14 is designed to meet the diverse demands of university life, from research and writing to light programming and multimedia consumption. Its durable build, excellent battery life, and comfortable keyboard make it an ideal companion for long study sessions and campus mobility. Great for student and personal use.",
      "specifications": {
        "processor": "AMD Ryzen 5 7530U (6-core)",
        "graphicsCard": "Integrated AMD Radeon Graphics",
        "ram": "16GB LPDDR4X 4266MHz",
        "storage": "512GB PCIe Gen3 NVMe SSD",
        "display": "14.0-inch FHD (1920 x 1080), IPS, Touch, 300 nits",
        "batteryLifeHours": 10,
        "weightKg": 1.3,
        "ports": ["2x USB 3.2 Gen 2 Type-C (DisplayPort, Power Delivery)", "2x USB 3.2 Gen 1 Type-A", "HDMI 2.0", "MicroSD Card Reader", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Home",
        "webcam": "1080p FHD"
      },
      "features": [
        "Robust Build Quality",
        "Touchscreen Display",
        "Fast Charging Support",
        "Enhanced Privacy Shutter Webcam"
      ],
      "availableColors": ["Pacific Blue", "Arctic White"]
    },
    {
      "productId": "BIZPRO-ELITE-14",
      "productName": "BizPro Elite 14",
      "manufacturer": "Enterprise Solutions",
      "category": "Business Laptop",
      "price": 1499.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzaW5lc3MlMjBsYXB0b3B8ZW58MHx8MHx8fDA&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzaW5lc3MlMjBsYXB0b3B8ZW58MHx8MHx8fDA&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "Premium business laptop with advanced security and connectivity.",
      "longDescription": "The BizPro Elite 14 is engineered for the demanding corporate environment, offering top-tier performance, comprehensive security features, and extensive connectivity options. Its sleek design and durable construction ensure it can withstand the rigors of daily business travel and intensive office work. Ideal for professional and business use.",
      "specifications": {
        "processor": "Intel Core i7-1360P (12-core)",
        "graphicsCard": "Integrated Intel Iris Xe Graphics",
        "ram": "16GB LPDDR5 5200MHz",
        "storage": "512GB PCIe Gen4 NVMe SSD",
        "display": "14.0-inch FHD+ (1920 x 1200), IPS, Anti-Glare, 400 nits",
        "batteryLifeHours": 9,
        "weightKg": 1.4,
        "ports": ["2x Thunderbolt 4 (USB-C)", "2x USB 3.2 Gen 1 Type-A", "HDMI 2.0", "RJ45 Ethernet", "Smart Card Reader", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Pro",
        "webcam": "1080p FHD IR (Privacy Shutter)"
      },
      "features": [
        "Enterprise-grade Security Features",
        "MIL-STD 810H Durability",
        "Backlit Keyboard",
        "Fast Wi-Fi 6E",
        "Optional 5G Connectivity"
      ],
      "availableColors": ["Executive Black"]
    },
    {
      "productId": "MEDIA-MASTER-17",
      "productName": "MediaMaster 17 Professional",
      "manufacturer": "MediaForge",
      "category": "Workstation",
      "price": 2899.00,
      "currency": "USD",
      "thumbnailUrl": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29ya3N0YXRpb24lMjBsYXB0b3B8ZW58MHx8MHx8fDA&auto=format&fit=crop&w=300&q=60",
      "fullImageUrl": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29ya3N0YXRpb24lMjBsYXB0b3B8ZW58MHx8MHx8fDA&auto=format&fit=crop&w=800&q=80",
      "shortDescription": "High-performance workstation for video editing and content creation.",
      "longDescription": "The MediaMaster 17 is a portable powerhouse for professional content creators, featuring a large, high-resolution display with exceptional color accuracy and a powerful NVIDIA RTX GPU. It's built to handle demanding video editing, graphic design, and 3D rendering workflows, making it a top choice for professional use in multimedia.",
      "specifications": {
        "processor": "Intel Core i9-14900HX (24-core)",
        "graphicsCard": "NVIDIA GeForce RTX 4070 12GB GDDR6",
        "ram": "64GB DDR5 5200MHz",
        "storage": "2TB PCIe Gen4 NVMe SSD",
        "display": "17.3-inch 4K (3840 x 2160), IPS, 120Hz, 500 nits, 100% DCI-P3, Delta E < 1",
        "batteryLifeHours": 7,
        "weightKg": 2.7,
        "ports": ["2x Thunderbolt 4 (USB-C)", "3x USB 3.2 Gen 2 Type-A", "HDMI 2.1", "Mini DisplayPort 1.4", "SD Card Reader", "Headphone Jack"],
        "operatingSystem": "QuantumOS 11 Pro",
        "webcam": "1080p FHD"
      },
      "features": [
        "Calibrated Professional Display",
        "Advanced Cooling Solution",
        "Large Haptic Touchpad",
        "Premium Audio System"
      ],
      "availableColors": ["Dark Grey"]
    }
  ],
  "reviews": [
    {
      "reviewId": "REV-001",
      "productId": "AETHER-CORE-15",
      "userId": "designPro_01",
      "rating": 5,
      "title": "Absolutely stunning display for design work!",
      "comment": "This AetherTech is a dream for graphic design. The OLED screen is vibrant, colors are accurate, and the touch functionality is a bonus. Performance for my Adobe apps is seamless.",
      "date": "2024-05-10"
    },
    {
      "reviewId": "REV-002",
      "productId": "AETHER-CORE-15",
      "userId": "videoWizard",
      "rating": 3,
      "title": "Great power, but thermal throttling concern",
      "comment": "I edit 4K video all day, and while the RTX 4060 is good, I sometimes feel it throttles under heavy, sustained load. Fans get pretty loud. Battery life is okay for a powerful laptop.",
      "date": "2024-05-15"
    },
    {
      "reviewId": "REV-003",
      "productId": "AETHER-CORE-15",
      "userId": "studentGrind",
      "rating": 4,
      "title": "A bit pricey but worth it",
      "comment": "As a student, it was a big investment, but the performance and screen quality make it worth it for my CAD projects. It's solid, but a bit heavy to carry around campus all day.",
      "date": "2024-05-20"
    },
    {
      "reviewId": "REV-004",
      "productId": "STREAMLINE-STUDIOBOOK-14",
      "userId": "coder_gal",
      "rating": 5,
      "title": "Unbelievable battery life and blazing fast!",
      "comment": "As a developer, this machine is a dream. The S3 Pro chip is incredibly fast and efficient for compiling code. I can go all day without charging, and the screen is beautiful for my eyes.",
      "date": "2024-06-01"
    },
    {
      "reviewId": "REV-005",
      "productId": "STREAMLINE-STUDIOBOOK-14",
      "userId": "creativeFlow",
      "rating": 4,
      "title": "Great, but unified memory limits some tasks",
      "comment": "It's an amazing laptop, very powerful and silent. For my specific 3D rendering workflows, I wish it had more RAM than 18GB, though for most things it's superb. A bit pricey.",
      "date": "2024-06-05"
    },
    {
      "reviewId": "REV-006",
      "productId": "STREAMLINE-STUDIOBOOK-14",
      "userId": "travelingMusician",
      "rating": 5,
      "title": "Perfect for studio and travel!",
      "comment": "I use this for music production on the go. The M3 Pro chip handles all my VSTs and audio tracks without a hitch. The compact size and long battery are perfect for flights.",
      "date": "2024-06-10"
    },
    {
      "reviewId": "REV-007",
      "productId": "FUSION-APEX-16",
      "userId": "proGamerElite",
      "rating": 5,
      "title": "Absolute Beast for Gaming! Max settings, no problem.",
      "comment": "I've thrown everything at this laptop - new AAA titles - and it eats them for breakfast. The 240Hz QHD screen is silky smooth. Fans get loud, but that's expected for this power. Highly recommend!",
      "date": "2024-05-28"
    },
    {
      "reviewId": "REV-008",
      "productId": "FUSION-APEX-16",
      "userId": "renderFarm_alt",
      "rating": 4,
      "title": "Incredible raw performance, but heavy and hot",
      "comment": "This is a desktop replacement. The CPU and GPU are stellar for rendering. It is quite heavy and battery life is very short (6 hours max), so plan to keep it plugged in for serious work.",
      "date": "2024-06-03"
    },
    {
      "reviewId": "REV-009",
      "productId": "FUSION-APEX-16",
      "userId": "casualGamer_fail",
      "rating": 3,
      "title": "Overheats sometimes and too loud for casual use",
      "comment": "When playing demanding games for a long time, I notice some throttling and it gets extremely hot around the keyboard. The fans are also excessively loud, even in a quiet room. Not for everyone.",
      "date": "2024-06-08"
    },
    {
      "reviewId": "REV-010",
      "productId": "ZENITH-AURAFLOW-13",
      "userId": "digitalNomad",
      "rating": 5,
      "title": "Perfect travel companion and stunning display!",
      "comment": "I bought this for business trips and it's fantastic. Super light, amazing battery life (easily lasts a full workday), and the OLED screen is gorgeous for presentations and media consumption. Love the sleek design.",
      "date": "2024-05-20"
    },
    {
      "reviewId": "REV-011",
      "productId": "ZENITH-AURAFLOW-13",
      "userId": "uniStudent_A",
      "rating": 4,
      "title": "Great for studies, minor issues with dongles",
      "comment": "Lightweight and powerful enough for all my university work. The webcam is great for online classes. My only gripe is the limited port selection; I constantly need dongles for USB-A devices.",
      "date": "2024-05-25"
    },
    {
      "reviewId": "REV-012",
      "productId": "ZENITH-AURAFLOW-13",
      "userId": "exec_on_go",
      "rating": 5,
      "title": "Unexpectedly powerful and durable for its size!",
      "comment": "I was skeptical about performance in such a thin laptop, but the Core Ultra chip handles all my office apps and multitasking smoothly. The battery really lasts, and the build feels solid.",
      "date": "2024-06-02"
    },
    {
      "reviewId": "REV-013",
      "productId": "VIRTUO-PROBOOK-15",
      "userId": "homeUser_bob",
      "rating": 4,
      "title": "Good basic laptop for the price",
      "comment": "Got this for my kids for schoolwork and general internet Browse. It's not super fast but perfectly adequate for daily tasks. The keyboard is comfortable for typing.",
      "date": "2024-06-01"
    },
    {
      "reviewId": "REV-014",
      "productId": "VIRTUO-PROBOOK-15",
      "userId": "student_on_budget",
      "rating": 3,
      "title": "SSD is small, wish it had more RAM",
      "comment": "It's fine for simple tasks, but the 256GB SSD fills up quickly. 8GB RAM is also a bottleneck when I have many browser tabs open or try to run anything heavier. Good for the price, though.",
      "date": "2024-06-05"
    },
    {
      "reviewId": "REV-015",
      "productId": "VIRTUO-PROBOOK-15",
      "userId": "smallBizOwner_T",
      "rating": 4,
      "title": "Reliable office machine",
      "comment": "Bought a few of these for my small office. They boot fast and handle all our office suite needs without issues. Good value for money, dependable machines.",
      "date": "2024-06-09"
    },
    {
      "reviewId": "REV-016",
      "productId": "TECHFORGE-CREATORX-17",
      "userId": "filmEditor_mia",
      "rating": 5,
      "title": "The ultimate portable editing workstation!",
      "comment": "I'm blown away by the power and display on this CreatorX 17. Editing 8K footage is smooth as butter, and the Mini-LED screen is the best I've ever seen on a laptop for color grading. It's heavy, but worth it.",
      "date": "2024-05-29"
    },
    {
      "reviewId": "REV-017",
      "productId": "TECHFORGE-CREATORX-17",
      "userId": "3DArtist_Z",
      "rating": 5,
      "title": "Rendering speed is insane, perfect for 3D modeling",
      "comment": "This machine is a beast for 3D rendering and complex simulations. The RTX 4090 and 64GB RAM make a huge difference. Thermal management is surprisingly good for the components. Pricey, but an investment.",
      "date": "2024-06-04"
    },
    {
      "reviewId": "REV-018",
      "productId": "TECHFORGE-CREATORX-17",
      "userId": "roadWarrior_dev",
      "rating": 3,
      "title": "Too bulky for frequent travel",
      "comment": "Performance is amazing for development, but at almost 3kg, it's just too cumbersome to carry around daily. Battery life is also just okay for such a powerful machine. More of a portable desktop than a laptop.",
      "date": "2024-06-07"
    },
    {
      "reviewId": "REV-019",
      "productId": "CHRONOS-GAMING-15",
      "userId": "gamer_dude",
      "rating": 4,
      "title": "Solid gaming performance for the price!",
      "comment": "Plays most of my games smoothly. Great for casual gaming sessions. Fans can get a bit loud during intense gameplay.",
      "date": "2024-05-22"
    },
    {
      "reviewId": "REV-020",
      "productId": "CHRONOS-GAMING-15",
      "userId": "budgetGamer",
      "rating": 5,
      "title": "Fantastic value for an entry-level gaming laptop.",
      "comment": "Couldn't be happier with this purchase. It runs Valorant and Fortnite beautifully. The 144Hz screen makes a difference.",
      "date": "2024-05-27"
    },
    {
      "reviewId": "REV-021",
      "productId": "CHRONOS-GAMING-15",
      "userId": "streamer_wannabe",
      "rating": 3,
      "title": "Good for gaming, not ideal for streaming and gaming simultaneously.",
      "comment": "It handles games well, but when I try to stream at the same time, it struggles a bit. Probably need more RAM or a stronger processor for that.",
      "date": "2024-06-01"
    },
    {
      "reviewId": "REV-022",
      "productId": "COSMOS-ULTRA-13",
      "userId": "corporateExec",
      "rating": 5,
      "title": "Excellent for business travel and presentations.",
      "comment": "Lightweight, long battery life, and the 2-in-1 feature is very handy for client presentations. Security features are a big plus.",
      "date": "2024-05-18"
    },
    {
      "reviewId": "REV-023",
      "productId": "COSMOS-ULTRA-13",
      "userId": "IT_pro",
      "rating": 5,
      "title": "Robust security and great performance for demanding business applications.",
      "comment": "Our IT department approved this. The TPM chip and other security measures are great. Performance is snappy for all our enterprise software.",
      "date": "2024-05-25"
    },
    {
      "reviewId": "REV-024",
      "productId": "COSMOS-ULTRA-13",
      "userId": "remoteWorker",
      "rating": 4,
      "title": "Great machine, but sometimes wish for more ports.",
      "comment": "Perfect for remote work, video calls are crisp. The battery is amazing. Only minor drawback is the limited number of ports, I need a dongle for my external monitor and mouse.",
      "date": "2024-06-03"
    },
    {
      "reviewId": "REV-025",
      "productId": "ESSENTIAL-NOTEBOOK-15",
      "userId": "grandma_sues",
      "rating": 4,
      "title": "Simple and easy to use for web Browse and emails.",
      "comment": "My grandson set this up for me. I can easily check my emails and browse the internet. It's not too complicated.",
      "date": "2024-06-01"
    },
    {
      "reviewId": "REV-026",
      "productId": "ESSENTIAL-NOTEBOOK-15",
      "userId": "student_basic",
      "rating": 3,
      "title": "Does the job for school work, a bit slow sometimes.",
      "comment": "It's fine for typing essays and doing online research. Sometimes it feels a bit slow when I have many tabs open, but for the price, it's okay.",
      "date": "2024-06-06"
    },
    {
      "reviewId": "REV-027",
      "productId": "ESSENTIAL-NOTEBOOK-15",
      "userId": "home_budget",
      "rating": 4,
      "title": "Good for personal use and light tasks.",
      "comment": "Bought this for the family for general use. It's good for watching videos and basic office tasks. Can't complain for the price.",
      "date": "2024-06-10"
    },
    {
      "reviewId": "REV-028",
      "productId": "STUDENT-PRO-14",
      "userId": "college_kid",
      "rating": 5,
      "title": "Perfect for university life!",
      "comment": "This laptop is awesome for notes, research, and even some light gaming. The touchscreen is a nice bonus. Battery lasts all day on campus.",
      "date": "2024-05-29"
    },
    {
      "reviewId": "REV-029",
      "productId": "STUDENT-PRO-14",
      "userId": "programming_noob",
      "rating": 4,
      "title": "Great for coding and daily tasks, very portable.",
      "comment": "I'm learning to code and this machine handles VS Code and compilers without issues. It's super light, so carrying it to lectures is easy.",
      "date": "2024-06-03"
    },
    {
      "reviewId": "REV-030",
      "productId": "STUDENT-PRO-14",
      "userId": "multimedia_student",
      "rating": 4,
      "title": "Solid performance for multimedia editing, good screen.",
      "comment": "It's not a powerhouse, but it handles my video editing assignments pretty well for a student laptop. The IPS screen is decent for color accuracy.",
      "date": "2024-06-08"
    },
    {
      "reviewId": "REV-031",
      "productId": "BIZPRO-ELITE-14",
      "userId": "sales_rep_max",
      "rating": 5,
      "title": "Ideal business companion - reliable and secure.",
      "comment": "This laptop is perfect for my sales calls and presentations. The security features give me peace of mind, and it's fast for all my CRM software.",
      "date": "2024-05-26"
    },
    {
      "reviewId": "REV-032",
      "productId": "BIZPRO-ELITE-14",
      "userId": "CEO_traveler",
      "rating": 5,
      "title": "Exceptional build quality and performance for executives.",
      "comment": "I travel constantly and this laptop holds up incredibly well. It's sleek, powerful, and the battery lasts through my longest flights.",
      "date": "2024-06-02"
    },
    {
      "reviewId": "REV-033",
      "productId": "BIZPRO-ELITE-14",
      "userId": "corporate_dev",
      "rating": 4,
      "title": "Good for professional development, but could use more RAM options.",
      "comment": "Handles my development environment well, especially with the Thunderbolt ports. For very large projects, 32GB RAM would be a nice option, but 16GB is usually enough.",
      "date": "2024-06-07"
    },
    {
      "reviewId": "REV-034",
      "productId": "MEDIA-MASTER-17",
      "userId": "pro_video_editor",
      "rating": 5,
      "title": "Unmatched performance for 4K video editing on the go!",
      "comment": "This is a true portable workstation. The 4K screen is stunningly accurate, and the RTX 4070 makes short work of even complex timelines. A game-changer for my professional work.",
      "date": "2024-05-30"
    },
    {
      "reviewId": "REV-035",
      "productId": "MEDIA-MASTER-17",
      "userId": "graphic_designer_pro",
      "rating": 5,
      "title": "Incredible display and power for graphic design.",
      "comment": "The DCI-P3 coverage and Delta E < 1 are critical for my graphic design work, and this laptop delivers. It handles huge Photoshop and Illustrator files with ease.",
      "date": "2024-06-05"
    },
    {
      "reviewId": "REV-036",
      "productId": "MEDIA-MASTER-17",
      "userId": "musician_producer",
      "rating": 4,
      "title": "Powerful for music production, but a bit heavy.",
      "comment": "Runs all my DAWs and VSTs flawlessly. The sound quality is excellent. It's definitely a desktop replacement, so don't expect ultrabook portability.",
      "date": "2024-06-09"
    }
  ]
};


// I've used some Unsplash URLs for product images as the provided ones might be placeholders.
// You can replace them with actual URLs if available.

export const getProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.products);
    }, MOCK_DELAY_MS);
  });
};

export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = data.products.find(p => p.productId === id);
      resolve(product);
    }, MOCK_DELAY_MS);
  });
};

export const searchProductsByCategory = (category: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!category.trim()) {
        resolve(data.products); // Return all if category is empty
        return;
      }
      const lowerCaseCategory = category.toLowerCase();
      const filteredProducts = data.products.filter(p => 
        p.category.toLowerCase().includes(lowerCaseCategory)
      );
      resolve(filteredProducts);
    }, MOCK_DELAY_MS);
  });
};

export const getReviewsByProductId = (productId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reviews = data.reviews.filter(r => r.productId === productId);
      resolve(reviews);
    }, MOCK_DELAY_MS);
  });
};
