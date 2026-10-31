import React, { useState } from 'react';
import {
  GraduationCap,
  Phone,
  MessageCircle,
  Menu,
  X,
  Terminal,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { formatContactUrl } from '../utils/schoolLogic';

interface HeaderProps {
  onOpenPortal: () => void;
  onOpenPowerShell: () => void;
  onOpenAdmission: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPortal,
  onOpenPowerShell,
  onOpenAdmission,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About EAV', href: '#about' },
    { name: 'Departments & Trades', href: '#departments' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Admissions', href: '#admissions' },
    { name: 'News & Events', href: '#news' },
    { name: 'Contact & Location', href: '#contact' },
    { name: 'FAQs', href: '#faqs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top developer & contact bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Developed by Remmy | L5 SWD
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a
              href="https://instagram.com/tigernsanz"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              Instagram: <span className="text-amber-400 font-semibold">@tigernsanz</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={formatContactUrl('tel', '0795547233')}
              className="text-slate-300 hover:text-emerald-300 transition flex items-center gap-1 font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>0795547233</span>
            </a>
            <a
              href={formatContactUrl('whatsapp', '0795547233', 'Hello Remmy, I want to inquire about EAV Kivumu Smart School')}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Helpdesk
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-800 transition">
                EAV KIVUMU
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                SMART SCHOOL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              École Agro-Vétérinaire • Rutsiro, Western Province
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-emerald-700 transition relative py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenPowerShell}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition border border-slate-300/70"
            title="Open Windows PowerShell Setup Guide & Files"
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
            <span>PowerShell Setup</span>
          </button>

          <button
            onClick={onOpenAdmission}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
          >
            Apply Now
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenPortal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Portal Login</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmission();
              }}
              className="w-full text-center py-2.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs"
            >
              Apply Online
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full text-center py-2.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold"
            >
              Portal Login
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPowerShell();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300"
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
            <span>Windows PowerShell Setup Guide</span>
          </button>

          <nav className="flex flex-col space-y-2 pt-2 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <a
              href={formatContactUrl('tel', '0795547233')}
              className="flex items-center gap-1 font-mono text-emerald-700 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" /> 0795547233
            </a>
            <span className="text-amber-600 font-medium">Remmy | L5 SWD</span>
          </div>
        </div>
      )}
    </header>
  );
};
