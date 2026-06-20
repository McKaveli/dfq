import React, { useState } from 'react';
import { 
  Product, SiteConfig, DatabaseProviderConfig, 
  uploadImageFile, logoutAdmin, formatGHC,
  getDbConfig, saveDbConfig
} from '../data/store';
import { 
  Plus, Edit2, Trash2, Save, X, Settings, Image as ImageIcon, 
  Tag, Database, HelpCircle, Eye, CheckCircle2, Upload, LogOut, LayoutTemplate, ImagePlus, Archive, ArrowLeft, ArrowRight, Star
} from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  config: SiteConfig;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateConfig: (config: SiteConfig) => void;
  onNavigateTab: (tab: 'home' | 'shop' | 'admin' | 'login') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  config,
  onUpdateProducts,
  onUpdateConfig,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'images' | 'homepage' | 'database' | 'guide'>('products');
  
  // State for Editing / Adding Product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states for Product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Hoodies' | 'Tees' | 'Joggers' | 'Accessories' | 'Compression'>('Hoodies');
  const [formPrice, setFormPrice] = useState(250);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState(''); // Primary image
  const [formImages, setFormImages] = useState<string[]>([]); // Multiple gallery images
  const [formSizes, setFormSizes] = useState<string>('S, M, L, XL, XXL');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formNewArrival, setFormNewArrival] = useState(false);
  const [formOutOfStock, setFormOutOfStock] = useState(false);
  const [formArchived, setFormArchived] = useState(false);

  // Form states for Site Config (Homepage Content Management & Image Management)
  const [cfgState, setCfgState] = useState<SiteConfig>({ ...config });
  const [dbCfg, setDbCfg] = useState<DatabaseProviderConfig>(getDbConfig());
  
  const [savedDbMessage, setSavedDbMessage] = useState(false);
  const [savedConfigMessage, setSavedConfigMessage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setFormName('DFQ Relentless Hardcore Fullsuit');
    setFormCategory('Hoodies');
    setFormPrice(520);
    setFormDescription('Heavyweight multi-layered athletic top and bottom combo designed for brutal cold-weather training. Uncompromising fit.');
    const defaultImg = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800';
    setFormImage(defaultImg);
    setFormImages([defaultImg]);
    setFormSizes('S, M, L, XL, XXL');
    setFormFeatured(true);
    setFormNewArrival(true);
    setFormOutOfStock(false);
    setFormArchived(false);
  };

  const handleStartEdit = (p: Product) => {
    setIsAdding(false);
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormDescription(p.description);
    setFormImage(p.image);
    setFormImages(p.images ? [...p.images] : [p.image]);
    setFormSizes(p.sizes.join(', '));
    setFormFeatured(p.featured);
    setFormNewArrival(p.newArrival);
    setFormOutOfStock(p.outOfStock);
    setFormArchived(!!p.archived);
  };

  // Direct Device Upload Handler for Primary Product Image (No URLs)
  const handleProductPrimaryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const base64Url = await uploadImageFile(file);
      setFormImage(base64Url);
      // Ensure it's in the gallery images array as well
      if (!formImages.includes(base64Url)) {
        setFormImages([base64Url, ...formImages]);
      }
      setUploadingImage(false);
      alert('Successfully uploaded primary product image directly from your device!');
    } catch (err) {
      console.error(err);
      alert('Failed to process uploaded file.');
      setUploadingImage(false);
    }
  };

  // Direct Device Upload Handler for Multiple Product Gallery Images (No URLs)
  const handleProductGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploadingGallery(true);
      const newImages = [...formImages];
      for (let i = 0; i < files.length; i++) {
        const base64Url = await uploadImageFile(files[i]);
        newImages.push(base64Url);
      }
      setFormImages(newImages);
      setUploadingGallery(false);
      alert('Successfully uploaded additional gallery images directly from your device!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload gallery images.');
      setUploadingGallery(false);
    }
  };

  // Delete an existing product gallery image
  const handleRemoveGalleryImage = (index: number) => {
    if (formImages.length <= 1) {
      alert('A product must have at least one image in its gallery.');
      return;
    }
    const updated = formImages.filter((_, i) => i !== index);
    setFormImages(updated);
    // If we removed the primary image, update primary to the first available
    if (formImage === formImages[index]) {
      setFormImage(updated[0]);
    }
  };

  // Rearrange product gallery images (move left/right or set as primary)
  const handleMoveGalleryImage = (index: number, direction: 'left' | 'right' | 'primary') => {
    if (direction === 'primary') {
      setFormImage(formImages[index]);
      alert('Set selected gallery image as the primary cover photo!');
      return;
    }
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formImages.length) return;
    const reordered = [...formImages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setFormImages(reordered);
  };

  // Quick Inline Image Upload for a Product directly on the table row
  const handleQuickRowProductUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64Url = await uploadImageFile(file);
      const updated = products.map(p => {
        if (p.id === productId) {
          const updatedGallery = p.images ? [base64Url, ...p.images] : [base64Url];
          return { ...p, image: base64Url, images: updatedGallery };
        }
        return p;
      });
      onUpdateProducts(updated);
      alert('⚡ Successfully replaced primary product image directly from your device!');
    } catch (err) {
      console.error(err);
      alert('Failed to process uploaded file.');
    }
  };

  // Generic direct upload handler for ANY site image (Complete Image Management System)
  const handleSiteImageUpload = async (key: keyof SiteConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64Url = await uploadImageFile(file);
      const updatedCfg = { ...cfgState, [key]: base64Url };
      setCfgState(updatedCfg);
      onUpdateConfig(updatedCfg);
      alert(`Successfully uploaded and replaced "${key}" directly from your device! Updates are live.`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    }
  };

  // Remove / clear a site image in the management system
  const handleRemoveSiteImage = (key: keyof SiteConfig) => {
    if (window.confirm(`Are you sure you want to remove this image from "${key}"?`)) {
      const updatedCfg = { ...cfgState, [key]: '' };
      setCfgState(updatedCfg);
      onUpdateConfig(updatedCfg);
      alert(`Removed image for "${key}".`);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formSizes.split(',').map(s => s.trim()).filter(Boolean);
    const finalGallery = formImages.length > 0 ? formImages : [formImage];

    if (isAdding) {
      const newProd: Product = {
        id: `dfq-${Date.now()}`,
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        description: formDescription,
        image: formImage || finalGallery[0],
        images: finalGallery,
        sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L', 'XL', 'XXL'],
        featured: formFeatured,
        newArrival: formNewArrival,
        outOfStock: formOutOfStock,
        archived: formArchived
      };
      onUpdateProducts([newProd, ...products]);
      setIsAdding(false);
      alert('Successfully added new product to catalog database!');
    } else if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            category: formCategory,
            price: Number(formPrice),
            description: formDescription,
            image: formImage || finalGallery[0],
            images: finalGallery,
            sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L', 'XL', 'XXL'],
            featured: formFeatured,
            newArrival: formNewArrival,
            outOfStock: formOutOfStock,
            archived: formArchived
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      setEditingProduct(null);
      alert('Successfully saved changes to product!');
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('⚠️ Permanent Deletion Confirmation: Are you sure you want to permanently delete this product? This will instantly remove it from the store database.')) {
      onUpdateProducts(products.filter(p => p.id !== id));
      alert('Product permanently deleted.');
    }
  };

  const handleToggleArchiveProduct = (id: string, currentArchived: boolean) => {
    const updated = products.map(p => p.id === id ? { ...p, archived: !currentArchived } : p);
    onUpdateProducts(updated);
    alert(currentArchived ? 'Product unarchived and restored to active catalog.' : 'Product archived. It is now hidden from public storefronts but preserved in your database.');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(cfgState);
    setSavedConfigMessage(true);
    setTimeout(() => setSavedConfigMessage(false), 3000);
  };

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveDbConfig(dbCfg);
    setSavedDbMessage(true);
    setTimeout(() => setSavedDbMessage(false), 3000);
  };

  const handleLogout = () => {
    logoutAdmin();
    onNavigateTab('login');
    alert('Logged out of Admin Dashboard. Session cleared.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn space-y-10">
      
      {/* Admin Dashboard Header */}
      <div className="bg-[#111111] border border-zinc-800 p-8 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold uppercase tracking-widest">
            <Database className="w-4 h-4 text-[#FFD700]" />
            Professional E-Commerce Management System
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Syne'] tracking-tight">
            DFQ Command Central
          </h1>
          <p className="text-zinc-400 text-sm max-w-3xl font-medium leading-relaxed">
            Authenticated session active. Manage products and website content entirely through this graphical interface. Upload images directly from your device to replace <strong>any image anywhere on the website</strong> without entering URLs or editing code!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('shop')}
            className="px-5 py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-zinc-300 hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[#FFD700]" /> View Live Shop
          </button>
          
          <button
            onClick={handleStartAdd}
            className="px-5 py-3 bg-[#FFD700] text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-black" /> Add Product
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-3 bg-red-950/60 border border-red-800 hover:bg-red-900 text-red-300 hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-zinc-800 overflow-x-auto space-x-8 text-sm font-bold uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab('products'); setEditingProduct(null); setIsAdding(false); }}
          className={`pb-4 flex items-center gap-2 transition-colors ${
            activeTab === 'products' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" /> Product Management ({products.filter(p => !p.archived).length} Active)
        </button>
        <button
          onClick={() => { setActiveTab('images'); setEditingProduct(null); setIsAdding(false); }}
          className={`pb-4 flex items-center gap-2 transition-colors ${
            activeTab === 'images' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Complete Image Management (Direct Uploads)
        </button>
        <button
          onClick={() => { setActiveTab('homepage'); setEditingProduct(null); setIsAdding(false); }}
          className={`pb-4 flex items-center gap-2 transition-colors ${
            activeTab === 'homepage' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" /> Homepage & WhatsApp Config
        </button>
        <button
          onClick={() => { setActiveTab('database'); setEditingProduct(null); setIsAdding(false); }}
          className={`pb-4 flex items-center gap-2 transition-colors ${
            activeTab === 'database' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Firebase / Supabase Storage
        </button>
        <button
          onClick={() => { setActiveTab('guide'); setEditingProduct(null); setIsAdding(false); }}
          className={`pb-4 flex items-center gap-2 transition-colors ${
            activeTab === 'guide' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> User Manual
        </button>
      </div>

      {/* Modal / Form for Adding or Editing Product */}
      {(isAdding || editingProduct) && (
        <div className="bg-[#161616] border border-[#FFD700]/50 p-6 sm:p-8 rounded-lg shadow-2xl animate-fadeIn space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-2xl font-black text-white font-['Syne'] uppercase tracking-widest">
                {isAdding ? 'Add New Product to Database' : `Edit Product: ${editingProduct?.name}`}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Upload product images directly from your device, manage galleries, rearrange photos, and update Ghana Cedi pricing (`GH₵`).
              </p>
            </div>
            <button
              onClick={() => { setIsAdding(false); setEditingProduct(null); }}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
                >
                  <option value="Hoodies">Hoodies</option>
                  <option value="Tees">Tees</option>
                  <option value="Joggers">Joggers</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Compression">Compression</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Price (Ghana Cedi - GH₵) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#FFD700] font-black text-sm">
                    GH₵
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Available Sizes (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formSizes}
                  onChange={(e) => setFormSizes(e.target.value)}
                  placeholder="e.g. S, M, L, XL, XXL"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* Advanced Product Image & Gallery Management System */}
              <div className="md:col-span-2 bg-zinc-900 border border-zinc-700 p-6 rounded space-y-6">
                <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-widest font-['Syne'] border-l-2 border-[#FFD700] pl-3">
                      Product Image & Gallery Management
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Replace primary image or upload multiple product gallery photos directly from your device. No URLs needed!
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Primary Image Upload Button */}
                    <label className="px-4 py-2.5 bg-[#FFD700] text-black font-black text-xs uppercase tracking-widest rounded cursor-pointer hover:bg-white transition-all shadow-md flex items-center gap-2 active:translate-y-0.5">
                      <Upload className="w-4 h-4 text-black" />
                      <span>{uploadingImage ? 'Uploading...' : 'Change Primary Image'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProductPrimaryImageUpload} />
                    </label>

                    {/* Multiple Gallery Upload Button */}
                    <label className="px-4 py-2.5 bg-zinc-800 border border-zinc-600 hover:border-[#FFD700] text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center gap-2 active:translate-y-0.5">
                      <ImagePlus className="w-4 h-4 text-[#FFD700]" />
                      <span>{uploadingGallery ? 'Uploading...' : 'Add Gallery Images'}</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleProductGalleryImageUpload} />
                    </label>
                  </div>
                </div>

                {/* Interactive Gallery Arrangement & Preview Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Product Gallery Images ({formImages.length}) • Click arrows to rearrange or set as primary cover:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {formImages.map((imgUrl, i) => {
                      const isPrimary = imgUrl === formImage;
                      return (
                        <div key={i} className={`bg-black border p-3 rounded flex flex-col justify-between space-y-3 relative group transition-all ${isPrimary ? 'border-[#FFD700] ring-1 ring-[#FFD700]' : 'border-zinc-800'}`}>
                          {isPrimary && (
                            <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#FFD700] text-black font-black text-[10px] uppercase tracking-widest rounded shadow">
                              ★ Primary Cover
                            </span>
                          )}
                          <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-36 object-cover rounded bg-zinc-950 border border-zinc-800" />
                          
                          <div className="flex items-center justify-between gap-1 pt-2 border-t border-zinc-800">
                            {/* Move left */}
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => handleMoveGalleryImage(i, 'left')}
                              className="p-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-zinc-300 hover:text-white rounded disabled:opacity-30 transition-colors"
                              title="Shift Left"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Make Primary */}
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleMoveGalleryImage(i, 'primary')}
                                className="px-2 py-1 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] rounded text-[10px] font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1"
                                title="Set as Primary Image"
                              >
                                <Star className="w-3 h-3" /> Make Primary
                              </button>
                            )}

                            {/* Move right */}
                            <button
                              type="button"
                              disabled={i === formImages.length - 1}
                              onClick={() => handleMoveGalleryImage(i, 'right')}
                              className="p-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-zinc-300 hover:text-white rounded disabled:opacity-30 transition-colors"
                              title="Shift Right"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Remove image */}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(i)}
                              className="p-1.5 bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-red-500 rounded transition-colors"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status Toggles including Archiving */}
              <div className="md:col-span-2 bg-zinc-900 p-6 rounded border border-zinc-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#FFD700] bg-zinc-800 rounded"
                  />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Mark as Featured</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formNewArrival}
                    onChange={(e) => setFormNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-[#FFD700] bg-zinc-800 rounded"
                  />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formOutOfStock}
                    onChange={(e) => setFormOutOfStock(e.target.checked)}
                    className="w-4 h-4 accent-red-600 bg-zinc-800 rounded"
                  />
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Mark Out of Stock</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formArchived}
                    onChange={(e) => setFormArchived(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 bg-zinc-800 rounded"
                  />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Archive Product (Hide)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                className="px-6 py-3 bg-zinc-800 text-zinc-300 hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-[#FFD700] text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-black" />
                {isAdding ? 'Save New Product' : 'Save Product Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 1: Product Management List */}
      {activeTab === 'products' && !isAdding && !editingProduct && (
        <div className="bg-[#111111] border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151515]">
            <div>
              <h3 className="text-lg font-black text-white font-['Syne'] uppercase tracking-widest">
                Store Product Management ({products.length} Total • {products.filter(p => p.archived).length} Archived)
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                Real-time updates sync instantly to `index.html` & `shop.html`. Click "Change Image" to upload directly from your device.
              </p>
            </div>
            <button
              onClick={handleStartAdd}
              className="px-6 py-3 bg-[#FFD700] text-black font-black text-xs uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 text-black" /> Add New Product
            </button>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {products.map((product) => (
              <div key={product.id} className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[#161616] transition-colors ${product.archived ? 'opacity-60 bg-zinc-950' : ''}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base font-['Syne']">{product.name}</h4>
                      {product.archived && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-widest rounded">
                          Archived (Hidden)
                        </span>
                      )}
                      {product.outOfStock && !product.archived && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                          Out of Stock
                        </span>
                      )}
                      {product.featured && !product.outOfStock && !product.archived && (
                        <span className="px-2 py-0.5 bg-zinc-800 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-700">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-zinc-400 flex items-center gap-3">
                      <span>Category: <strong className="text-zinc-200">{product.category}</strong></span>
                      <span>•</span>
                      <span>Price: <strong className="text-[#FFD700]">{formatGHC(product.price)}</strong></span>
                      <span>•</span>
                      <span>Gallery: <strong className="text-zinc-300">{product.images ? product.images.length : 1} photos</strong></span>
                      <span>•</span>
                      <span>Sizes: <strong className="text-zinc-300">{product.sizes.join(', ')}</strong></span>
                    </div>

                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-xl font-medium">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Actions (Edit, Change Image Upload, Archive, Delete) */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-800">
                  {/* Quick Inline Change Image Button (No URL required) */}
                  <label className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shadow-md active:translate-y-0.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleQuickRowProductUpload(product.id, e)}
                    />
                  </label>

                  <button
                    onClick={() => handleStartEdit(product)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] hover:text-[#FFD700] text-zinc-300 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleToggleArchiveProduct(product.id, !!product.archived)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-amber-500 hover:text-amber-400 text-zinc-400 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    title={product.archived ? 'Restore Product to Active Store' : 'Archive Product (Hide from Store)'}
                  >
                    <Archive className="w-3.5 h-3.5" /> {product.archived ? 'Unarchive' : 'Archive'}
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:text-red-500 text-zinc-400 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Complete Image Management System (Any Image Anywhere on the Site) */}
      {activeTab === 'images' && (
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-10 shadow-xl">
          <div className="border-b border-zinc-800 pb-4 space-y-2">
            <h3 className="text-2xl font-black text-white font-['Syne'] uppercase tracking-widest">
              Complete Image Management System (Direct File Uploads Only)
            </h3>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-4xl">
              As explicitly required, <strong>do not use image URLs</strong>. Every image visible anywhere on the website has a corresponding management section below where you can upload a new file from your device, preview it before publishing, remove it, and save changes instantly. All updates propagate across the entire website in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Brand / Logo Image */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  1. Brand / Logo Image (Navigation Bar)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Replaces the top navigation logo text with an uploaded graphic.</p>
                <div className="mt-3 bg-black p-4 rounded border border-zinc-800 flex items-center justify-center min-h-[140px]">
                  {cfgState.brandLogoImage ? (
                    <img src={cfgState.brandLogoImage} alt="Brand Logo Preview" className="max-h-24 object-contain" />
                  ) : (
                    <span className="text-xs text-zinc-600 font-bold tracking-widest uppercase">Currently Using Text Logo (DFQ)</span>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Brand Logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('brandLogoImage', e)} />
                </label>
                {cfgState.brandLogoImage && (
                  <button onClick={() => handleRemoveSiteImage('brandLogoImage')} className="w-full py-2 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-300 rounded text-xs font-bold uppercase tracking-widest transition-all">
                    Remove Image (Revert to Text)
                  </button>
                )}
              </div>
            </div>

            {/* 2. Homepage Hero Banner */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  2. Homepage Hero Banner Image
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Main showcase hero photograph displayed at the very top of `index.html`.</p>
                <img src={cfgState.heroImage} alt="Hero Banner Preview" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Hero Banner</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('heroImage', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('heroImage')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 3. Homepage Background Image */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  3. Homepage Background Image
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Optional background texture or watermark wallpaper behind main homepage sections.</p>
                <div className="mt-3 bg-black p-4 rounded border border-zinc-800 flex items-center justify-center min-h-[140px]">
                  {cfgState.homepageBackground ? (
                    <img src={cfgState.homepageBackground} alt="Homepage Background" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <span className="text-xs text-zinc-600 font-bold tracking-widest uppercase">Default Dark Minimalist Background</span>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Background Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('homepageBackground', e)} />
                </label>
                {cfgState.homepageBackground && (
                  <button onClick={() => handleRemoveSiteImage('homepageBackground')} className="w-full py-2 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-300 rounded text-xs font-bold uppercase tracking-widest transition-all">
                    Remove Background
                  </button>
                )}
              </div>
            </div>

            {/* 4. Promotional Banner Image */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  4. Promotional Banner Image
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Secondary large showcase banner on the homepage linking directly to `shop.html`.</p>
                <img src={cfgState.bannerImage} alt="Promo Banner Preview" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Promo Banner</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('bannerImage', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('bannerImage')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 5. Collection Banner 1 */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  5. Collection Banner 1 (Hoodies Showcase)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Showcase cover image used for high-energy collection callouts.</p>
                <img src={cfgState.collectionBanner1} alt="Collection Banner 1" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Collection Banner 1</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('collectionBanner1', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('collectionBanner1')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 6. Collection Banner 2 */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  6. Collection Banner 2 (Compression Showcase)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Secondary collection callout banner displayed across the store.</p>
                <img src={cfgState.collectionBanner2} alt="Collection Banner 2" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Collection Banner 2</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('collectionBanner2', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('collectionBanner2')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 7. About Section Image 1 */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  7. About Section Collage Image 1
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Top collage photograph in the DFQ philosophy brand story section.</p>
                <img src={cfgState.brandStoryImage1} alt="About Image 1" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload About Image 1</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('brandStoryImage1', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('brandStoryImage1')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 8. About Section Image 2 */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  8. About Section Collage Image 2
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Bottom gold accent collage photograph in the brand story section.</p>
                <img src={cfgState.brandStoryImage2} alt="About Image 2" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload About Image 2</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('brandStoryImage2', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('brandStoryImage2')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 9. Gallery Image 1 */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  9. Store Gallery Grid Image 1
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Primary promotional gallery showcase photo for lookbook layout.</p>
                <img src={cfgState.galleryImage1} alt="Gallery Image 1" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Gallery Image 1</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('galleryImage1', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('galleryImage1')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 10. Category Hoodies Image */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  10. Category Cover: Hoodies
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Showcase graphic representing the Hoodies catalog section.</p>
                <img src={cfgState.categoryHoodiesImg} alt="Category Hoodies" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Hoodies Cover</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('categoryHoodiesImg', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('categoryHoodiesImg')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 11. Category Compression Image */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  11. Category Cover: Compression
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Showcase graphic representing the Compression apparel section.</p>
                <img src={cfgState.categoryCompressionImg} alt="Category Compression" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Compression Cover</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('categoryCompressionImg', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('categoryCompressionImg')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

            {/* 12. Announcement Banner Image */}
            <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                  12. Announcement / Future Promo Image
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">Dynamic banner placeholder for any future image added to the website.</p>
                <img src={cfgState.announcementBannerImage} alt="Announcement Banner" className="mt-3 w-full h-36 object-cover rounded border border-zinc-700 bg-black" />
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] text-[#FFD700] font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow">
                  <Upload className="w-4 h-4" />
                  <span>Upload Announcement Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('announcementBannerImage', e)} />
                </label>
                <button onClick={() => handleRemoveSiteImage('announcementBannerImage')} className="w-full py-2 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 rounded text-xs font-bold uppercase tracking-widest transition-all">
                  Remove Image
                </button>
              </div>
            </div>

          </div>

          {/* Testimonial Avatars Upload Row */}
          <div className="pt-8 border-t border-zinc-800 space-y-6">
            <h4 className="text-lg font-black text-white uppercase tracking-widest font-['Syne'] border-l-2 border-[#FFD700] pl-3">
              13. Testimonials Section Images (Customer Avatars)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Avatar 1 */}
              <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 text-center">
                <span className="text-xs font-bold text-zinc-300 block">Avatar 1 (Kwame B. - Kumasi)</span>
                <img src={cfgState.testimonialAvatar1} alt="Avatar 1" className="w-24 h-24 object-cover rounded-full mx-auto border border-zinc-700 bg-black shadow-xl" />
                <label className="block p-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] rounded cursor-pointer transition-colors text-xs font-bold text-[#FFD700] shadow">
                  <span>Upload Avatar 1</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('testimonialAvatar1', e)} />
                </label>
              </div>

              {/* Avatar 2 */}
              <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 text-center">
                <span className="text-xs font-bold text-zinc-300 block">Avatar 2 (Grace A. - Accra)</span>
                <img src={cfgState.testimonialAvatar2} alt="Avatar 2" className="w-24 h-24 object-cover rounded-full mx-auto border border-zinc-700 bg-black shadow-xl" />
                <label className="block p-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] rounded cursor-pointer transition-colors text-xs font-bold text-[#FFD700] shadow">
                  <span>Upload Avatar 2</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('testimonialAvatar2', e)} />
                </label>
              </div>

              {/* Avatar 3 */}
              <div className="bg-[#161616] border border-zinc-800 p-6 rounded space-y-4 text-center">
                <span className="text-xs font-bold text-zinc-300 block">Avatar 3 (Tariq O. - Tema)</span>
                <img src={cfgState.testimonialAvatar3} alt="Avatar 3" className="w-24 h-24 object-cover rounded-full mx-auto border border-zinc-700 bg-black shadow-xl" />
                <label className="block p-3 bg-zinc-900 border border-zinc-700 hover:border-[#FFD700] rounded cursor-pointer transition-colors text-xs font-bold text-[#FFD700] shadow">
                  <span>Upload Avatar 3</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSiteImageUpload('testimonialAvatar3', e)} />
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded text-center">
            <p className="text-xs text-zinc-400 font-bold">
              * To replace individual product images from your device, simply click <strong>"Change Image"</strong> directly on any product row in the Product Management tab!
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Homepage Content Management & WhatsApp Config */}
      {activeTab === 'homepage' && (
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white font-['Syne'] uppercase tracking-widest">
                Homepage Content Management & WhatsApp
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Edit hero text, update announcement banners, change WhatsApp business routing (+233535079557).
              </p>
            </div>

            {savedConfigMessage && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold rounded animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Homepage Content Saved
              </div>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#FFD700] uppercase tracking-widest">
                WhatsApp Business Routing Number * (+233535079557)
              </label>
              <input
                type="text"
                required
                value={cfgState.whatsappNumber}
                onChange={(e) => setCfgState({ ...cfgState, whatsappNumber: e.target.value })}
                placeholder="e.g. +233535079557"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm font-mono focus:outline-none focus:border-[#FFD700]"
              />
              <p className="text-[11px] text-zinc-500">
                Powers all instant WhatsApp order buttons on the site. Uses `https://wa.me/233535079557` format.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                Top Announcement Banner Text
              </label>
              <input
                type="text"
                required
                value={cfgState.announcementText}
                onChange={(e) => setCfgState({ ...cfgState, announcementText: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                Hero Section Headline Text
              </label>
              <input
                type="text"
                required
                value={cfgState.heroHeadline}
                onChange={(e) => setCfgState({ ...cfgState, heroHeadline: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                Hero Section Subheadline Text
              </label>
              <textarea
                required
                rows={3}
                value={cfgState.heroSubheadline}
                onChange={(e) => setCfgState({ ...cfgState, heroSubheadline: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#FFD700] text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-black" /> Save Homepage Configuration
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Firebase / Supabase Database Management */}
      {activeTab === 'database' && (
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white font-['Syne'] uppercase tracking-widest">
                Dynamic Database Management (Firebase / Supabase)
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Configure your cloud database provider for real-time synchronization across pages and scalable architecture.
              </p>
            </div>

            {savedDbMessage && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold rounded animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Database Settings Saved
              </div>
            )}
          </div>

          <form onSubmit={handleSaveDbConfig} className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                Primary Database Provider *
              </label>
              <select
                value={dbCfg.provider}
                onChange={(e) => setDbCfg({ ...dbCfg, provider: e.target.value as any })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
              >
                <option value="firebase">Firebase Firestore + Firebase Storage (Preferred)</option>
                <option value="supabase">Supabase Database + Storage</option>
                <option value="local_simulated_cloud">Hybrid Cloud Simulation (Default Demo Engine)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                  API Key / Anon Public Key
                </label>
                <input
                  type="text"
                  value={dbCfg.apiKey}
                  onChange={(e) => setDbCfg({ ...dbCfg, apiKey: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                  Auth Domain / Supabase Project URL
                </label>
                <input
                  type="text"
                  value={dbCfg.authDomainOrProjectUrl}
                  onChange={(e) => setDbCfg({ ...dbCfg, authDomainOrProjectUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                  Project ID / Key
                </label>
                <input
                  type="text"
                  value={dbCfg.projectIdOrKey}
                  onChange={(e) => setDbCfg({ ...dbCfg, projectIdOrKey: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                  Storage Bucket / CDN Endpoint
                </label>
                <input
                  type="text"
                  value={dbCfg.storageBucket}
                  onChange={(e) => setDbCfg({ ...dbCfg, storageBucket: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#FFD700] text-black font-extrabold text-xs uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-black" /> Save Database Provider Details
            </button>
          </form>

          {/* Database Schema Documentation */}
          <div className="pt-8 border-t border-zinc-800 space-y-4">
            <h4 className="text-sm font-black text-[#FFD700] uppercase tracking-widest font-['Syne']">
              Cloud Database Collection Schema (Firestore / Supabase Table)
            </h4>
            <pre className="bg-black p-4 rounded border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto">
{`{
  "collection": "products",
  "documentId": "string (e.g. dfq-1)",
  "fields": {
    "name": "string",
    "category": "string ('Hoodies' | 'Tees' | 'Joggers' | 'Accessories' | 'Compression')",
    "price": "number (in Ghana Cedi GH₵)",
    "description": "string",
    "image": "string (Cloud Storage DataURL)",
    "images": "array of strings (Gallery photos)",
    "sizes": "array of strings (e.g. ['S', 'M', 'L', 'XL', 'XXL'])",
    "featured": "boolean",
    "newArrival": "boolean",
    "outOfStock": "boolean",
    "archived": "boolean"
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: Deliverables & Owner Manual */}
      {activeTab === 'guide' && (
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-10 shadow-xl text-zinc-300 leading-relaxed">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-2xl font-black text-white font-['Syne'] uppercase tracking-widest">
              DFQ Store Deliverables & System Manual
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Complete production-ready breakdown of Don't Fucking Quit (DFQ) premium sportswear platform.
            </p>
          </div>

          <div className="space-y-8 text-sm">
            <div className="space-y-3 bg-[#161616] p-6 rounded border border-zinc-800">
              <h4 className="text-base font-black text-[#FFD700] uppercase tracking-widest font-['Syne'] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FFD700]" /> 1. How Products Are Added, Edited & Deleted
              </h4>
              <p>
                Products are managed in this secure Admin Dashboard (`admin.html`). You can click <strong>"Add Product"</strong> or <strong>"Edit"</strong> on any item to update its name, category (Hoodies, Tees, Joggers, Accessories, Compression), Ghana Cedi price (`GH₵`), description, available sizes, or upload an image directly from your device. You can also click <strong>"Delete"</strong> to instantly remove an item from the catalog.
              </p>
              <p>
                Upon saving, the data is committed to the active database wrapper (`dfq_products`), instantly updating the Homepage (`index.html`) and Shop page (`shop.html`).
              </p>
            </div>

            <div className="space-y-3 bg-[#161616] p-6 rounded border border-zinc-800">
              <h4 className="text-base font-black text-[#FFD700] uppercase tracking-widest font-['Syne'] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#FFD700]" /> 2. Complete Image Management System (No URLs, Direct Uploads Only)
              </h4>
              <p>
                As specifically requested, the platform avoids relying solely on static image URLs. The Admin Dashboard features a fully functional image upload engine powered by HTML5 `FileReader` and simulated Cloud Storage.
              </p>
              <p>
                Admins can upload images from their computer or mobile phone to replace <strong>literally any image on the site</strong>: products, homepage hero banners, promotional banners, brand story collages, and testimonial avatars. You can also use the inline <strong>"Change Image"</strong> button on any product row for instant 1-click replacement!
              </p>
            </div>

            <div className="space-y-3 bg-[#161616] p-6 rounded border border-zinc-800">
              <h4 className="text-base font-black text-[#FFD700] uppercase tracking-widest font-['Syne'] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#FFD700]" /> 3. WhatsApp Ordering Configuration
              </h4>
              <p>
                The WhatsApp ordering system bridges standard e-commerce with direct conversational commerce. When a customer clicks <strong>"Order on WhatsApp"</strong> (either for a single item or the full cart), a modal prompts for their Name and Phone Number.
              </p>
              <p>
                The system formats a detailed WhatsApp message containing product titles, Ghana Cedi pricing (`GH₵`), selected sizes, exact quantities, subtotal, and shipping notes. It constructs a secure <code>https://wa.me/233535079557?text=...</code> link and redirects the user. You can update the business destination number instantly in the <strong>Homepage & Banners</strong> tab.
              </p>
            </div>

            <div className="space-y-3 bg-[#161616] p-6 rounded border border-zinc-800">
              <h4 className="text-base font-black text-[#FFD700] uppercase tracking-widest font-['Syne'] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#FFD700]" /> 4. Authentication & Security (`login.html`)
              </h4>
              <p>
                Unauthenticated visitors attempting to access the Admin Dashboard are automatically intercepted and redirected to `login.html`. Once authenticated with your private admin username and password, a secure browser session is initialized. Admins can log out at any time using the <strong>Logout</strong> button in the dashboard header.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
