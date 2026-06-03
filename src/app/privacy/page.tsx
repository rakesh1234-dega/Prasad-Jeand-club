'use client';
export default function PrivacyPage() {
  return (
    <div className="min-h-screen"><div className="bg-[#111] border-b border-[#2A2A2A] py-12 text-center"><h1 className="font-display text-3xl font-bold text-white">Privacy Policy</h1><p className="text-[#666] text-sm mt-1">Last updated: January 2024</p></div>
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {[{t:'Information We Collect',c:'We collect name, email, phone, shipping address, and payment info when you make a purchase.'},{t:'How We Use It',c:'To process orders, send updates, improve our services, and send promotional offers with your consent.'},{t:'Data Sharing',c:'We never sell your data. We share only with shipping partners and payment processors to fulfill orders.'},{t:'Security',c:'We use industry-standard SSL encryption to protect all data transfers.'},{t:'Your Rights',c:'You can access, correct, or delete your data anytime. Contact support@prasadjeans.com.'}].map(s=>(
        <div key={s.t} className="card rounded-lg p-5"><h2 className="font-display text-sm font-bold text-white mb-2">{s.t}</h2><p className="text-xs text-[#A0A0A0] leading-relaxed">{s.c}</p></div>
      ))}
    </div></div>
  );
}
