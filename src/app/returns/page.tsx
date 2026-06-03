'use client';
import Link from 'next/link';
export default function ReturnsPage() {
  return (
    <div className="min-h-screen"><div className="bg-[#111] border-b border-[#2A2A2A] py-12 text-center"><h1 className="font-display text-3xl font-bold text-white">Return & Refund Policy</h1><p className="text-[#666] text-sm mt-1">Easy returns, hassle-free</p></div>
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="card rounded-lg p-5 border-[#2ECC71]/20"><p className="text-xs font-bold text-[#2ECC71]">✓ 7-Day Easy Return Window</p><p className="text-[10px] text-[#A0A0A0] mt-1">Return any product within 7 days for a full refund</p></div>
      <div className="card rounded-lg p-5">
        <h2 className="font-display text-sm font-bold text-white mb-3">How to Return</h2>
        <div className="space-y-3">{[{s:1,t:'Initiate Return',d:'Go to Orders → Select → Return'},{s:2,t:'Pack It',d:'Original packaging with tags'},{s:3,t:'Pickup',d:'Courier picks up in 48 hours'},{s:4,t:'Refund',d:'5-7 business days after quality check'}].map(st=>(
          <div key={st.s} className="flex gap-3"><div className="w-7 h-7 gradient-gold rounded-full flex items-center justify-center text-[10px] text-black font-bold flex-shrink-0">{st.s}</div><div><p className="text-xs font-medium text-white">{st.t}</p><p className="text-[10px] text-[#666]">{st.d}</p></div></div>
        ))}</div>
      </div>
      <div className="card rounded-lg p-5">
        <h2 className="font-display text-sm font-bold text-white mb-3">Refund Timeline</h2>
        <div className="space-y-1.5 text-xs">{[{m:'UPI',t:'2-3 days'},{m:'Card',t:'5-7 days'},{m:'Net Banking',t:'5-7 days'},{m:'COD',t:'7-10 days (bank transfer)'}].map(r=>(
          <div key={r.m} className="flex justify-between py-1.5 border-b border-[#2A2A2A] last:border-0"><span className="text-[#A0A0A0]">{r.m}</span><span className="text-white">{r.t}</span></div>
        ))}</div>
      </div>
      <div className="text-center"><p className="text-xs text-[#666]">Need help?</p><Link href="/contact" className="btn-gold-sm inline-block mt-2">Contact Support</Link></div>
    </div></div>
  );
}
