import { Product, Order, Customer } from '@/types';

export const mockProducts: Product[] = [
  { id: '1', name: 'Paracetamol 500mg (Strips of 10)', slug: 'paracetamol-500mg', category: 'Pain Relief', price: 2500, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Paracetamol', stockQty: 243, isActive: true },
  { id: '2', name: 'Vitamin C 1000mg (30 tablets)', slug: 'vitamin-c-1000mg', category: 'Vitamins', price: 18000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Vitamin+C', stockQty: 120, isActive: true },
  { id: '3', name: 'Amoxicillin 500mg (Capsules)', slug: 'amoxicillin-500mg', category: 'Antibiotics', price: 35000, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Amoxicillin', stockQty: 45, isActive: true },
  { id: '4', name: 'Cetaphil Gentle Skin Cleanser 250ml', slug: 'cetaphil-cleanser-250ml', category: 'Skincare', price: 62000, originalPrice: 75000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Cetaphil', stockQty: 15, isActive: true },
  { id: '5', name: 'Ibuprofen 400mg (20 tablets)', slug: 'ibuprofen-400mg', category: 'Pain Relief', price: 8500, inStock: false, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Ibuprofen', stockQty: 0, isActive: true },
  { id: '6', name: 'Aspirin 75mg (28 tablets)', slug: 'aspirin-75mg', category: 'Pain Relief', price: 12000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Aspirin', stockQty: 80, isActive: true },
  { id: '7', name: 'Vitamin D3 1000 IU', slug: 'vitamin-d3-1000-iu', category: 'Vitamins', price: 25000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Vitamin+D3', stockQty: 5, isActive: true },
  { id: '8', name: 'Azithromycin 500mg (3 tablets)', slug: 'azithromycin-500mg', category: 'Antibiotics', price: 15000, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Azithromycin', stockQty: 30, isActive: true },
  { id: '9', name: 'La Roche-Posay Effaclar Duo', slug: 'la-roche-posay-effaclar', category: 'Skincare', price: 95000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=La+Roche', stockQty: 12, isActive: true },
  { id: '10', name: 'Pampers Premium Care Size 3', slug: 'pampers-premium-care-3', category: 'Baby & Mother', price: 45000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Pampers', stockQty: 50, isActive: true },
  { id: '11', name: 'Sudocrem Healing Cream 125g', slug: 'sudocrem-125g', category: 'Baby & Mother', price: 32000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Sudocrem', stockQty: 8, isActive: true },
  { id: '12', name: 'Dettol Antiseptic Liquid 500ml', slug: 'dettol-500ml', category: 'First Aid', price: 18000, originalPrice: 22000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Dettol', stockQty: 100, isActive: true },
  { id: '13', name: 'Elastoplast Fabric Plasters (40s)', slug: 'elastoplast-fabric-40s', category: 'First Aid', price: 15000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Elastoplast', stockQty: 200, isActive: true },
  { id: '14', name: 'Gaviscon Double Action 150ml', slug: 'gaviscon-150ml', category: 'Digestive Health', price: 28000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Gaviscon', stockQty: 40, isActive: true },
  { id: '15', name: 'Imodium 2mg (6 capsules)', slug: 'imodium-2mg', category: 'Digestive Health', price: 12000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Imodium', stockQty: 150, isActive: true },
  { id: '16', name: 'Wellman Original (30 tablets)', slug: 'wellman-original', category: "Men's Health", price: 42000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Wellman', stockQty: 60, isActive: true },
  { id: '17', name: 'Centrum Men', slug: 'centrum-men', category: "Men's Health", price: 55000, inStock: false, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Centrum', stockQty: 0, isActive: true },
  { id: '18', name: 'CeraVe Moisturizing Cream 340g', slug: 'cerave-cream-340g', category: 'Skincare', price: 85000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=CeraVe', stockQty: 22, isActive: true },
  { id: '19', name: 'Zinc 50mg (100 tablets)', slug: 'zinc-50mg', category: 'Vitamins', price: 30000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Zinc', stockQty: 90, isActive: true },
  { id: '20', name: 'Panadol Extra (24 tablets)', slug: 'panadol-extra', category: 'Pain Relief', price: 8000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Panadol', stockQty: 500, isActive: true },
  { id: '21', name: 'Diclofenac Gel 1% (50g Tube)', slug: 'diclofenac-gel-50g', category: 'Pain Relief', price: 7500, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Diclofenac', stockQty: 85, isActive: true },
  { id: '22', name: 'Tramadol 50mg (10 Capsules)', slug: 'tramadol-50mg', category: 'Pain Relief', price: 28000, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Tramadol', stockQty: 18, isActive: true },
  { id: '23', name: 'Panadol Actifast (20 Tablets)', slug: 'panadol-actifast', category: 'Pain Relief', price: 9000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Actifast', stockQty: 140, isActive: true },
  { id: '24', name: 'Seven Seas Cod Liver Oil (100s)', slug: 'cod-liver-oil-100s', category: 'Vitamins', price: 34000, originalPrice: 38000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Cod+Liver', stockQty: 42, isActive: true },
  { id: '25', name: 'Calcium + Vitamin D3 (60 Tablets)', slug: 'calcium-d3-60', category: 'Vitamins', price: 22000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Calcium+D3', stockQty: 75, isActive: true },
  { id: '26', name: 'High Potency B-Complex (30s)', slug: 'b-complex-30', category: 'Vitamins', price: 15000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=B-Complex', stockQty: 110, isActive: true },
  { id: '27', name: 'Ciprofloxacin 500mg (10 Tablets)', slug: 'ciprofloxacin-500mg', category: 'Antibiotics', price: 42000, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Cipro', stockQty: 25, isActive: true },
  { id: '28', name: 'Doxycycline 100mg (10 Capsules)', slug: 'doxycycline-100mg', category: 'Antibiotics', price: 19500, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Doxy', stockQty: 60, isActive: true },
  { id: '29', name: 'Augmentin 625mg (14 Tablets)', slug: 'augmentin-625mg', category: 'Antibiotics', price: 85000, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Augmentin', stockQty: 14, isActive: true },
  { id: '30', name: 'Bio-Oil Skincare Oil 125ml', slug: 'bio-oil-125ml', category: 'Skincare', price: 78000, originalPrice: 90000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Bio-Oil', stockQty: 19, isActive: true },
  { id: '31', name: 'Neutrogena Hydro Boost Water Gel', slug: 'neutrogena-hydro-boost', category: 'Skincare', price: 89000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Hydro+Boost', stockQty: 8, isActive: true },
  { id: '32', name: 'Aveeno Moisturizing Lotion 300ml', slug: 'aveeno-moisturizing-300ml', category: 'Skincare', price: 65000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Aveeno', stockQty: 27, isActive: true },
  { id: '33', name: 'Avent Natural Feeding Bottle 260ml', slug: 'avent-bottle-260ml', category: 'Baby & Mother', price: 58000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Avent', stockQty: 30, isActive: true },
  { id: '34', name: 'Pregnacare Plus Omega-3 (56s)', slug: 'pregnacare-plus-56', category: 'Baby & Mother', price: 85000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Pregnacare', stockQty: 15, isActive: true },
  { id: '35', name: 'Huggies Extra Care Size 4 (44s)', slug: 'huggies-extra-care-4', category: 'Baby & Mother', price: 68000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Huggies', stockQty: 40, isActive: true },
  { id: '36', name: 'Omron Digital Thermometer', slug: 'omron-digital-thermometer', category: 'First Aid', price: 24000, originalPrice: 30000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Omron', stockQty: 55, isActive: true },
  { id: '37', name: 'Surgical Face Masks (Box of 50)', slug: 'surgical-masks-box-50', category: 'First Aid', price: 12000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Surgical+Mask', stockQty: 350, isActive: true },
  { id: '38', name: 'Betadine Antiseptic Solution 100ml', slug: 'betadine-antiseptic-100ml', category: 'First Aid', price: 14500, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Betadine', stockQty: 80, isActive: true },
  { id: '39', name: 'Pepto-Bismol Liquid 230ml', slug: 'pepto-bismol-230ml', category: 'Digestive Health', price: 34000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Pepto', stockQty: 22, isActive: true },
  { id: '40', name: 'Senokot Natural Laxative (20s)', slug: 'senokot-laxative-20', category: 'Digestive Health', price: 12500, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Senokot', stockQty: 95, isActive: true },
  { id: '41', name: 'Dulcolax 5mg (10 Tablets)', slug: 'dulcolax-5mg-10', category: 'Digestive Health', price: 9800, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Dulcolax', stockQty: 180, isActive: true },
  { id: '42', name: 'Wellman Prostace (60 Tablets)', slug: 'wellman-prostace-60', category: "Men's Health", price: 95000, originalPrice: 110000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Prostace', stockQty: 12, isActive: true },
  { id: '43', name: 'Kirkland Minoxidil 5% (60ml)', slug: 'minoxidil-5-percent-60ml', category: "Men's Health", price: 65000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Minoxidil', stockQty: 34, isActive: true },
  { id: '44', name: 'Centrum Men Multi-Gummies (70s)', slug: 'centrum-men-gummies-70', category: "Men's Health", price: 48000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Gummies', stockQty: 50, isActive: true },
  { id: '45', name: 'Panadol Menstrual (12 Tablets)', slug: 'panadol-menstrual-12', category: 'Pain Relief', price: 6000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Menstrual', stockQty: 210, isActive: true },
  { id: '46', name: 'Solpadeine Soluble (16 Tablets)', slug: 'solpadeine-soluble-16', category: 'Pain Relief', price: 14000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Solpadeine', stockQty: 85, isActive: true },
  { id: '47', name: 'Erythromycin 250mg (Strips of 10)', slug: 'erythromycin-250mg', category: 'Antibiotics', price: 29000, inStock: true, requiresPrescription: true, image: 'https://placehold.co/400x400/FEF3E8/B36B00?text=Erythromycin', stockQty: 15, isActive: true },
  { id: '48', name: 'Loperamide 2mg (10 Capsules)', slug: 'loperamide-2mg-10', category: 'Digestive Health', price: 5000, inStock: true, requiresPrescription: false, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Loperamide', stockQty: 320, isActive: true },
];

export const mockOrders: Order[] = [
  {
    id: 'ord_1',
    orderNumber: '#MR-2025-00431',
    customer: {
      id: 'cust_1',
      name: 'Sarah Namukasa',
      email: 'sarah@example.com',
      phone: '+256 772 123 456',
      addresses: [],
    },
    items: [
      { productId: '1', name: 'Paracetamol 500mg', price: 2500, quantity: 2, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Paracetamol' },
      { productId: '2', name: 'Vitamin C 1000mg', price: 18000, quantity: 1, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Vitamin+C' }
    ],
    subtotal: 23000,
    deliveryFee: 5000,
    discount: 0,
    total: 28000,
    status: 'pending',
    deliveryAddress: { id: 'addr_1', name: 'Sarah Namukasa', phone: '+256 772 123 456', street: 'Plot 12, Kololo', district: 'Kampala Central', isDefault: true },
    paymentMethod: 'mtn_momo',
    paymentStatus: 'paid',
    createdAt: '2025-05-12T09:41:00Z',
  },
  {
    id: 'ord_2',
    orderNumber: '#MR-2025-00432',
    customer: {
      id: 'cust_2',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+256 752 987 654',
      addresses: [],
    },
    items: [
      { productId: '4', name: 'Cetaphil Gentle Skin Cleanser', price: 62000, quantity: 1, image: 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Cetaphil' },
    ],
    subtotal: 62000,
    deliveryFee: 0,
    discount: 6200,
    total: 55800,
    status: 'delivered',
    deliveryAddress: { id: 'addr_2', name: 'John Doe', phone: '+256 752 987 654', street: 'Kisaasi', district: 'Nakawa', isDefault: true },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2025-05-11T14:20:00Z',
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'Sarah Namukasa',
    email: 'sarah@example.com',
    phone: '+256 772 123 456',
    addresses: [
      { id: 'addr_1', name: 'Sarah Namukasa', phone: '+256 772 123 456', street: 'Plot 12, Kololo', district: 'Kampala Central', isDefault: true }
    ],
  }
];
