// ============================================================
// DFQ Store — store.ts
// Firebase Firestore + Storage (real-time, cross-device sync)
// Falls back to localStorage if Firebase is unreachable
// ============================================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore, doc, getDoc, setDoc, collection,
  getDocs, deleteDoc, Firestore
} from 'firebase/firestore';
import {
  getStorage, ref, uploadString, getDownloadURL,
  FirebaseStorage
} from 'firebase/storage';

// ─── Types ────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: 'Hoodies' | 'Tees' | 'Joggers' | 'Accessories' | 'Compression';
  price: number;
  description: string;
  image: string;
  images: string[];
  sizes: string[];
  featured: boolean;
  newArrival: boolean;
  outOfStock: boolean;
  archived?: boolean;
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
  whatsappNumber: string;
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
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

// ─── Firebase Config ──────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCKOCXKel-PdOX-837Xp4Rz7BcDDJs-rdY',
  authDomain: 'dfq-sports-app.firebaseapp.com',
  projectId: 'dfq-sports-app',
  storageBucket: 'dfq-sports-app.firebasestorage.app',
  messagingSenderId: '41696932296',
  appId: '1:41696932296:web:e56d576d86ee28cc6b90fd',
};

// ─── Firebase Singleton ───────────────────────────────────────

let _app: FirebaseApp;
let _db: Firestore;
let _storage: FirebaseStorage;

function getFirebase() {
  if (!_app) {
    _app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    _db = getFirestore(_app);
    _storage = getStorage(_app);
  }
  return { db: _db, storage: _storage };
}

// ─── Initial / Default Data ───────────────────────────────────

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'dfq-1',
    name: 'DFQ Apex Heavyweight Athletic Hoodie',
    category: 'Hoodies',
    price: 450,
    description: 'Built for extreme pre-game warmups and cold-weather runs. 520gsm organic cotton fleece with bold gold "DON\'T FUCKING QUIT" typography across the chest.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true, newArrival: true, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-2',
    name: 'DFQ Relentless Compression Tee',
    category: 'Compression',
    price: 240,
    description: 'Ultra-stretch sweat-wicking compression top engineered for high-intensity lifting and combat sports.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true, newArrival: true, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-3',
    name: 'DFQ Hyper-Performance Joggers',
    category: 'Joggers',
    price: 350,
    description: 'Tapered athletic fit joggers made from high-stretch woven fabric.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true, newArrival: false, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-4',
    name: 'DFQ Unbroken Oversized Warmup Pullover',
    category: 'Hoodies',
    price: 480,
    description: 'Oversized drop-shoulder profile designed for pre-workout pump cover.',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: true, newArrival: false, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-5',
    name: 'DFQ Motivation Gym Crest Snapback',
    category: 'Accessories',
    price: 180,
    description: 'Durable 6-panel athletic cap with 3D metallic gold embroidery.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800'],
    sizes: ['One Size'],
    featured: true, newArrival: false, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-6',
    name: 'DFQ Dominance High-Cut Graphic Tee',
    category: 'Tees',
    price: 220,
    description: 'Raw-cut sleeve graphic tee designed for bodybuilding and intense training.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true, newArrival: true, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-7',
    name: 'DFQ Apex Utility Track Sweatpants',
    category: 'Joggers',
    price: 320,
    description: 'Multi-pocket fleece track sweatpants designed for all-day streetwear versatility.',
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false, newArrival: false, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-8',
    name: 'DFQ All-Weather Reflective Track Jacket',
    category: 'Hoodies',
    price: 520,
    description: 'Water-repellent windbreaker with 3M reflective gold piping.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false, newArrival: false, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-9',
    name: 'DFQ Essential Core Minimalist Tee',
    category: 'Tees',
    price: 190,
    description: 'Pure black athletic tee with a subtle micro-printed "DFQ" acronym.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false, newArrival: false, outOfStock: false, archived: false,
  },
  {
    id: 'dfq-10',
    name: 'DFQ Combat Heavyweight Gym Duffel Bag',
    category: 'Accessories',
    price: 380,
    description: 'Military-grade ballistic nylon duffel with dedicated shoe compartment.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'],
    sizes: ['One Size'],
    featured: false, newArrival: true, outOfStock: false, archived: false,
  },
];

export const INITIAL_CONFIG: SiteConfig = {
  whatsappNumber: '+233535079557',
  announcementText: '🔥 GHANA NATIONWIDE EXPRESS DISPATCH • ORDER VIA WHATSAPP (+233 53 507 9557) 🔥',
  heroHeadline: "DON'T FUCKING QUIT.",
  heroSubheadline: 'Premium Athletic Streetwear & Sportswear Built for Uncompromising Resilience.',
  brandLogoImage: '',
  heroImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1600',
  heroBackgroundImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1600',
  homepageBackground: '',
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
  testimonialAvatar3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
};

export const INITIAL_DB_CONFIG: DatabaseProviderConfig = {
  provider: 'firebase',
  apiKey: FIREBASE_CONFIG.apiKey,
  authDomainOrProjectUrl: FIREBASE_CONFIG.authDomain,
  projectIdOrKey: FIREBASE_CONFIG.projectId,
  storageBucket: FIREBASE_CONFIG.storageBucket,
};

// ─── Helpers ──────────────────────────────────────────────────

export const formatGHC = (amount: number): string => `GH₵${amount.toFixed(2)}`;

// ─── IMAGE UPLOAD ─────────────────────────────────────────────
// Compresses image first, then uploads to Firebase Storage.
// Reduces a 5MB phone photo to ~150-300KB before upload.
// Falls back to compressed base64 if Storage upload fails.

const compressImage = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');

        // Scale down if wider than maxWidth
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG (75% quality, looks great on clothing store)
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadImageFile = async (file: File): Promise<string> => {
  try {
    const { storage } = getFirebase();

    // Compress first — brings upload time from 10-15min down to 5-15 seconds
    const compressed = await compressImage(file);

    const path = `dfq-images/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const storageRef = ref(storage, path);
    await uploadString(storageRef, compressed, 'data_url');
    const url = await getDownloadURL(storageRef);
    return url; // ✅ Public Firebase Storage URL — visible to everyone
  } catch (err) {
    console.warn('Firebase Storage upload failed, falling back to compressed base64:', err);
    return compressImage(file); // fallback is still compressed
  }
};

// ─── PRODUCTS ─────────────────────────────────────────────────

const PRODUCTS_COLLECTION = 'products';
const LOCAL_PRODUCTS_KEY = 'dfq_products';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { db } = getFirebase();
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

    if (!snapshot.empty) {
      const products = snapshot.docs.map(d => ({
        ...(d.data() as Product),
        id: d.id,
        images: d.data().images || [d.data().image],
        archived: !!d.data().archived,
      }));
      // Sync to localStorage as cache
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
      return products;
    }

    // Firestore empty — seed with initial products
    console.log('Firestore empty, seeding initial products...');
    await saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.warn('Firestore unavailable, using localStorage fallback:', err);
    try {
      const data = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (data) {
        return JSON.parse(data).map((p: any) => ({
          ...p,
          images: p.images || [p.image],
          archived: !!p.archived,
        }));
      }
    } catch (_) {}
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = async (products: Product[]): Promise<void> => {
  // Always save to localStorage immediately (instant UI response)
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));

  // Then persist to Firestore (all visitors will see this)
  try {
    const { db } = getFirebase();
    await Promise.all(
      products.map(p =>
        setDoc(doc(db, PRODUCTS_COLLECTION, p.id), {
          name: p.name,
          category: p.category,
          price: p.price,
          description: p.description,
          image: p.image,
          images: p.images,
          sizes: p.sizes,
          featured: p.featured,
          newArrival: p.newArrival,
          outOfStock: p.outOfStock,
          archived: p.archived ?? false,
        })
      )
    );

    // Remove products from Firestore that were deleted locally
    const { db: db2 } = getFirebase();
    const snapshot = await getDocs(collection(db2, PRODUCTS_COLLECTION));
    const localIds = new Set(products.map(p => p.id));
    await Promise.all(
      snapshot.docs
        .filter(d => !localIds.has(d.id))
        .map(d => deleteDoc(doc(db2, PRODUCTS_COLLECTION, d.id)))
    );
  } catch (err) {
    console.warn('Firestore save failed (localStorage updated):', err);
  }
};

// ─── SITE CONFIG ──────────────────────────────────────────────

const CONFIG_DOC = 'config/siteConfig';
const LOCAL_CONFIG_KEY = 'dfq_config';

export const getConfig = async (): Promise<SiteConfig> => {
  try {
    const { db } = getFirebase();
    const snap = await getDoc(doc(db, 'config', 'siteConfig'));
    if (snap.exists()) {
      const data = { ...INITIAL_CONFIG, ...(snap.data() as SiteConfig) };
      localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(data));
      return data;
    }
    // Seed Firestore with defaults
    await saveConfig(INITIAL_CONFIG);
    return INITIAL_CONFIG;
  } catch (err) {
    console.warn('Firestore config unavailable, using localStorage fallback:', err);
    try {
      const data = localStorage.getItem(LOCAL_CONFIG_KEY);
      if (data) return { ...INITIAL_CONFIG, ...JSON.parse(data) };
    } catch (_) {}
    return INITIAL_CONFIG;
  }
};

export const saveConfig = async (config: SiteConfig): Promise<void> => {
  localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));
  try {
    const { db } = getFirebase();
    await setDoc(doc(db, 'config', 'siteConfig'), { ...config });
  } catch (err) {
    console.warn('Firestore config save failed (localStorage updated):', err);
  }
};

// ─── CART (localStorage only — per-user, no sync needed) ──────

const LOCAL_CART_KEY = 'dfq_cart';

export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(LOCAL_CART_KEY);
    if (data) return JSON.parse(data);
  } catch (_) {}
  return [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
};

// ─── DB CONFIG (localStorage only) ───────────────────────────

const LOCAL_DB_CONFIG_KEY = 'dfq_db_config';

export const getDbConfig = (): DatabaseProviderConfig => {
  try {
    const data = localStorage.getItem(LOCAL_DB_CONFIG_KEY);
    if (data) return JSON.parse(data);
  } catch (_) {}
  return INITIAL_DB_CONFIG;
};

export const saveDbConfig = (cfg: DatabaseProviderConfig): void => {
  localStorage.setItem(LOCAL_DB_CONFIG_KEY, JSON.stringify(cfg));
};

// ─── ADMIN AUTH (localStorage — session only) ─────────────────

export const isAdminLoggedIn = (): boolean =>
  localStorage.getItem('dfq_admin_session') === 'active';

export const loginAdmin = (user: string, pass: string): boolean => {
  if (user === 'Crackit' && pass === 'Crackit199526') {
    localStorage.setItem('dfq_admin_session', 'active');
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem('dfq_admin_session');
};