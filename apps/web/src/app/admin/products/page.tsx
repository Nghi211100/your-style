'use client';

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  createdAt?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Selected items for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('Dresses');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const availableColors = ['#1A1814', '#C4A265', '#8C7E6A', '#F0EDE8', '#FFFFFF', '#E6C181', '#755A24'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const categories = ['Dresses', 'Outwear', 'Accessories', 'Shoes', 'Knitwear'];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch product catalog');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Atelier API offline.');
    } finally {
      setLoading(false);
    }
  }

  // Handle auto slug creation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingProduct) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  // Open add modal
  const openAddModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setPrice(0);
    setSalePrice('');
    setStock(0);
    setCategory('Dresses');
    setImageUrl('');
    setSelectedColors([]);
    setSelectedSizes([]);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setDescription(product.description);
    setPrice(product.price);
    setSalePrice(product.salePrice === null ? '' : product.salePrice);
    setStock(product.stock);
    setCategory(product.category);
    setImageUrl(product.images?.[0] || '');
    setSelectedColors(product.colors || []);
    setSelectedSizes(product.sizes || []);
  };

  // Save product (Add or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      salePrice: salePrice === '' ? null : Number(salePrice),
      stock: Number(stock),
      category,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'],
      colors: selectedColors,
      sizes: selectedSizes,
    };

    try {
      const url = editingProduct
        ? `${process.env.API_URL}/products/${editingProduct.id}`
        : `${process.env.API_URL}/products`;
      const method = editingProduct ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product changes');

      setIsAddModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to retire this apparel from catalog?')) return;
    try {
      const res = await fetch(`${process.env.API_URL}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to retire apparel');
      fetchProducts();
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to retire product.');
    }
  };

  // Bulk action: Delete selected
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to retire these ${selectedIds.length} apparel items?`)) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${process.env.API_URL}/products/${id}`, { method: 'DELETE' })
        )
      );
      setSelectedIds([]);
      fetchProducts();
    } catch (err: any) {
      alert('Bulk retirement failed. Some items may not have been deleted.');
    }
  };

  // Checkbox interactions
  const handleSelectToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  // Filter Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();

      let matchesStock = true;
      if (stockFilter === 'out') matchesStock = p.stock === 0;
      else if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 5;
      else if (stockFilter === 'in') matchesStock = p.stock > 5;

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    });

  if (loading && products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C4A265] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-sans text-sm text-[#8C7E6A] tracking-wider uppercase">Aligning catalog drawers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#1A1814]">Catalog Repository</h2>
          <p className="text-[#8C7E6A] font-sans text-sm">Add, update, and manage high-fashion apparel inventories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#1A1814] text-white hover:bg-[#C4A265] transition-all px-6 py-3 rounded-lg shadow flex items-center justify-center gap-2 font-sans font-semibold text-sm uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Propose Apparel
        </button>
      </div>

      {/* Filters Bar */}
      <section className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>

        {/* Stock status filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
        >
          <option value="all">All Inventory Statuses</option>
          <option value="in">In Stock (&gt; 5)</option>
          <option value="low">Low Stock (1 - 5)</option>
          <option value="out">Out of Stock (0)</option>
        </select>

        {/* Sort option */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
        >
          <option value="newest">Recently Proposed</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </section>

      {/* Main Table Card */}
      <section className="bg-white rounded-xl border border-[#C4A265]/10 shadow-whisper overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] border-b border-[#F0EDE8] text-[10px] text-[#8C7E6A] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 && selectedIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAllToggle}
                    className="rounded border-gray-300 text-[#C4A265] focus:ring-[#C4A265] cursor-pointer"
                  />
                </th>
                <th className="py-4 px-6">Apparel item</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock level</th>
                <th className="py-4 px-6">Sizes & Colors</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8] font-sans text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C7E6A]">
                    No apparel fits these search parameters inside your collection.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FDFBF7] transition-all">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleSelectToggle(p.id)}
                        className="rounded border-gray-300 text-[#C4A265] focus:ring-[#C4A265] cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#F0EDE8] hover:scale-105 transition-transform duration-300"
                      />
                      <div>
                        <h4 className="font-bold text-[#1A1814] max-w-[200px] truncate">{p.name}</h4>
                        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">{p.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded bg-[#F0EDE8] text-[#8C7E6A] font-sans font-semibold text-[10px] uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm font-bold text-[#1A1814]">
                        ${p.price.toLocaleString()}
                      </div>
                      {p.salePrice && (
                        <div className="font-mono text-[10px] text-red-500 line-through">
                          ${p.salePrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          p.stock === 0
                            ? 'bg-red-500'
                            : p.stock <= 5
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`} />
                        <span className={`font-mono text-xs font-semibold ${
                          p.stock === 0
                            ? 'text-red-600'
                            : p.stock <= 5
                            ? 'text-amber-600'
                            : 'text-[#1A1814]'
                        }`}>
                          {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        {p.sizes?.map((sz) => (
                          <span key={sz} className="px-1.5 py-0.5 rounded border border-[#F0EDE8] text-[9px] font-bold text-gray-500">
                            {sz}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        {p.colors?.map((col) => (
                          <span
                            key={col}
                            style={{ backgroundColor: col }}
                            className="w-3.5 h-3.5 rounded-full border border-gray-200 block"
                            title={col}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 hover:bg-[#F0EDE8] rounded text-[#8C7E6A] hover:text-[#1A1814] transition-all"
                          title="Modify details"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-all"
                          title="Retire apparel"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Floating Bulk Actions bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1814] text-white py-4 px-8 rounded-full shadow-lg border border-[#C4A265]/30 flex items-center gap-6 z-50 animate-bounce duration-1000">
          <span className="font-sans text-xs uppercase tracking-wider text-[#C4A265] font-bold">
            {selectedIds.length} Apparel selected
          </span>
          <div className="w-px h-5 bg-white/10" />
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Retire Selected
          </button>
          <div className="w-px h-5 bg-white/10" />
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Modals overlay */}
      {(isAddModalOpen || editingProduct !== null) && (
        <div className="fixed inset-0 bg-[#1A1814]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-[#C4A265]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute right-6 top-6 text-[#8C7E6A] hover:text-[#1A1814] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-sans text-2xl font-bold tracking-tight text-[#1A1814] mb-6">
              {editingProduct ? 'Modify Boutique Apparel' : 'Propose Boutique Apparel'}
            </h3>

            <form onSubmit={handleSave} className="space-y-6 text-sm font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                    Apparel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
                    placeholder="e.g. Silk Linen Trench Coat"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                    Slug ID
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-mono"
                    placeholder="silk-linen-trench-coat"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                    Category Selection
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Level */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-mono"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-mono"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                    Boutique Sale Price ($ - Optional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-mono"
                    placeholder="Leave blank for regular price"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                  Atelier Editorial Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
                  placeholder="Describe the fabric weaves, craftsmanship cuts, luxury fittings..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                  Apparel Editorial Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#C4A265] transition-colors font-mono text-xs"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-sans">
                  provide high definition photography assets.
                </p>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                  Tailored Sizes Allocation
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSizes(selectedSizes.filter((item) => item !== sz));
                          } else {
                            setSelectedSizes([...selectedSizes, sz]);
                          }
                        }}
                        className={`px-4 py-2 rounded border font-semibold text-xs transition-all uppercase font-sans ${
                          isSelected
                            ? 'bg-[#1A1814] text-white border-[#1A1814]'
                            : 'bg-white text-gray-500 border-[#F0EDE8] hover:border-gray-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7E6A] mb-2">
                  Palette Swatches Selection
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((col) => {
                    const isSelected = selectedColors.includes(col);
                    return (
                      <button
                        type="button"
                        key={col}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedColors(selectedColors.filter((item) => item !== col));
                          } else {
                            setSelectedColors([...selectedColors, col]);
                          }
                        }}
                        style={{ backgroundColor: col }}
                        className={`w-8 h-8 rounded-full border relative flex items-center justify-center transition-all hover:scale-110 shadow-sm ${
                          isSelected ? 'border-2 border-[#C4A265] scale-105' : 'border-gray-300'
                        }`}
                        title={col}
                      >
                        {isSelected && (
                          <span
                            className={`material-symbols-outlined text-xs ${
                              col === '#FFFFFF' || col === '#F0EDE8' ? 'text-black' : 'text-white'
                            }`}
                          >
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 border-t border-[#F0EDE8] pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-3 rounded-lg border border-[#F0EDE8] hover:bg-[#FDFBF7] font-semibold text-xs uppercase tracking-wider text-[#8C7E6A] transition-all font-sans"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1814] text-white hover:bg-[#C4A265] px-8 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all shadow font-sans"
                >
                  {editingProduct ? 'Commit Modification' : 'Publish Apparel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
