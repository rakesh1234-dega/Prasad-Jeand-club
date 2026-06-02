'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isFlashDeal: boolean;
}

interface FlashOffer {
  id: string;
  title: string;
  discountPercent: number;
  endTime: string;
  isActive: boolean;
}

interface AdminCoupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  expiryDate: string;
  isActive: boolean;
}

type Tab = 'dashboard' | 'products' | 'addProduct' | 'offers' | 'coupons' | 'orders';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [flashOffers, setFlashOffers] = useState<FlashOffer[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const [newProduct, setNewProduct] = useState({ name: '', price: '', oldPrice: '', category: 'jeans', stock: '', sizes: [] as string[], isFeatured: false, isTrending: false, isBestSeller: false, isFlashDeal: false });
  const [newOffer, setNewOffer] = useState({ title: '', discountPercent: '', durationHours: '2' });
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: '', minOrder: '', expiryDate: '' });

  useEffect(() => {
    if (localStorage.getItem('pjc_admin_auth') === 'true') setIsAuthenticated(true);
    const sp = localStorage.getItem('pjc_admin_products'); if (sp) setProducts(JSON.parse(sp));
    const so = localStorage.getItem('pjc_admin_offers'); if (so) setFlashOffers(JSON.parse(so));
    const sc = localStorage.getItem('pjc_admin_coupons'); if (sc) setCoupons(JSON.parse(sc));
    const ord = localStorage.getItem('pjc_orders'); if (ord) setOrders(JSON.parse(ord));
  }, []);

  useEffect(() => { if (products.length) localStorage.setItem('pjc_admin_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('pjc_admin_offers', JSON.stringify(flashOffers)); }, [flashOffers]);
  useEffect(() => { localStorage.setItem('pjc_admin_coupons', JSON.stringify(coupons)); }, [coupons]);

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (adminPass === 'prasad@admin2024') { setIsAuthenticated(true); localStorage.setItem('pjc_admin_auth', 'true'); } else { alert('Wrong password! Use: prasad@admin2024'); } };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: AdminProduct = { id: `prod-${Date.now()}`, name: newProduct.name, price: Number(newProduct.price), oldPrice: Number(newProduct.oldPrice) || Number(newProduct.price), discount: newProduct.oldPrice ? Math.round(((Number(newProduct.oldPrice) - Number(newProduct.price)) / Number(newProduct.oldPrice)) * 100) : 0, category: newProduct.category, sizes: newProduct.sizes, colors: ['#000000'], stock: Number(newProduct.stock) || 50, isFeatured: newProduct.isFeatured, isTrending: newProduct.isTrending, isBestSeller: newProduct.isBestSeller, isFlashDeal: newProduct.isFlashDeal };
    setProducts(prev => [p, ...prev]);
    setNewProduct({ name: '', price: '', oldPrice: '', category: 'jeans', stock: '', sizes: [], isFeatured: false, isTrending: false, isBestSeller: false, isFlashDeal: false });
    setActiveTab('products');
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const o: FlashOffer = { id: `offer-${Date.now()}`, title: newOffer.title, discountPercent: Number(newOffer.discountPercent), endTime: new Date(Date.now() + Number(newOffer.durationHours) * 3600000).toISOString(), isActive: true };
    setFlashOffers(prev => [o, ...prev]);
    localStorage.setItem('pjc_flash_end', String(Date.now() + Number(newOffer.durationHours) * 3600000));
    setNewOffer({ title: '', discountPercent: '', durationHours: '2' });
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const c: AdminCoupon = { id: `c-${Date.now()}`, code: newCoupon.code.toUpperCase(), discountPercent: Number(newCoupon.discountPercent), minOrder: Number(newCoupon.minOrder) || 0, expiryDate: newCoupon.expiryDate, isActive: true };
    setCoupons(prev => [c, ...prev]);
    setNewCoupon({ code: '', discountPercent: '', minOrder: '', expiryDate: '' });
  };

  const updateOrderStatus = (id: string, status: string) => { const u = orders.map(o => o.id === id ? {...o, status} : o); setOrders(u); localStorage.setItem('pjc_orders', JSON.stringify(u)); };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white text-2xl font-bold">PJC</span></div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Prasad Jeans Club</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6">
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="Admin password" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 mb-4" required />
            <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">LOGIN</button>
            <p className="text-[10px] text-gray-400 text-center mt-3">Hint: prasad@admin2024</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><span className="text-xs font-bold">PJC</span></div>
          <h1 className="text-sm font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-white">← Store</Link>
          <button onClick={() => { localStorage.removeItem('pjc_admin_auth'); setIsAuthenticated(false); }} className="text-xs text-red-400">Logout</button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 min-h-[calc(100vh-52px)] sticky top-[52px] hidden md:block p-3">
          {([['dashboard','📊','Dashboard'],['products','📦','Products'],['addProduct','➕','Add Product'],['offers','⚡','Flash Offers'],['coupons','🎫','Coupons'],['orders','🛒','Orders']] as [Tab,string,string][]).map(([id,icon,label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 ${activeTab === id ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 p-5">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{l:'Products',v:products.length,c:'blue'},{l:'Flash Offers',v:flashOffers.filter(o=>o.isActive).length,c:'red'},{l:'Coupons',v:coupons.filter(c=>c.isActive).length,c:'green'},{l:'Orders',v:orders.length,c:'purple'}].map(s=>(
                  <div key={s.l} className="bg-white rounded-xl p-5 border border-gray-100">
                    <p className="text-xs text-gray-500">{s.l}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={()=>setActiveTab('addProduct')} className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100"><span className="text-2xl block">➕</span><span className="text-xs font-medium text-blue-700">Add Product</span></button>
                <button onClick={()=>setActiveTab('offers')} className="p-4 bg-red-50 rounded-xl text-center hover:bg-red-100"><span className="text-2xl block">⚡</span><span className="text-xs font-medium text-red-700">New Offer</span></button>
                <button onClick={()=>setActiveTab('coupons')} className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100"><span className="text-2xl block">🎫</span><span className="text-xs font-medium text-green-700">New Coupon</span></button>
                <button onClick={()=>setActiveTab('orders')} className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100"><span className="text-2xl block">📋</span><span className="text-xs font-medium text-purple-700">Orders</span></button>
              </div>
            </div>
          )}

          {activeTab === 'addProduct' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
                <div><label className="text-xs font-bold text-gray-700 block mb-1">Product Name *</label><input type="text" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} required placeholder="Premium Slim Fit Jeans" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-gray-700 block mb-1">Selling Price ₹ *</label><input type="number" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} required placeholder="1499" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" /></div>
                  <div><label className="text-xs font-bold text-gray-700 block mb-1">MRP ₹</label><input type="number" value={newProduct.oldPrice} onChange={e=>setNewProduct({...newProduct,oldPrice:e.target.value})} placeholder="2999" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                    <select value={newProduct.category} onChange={e=>setNewProduct({...newProduct,category:e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm">
                      <option value="jeans">Jeans</option><option value="shirts">Shirts</option><option value="tshirts">T-Shirts</option><option value="hoodies">Hoodies</option><option value="jackets">Jackets</option><option value="shorts">Shorts</option>
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-gray-700 block mb-1">Stock</label><input type="number" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct,stock:e.target.value})} placeholder="50" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" /></div>
                </div>
                <div><label className="text-xs font-bold text-gray-700 block mb-2">Sizes</label>
                  <div className="flex flex-wrap gap-2">{['S','M','L','XL','XXL','28','30','32','34','36','38','40'].map(s=>(
                    <button key={s} type="button" onClick={()=>setNewProduct(p=>({...p,sizes:p.sizes.includes(s)?p.sizes.filter(x=>x!==s):[...p.sizes,s]}))} className={`px-3 py-1.5 text-xs border rounded-lg ${newProduct.sizes.includes(s)?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-600'}`}>{s}</button>
                  ))}</div>
                </div>
                <div><label className="text-xs font-bold text-gray-700 block mb-2">Display Tags</label>
                  <div className="flex flex-wrap gap-3">{[['isFeatured','⭐ New Arrival'],['isTrending','🔥 Trending'],['isBestSeller','👑 Best Seller'],['isFlashDeal','⚡ Flash Deal']].map(([k,l])=>(
                    <label key={k} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={(newProduct as any)[k]} onChange={e=>setNewProduct(p=>({...p,[k]:e.target.checked}))} className="w-4 h-4 text-red-600 rounded" /><span className="text-xs font-medium">{l}</span></label>
                  ))}</div>
                </div>
                <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 mt-2">ADD PRODUCT</button>
              </form>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products ({products.length})</h2>
                <button onClick={()=>setActiveTab('addProduct')} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg">+ Add</button>
              </div>
              {products.length===0?(
                <div className="bg-white rounded-xl p-12 text-center border"><span className="text-5xl block mb-3">📦</span><p className="text-gray-500">No products yet</p><button onClick={()=>setActiveTab('addProduct')} className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg">Add First</button></div>
              ):(
                <div className="space-y-2">{products.map(p=>(
                  <div key={p.id} className="bg-white rounded-lg p-4 border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{p.category==='jeans'?'👖':p.category==='shirts'?'👔':p.category==='tshirts'?'👕':'🧥'}</div>
                      <div>
                        <h4 className="font-semibold text-sm">{p.name}</h4>
                        <p className="text-xs text-gray-500">₹{p.price} {p.discount>0&&<span className="text-green-600 font-bold">({p.discount}% off)</span>} • {p.category} • Stock: {p.stock}</p>
                        <div className="flex gap-1 mt-0.5">{p.isFlashDeal&&<span className="text-[9px] px-1 bg-red-100 text-red-700 rounded font-bold">FLASH</span>}{p.isTrending&&<span className="text-[9px] px-1 bg-orange-100 text-orange-700 rounded font-bold">TRENDING</span>}{p.isFeatured&&<span className="text-[9px] px-1 bg-blue-100 text-blue-700 rounded font-bold">FEATURED</span>}</div>
                      </div>
                    </div>
                    <button onClick={()=>{if(confirm('Delete?'))setProducts(prev=>prev.filter(x=>x.id!==p.id))}} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Flash Offers</h2>
              <form onSubmit={handleAddOffer} className="bg-white rounded-xl p-6 border space-y-4">
                <h3 className="font-bold text-sm">Create Flash Offer (shows on homepage timer)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={newOffer.title} onChange={e=>setNewOffer({...newOffer,title:e.target.value})} required placeholder="e.g. 50% OFF Jeans" className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-red-500" />
                  <input type="number" value={newOffer.discountPercent} onChange={e=>setNewOffer({...newOffer,discountPercent:e.target.value})} required placeholder="Discount %" className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-red-500" />
                  <select value={newOffer.durationHours} onChange={e=>setNewOffer({...newOffer,durationHours:e.target.value})} className="px-4 py-3 border rounded-lg text-sm">
                    <option value="0.5">30 min</option><option value="1">1 hr</option><option value="2">2 hrs</option><option value="3">3 hrs</option><option value="6">6 hrs</option><option value="12">12 hrs</option><option value="24">24 hrs</option>
                  </select>
                </div>
                <button type="submit" className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">⚡ CREATE OFFER</button>
              </form>
              <div className="space-y-2">{flashOffers.map(o=>(
                <div key={o.id} className="bg-white rounded-lg p-4 border flex items-center justify-between">
                  <div><p className="font-semibold text-sm">{o.title}</p><p className="text-xs text-gray-500">{o.discountPercent}% OFF • Ends: {new Date(o.endTime).toLocaleString()}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${o.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{o.isActive?'LIVE':'ENDED'}</span>
                    <button onClick={()=>setFlashOffers(prev=>prev.filter(x=>x.id!==o.id))} className="text-xs text-red-500">Delete</button>
                  </div>
                </div>
              ))}</div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Coupons</h2>
              <form onSubmit={handleAddCoupon} className="bg-white rounded-xl p-6 border space-y-4">
                <h3 className="font-bold text-sm">Create Coupon Code</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input type="text" value={newCoupon.code} onChange={e=>setNewCoupon({...newCoupon,code:e.target.value})} required placeholder="CODE" className="px-4 py-3 border rounded-lg text-sm uppercase focus:outline-none focus:border-red-500" />
                  <input type="number" value={newCoupon.discountPercent} onChange={e=>setNewCoupon({...newCoupon,discountPercent:e.target.value})} required placeholder="% off" className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-red-500" />
                  <input type="number" value={newCoupon.minOrder} onChange={e=>setNewCoupon({...newCoupon,minOrder:e.target.value})} placeholder="Min ₹" className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-red-500" />
                  <input type="date" value={newCoupon.expiryDate} onChange={e=>setNewCoupon({...newCoupon,expiryDate:e.target.value})} required className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-red-500" />
                </div>
                <button type="submit" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">🎫 CREATE</button>
              </form>
              <div className="space-y-2">{coupons.map(c=>(
                <div key={c.id} className="bg-white rounded-lg p-4 border flex items-center justify-between">
                  <div><span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">{c.code}</span><p className="text-xs text-gray-500 mt-1">{c.discountPercent}% off • Min ₹{c.minOrder} • Exp: {c.expiryDate}</p></div>
                  <button onClick={()=>setCoupons(prev=>prev.map(x=>x.id===c.id?{...x,isActive:!x.isActive}:x))} className={`text-xs px-3 py-1.5 rounded-lg font-bold ${c.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{c.isActive?'ACTIVE':'OFF'}</button>
                </div>
              ))}</div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders ({orders.length})</h2>
              {orders.length===0?(<div className="bg-white rounded-xl p-12 text-center border"><span className="text-5xl block mb-3">📋</span><p className="text-gray-500">No orders yet</p></div>):(
                <div className="space-y-2">{orders.map((o:any)=>(
                  <div key={o.id} className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <div><p className="font-bold text-sm">#{o.id}</p><p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleString()}</p></div>
                      <span className="font-bold">₹{o.total?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{o.items?.length} items</p>
                      <select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value)} className={`text-xs font-bold px-3 py-1 rounded-lg border ${o.status==='delivered'?'bg-green-50 text-green-700 border-green-200':o.status==='cancelled'?'bg-red-50 text-red-700 border-red-200':'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        <option value="placed">Placed</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
