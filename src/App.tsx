import React, { useState, useEffect } from 'react';
import { 
  Product, CartItem, SiteConfig, 
  getProducts, saveProducts, 
  getCart, saveCart, 
  getConfig, saveConfig,
  isAdminLoggedIn
} from './data/store';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickView } from './components/ProductQuickView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'shop' | 'admin' | 'login'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [config, setConfig] = useState<SiteConfig>({
    whatsappNumber: '+233535079557',
    announcementText: '',
    heroHeadline: '',
    heroSubheadline: '',
    brandLogoImage: '',
    heroImage: '',
    heroBackgroundImage: '',
    homepageBackground: '',
    bannerImage: '',
    announcementBannerImage: '',
    collectionBanner1: '',
    collectionBanner2: '',
    brandStoryImage1: '',
    brandStoryImage2: '',
    galleryImage1: '',
    galleryImage2: '',
    galleryImage3: '',
    galleryImage4: '',
    categoryHoodiesImg: '',
    categoryTeesImg: '',
    categoryJoggersImg: '',
    categoryAccessoriesImg: '',
    categoryCompressionImg: '',
    testimonialAvatar1: '',
    testimonialAvatar2: '',
    testimonialAvatar3: ''
  });

  // Modal states
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [singleOrderProduct, setSingleOrderProduct] = useState<{ product: Product; size: string; quantity: number } | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    setProducts(getProducts());
    setCart(getCart());
    setConfig(getConfig());
  }, []);

  // Safe tab navigation with authentication guard for Admin Dashboard
  const handleNavigateTab = (tab: 'home' | 'shop' | 'admin' | 'login') => {
    if (tab === 'admin' && !isAdminLoggedIn()) {
      alert('🔒 Secure Admin Access: You must log in first to view the dashboard.');
      setCurrentTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync products update
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  // Sync config update
  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Add to Cart handler with explicit quantity
  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    const existingIndex = cart.findIndex(item => item.productId === product.id && item.size === size);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, index) => 
        index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity
      };
      updatedCart = [newItem, ...cart];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    const updatedCart = cart.map(item => item.id === id ? { ...item, quantity: newQty } : item);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Remove Cart Item
  const handleRemoveCartItem = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
    saveCart([]);
  };

  // WhatsApp Order trigger for Single Product with quantity
  const handleWhatsAppOrder = (product: Product, size: string, quantity: number) => {
    setSingleOrderProduct({ product, size, quantity });
    setWhatsappModalOpen(true);
  };

  // WhatsApp Order trigger for Full Cart
  const handleOpenWhatsAppCheckout = () => {
    setSingleOrderProduct(null);
    setWhatsappModalOpen(true);
  };

  // Smooth scroll helpers for Navbar
  const scrollToAbout = () => {
    const el = document.getElementById('brand-story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('testimonials');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#FFD700] selection:text-black">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigateTab}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        openCart={() => setCartOpen(true)}
        announcementText={config.announcementText}
        brandLogoImage={config.brandLogoImage}
        scrollToAbout={scrollToAbout}
        scrollToContact={scrollToContact}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            products={products}
            config={config}
            onNavigateShop={() => handleNavigateTab('shop')}
            onAddToCart={handleAddToCart}
            onWhatsAppOrder={handleWhatsAppOrder}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            products={products}
            config={config}
            onAddToCart={handleAddToCart}
            onWhatsAppOrder={handleWhatsAppOrder}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentTab === 'login' && (
          <LoginView
            onLoginSuccess={() => handleNavigateTab('admin')}
            onNavigateHome={() => handleNavigateTab('home')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            products={products}
            config={config}
            onUpdateProducts={handleUpdateProducts}
            onUpdateConfig={handleUpdateConfig}
            onNavigateTab={handleNavigateTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        whatsappNumber={config.whatsappNumber}
        onNavigateTab={handleNavigateTab}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenWhatsAppCheckout={handleOpenWhatsAppCheckout}
        onNavigateShop={() => {
          setCartOpen(false);
          handleNavigateTab('shop');
        }}
      />

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onWhatsAppOrder={handleWhatsAppOrder}
      />

      {/* WhatsApp Checkout / Order Modal */}
      <WhatsAppModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        whatsappNumber={config.whatsappNumber}
        cart={cart}
        singleOrderProduct={singleOrderProduct}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default App;
