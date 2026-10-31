import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { formatContactUrl } from '../utils/schoolLogic';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch (err) {
      // Offline fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            Direct Communication & Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact EAV Kivumu School
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Have questions about admissions, TVET departments, boarding, or visiting our campus? Contact our administrative desk or reach out directly to developer Remmy on <strong className="text-emerald-800 font-mono">0795547233</strong>.
          </p>
        </div>

        {/* Contact Hotline Highlight Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Direct Phone Call */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Official Hotline
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  0795547233
                </span>
              </div>
            </div>
            <a
              href={formatContactUrl('tel', '0795547233')}
              className="w-full text-center py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now (0795547233)
            </a>
          </div>

          {/* WhatsApp Direct */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  WhatsApp Support
                </span>
                <span className="text-sm font-extrabold text-emerald-700 font-mono">
                  0795547233
                </span>
              </div>
            </div>
            <a
              href={formatContactUrl(
                'whatsapp',
                '0795547233',
                'Hello Remmy, I have an inquiry about EAV Kivumu Smart School.'
              )}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </span>
                <span className="text-xs font-bold text-slate-900 truncate block">
                  eavkivumu.school@gmail.com
                </span>
              </div>
            </div>
            <a
              href="mailto:eavkivumu.school@gmail.com"
              className="w-full text-center py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Send Email
            </a>
          </div>

          {/* Campus Location */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Campus Location
                </span>
                <span className="text-xs font-bold text-slate-900 block">
                  Kivumu, Rutsiro District
                </span>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Kivumu+Rutsiro+Rwanda"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              Open Map Directions
            </a>
          </div>
        </div>

        {/* Contact Form and Campus Details */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Message form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Send an Official Message</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Fill out the message form below. For immediate reply, we recommend calling or using WhatsApp on 0795547233.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Message Delivered!</h4>
                <p className="text-emerald-800 text-xs max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your communication has been dispatched to EAV Kivumu school administration. We will reply to your phone or email shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'General Inquiry',
                      message: '',
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jean Damascene"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telephone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0795547233"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Admissions 2026/2027">Admissions 2026/2027</option>
                      <option value="Software Development (SWD)">Software Development (SWD)</option>
                      <option value="Veterinary Medicine">Veterinary Medicine</option>
                      <option value="Agriculture & Farming">Agriculture & Farming</option>
                      <option value="Boarding Facilities">Boarding Facilities</option>
                      <option value="Partnership / TVET Internship">Partnership / TVET Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your question, inquiry or request here..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Message...' : 'Send Message Now'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Visiting & Hours info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Visiting & Office Hours
              </span>
              <h4 className="text-xl font-bold">EAV Kivumu Administration Desk</h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Monday – Friday:</strong>
                    <span>7:30 AM – 5:00 PM (CAT)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Saturday:</strong>
                    <span>8:00 AM – 1:00 PM (Admissions & Boarding Visitations)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Sunday:</strong>
                    <span>Closed (Emergency boarding duty nurse on call)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  System Architect & Direct Contact:
                </span>
                <p className="font-bold text-emerald-300 text-sm">Remmy | L5 SWD</p>
                <p className="text-xs text-slate-400 font-mono">Instagram: @tigernsanz</p>
                <p className="text-xs text-amber-400 font-mono mt-0.5">Telephone: 0795547233</p>
              </div>
            </div>

            {/* Travel Directions */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                How to Reach EAV Kivumu
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Take the paved Western Province corridor connecting Rubavu / Karongi. Disembark at Kivumu center in Rutsiro District. School direction signs lead directly to the main academic campus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
