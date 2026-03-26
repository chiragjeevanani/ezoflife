// Master Services Catalog for all panels
export const MASTER_SERVICES = [
  { 
    id: 'wash-fold', 
    name: 'Wash & Fold', 
    category: 'Daily Wear',
    unit: 'kg',
    basePrice: 60,
    icon: 'local_laundry_service',
    description: 'Everyday clothes washed, dried and neatly folded.'
  },
  { 
    id: 'ironing', 
    name: 'Steam Ironing', 
    category: 'Daily Wear',
    unit: 'pc',
    basePrice: 15,
    icon: 'iron',
    description: 'Crisp, wrinkle-free steam pressing for your formals.'
  },
  { 
    id: 'dry-clean', 
    name: 'Dry Cleaning', 
    category: 'Premium Care',
    unit: 'pc',
    basePrice: 120,
    icon: 'dry_cleaning',
    description: 'Professional chemical cleaning for delicate fabrics.'
  },
  { 
    id: 'shoes', 
    name: 'Shoe Spa', 
    category: 'Premium Care',
    unit: 'pair',
    basePrice: 250,
    icon: 'ice_skating',
    description: 'Deep cleaning and restoration for your favorite footwear.'
  },
  { 
    id: 'home-furnishing', 
    name: 'Home Furnishing', 
    category: 'Curtains & Linen',
    unit: 'sqft',
    basePrice: 40,
    icon: 'curtains',
    description: 'Curtains, bedsheets, and sofa cover cleaning.'
  }
];

export const getServiceById = (id) => MASTER_SERVICES.find(s => s.id === id);
