import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, CheckCircle, Phone, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl mb-10 text-center sm:text-left">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3 py-1 text-xs font-semibold text-amber-300 border border-emerald-700/60">
            <Sparkles className="h-3.5 w-3.5" /> 17 Years of Service to Humanity
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            About Al-Murtaza Spiritual Center
          </h1>
          <p className="font-arabic text-lg sm:text-2xl text-amber-300 font-bold" dir="rtl">
            المرتضیٰ مرکزِ روحانیت — یقین، دعا، نسبت اور خدمتِ انسانیت
          </p>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Founded under the spiritual guidance of <strong>Hazrat Peer Muhammad Usman Alvi Sahib</strong>, Al-Murtaza Spiritual Center is dedicated to propagating Quranic education, authentic Sunnah-based spiritual healing, and compassionate community welfare.
          </p>
        </div>
      </div>

      {/* Founder Profile In-Depth */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative aspect-square w-72 sm:w-88 overflow-hidden rounded-2xl border-4 border-emerald-800/20 shadow-xl bg-slate-100">
              <img
                src="/images/owner.webp"
                alt="Hazrat Peer Muhammad Usman Alvi Sahib"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Spiritual Guide & Patron
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Hazrat Peer Muhammad Usman Alvi Sahib
              </h2>
              <p className="font-arabic text-base sm:text-lg text-emerald-800 font-semibold mt-1" dir="rtl">
                پیرِ طریقت حضرت پیر محمد عثمان علوی صاحب
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Hazrat Peer Muhammad Usman Alvi Sahib has devoted approximately <strong>17 years</strong> to continuous service in spiritual counseling, religious education, and humanitarian relief. Rooted in deep Islamic scholarship and devotion to the Quran and Sunnah, his approach emphasizes pure faith, sincere supplication (Dua), and selfless service to creation.
              </p>
              <p>
                Under his leadership, thousands have found clarity in personal, domestic, and spiritual tribulations through genuine Istikhara guidance and Masnoon Ruqyah. Beyond spiritual guidance, Peer Sahib established ongoing welfare programs to ensure orphans, widows, and impoverished households in the Rawalpindi and Chakwal areas receive regular sustenance and care.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20Hazrat%20Peer%20Sahib"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition-all"
              >
                <Phone className="h-4 w-4" /> Direct WhatsApp Consultation
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                View Spiritual Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Our Sacred Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To provide authentic Islamic and spiritual guidance in the light of the Quran and Sunnah, revive prophetic wellness (Tibb-e-Nabawi), support deserving families, promote moral education, and serve humanity with sincerity and compassion.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To build a supportive society anchored in Islamic values, spiritual peace, brotherhood, and universal service to humanity, free from exploitation and despair.
          </p>
        </div>
      </div>
    </div>
  );
}
