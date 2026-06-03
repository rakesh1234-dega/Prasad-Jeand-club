'use client';
export default function TermsPage() {
  return (
    <div className="min-h-screen"><div className="bg-[#111] border-b border-[#2A2A2A] py-12 text-center"><h1 className="font-display text-3xl font-bold text-white">Terms & Conditions</h1><p className="text-[#666] text-sm mt-1">Last updated: January 2024</p></div>
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {[{t:'Account Terms',c:'You must provide accurate information. You are responsible for your account security.'},{t:'Orders & Payment',c:'All prices are in INR, inclusive of GST. We reserve the right to cancel orders if stock is unavailable.'},{t:'Shipping',c:'Delivery timelines are estimates. We are not responsible for courier delays.'},{t:'Returns',c:'Products can be returned within 7 days. Items must be unused with original tags.'},{t:'Prohibited Activities',c:'Creating fake accounts, placing fraudulent orders, or reselling products is prohibited.'}].map(s=>(
        <div key={s.t} className="card rounded-lg p-5"><h2 className="font-display text-sm font-bold text-white mb-2">{s.t}</h2><p className="text-xs text-[#A0A0A0] leading-relaxed">{s.c}</p></div>
      ))}
    </div></div>
  );
}
