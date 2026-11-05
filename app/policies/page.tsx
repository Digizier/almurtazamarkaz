export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Store Policies & Medical Disclaimer
        </h1>
        <p className="text-xs text-slate-500 mt-1">Al-Murtaza Spiritual Center & Herbal Store</p>
      </div>

      {/* 1. Shipping & Delivery */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
        <h2 className="text-base font-bold text-slate-900 text-emerald-800">
          1. Delivery & Nationwide Shipping Policy
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          We ship across all cities, districts, and tehsils in Pakistan via reputable courier partners (TCS, Leopard, PostEx, Trax).
          Orders are typically dispatched within 24 business hours. Estimated delivery time is 2 to 4 working days for major cities (Rawalpindi, Islamabad, Lahore, Karachi, Peshawar, Multan, Faisalabad) and 3 to 5 days for remote areas.
          Standard delivery charge is Rs. 250. Orders of Rs. 2,500 and above qualify for 100% <strong>FREE Delivery</strong>.
        </p>
      </div>

      {/* 2. Return & Refund Policy */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
        <h2 className="text-base font-bold text-slate-900 text-emerald-800">
          2. Return, Replacement & Damage Policy
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          If any product is received damaged, leaking, or broken during courier transit, please notify us within 48 hours of delivery with a photo on WhatsApp (0329-9888909). We will arrange an immediate, complimentary replacement without hassle. Due to hygiene and herbal purity standards, opened herbal oils and powders cannot be returned once used.
        </p>
      </div>

      {/* 3. Medical Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-xs space-y-2">
        <h2 className="text-base font-bold text-amber-950">
          3. Traditional Wellness & Medical Disclaimer
        </h2>
        <p className="text-xs text-amber-900 leading-relaxed">
          The herbal oils, Sidr honey, and natural botanical products offered by Al-Murtaza Spiritual Center are traditional holistic wellness items and dietary supplements. They are not intended as substitutes for professional clinical medical advice, prescription medication, or formal hospital care. Pregnant or nursing mothers and individuals with chronic medical illnesses (e.g. severe renal failure, diabetes) should consult their physician prior to taking concentrated botanical extracts.
        </p>
      </div>

      {/* 4. Spiritual Consultation Ethics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
        <h2 className="text-base font-bold text-slate-900 text-emerald-800">
          4. Spiritual Consultation & Istikhara Ethics
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Spiritual guidance, Ruqyah, and Istikhara are conducted strictly under Islamic principles and Sunnah tradition. No commercial fees are charged for spiritual guidance; it is carried out purely for the pleasure of Allah and the spiritual welfare of Muslims.
        </p>
      </div>
    </div>
  );
}
