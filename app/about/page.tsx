"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  CheckCircle,
  Phone,
  ArrowRight,
  BookOpen,
  Award,
  Compass,
  Globe2,
} from "lucide-react";

export default function AboutPage() {
  const [lang, setLang] = useState<"ur" | "en">("ur");

  const salasil = [
    { ur: "قادریہ", en: "Qadiriyya" },
    { ur: "سہروردیہ", en: "Suhrawardiyya" },
    { ur: "نقشبندیہ", en: "Naqshbandiyya" },
    { ur: "چشتیہ", en: "Chishtiyya" },
    { ur: "صابریہ", en: "Sabiriyya" },
    { ur: "نظامیہ", en: "Nizamiyya" },
    { ur: "مجددیہ", en: "Mujaddidiyya" },
    { ur: "ابوالعلائیہ", en: "Abul-Ulaiyya" },
    { ur: "جہانگیریہ", en: "Jahangiriyya" },
    { ur: "حسنیہ", en: "Hasaniyya" },
    { ur: "نقیبیہ", en: "Naqeebiyya" },
    { ur: "عارفیہ", en: "Aarifiyya" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Language Switcher Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/20 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-4 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold text-emerald-100">
            {lang === "ur" ? "زبان کا انتخاب کریں / Choose Language:" : "Language Selection / زبان منتخب کریں:"}
          </span>
        </div>
        <div className="inline-flex rounded-xl bg-emerald-950/80 p-1 border border-emerald-700/50">
          <button
            onClick={() => setLang("ur")}
            className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-bold transition-all ${
              lang === "ur"
                ? "bg-amber-400 text-slate-950 shadow-md font-arabic"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            اردو (Urdu)
          </button>
          <button
            onClick={() => setLang("en")}
            className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-bold transition-all ${
              lang === "en"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-12 text-white shadow-2xl mb-10 border border-emerald-800/50">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <p className="font-arabic text-xl sm:text-3xl text-amber-300 font-bold tracking-wider" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ
          </p>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-300 border border-amber-400/30 shadow-inner">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{lang === "ur" ? "17 سالہ دینی، روحانی و فلاحی خدمات" : "17+ Years of Sacred Spiritual & Welfare Services"}</span>
          </div>

          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight ${lang === "ur" ? "font-arabic" : ""}`} dir={lang === "ur" ? "rtl" : "ltr"}>
            {lang === "ur"
              ? "تعارفِ شخصیت، نسبتِ طریقت و خدماتِ روحانیہ"
              : "Biography, Spiritual Lineage & Sacred Services"}
          </h1>

          <p className="font-arabic text-base sm:text-xl text-amber-300 font-bold" dir="rtl">
            المرتضیٰ مرکزِ روحانیت — یقین، دعا، نسبت اور خدمتِ انسانیت
          </p>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
            {lang === "ur"
              ? "پیرِ طریقت، رہبرِ شریعت، حضرت صوفی مولانا پیر محمد عثمان شاہ علوی کی زیرِ سرپرستی دینِ متین کی ترویج، اتباعِ شریعت، مسنون روحانی علاج اور بے لوث خدمتِ خلق کا ایک عظیم روحانی مرکز۔"
              : "A sanctified spiritual center under the patronage of Hazrat Sufi Maulana Peer Muhammad Usman Shah Alvi, dedicated to the revival of Sunnah-based spiritual healing, inner reformation, and humanitarian welfare."}
          </p>
        </div>
      </div>

      {/* Founder In-Depth Profile */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-square w-72 sm:w-88 rounded-3xl overflow-hidden border-4 border-amber-400/40 shadow-2xl bg-slate-900 group">
              <img
                src="/images/owner.webp"
                alt="Hazrat Sufi Maulana Peer Muhammad Usman Shah Alvi"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="inline-block rounded-full bg-amber-400/90 px-3 py-1 text-[11px] font-bold text-slate-950 shadow-md">
                  صاحبِ اجازت و خلافت (17 سالہ تجربہ)
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3 w-3 text-emerald-600" /> اتباعِ شریعت و طریقت
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-900 border border-amber-200">
                <HeartHandshake className="h-3 w-3 text-amber-700" /> خدمتِ خلق و انسانیت
              </span>
            </div>
          </div>

          {/* Biography Text Column */}
          <div className="lg:col-span-7 space-y-4 text-slate-800">
            {lang === "ur" ? (
              <div className="space-y-4 text-right" dir="rtl">
                <div className="border-r-4 border-amber-500 pr-4">
                  <span className="text-xs font-bold text-amber-600 tracking-wider">
                    عمدة الازکیاء، زبدة الاصفیاء، مقتدائے اہلِ صفا، امینِ امانتِ طریقت
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 font-arabic">
                    حضرت صوفی مولانا پیر محمد عثمان شاہ علوی
                  </h2>
                  <p className="text-sm font-bold text-amber-700">
                    پیرِ طریقت، رہبرِ شریعت، صاحبِ اجازت و خلافت
                  </p>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-arabic">
                  آپ ایک ممتاز علمی، روحانی، دینی، سماجی اور ادبی شخصیت ہیں۔ آپ کو دینی و عصری علوم سے گہری وابستگی، تصوف و معرفت سے خصوصی شغف اور اصلاح و تربیت کے میدان میں نمایاں دلچسپی حاصل ہے۔
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-arabic">
                  آپ گزشتہ <strong className="text-emerald-900 font-black">سترہ سال (17 Years)</strong> سے روحانی علاج و معالجہ، عملیات، دم و دعا، وظائف، استخارہ، اصلاحِ احوال اور خدمتِ مخلوقِ خدا میں مصروفِ عمل ہیں۔ شعبۂ روحانیت و عملیات میں آپ کو طویل تجربہ اور خصوصی مہارت حاصل ہے۔
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-arabic">
                  آپ کی جدوجہد کا بنیادی مقصد پریشان حال انسانوں کی دینی و روحانی رہنمائی، اصلاحِ باطن، اخلاقی تربیت اور معاشرے میں خیر و بھلائی کے فروغ کے لیے عملی کردار ادا کرنا ہے۔
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Paragon of Purity • Trustee of Tariqah
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                    Hazrat Sufi Maulana Peer Muhammad Usman Shah Alvi
                  </h2>
                  <p className="text-sm font-bold text-amber-700">
                    Spiritual Guide (Peer-e-Tariqat) • Shepherd of Shariah • Bearer of Khilafat
                  </p>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  Hazrat Peer Muhammad Usman Shah Alvi is an esteemed Islamic scholar, spiritual mentor, social reformer, and literary figure. He possesses deep erudition in traditional Islamic jurisprudence and modern thought, with a profound passion for authentic Sufism (Tasawwuf) and personal moral reformation.
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  For over <strong className="text-emerald-900 font-bold">17 years</strong>, Peer Sahib has devoted his life to Quranic Spiritual Healing (Rohani Ilaj), authentic spiritual operations (Amliyat), healing supplications (Dam & Dua), sacred litanies (Wazaif), Istikhara guidance, and the selfless service of Allah’s creation.
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  The primary objective of his lifelong mission is to illuminate distressed hearts, provide authentic Quranic solace, reform character, and champion compassionate charity across all strata of society.
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20Hazrat%20Peer%20Sahib"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-emerald-900 transition-all active:scale-95"
              >
                <Phone className="h-4 w-4" />
                {lang === "ur" ? "پیر صاحب سے براہِ راست رابطہ (0329-9888909)" : "Direct WhatsApp Consultation (0329-9888909)"}
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all"
              >
                {lang === "ur" ? "روحانی خدمات ملاحظہ کریں" : "View Spiritual Services"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Murshid-e-Kareem & Rohani Nisbat Card */}
      <div className="rounded-3xl border border-amber-300/60 bg-gradient-to-br from-amber-50/70 via-emerald-50/40 to-amber-50/70 p-6 sm:p-10 shadow-md mb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block rounded-full bg-amber-200/80 px-4 py-1 text-xs font-bold text-amber-900 border border-amber-300">
              {lang === "ur" ? "ذکرِ مرشدِ کریم و نسبتِ روحانی" : "Mention of the Esteemed Murshid & Spiritual Lineage"}
            </span>
            <p className="text-xs sm:text-sm font-bold text-emerald-900">
              {lang === "ur"
                ? "تاجُ العارفین، زینُ الصالحین، عارف باللہ، شیخِ کامل، شیخِ طریقت، مقتدائے اہلِ معرفت"
                : "Crown of Gnostics, Ornament of the Righteous, Gnostic of Allah, Perfect Master:"}
            </p>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 font-arabic" dir="rtl">
              حضرت خواجہ خواجگان، فقیر صوفی محمد عارف تبسم نقیبی ستی رحمۃ اللہ علیہ
            </h3>
          </div>

          <div className="rounded-2xl bg-white/90 p-5 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            {lang === "ur" ? (
              <div className="space-y-4 text-right font-arabic leading-relaxed text-slate-700 text-sm sm:text-base" dir="rtl">
                <p>
                  ایک صاحبِ علم و معرفت، مردِ حق آگاہ، صاحبِ سلوک و تصوف اور روحانی تربیت و اصلاح کی ممتاز شخصیت تھے۔ آپ کی حیاتِ مبارکہ کا محور اتباعِ شریعت، عشقِ مصطفیٰ ﷺ، ذکرِ الٰہی، تزکیۂ نفس، اصلاحِ باطن اور خدمتِ خلق تھا۔
                </p>
                <p>
                  آپ کی روحانی تعلیمات، تربیتی توجہات اور فیوض و برکات نے طالبانِ حق کو سلوک و معرفت کی راہوں سے روشناس کرایا۔ آپ نے اپنے روحانی فیض، تربیت اور نسبت کے ذریعے محبتِ الٰہی، اصلاحِ نفس اور خدمتِ انسانیت کا پیغام عام کیا۔
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-left leading-relaxed text-slate-700 text-sm sm:text-base">
                <p>
                  Hazrat Khawaja Khawajgan, Faqeer Sufi Muhammad Arif Tabassum Naqeebi Satti (Rahmatullah Alayh) was a realized man of Truth, an adept in Sufism, and an eminent luminary of divine knowledge and spiritual mentorship. The core of his blessed life was strict adherence to the Shari’ah, intense love of the Holy Prophet Muhammad ﷺ, constant Dhikr of Allah, purification of the soul (Tazkiyah al-Nafs), inner reformation (Islah al-Batin), and selfless service to humanity.
                </p>
                <p>
                  Through his spiritual radiance and noble transmissions, countess seekers were guided upon the path of gnosis and divine love, sowing the seeds of compassion and moral upliftment.
                </p>
              </div>
            )}
          </div>

          {/* Salasil Badges */}
          <div className="space-y-3">
            <h4 className="text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-950 font-arabic">
              {lang === "ur" ? "سلاسلِ عالیہ و روحانی نسبتیں" : "Sacred Spiritual Lineages & Sufi Orders"}
            </h4>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {salasil.map((silsila, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-300 bg-white px-3.5 py-1.5 shadow-xs text-center hover:bg-amber-100/60 transition-colors"
                >
                  <span className="font-arabic font-bold text-emerald-950 text-xs sm:text-sm block">
                    {silsila.ur}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {silsila.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ijazat & Khilafat Statement */}
          <div className="rounded-2xl bg-emerald-950 p-6 sm:p-8 text-white space-y-3 border border-emerald-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
              <Award className="h-4 w-4" />
              <span>{lang === "ur" ? "نسبتِ مرشد، اجازت و خلافت اور روحانی امانت" : "Spiritual Authorization, Khilafat & Sacred Trust"}</span>
            </div>
            {lang === "ur" ? (
              <div className="space-y-2 text-right font-arabic leading-relaxed text-emerald-100 text-xs sm:text-sm" dir="rtl">
                <p>
                  آپ اپنے مرشدِ کریم حضرت خواجہ خواجگان فقیر صوفی محمد عارف تبسم نقیبی ستی رحمۃ اللہ علیہ کے فیضِ صحبت، روحانی تربیت اور خصوصی توجہات سے وابستہ ہیں۔
                </p>
                <p>
                  آپ کو اپنے مرشدِ کریم کی جانب سے سلوک و طریقت کی روحانی منازل میں تربیت و رہنمائی، اجازت و خلافت اور مخلوقِ خدا کی دینی، روحانی اور اصلاحی خدمت کی ذمہ داریوں سے نوازا گیا۔
                </p>
                <p className="text-amber-300 font-semibold">
                  یہ نسبت آپ کے لیے محض ایک اعزاز نہیں بلکہ ایک عظیم روحانی امانت اور ذمہ داری ہے، جسے آپ شریعتِ مطہرہ کی پابندی، اخلاص، تقویٰ، عاجزی اور خدمتِ انسانیت کے جذبے کے ساتھ آگے بڑھانے میں مصروفِ عمل ہیں۔
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-left leading-relaxed text-emerald-100 text-xs sm:text-sm">
                <p>
                  Hazrat Peer Muhammad Usman Shah Alvi has been intimately blessed by the spiritual companionship, training, and special spiritual focus of his Murshid-e-Kareem.
                </p>
                <p>
                  He was officially bestowed with spiritual mentorship, authorization (Ijazah), and succession (Khilafat) in the stations of Tariqah, tasked with guiding seekers and serving creation.
                </p>
                <p className="text-amber-300 font-semibold">
                  This sacred connection is held not merely as a title of honor, but as an immense divine trust (Amanah) and solemn responsibility carried forward with steadfast adherence to the Shari’ah, sincerity, humility, and unwavering dedication to humanity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Main Pillars of Services */}
      <div className="space-y-6 mb-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            {lang === "ur" ? "ہمہ جہت فیض و خدمات" : "Comprehensive Sacred Endeavors"}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            {lang === "ur" ? "دینی، روحانی و فلاحی خدمات" : "Religious, Spiritual & Humanitarian Services"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === "ur"
              ? "المرتضیٰ مرکزِ روحانیت کے پلیٹ فارم سے جاری خدمات کے 3 نمایاں شعبہ جات"
              : "Three dedicated pillars anchored at Al-Murtaza Spiritual Center"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Rohani Khidmaat */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-emerald-950 font-arabic">
                {lang === "ur" ? "1۔ روحانی خدمات" : "1. Spiritual Services & Healing"}
              </h3>
              <ul className={`space-y-2.5 text-xs sm:text-sm text-slate-700 ${lang === "ur" ? "font-arabic text-right" : ""}`} dir={lang === "ur" ? "rtl" : "ltr"}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "روحانی علاج و معالجہ، دم، دعا اور مجرب مسنون وظائف۔" : "Quranic Spiritual Healing (Rohani Ilaj), Masnoon supplications & Wazaif."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "جادو، جنات، نظرِ بد اور دیگر روحانی پریشانیوں کے حوالے سے رہنمائی۔" : "Diagnosis and guidance regarding Black Magic, Jinn, and the Evil Eye (Nazar)."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "استخارہ، روحانی مشاورت اور اصلاحِ احوال۔" : "Authentic Sunnah Istikhara, spiritual counseling, and life guidance."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "ذکرِ الٰہی، تزکیۂ نفس اور اصلاحِ باطن کی تعلیم و تربیت۔" : "Dhikr assemblies, purification of the heart (Tazkiyah), and inner reformation."}</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-200">
              <Link href="/services" className="text-xs font-bold text-emerald-900 hover:text-emerald-700 inline-flex items-center gap-1">
                {lang === "ur" ? "خدمات کی تفصیل دیکھیں" : "Explore Healing Services"} &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 2: Khidmat-e-Khalq */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-950 font-arabic">
                {lang === "ur" ? "2۔ خدمتِ خلق و فلاحی سرگرمیاں" : "2. Humanitarian Relief & Welfare"}
              </h3>
              <ul className={`space-y-2.5 text-xs sm:text-sm text-slate-700 ${lang === "ur" ? "font-arabic text-right" : ""}`} dir={lang === "ur" ? "rtl" : "ltr"}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "مستحق، نادار اور ضرورت مند خاندانوں میں راشن کی باقاعدہ تقسیم۔" : "Monthly food ration drives for deserving, impoverished families."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "بیوہ خواتین اور یتیم بچوں کے لیے مستقل امدادی سرگرمیاں۔" : "Direct ongoing assistance for widows, orphans, and destitute individuals."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "سائلین، مساکین اور زائرین کے لیے لنگر و طعام کا مستقل اہتمام۔" : "Continuous daily Langar (free community meals) and traveler hospitality."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "ضرورت مند خاندانوں کی حتی المقدور مالی و سماجی معاونت۔" : "Emergency financial and social aid for families facing crisis."}</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200">
              <Link href="/welfare" className="text-xs font-bold text-amber-900 hover:text-amber-700 inline-flex items-center gap-1">
                {lang === "ur" ? "فلاحی منصوبے دیکھیں" : "View Welfare Projects"} &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 3: Deeni & Islahi */}
          <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold shadow-md">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 font-arabic">
                {lang === "ur" ? "3۔ دینی و اصلاحی خدمات" : "3. Religious Education & Moral Reform"}
              </h3>
              <ul className={`space-y-2.5 text-xs sm:text-sm text-slate-700 ${lang === "ur" ? "font-arabic text-right" : ""}`} dir={lang === "ur" ? "rtl" : "ltr"}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "دینی تعلیم و تربیت کا فروغ اور قرآن و سنت کی روشنی میں رہنمائی۔" : "Promotion of authentic Quranic education and prophetic ethics."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "اخلاقی اصلاح، حسنِ معاشرت اور معاشرتی بھلائی کی پرخلوص کوششیں۔" : "Moral reformation, constructive character-building, and social welfare."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "محبتِ رسول ﷺ، ذکرِ الٰہی اور اتباعِ شریعت کی تعلیمات کا فروغ۔" : "Deepening the love of Prophet Muhammad ﷺ and adherence to Shari’ah."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-sky-700 flex-none mt-0.5" />
                  <span>{lang === "ur" ? "انسانیت کی خدمت اور معاشرے میں اخوت و محبت کا پیغام عام کرنا۔" : "Spreading brotherhood, peaceful co-existence, and universal harmony."}</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-200">
              <Link href="/blog" className="text-xs font-bold text-sky-900 hover:text-sky-700 inline-flex items-center gap-1">
                {lang === "ur" ? "اصلاحی مضامین پڑھیں" : "Read Articles & Guidance"} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose of Life & Spiritual Message */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              {lang === "ur" ? "فکر و نظریہ" : "Core Philosophy & Spiritual Creed"}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-arabic">
              {lang === "ur" ? "مقصدِ حیات و پیغامِ روحانیت" : "Purpose of Life & The Spiritual Message"}
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {lang === "ur" ? (
              <div className="space-y-4 text-right font-arabic" dir="rtl">
                <p>
                  آپ کی زندگی کا بنیادی نصب العین رضائے الٰہی کا حصول، اتباعِ شریعت، عشقِ رسول ﷺ، ذکرِ الٰہی، اپنے مرشدِ کریم کی روحانی امانت کی پاسداری اور مخلوقِ خدا کی بے لوث خدمت ہے۔
                </p>
                <div className="rounded-2xl bg-amber-50/80 p-5 border-r-4 border-amber-500 font-bold text-emerald-950">
                  &ldquo;آپ کے نزدیک حقیقی روحانیت کا حسن محض ظاہری نسبت یا الفاظ و القابات میں نہیں بلکہ اخلاص، تقویٰ، حسنِ اخلاق، عاجزی، اصلاحِ نفس اور خدمتِ انسانیت میں پوشیدہ ہے۔&rdquo;
                </div>
                <p>
                  آپ اسی فکر و نظریے کے تحت اپنی علمی، روحانی اور فلاحی سرگرمیوں کو آگے بڑھا رہے ہیں تاکہ دکھی انسانیت کے لیے آسانیاں پیدا ہوں، دلوں میں محبتِ الٰہی کا نور روشن ہو اور معاشرے میں خیر و بھلائی کو فروغ حاصل ہو۔
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <p>
                  The foundational compass of Peer Sahib’s life is attaining the pleasure of Allah Almighty, upholding the sacred Shari’ah, embracing profound love for the Holy Prophet Muhammad ﷺ, constant remembrance of Allah (Dhikr), safeguarding the spiritual trust of his Murshid-e-Kareem, and rendering selfless service to humanity.
                </p>
                <div className="rounded-2xl bg-amber-50/80 p-5 border-l-4 border-amber-500 font-semibold text-emerald-950 italic">
                  &ldquo;In his view, the true beauty of spirituality lies not in outward titles or hollow affiliations, but in sincere devotion (Ikhlas), God-consciousness (Taqwa), moral beauty, humility, self-purification, and dedicated service to fellow human beings.&rdquo;
                </div>
                <p>
                  Under this living philosophy, his educational, spiritual, and humanitarian endeavors continue to bring comfort to afflicted souls, illuminate hearts with divine light, and cultivate goodness in the world.
                </p>
              </div>
            )}
          </div>

          {/* Closing Dua Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 p-6 text-white text-center space-y-2 border border-emerald-800">
            <p className="font-arabic text-base sm:text-xl text-amber-300 font-bold" dir="rtl">
              اللہ تعالیٰ ہمارے اسلاف و مشائخ کے فیوض و برکات کو جاری و ساری رکھے، ہمیں ان کی تعلیمات پر عمل کرنے اور اخلاص کے ساتھ مخلوقِ خدا کی خدمت کرنے کی توفیق عطا فرمائے۔ آمین یا رب العالمین۔
            </p>
            <p className="text-xs text-emerald-200">
              {lang === "ur"
                ? "زیرِ سرپرستی و اہتمام: المرتضیٰ مرکزِ روحانیت"
                : "Under the Patronage & Direction of: Al-Murtaza Spiritual Center"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {lang === "ur" ? "آن لائن استخارہ و روحانی مشاورت" : "Online Istikhara & Guidance"}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === "ur" ? "پیر صاحب سے استخارہ کے لیے وقت حاصل کریں" : "Request a spiritual consultation session"}
            </p>
          </div>
          <Link
            href="/services"
            className="rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-all flex-none"
          >
            {lang === "ur" ? "استخارہ فارم" : "Book Now"}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {lang === "ur" ? "خالص طبِ نبوی پروڈکٹس" : "Pure Tibb-e-Nabawi Store"}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === "ur" ? "سدر بیری شہد، روغنِ کلونجی اور ہربل مصنوعات" : "Sidr Beri Honey, Kalonji oil & natural remedies"}
            </p>
          </div>
          <Link
            href="/shop"
            className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all flex-none"
          >
            {lang === "ur" ? "شاپ وزٹ کریں" : "Visit Store"}
          </Link>
        </div>
      </div>
    </div>
  );
}
