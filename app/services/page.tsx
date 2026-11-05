"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Phone, CheckCircle, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";
import { getSpiritualServices } from "@/lib/db";
import { SpiritualService } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<SpiritualService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpiritualServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const faqs = [
    {
      q: "What is the procedure for Istikhara at Al-Murtaza Spiritual Center?",
      a: "Istikhara is conducted according to the Sunnah of Prophet Muhammad (PBUH). You can send your name, mother's name, and the specific matter via WhatsApp (0329-9888909), and Hazrat Peer Muhammad Usman Alvi Sahib provides authentic guidance based on prayer and Islamic wisdom."
    },
    {
      q: "Is there any fee or commercial charge for spiritual guidance?",
      a: "No. Al-Murtaza Spiritual Center provides Rohani Ilaj, Ruqyah, and Istikhara guidance purely for the pleasure of Allah and the welfare of humanity. There is no commercial charge for spiritual guidance."
    },
    {
      q: "Are the spiritual practices based strictly on Quran and Sunnah?",
      a: "Yes, 100%. All supplications, Ruqyah, and Wazaif prescribed are derived from authentic Quranic verses and Masnoon Hadith traditions, completely free from un-Islamic innovations."
    },
    {
      q: "Can I receive guidance if I live outside Rawalpindi or Chakwal?",
      a: "Yes. People from all cities across Pakistan as well as overseas Pakistanis reach out daily via phone and WhatsApp for consultation and Istikhara."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl mb-10 text-center sm:text-left">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3 py-1 text-xs font-semibold text-amber-300 border border-emerald-700/60">
            <Sparkles className="h-3.5 w-3.5" /> Quran & Sunnah Rohani Ilaj
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Spiritual Services & Guidance
          </h1>
          <p className="font-arabic text-lg sm:text-2xl text-amber-300 font-bold" dir="rtl">
            المرتضیٰ مرکزِ روحانیت — خدماتِ روحانی و اصلاحِ باطن
          </p>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Under the supervision of <strong>Hazrat Peer Muhammad Usman Alvi Sahib</strong>, providing authentic Islamic spiritual healing, Istikhara consultation, and moral guidance for 17+ years.
          </p>

          <div className="pt-3 flex flex-wrap gap-3 justify-center sm:justify-start">
            <a
              href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20Hazrat%20Peer%20Sahib%20I%20would%20like%20spiritual%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all active:scale-95"
            >
              <Phone className="h-4 w-4" /> Book Consultation on WhatsApp
            </a>
            <Link
              href="/contact"
              className="rounded-lg border border-emerald-500 bg-emerald-800/80 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-all"
            >
              Service Locations
            </Link>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="mb-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our Core Spiritual Services</h2>
          <p className="text-xs text-slate-500 mt-1">Sincere Quranic healing and guidance for individuals and families</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl flash-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-600/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    {srv.title_ur && (
                      <span className="font-arabic text-sm font-bold text-emerald-800" dir="rtl">
                        {srv.title_ur}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-3">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sunnah Methodology</span>
                  <a
                    href="https://wa.me/923299888909"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Request Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <HelpCircle className="h-8 w-8 text-emerald-700 mx-auto mb-2" />
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Common inquiries regarding our spiritual guidance and services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
