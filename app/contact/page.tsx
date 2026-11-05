"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";
import { sendInquiry } from "@/lib/db";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Spiritual Guidance / Rohani Consultation",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg("Please provide your name, phone/WhatsApp number, and message.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const ok = await sendInquiry(formData);
      if (ok) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "", subject: "Spiritual Guidance", message: "" });
      } else {
        setErrorMsg("Failed to send message. Please contact us directly via WhatsApp.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please message us directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
          Get In Touch
        </span>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Contact Al-Murtaza Spiritual Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          We welcome inquiries for spiritual guidance, Istikhara requests, herbal wellness consultations, and welfare assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Service Locations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Official Service Coordinates</h2>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-700 flex-none mt-0.5" />
                <div>
                  <strong className="text-slate-900">Service Locations:</strong>
                  <p className="mt-0.5">Rawalpindi Saddar & Chakwal, Pakistan</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    *Note: This is a spiritual sanctuary and welfare center, not a commercial retail shop.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-700 flex-none" />
                <div>
                  <strong className="text-slate-900">Phone & WhatsApp:</strong>
                  <p className="text-emerald-800 font-bold mt-0.5">0329-9888909</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-700 flex-none" />
                <div>
                  <strong className="text-slate-900">Official Email:</strong>
                  <p className="mt-0.5 truncate">almurtazamarkaz1@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/923299888909?text=Assalam-o-Alaikum%20Al-Murtaza%20Spiritual%20Center"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-all active:scale-95"
              >
                <MessageSquare className="h-4 w-4" /> Message Directly on WhatsApp
              </a>
            </div>
          </div>

          {/* Portrait Highlight */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <img
              src="/images/owner.webp"
              alt="Hazrat Peer Muhammad Usman Alvi"
              className="h-16 w-16 rounded-full object-cover border-2 border-emerald-700"
            />
            <div>
              <h3 className="text-xs font-bold text-slate-900">Hazrat Peer Muhammad Usman Alvi Sahib</h3>
              <p className="text-[11px] text-emerald-700 font-medium">Founder & Spiritual Mentor (17+ Years)</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Available for Istikhara and Rohani Counseling.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              Send a Message or Consultation Request
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below. Our spiritual desk will review and contact you promptly.
            </p>

            {submitted ? (
              <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950">Message Received Successfully!</h3>
                <p className="text-xs text-emerald-800">
                  JazakAllah Khair. Your inquiry has been forwarded to Hazrat Peer Sahib’s counseling desk. We will reach out via WhatsApp/Phone soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-semibold text-emerald-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Muhammad Ahmad"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="yourname@gmail.com"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Purpose of Contact
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden bg-white"
                    >
                      <option value="Spiritual Guidance / Rohani Consultation">
                        Spiritual Guidance / Rohani Consultation
                      </option>
                      <option value="Istikhara Online">Istikhara Online</option>
                      <option value="Herbal Product Order Inquiry">Herbal Product Order Inquiry</option>
                      <option value="Welfare / Ration Drive Support">Welfare / Ration Drive Support</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message / Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your consultation question or matter in confidence..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending in confidence..." : "Submit Confidential Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
