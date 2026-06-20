export interface Product {
  id: string;
  name: string;
  category: 'Hoodies' | 'Tees' | 'Joggers' | 'Accessories' | 'Compression';
  price: number; // in Ghana Cedi (GH₵)
  description: string;
  image: string; // Primary image Base64 DataURL or initial stock
  images: string[]; // Multiple gallery images for the product
  sizes: string[];
  featured: boolean;
  newArrival: boolean;
  outOfStock: boolean;
  archived?: boolean; // Archiving feature
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface SiteConfig {
  whatsappNumber: string; // +233535079557
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  
  // Graphical Image Management System (Direct File Uploads)
  brandLogoImage: string;
  heroImage: string;
  heroBackgroundImage: string;
  homepageBackground: string;
  bannerImage: string;
  announcementBannerImage: string;
  collectionBanner1: string;
  collectionBanner2: string;
  brandStoryImage1: string;
  brandStoryImage2: string;
  galleryImage1: string;
  galleryImage2: string;
  galleryImage3: string;
  galleryImage4: string;
  categoryHoodiesImg: string;
  categoryTeesImg: string;
  categoryJoggersImg: string;
  categoryAccessoriesImg: string;
  categoryCompressionImg: string;
  testimonialAvatar1: string;
  testimonialAvatar2: string;
  testimonialAvatar3: string;
}

export interface DatabaseProviderConfig {
  provider: 'firebase' | 'supabase' | 'local_simulated_cloud';
  apiKey: string;
  authDomainOrProjectUrl: string;
  projectIdOrKey: string;
  storageBucket: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'dfq-1',
    name: 'DFQ Apex Heavyweight Athletic Hoodie',
    category: 'Hoodies',
    price: 450,
    description: 'Built for extreme pre-game warmups and cold-weather runs. 520gsm organic cotton fleece with bold gold "DON\'T FUCKING QUIT" typography across the chest. Extreme comfort, reinforced seams.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    newArrival: true,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-2',
    name: 'DFQ Relentless Compression Tee',
    category: 'Compression',
    price: 240,
    description: 'Ultra-stretch sweat-wicking compression top engineered for high-intensity lifting and combat sports. Maximizes blood flow while displaying the sharp DFQ logo on the left pec.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    newArrival: true,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-3',
    name: 'DFQ Hyper-Performance Joggers',
    category: 'Joggers',
    price: 350,
    description: 'Tapered athletic fit joggers made from high-stretch woven fabric. Features zipped security pockets, adjustable waistband with gold aglets, and breathable mesh inseams.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    newArrival: false,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-4',
    name: 'DFQ Unbroken Oversized Warmup Pullover',
    category: 'Hoodies',
    price: 480,
    description: 'Oversized drop-shoulder profile designed for pre-workout pump cover. Heavyweight brushed French terry with distressed gold-foil spine lettering.',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: true,
    newArrival: false,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-5',
    name: 'DFQ Motivation Gym Crest Snapback',
    category: 'Accessories',
    price: 180,
    description: 'Durable 6-panel athletic cap with perforated laser-cut back panels for maximum cooling. 3D metallic gold embroidery of the DFQ motivational crest.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['One Size'],
    featured: true,
    newArrival: false,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-6',
    name: 'DFQ Dominance High-Cut Graphic Tee',
    category: 'Tees',
    price: 220,
    description: 'Raw-cut sleeve graphic tee designed for bodybuilding and intense training. Ultra-soft combed ringspun cotton that won\'t shrink in the wash.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    newArrival: true,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-7',
    name: 'DFQ Apex Utility Track Sweatpants',
    category: 'Joggers',
    price: 320,
    description: 'Multi-pocket fleece track sweatpants designed for all-day streetwear versatility. Deep pockets and thick premium waistband.',
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    newArrival: false,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-8',
    name: 'DFQ All-Weather Reflective Track Jacket',
    category: 'Hoodies',
    price: 520,
    description: 'Water-repellent windbreaker with 3M reflective gold piping that illuminates in headlights during midnight road work.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    newArrival: false,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-9',
    name: 'DFQ Essential Core Minimalist Tee',
    category: 'Tees',
    price: 190,
    description: 'Pure black athletic tee with a subtle micro-printed "DFQ" acronym centered on the chest. Understated, premium gym essential.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    newArrival: false,
    outOfStock: false,
    archived: false
  },
  {
    id: 'dfq-10',
    name: 'DFQ Combat Heavyweight Gym Duffel Bag',
    category: 'Accessories',
    price: 380,
    description: 'Military-grade ballistic nylon duffel with dedicated shoe compartment, wet-pocket for sweaty gear, and padded heavy-duty strap.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['One Size'],
    featured: false,
    newArrival: true,
    outOfStock: false,
    archived: false
  }
];

export const INITIAL_CONFIG: SiteConfig = {
  whatsappNumber: '+233535079557',
  announcementText: '🔥 GHANA NATIONWIDE EXPRESS DISPATCH • ORDER VIA WHATSAPP (+233 53 507 9557) 🔥',
  heroHeadline: 'DON\'T FUCKING QUIT.',
  heroSubheadline: 'Premium Athletic Streetwear & Sportswear Built for Uncompromising Resilience.',
  
  // Graphical Image Management System initial placeholders
  brandLogoImage: '', // Will use text logo if empty, or uploaded image
  heroImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1600',
  heroBackgroundImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1600',
  homepageBackground: '', // Dynamic background overlay
  bannerImage: 'https://images.unsplash.com/photo-1508742340722-21151121d582?auto=format&fit=crop&q=80&w=1600',
  announcementBannerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1600',
  collectionBanner1: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
  collectionBanner2: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
  brandStoryImage1: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=600',
  brandStoryImage2: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600',
  galleryImage1: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
  galleryImage2: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
  galleryImage3: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
  galleryImage4: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
  categoryHoodiesImg: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
  categoryTeesImg: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
  categoryJoggersImg: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
  categoryAccessoriesImg: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
  categoryCompressionImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
  testimonialAvatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  testimonialAvatar2: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  testimonialAvatar3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
};

export const INITIAL_DB_CONFIG: DatabaseProviderConfig = {
  provider: 'firebase',
  apiKey: 'AIzaSyDocDemoKeyForFirebaseFirestore',
  authDomainOrProjectUrl: 'dfq-sports-app.firebaseapp.com',
  projectIdOrKey: 'dfq-sports-app',
  storageBucket: 'dfq-sports-app.appspot.com'
};

// Ghana Cedi Currency Formatter Helper
export const formatGHC = (amount: number): string => {
  return `GH₵${amount.toFixed(2)}`;
};

// LocalStorage & simulated Cloud Storage accessors
export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem('dfq_products');
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all products have images array and archived flag if loading older localStorage data
      return parsed.map((p: any) => ({
        ...p,
        images: p.images || [p.image],
        archived: !!p.archived
      }));
    }
  } catch (e) {
    console.error('Failed to parse products from localStorage', e);
  }
  localStorage.setItem('dfq_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('dfq_products', JSON.stringify(products));
};

export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem('dfq_cart');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse cart from localStorage', e);
  }
  return [];
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem('dfq_cart', JSON.stringify(cart));
};

export const getConfig = (): SiteConfig => {
  try {
    const data = localStorage.getItem('dfq_config');
    if (data) {
      const parsed = JSON.parse(data);
      // Merge with INITIAL_CONFIG to ensure new image fields exist if loading older localStorage data
      return { ...INITIAL_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse config from localStorage', e);
  }
  localStorage.setItem('dfq_config', JSON.stringify(INITIAL_CONFIG));
  return INITIAL_CONFIG;
};

export const saveConfig = (config: SiteConfig) => {
  localStorage.setItem('dfq_config', JSON.stringify(config));
};

export const getDbConfig = (): DatabaseProviderConfig => {
  try {
    const data = localStorage.getItem('dfq_db_config');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse db config', e);
  }
  return INITIAL_DB_CONFIG;
};

export const saveDbConfig = (cfg: DatabaseProviderConfig) => {
  localStorage.setItem('dfq_db_config', JSON.stringify(cfg));
};

// Admin authentication session management with secure username & password
export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem('dfq_admin_session') === 'active';
};

export const loginAdmin = (user: string, pass: string): boolean => {
  if (user === 'Crackit' && pass === 'Crackit199526') {
    localStorage.setItem('dfq_admin_session', 'active');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem('dfq_admin_session');
};

// Helper to convert uploaded File to Base64 DataURL (Simulated Cloud Storage Upload)
export const uploadImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject('Failed to read file as data URL');
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
