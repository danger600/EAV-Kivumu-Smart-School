import React from 'react';
import {
  GraduationCap,
  FileCheck,
  Calendar,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { formatContactUrl } from '../utils/schoolLogic';

interface AdmissionsSectionProps {
  onOpenAdmissionModal: () => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  onOpenAdmissionModal,
}) => {
  return (
    <section id="admissions" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            Admissions & Enrollment
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Join the EAV Kivumu Community
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Applications are actively reviewed for the 2026/2027 academic intake across Software Development, Veterinary Medicine, Modern Agriculture, and O-Level programs.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              1
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Submit Online Application</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Fill in your academic marks and preferred department. You will immediately receive a verified tracking ID like <code className="bg-slate-100 text-emerald-700 px-1 rounded font-mono">KIV-2026-XXXX</code>.
            </p>
            <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
              Takes under 3 minutes
            </span>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              2
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dossier Review & Interview</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Our academic board evaluates your prior TVET or O-Level performance. Candidates may receive a brief phone or in-person verification interview.
            </p>
            <span className="text-teal-700 font-semibold text-xs flex items-center gap-1">
              Decision within 48 hours
            </span>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
              3
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmation & Onboarding</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Upon acceptance, receive your official admission letter, boarding assignment, uniform guidelines, and orientation timetable.
            </p>
            <span className="text-slate-900 font-semibold text-xs flex items-center gap-1">
              Full boarding guarantee
            </span>
          </div>
        </div>

        {/* Requirements & Call to action container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Required Documents for Enrollment
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Certified Primary or Senior 3 (O-Level) National Result Slip (NESA)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Copy of National ID / Child Birth Certificate or Passport</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Two recent colored passport-size photographs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Medical fitness certificate (for boarding scholars)</span>
                </li>
              </ul>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Notice: No application fee is charged to submit your online dossier.</span>
              </div>
            </div>

            {/* Action Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Ready to Start?
                </span>
                <h4 className="text-xl font-extrabold mt-0.5">Apply in Minutes</h4>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Join hundreds of aspiring software builders, vets, and farmers at EAV Kivumu.
                </p>
              </div>

              <button
                onClick={onOpenAdmissionModal}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>Launch Online Application Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                <span>Inquiries hotline:</span>
                <a
                  href={formatContactUrl('tel', '0795547233')}
                  className="font-mono font-bold text-amber-300 hover:text-white"
                >
                  0795547233
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
