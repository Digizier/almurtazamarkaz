"use client";

import { useEffect, useState } from "react";
import { HeartHandshake, Utensils, Users, CheckCircle, Phone, ArrowRight } from "lucide-react";
import { getWelfareProjects } from "@/lib/db";
import { WelfareProject } from "@/lib/types";

export default function WelfarePage() {
  const [projects, setProjects] = useState<WelfareProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWelfareProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl mb-10 text-center sm:text-left">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-3 py-1 text-xs font-semibold text-amber-300 border border-emerald-700/60">
            <HeartHandshake className="h-3.5 w-3.5" /> Humanitarian Relief & Community Service
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welfare Projects & Daily Langar
          </h1>
          <p className="font-arabic text-lg sm:text-2xl text-amber-300 font-bold" dir="rtl">
            خدمتِ خلق — راشن تقسیم، کفالتِ یتامیٰ و لنگرِ عام
          </p>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            For over 17 years, Al-Murtaza Spiritual Center has consistently stood with deserving families, orphans, and travelers across Rawalpindi and Chakwal through transparent community welfare.
          </p>

          <div className="pt-3">
            <a
              href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20I%20would%20like%20information%20regarding%20welfare%20and%20langar%20programs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all active:scale-95"
            >
              <Phone className="h-4 w-4" /> Connect with Welfare Department
            </a>
          </div>
        </div>
      </div>

      {/* Welfare Programs Grid */}
      <div className="mb-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Active Welfare Initiatives</h2>
          <p className="text-xs text-slate-500 mt-1">Direct ground relief managed with absolute sincerity and accountability</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl flash-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all"
              >
                <div className="aspect-16/10 w-full overflow-hidden bg-slate-100">
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 mb-2">
                      {proj.status}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.title}</h3>
                    {proj.title_ur && (
                      <p className="font-arabic text-xs font-semibold text-emerald-700 mt-1" dir="rtl">
                        {proj.title_ur}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Field Verified</span>
                    <span className="text-emerald-700 font-bold">Rawalpindi & Chakwal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Welfare Principles & Values */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Our Guiding Philosophy
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
            Honoring Dignity and Sincerity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All rations and assistance are delivered directly to the doorsteps of deserving individuals with strict confidentiality to protect their self-respect and dignity. Langar is open to all visitors regardless of background.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">100% Direct Delivery</h4>
            <p className="text-[11px] text-slate-500 mt-1">Zero administrative leakage; rations reach genuine households.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">Strict Confidentiality</h4>
            <p className="text-[11px] text-slate-500 mt-1">Protecting the self-respect of orphans and widows.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">17+ Years Record</h4>
            <p className="text-[11px] text-slate-500 mt-1">Consistent unbroken humanitarian service since 2009.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
