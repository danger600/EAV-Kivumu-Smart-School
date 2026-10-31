import React from 'react';
import {
  GraduationCap,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Heart,
  Terminal,
} from 'lucide-react';
import { formatContactUrl } from '../utils/schoolLogic';

interface FooterProps {
  onOpenPortal: () => void;
  onOpenPowerShell: () => void;
  onOpenAdmission: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPortal,
  onOpenPowerShell,
  onOpenAdmission,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner with Developer Attribution */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-900/40 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-mono font-bold text-sm">
              L5
            </div>
            <div>
              <p className="text-xs text-slate-400">Architect & Lead Systems Developer</p>
              <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                Developed by Remmy | L5 SWD
                <span className="text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 font-mono">
                  Software Development
                </span>
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://instagram.com/K.eed__"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 font-semibold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>Instagram: @K.eed__</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={formatContactUrl('tel', '0795547233')}
              className="px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 font-mono font-semibold border border-emerald-600/30 flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>0795547233</span>
            </a>

            <a
              href={formatContactUrl('whatsapp', '0795547233', 'Hello Remmy, I have an inquiry about EAV Kivumu')}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 font-semibold border border-teal-600/30 flex items-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Remmy</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: School overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  EAV KIVUMU SMART SCHOOL
                </span>
                <p className="text-[11px] text-slate-400">
                  École Agro-Vétérinaire de Kivumu • Ngororero, Rwanda
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Established in 1982, EAV Kivumu is a leading technical secondary institution accredited by the Rwanda TVET Board (RTB) and NESA, excelling in Software Development (SWD), Veterinary Medicine, and Modern Agriculture.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 font-mono">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kivumu Sector, Ngororero District, Western Province</span>
            </div>
          </div>

          {/* Col 3: Technical Trades */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Academic Trades
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition">
                  Software Development (SWD L3–L5)
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition">
                  Veterinary & Animal Health (VET)
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition">
                  Agriculture & Crop Production (AGR)
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition">
                  General Studies (Senior 1–3)
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-emerald-400 transition">
                  Computing & Robotics Labs
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Admissions */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Portals
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenAdmission}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Apply for Admission
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Student & Teacher Portal
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPowerShell}
                  className="hover:text-emerald-400 transition text-left"
                >
                  PowerShell Setup & Files
                </button>
              </li>
              <li>
                <a href="#news" className="hover:text-emerald-400 transition">
                  Academic Bulletins
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-emerald-400 transition">
                  FAQs & Helpdesk
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Hotlines */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Contact
            </h5>
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                <strong className="text-white block">School Telephone:</strong>
                <a
                  href={formatContactUrl('tel', '0795547233')}
                  className="text-emerald-400 font-mono font-bold hover:underline"
                >
                  0795547233
                </a>
              </p>
              <p>
                <strong className="text-white block">Email:</strong>
                <a
                  href="mailto:eavkivumu.school@gmail.com"
                  className="text-slate-300 hover:underline"
                >
                  eavkivumu.school@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-white block">WhatsApp Hotline:</strong>
                <a
                  href={formatContactUrl('whatsapp', '0795547233')}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 font-mono hover:underline"
                >
                  +250 795 547 233
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 EAV Kivumu Smart School. All rights reserved. Western Province, Rwanda.</p>
          <p className="flex items-center gap-1">
            Engineered with pride by <span className="text-slate-300 font-semibold">Remmy | L5 SWD</span> (<span className="text-amber-400">@K.eed__</span>)
          </p>
        </div>
      </div>
    </footer>
  );
};
