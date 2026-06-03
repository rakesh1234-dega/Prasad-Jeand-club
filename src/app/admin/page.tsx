'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Product } from '@/types';

type Tab = 'overview' | 'products' | 'offers' | 'coupons' | 'orders' | 'banner';

const emojis = ['👖','👕','👔','🧥','🥼','🩳','👟','🧤','🎩','👜'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [passError, setPassError] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');

  // Store
  const products = useStore(s => s.products);
  const addProduct = useStore(s => s.addProduct);
  const deleteProduct = useStore(s => s.deleteProduct);
  const flashOffers = useStore(s => s.flashOffers);
  const addFlashOffer = useStore(s => s.addFlashOffer);
  const deleteFlashOffer = useStore(s => s.deleteFlashOffer);
  const coupons = useStore(s => s.coupons);
  const addCoupon = useStore(s => s.addCoupon);
  const deleteCoupon = useStore(s => s.deleteCoupon);
  const orders = useStore(s => s.orders);
  const updateOrderStatus = useStore(s => s.updateOrderStatus);
  const adminOffer = useStore(s => s.adminOffer);
  const setAdminOffer = useStore(s => s.setAdminOffer);

  // Product form
  const [pf, setPf] = useState({ name: '', price: '', mrp: '', category: 'jeans', stock: '50', description: '', sizes: ['M','L'] as string[], tags: [] as string[], emoji: '👖' });
  // Offer form
  const [of, setOf] = useState({ title: '', discount: '', duration: '2' });
  // Coupon form
  const [cf, setCf] = useState({ code: '', discount: '', minOrder: '', expiry: '' });
  // Banner
  const [bannerText, setBannerText] = useState(adminOffer || '');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'prasad@admin2024') { setAuthed(true); sessionStorage.setItem('pjc_admin', 'true'); }
    else { setPassError(true); setTimeout(() => setPassError(false), 600); }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = { id: `p-${Date.now()}`, name: pf.name, price: Number(pf.price), mrp: Number(pf.mrp) || Number(pf.price), category: pf.category, sizes: pf.sizes, colors: ['#000','#1a3a5c'], tags: pf.tags, stock: Number(pf.stock), emoji: pf.emoji, description: pf.description || pf.name, createdAt: new Date().toISOString(), soldCount: 0 };
    addProduct(p);
    setPf({ name: '', price: '', mrp: '', category: 'jeans', stock: '50', description: '', sizes: ['M','L'], tags: [], emoji: '👖' });
    if ((window as any).__pjcToast) (window as any).__pjcToast('Product added ✓');
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    addFlashOffer({ id: `fo-${Date.now()}`, title: of.title, discount: Number(of.discount), endsAt: new Date(Date.now() + Number(of.duration) * 3600000).toISOString(), productIds: [] });
    setOf({ title: '', discount: '', duration: '2' });
    if ((window as any).__pjcToast) (window as any).__pjcToast('Flash offer created ✓');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({ code: cf.code.toUpperCase(), discount: Number(cf.discount), minOrder: Number(cf.minOrder) || 0, expiry: cf.expiry, active: true });
    setCf({ code: '', discount: '', minOrder: '', expiry: '' });
    if ((window as any).__pjcToast) (window as any).__pjcToast('Coupon created ✓');
  };

  // Auth check
  if (!authed && sessionStorage.getItem('pjc_admin') !== 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
        <div className="w-full max-w-xs">
          <div className="text-center mb-5">
            <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center mx-auto mb-2"><span className="text-black text-sm font-bold font-display">PJC</span></div>
            <h1 className="font-display text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-[9px] text-[#666]">Prasad Jeans Club</p>
          </div>
          <form onSubmit={handleLogin} className={`card rounded-xl p-5 ${passError ? 'animate-[shake_0.3s_ease]' : ''}`}>
            <label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="input w-full mb-3" placeholder="Admin password" required />
            <button type="submit" className="btn-gold w-full">LOGIN</button>
            <p className="text-[9px] text-[#666] text-center mt-2">Hint: prasad@admin2024</p>
          </form>
        </div>
      </div>
    );
  }

  if (!authed && sessionStorage.getItem('pjc_admin') === 'true') setAuthed(true);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'offers', label: 'Flash Offers', icon: '⚡' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'banner', label: 'Banner', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Top bar */}
      <div className="h-12 bg-[#111] border-b border-[#2A2A2A] flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 gradient-gold rounded-md flex items-center justify-center"><span className="text-black text-[9px] font-bold">PJC</span></div>
          <span className="text-xs font-bold text-white">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[10px] text-[#A0A0A0] hover:text-[#C9A84C]">← Store</Link>
          <button onClick={() => { sessionStorage.removeItem('pjc_admin'); setAuthed(false); }} className="text-[10px] text-[#E74C3C]">Logout</button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-44 border-r border-[#2A2A2A] min-h-[calc(100vh-48px)] p-2 hidden md:block sticky top-12">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-[11px] font-medium mb-0.5 ${tab === t.id ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]'}`}>
              <span className="text-sm">{t.icon}</span>{t.label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto border-b border-[#2A2A2A] px-2 py-1.5 gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-medium whitespace-nowrap ${tab === t.id ? 'bg-[#C9A84C] text-black' : 'text-[#A0A0A0]'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 max-w-4xl">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-white">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{l:'Products',v:products.length,c:'#C9A84C'},{l:'Flash Offers',v:flashOffers.length,c:'#E74C3C'},{l:'Coupons',v:coupons.filter(c=>c.active).length,c:'#2ECC71'},{l:'Orders',v:orders.length,c:'#3498DB'}].map(s=>(
                  <div key={s.l} className="card rounded-lg p-4"><p className="text-[10px] text-[#666] uppercase tracking-wider">{s.l}</p><p className="text-2xl font-bold mt-1" style={{color:s.c}}>{s.v}</p></div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button onClick={()=>setTab('products')} className="card rounded-lg p-4 text-center card-hover"><span className="text-2xl block">➕</span><span className="text-[10px] text-[#A0A0A0] mt-1 block">Add Product</span></button>
                <button onClick={()=>setTab('offers')} className="card rounded-lg p-4 text-center card-hover"><span className="text-2xl block">⚡</span><span className="text-[10px] text-[#A0A0A0] mt-1 block">New Offer</span></button>
                <button onClick={()=>setTab('coupons')} className="card rounded-lg p-4 text-center card-hover"><span className="text-2xl block">🎫</span><span className="text-[10px] text-[#A0A0A0] mt-1 block">New Coupon</span></button>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-white">Products ({products.length})</h2>
              {/* Add Form */}
              <form onSubmit={handleAddProduct} className="card rounded-lg p-5 space-y-3">
                <h3 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">Add Product</h3>
                <input value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})} required placeholder="Product name" className="input w-full" />
                <div className="grid grid-cols-3 gap-2">
                  <input value={pf.price} onChange={e=>setPf({...pf,price:e.target.value})} required placeholder="Price ₹" type="number" className="input" />
                  <input value={pf.mrp} onChange={e=>setPf({...pf,mrp:e.target.value})} placeholder="MRP ₹" type="number" className="input" />
                  <input value={pf.stock} onChange={e=>setPf({...pf,stock:e.target.value})} placeholder="Stock" type="number" className="input" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={pf.category} onChange={e=>setPf({...pf,category:e.target.value})} className="input">
                    <option value="jeans">Jeans</option><option value="shirts">Shirts</option><option value="tshirts">T-Shirts</option><option value="hoodies">Hoodies</option><option value="jackets">Jackets</option><option value="shorts">Shorts</option>
                  </select>
                  <div className="flex gap-1 items-center">
                    {emojis.map(em=>(
                      <button key={em} type="button" onClick={()=>setPf({...pf,emoji:em})} className={`text-lg p-0.5 rounded ${pf.emoji===em?'bg-[#C9A84C]/20 ring-1 ring-[#C9A84C]':''}`}>{em}</button>
                    ))}
                  </div>
                </div>
                <textarea value={pf.description} onChange={e=>setPf({...pf,description:e.target.value})} placeholder="Description" className="input w-full" rows={2} />
                <div>
                  <p className="text-[9px] text-[#666] uppercase tracking-wider mb-1">Sizes</p>
                  <div className="flex flex-wrap gap-1">{['XS','S','M','L','XL','XXL','28','30','32','34','36','38'].map(s=>(
                    <button key={s} type="button" onClick={()=>setPf(p=>({...p,sizes:p.sizes.includes(s)?p.sizes.filter(x=>x!==s):[...p.sizes,s]}))} className={`px-2 py-1 text-[10px] border rounded ${pf.sizes.includes(s)?'bg-[#C9A84C] text-black border-[#C9A84C]':'border-[#2A2A2A] text-[#A0A0A0]'}`}>{s}</button>
                  ))}</div>
                </div>
                <div>
                  <p className="text-[9px] text-[#666] uppercase tracking-wider mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">{['trending','bestseller','new','featured','flash'].map(t=>(
                    <button key={t} type="button" onClick={()=>setPf(p=>({...p,tags:p.tags.includes(t)?p.tags.filter(x=>x!==t):[...p.tags,t]}))} className={`px-2 py-1 text-[10px] border rounded capitalize ${pf.tags.includes(t)?'bg-[#C9A84C] text-black border-[#C9A84C]':'border-[#2A2A2A] text-[#A0A0A0]'}`}>{t}</button>
                  ))}</div>
                </div>
                <button type="submit" className="btn-gold w-full">ADD PRODUCT</button>
              </form>
              {/* List */}
              <div className="space-y-1.5">
                {products.map(p=>(
                  <div key={p.id} className="card rounded-md p-3 flex items-center gap-3">
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-[#666]">₹{p.price} • {p.category} • Stock: {p.stock}</p>
                      <div className="flex gap-1 mt-0.5">{p.tags.map(t=><span key={t} className={`text-[8px] px-1 py-0.5 rounded uppercase font-bold ${t==='trending'?'bg-[#E74C3C]/10 text-[#E74C3C]':t==='bestseller'?'bg-[#C9A84C]/10 text-[#C9A84C]':'bg-[#2ECC71]/10 text-[#2ECC71]'}`}>{t}</span>)}</div>
                    </div>
                    <button onClick={()=>{if(confirm('Delete?'))deleteProduct(p.id)}} className="text-[10px] text-[#E74C3C] hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLASH OFFERS */}
          {tab === 'offers' && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-white">Flash Offers</h2>
              <form onSubmit={handleAddOffer} className="card rounded-lg p-5 space-y-3">
                <h3 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">Create Flash Offer</h3>
                <input value={of.title} onChange={e=>setOf({...of,title:e.target.value})} required placeholder="e.g. Weekend Flash Sale" className="input w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={of.discount} onChange={e=>setOf({...of,discount:e.target.value})} required placeholder="Discount %" type="number" className="input" />
                  <select value={of.duration} onChange={e=>setOf({...of,duration:e.target.value})} className="input">
                    <option value="0.5">30 min</option><option value="1">1 hour</option><option value="2">2 hours</option><option value="6">6 hours</option><option value="12">12 hours</option><option value="24">24 hours</option>
                  </select>
                </div>
                <button type="submit" className="btn-gold">⚡ CREATE OFFER</button>
              </form>
              <div className="space-y-2">{flashOffers.map(o=>(
                <div key={o.id} className="card rounded-md p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">{o.title}</p><p className="text-[10px] text-[#666]">{o.discount}% OFF • Ends: {new Date(o.endsAt).toLocaleString()}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${new Date(o.endsAt)>new Date()?'bg-[#2ECC71]/10 text-[#2ECC71]':'bg-[#666]/10 text-[#666]'}`}>{new Date(o.endsAt)>new Date()?'LIVE':'ENDED'}</span>
                    <button onClick={()=>deleteFlashOffer(o.id)} className="text-[10px] text-[#E74C3C]">✕</button>
                  </div>
                </div>
              ))}</div>
            </div>
          )}

          {/* COUPONS */}
          {tab === 'coupons' && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-white">Coupons</h2>
              <form onSubmit={handleAddCoupon} className="card rounded-lg p-5 space-y-3">
                <h3 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">Create Coupon</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input value={cf.code} onChange={e=>setCf({...cf,code:e.target.value})} required placeholder="CODE" className="input uppercase" />
                  <input value={cf.discount} onChange={e=>setCf({...cf,discount:e.target.value})} required placeholder="% off" type="number" className="input" />
                  <input value={cf.minOrder} onChange={e=>setCf({...cf,minOrder:e.target.value})} placeholder="Min ₹" type="number" className="input" />
                  <input value={cf.expiry} onChange={e=>setCf({...cf,expiry:e.target.value})} required type="date" className="input" />
                </div>
                <button type="submit" className="btn-gold">🎫 CREATE COUPON</button>
              </form>
              <div className="space-y-1.5">{coupons.map(c=>(
                <div key={c.code} className="card rounded-md p-3 flex items-center justify-between">
                  <div><span className="text-xs font-bold text-[#C9A84C] tracking-wider">{c.code}</span><p className="text-[10px] text-[#666]">{c.discount}% off • Min ₹{c.minOrder} • Exp: {c.expiry}</p></div>
                  <button onClick={()=>deleteCoupon(c.code)} className="text-[10px] text-[#E74C3C]">✕</button>
                </div>
              ))}</div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-white">Orders ({orders.length})</h2>
              {orders.length===0?<p className="text-[#666] text-sm">No orders yet</p>:
              <div className="space-y-2">{orders.map(o=>(
                <div key={o.id} className="card rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div><p className="text-xs font-bold text-white">#{o.id}</p><p className="text-[9px] text-[#666]">{new Date(o.createdAt).toLocaleString()}</p></div>
                    <span className="text-xs font-bold text-[#C9A84C]">₹{o.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#A0A0A0]">{o.items.length} items • {o.payment}</p>
                    <select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value)} className="input text-[10px] py-1 px-2">
                      <option value="placed">Placed</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}</div>}
            </div>
          )}

          {/* BANNER */}
          {tab === 'banner' && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-white">Announcement Banner</h2>
              <div className="card rounded-lg p-5 space-y-3">
                <p className="text-[10px] text-[#666]">This text will scroll in the gold bar on the homepage. Leave empty for default.</p>
                <input value={bannerText} onChange={e=>setBannerText(e.target.value)} placeholder="e.g. 🔥 MEGA SALE: 70% OFF Everything!" className="input w-full" />
                {bannerText && (
                  <div className="bg-[#C9A84C] text-black text-[11px] font-semibold p-2 rounded overflow-hidden"><span className="animate-marquee inline-block whitespace-nowrap">{bannerText}</span></div>
                )}
                <div className="flex gap-2">
                  <button onClick={()=>{setAdminOffer(bannerText||null);if((window as any).__pjcToast)(window as any).__pjcToast('Banner updated ✓')}} className="btn-gold">PUBLISH</button>
                  <button onClick={()=>{setAdminOffer(null);setBannerText('');if((window as any).__pjcToast)(window as any).__pjcToast('Banner cleared')}} className="btn-gold-outline">CLEAR</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
