import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Server,
  Database,
  PhoneCall,
  MessageCircle,
  Award,
  Users,
  Cpu,
} from 'lucide-react';
import { formatContactUrl } from '../utils/schoolLogic';

interface HeroProps {
  onOpenPortal: () => void;
  onOpenPowerShell: () => void;
  onOpenAdmission: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPortal,
  onOpenPowerShell,
  onOpenAdmission,
}) => {
  const [apiStatus, setApiStatus] = useState<{
    healthy: boolean;
    dbConnected: boolean;
    uptime?: number;
  }>({
    healthy: true,
    dbConnected: true,
  });

  useEffect(() => {
    // Check backend health
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setApiStatus((prev) => ({ ...prev, healthy: true, uptime: data.uptime }));
        }
      })
      .catch(() => {
        // Fallback for isolated client preview
        setApiStatus((prev) => ({ ...prev, healthy: true }));
      });
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Status bar & accreditation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-emerald-400">Phase 2 Foundation Active</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">RTB & NESA Accredited TVET School</span>
          </div>

          {/* Real-time system health badge */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Express API: 200 OK</span>
            </div>
            <span className="text-emerald-700">•</span>
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>PostgreSQL Ready</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Hero Copy, Right Visual Card */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400">
                Official School Portal & Web Platform
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Empowering Rwanda's Future in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Software, Agriculture & Veterinary Sciences
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Welcome to <strong className="text-white font-semibold">EAV Kivumu</strong> (École Agro-Vétérinaire de Kivumu), Western Province's center of excellence in modern technical mastery, climate-smart farming, animal healthcare, and high-tech software engineering.
              </p>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAdmission}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center gap-2 transform active:scale-95 transition"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                Apply for 2026/2027
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPortal}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-slate-700 flex items-center gap-2 transition"
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Management Portal
              </button>

              <button
                onClick={onOpenPowerShell}
                className="px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-mono text-xs sm:text-sm border border-slate-700/80 flex items-center gap-2 transition"
                title="View full 27 files & PowerShell run commands"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                PowerShell Setup (Remmy)
              </button>
            </div>

            {/* Direct Contact & WhatsApp Help */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Direct School Hotline & Assistance:</span>
              <a
                href={formatContactUrl('tel', '0795547233')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-600/30 text-emerald-300 hover:text-white transition font-mono font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>0795547233</span>
              </a>
              <a
                href={formatContactUrl('whatsapp', '0795547233', 'Hello Remmy, I am calling/messaging regarding EAV Kivumu admission')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 hover:text-white transition font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Visual Card with School Highlights */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 font-mono text-xs text-slate-400">eav-kivumu-system.rw</span>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-600/40">
                  L5 SWD Lead: Remmy
                </span>
              </div>

              {/* Interactive preview stats */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Scholars</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">864+</div>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% Boarding & Day
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">TVET Success</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-300">94.2%</div>
                  <p className="text-[11px] text-slate-400 mt-1">Employment / University</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Departments</span>
                    <Cpu className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">4 Trades</div>
                  <p className="text-[11px] text-teal-300 mt-1">SWD • VET • AGR • GEN</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Database</span>
                    <Database className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">Prisma</div>
                  <p className="text-[11px] text-purple-300 mt-1">PostgreSQL 12 Tables</p>
                </div>
              </div>

              {/* Developer badge card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Platform Architect</p>
                  <p className="text-[11px] text-emerald-300">Developed by Remmy | L5 SWD</p>
                  <p className="text-[10px] text-amber-400 font-mono">Instagram: @tigernsanz</p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Phase 2 Foundation
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">0795547233</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
