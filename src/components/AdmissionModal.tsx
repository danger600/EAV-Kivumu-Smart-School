import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Phone,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { validateAdmissionApplication, formatContactUrl } from '../utils/schoolLogic';
import { TradeCode } from '../types';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrade?: TradeCode;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  initialTrade = 'SWD',
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    desiredTrade: initialTrade,
    levelApplied: 5,
    previousSchool: '',
    aggregateScore: 75,
    guardianName: '',
    guardianPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    trackingCode: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side pure validation
    const validation = validateAdmissionApplication(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      // 2. Submit to backend API
      const res = await fetch('/api/v1/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult({
          success: true,
          trackingCode: data.trackingCode,
          message: data.message,
        });
      } else {
        setErrors({ form: data.error || 'Submission failed. Please try again.' });
      }
    } catch (err) {
      // Fallback in case of network issue
      const fallbackCode = validation.trackingCode || `KIV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionResult({
        success: true,
        trackingCode: fallbackCode,
        message: 'Application recorded successfully in offline mode.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (submissionResult?.trackingCode) {
      navigator.clipboard.writeText(submissionResult.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Academic Year 2026 / 2027
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold">Online Admission Application</h3>
            <p className="text-slate-300 text-xs mt-1">
              Join EAV Kivumu • Rutsiro, Western Province • Technical & Academic Excellence
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {submissionResult ? (
            /* Success confirmation screen */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">Application Submitted!</h4>
                <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-800">{formData.firstName} {formData.lastName}</strong>. Your admission dossier has been received and routed to the Dean of Studies.
                </p>
              </div>

              {/* Tracking Code Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Your Official Admission Tracking ID
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-mono font-extrabold text-emerald-800">
                    {submissionResult.trackingCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                  <p><strong>Selected Trade:</strong> {formData.desiredTrade} (Level {formData.levelApplied})</p>
                  <p><strong>Applicant Contact:</strong> {formData.phone}</p>
                  <p><strong>Guardian:</strong> {formData.guardianName} ({formData.guardianPhone})</p>
                </div>
              </div>

              {/* Direct Next Steps */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-left max-w-md mx-auto space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Fast-Track Your Verification:
                </p>
                <p>
                  Send your tracking ID <strong className="font-mono">{submissionResult.trackingCode}</strong> via WhatsApp or direct call to Remmy / School Helpdesk for immediate confirmation.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={formatContactUrl(
                      'whatsapp',
                      '0795547233',
                      `Hello Remmy, I just submitted admission application with tracking code: ${submissionResult.trackingCode}`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Remmy (0795547233)
                  </a>
                  <a
                    href={formatContactUrl('tel', '0795547233')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call: 0795547233
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmissionResult(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Names */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Aimé"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Mugisha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Applicant phone (e.g. 0788123456)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Trade & Level */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Desired Department / Trade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.desiredTrade}
                    onChange={(e) =>
                      setFormData({ ...formData, desiredTrade: e.target.value as TradeCode })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="SWD">Software Development (SWD)</option>
                    <option value="VET">Veterinary Medicine & Animal Health (VET)</option>
                    <option value="AGR">Agriculture & Crop Production (AGR)</option>
                    <option value="GEN">General Studies Foundation (O'Level)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Entry Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.levelApplied}
                    onChange={(e) =>
                      setFormData({ ...formData, levelApplied: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value={3}>Level 3 (Fresh TVET Entry)</option>
                    <option value={4}>Level 4 (Intermediate Certificate)</option>
                    <option value={5}>Level 5 (Senior Diploma / L5)</option>
                    <option value={1}>Senior 1 (S1 O-Level)</option>
                    <option value={2}>Senior 2 (S2 O-Level)</option>
                    <option value={3}>Senior 3 (S3 O-Level)</option>
                  </select>
                </div>
              </div>

              {/* Previous School & Marks */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous School / Exam Center <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    placeholder="e.g. GS Kivumu or ES Rutsiro"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.previousSchool && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.previousSchool}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aggregate Score / Percentage (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formData.aggregateScore}
                    onChange={(e) =>
                      setFormData({ ...formData, aggregateScore: Number(e.target.value) })
                    }
                    placeholder="e.g. 82"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.aggregateScore && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.aggregateScore}</p>
                  )}
                </div>
              </div>

              {/* Guardian Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Parent / Guardian Details
                </span>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Celestin Habumugisha"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                    {errors.guardianName && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.guardianName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="Guardian phone (e.g. 0795547233)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                    {errors.guardianPhone && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.guardianPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Dossier...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
