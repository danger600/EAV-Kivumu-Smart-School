/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EAV Kivumu Smart School - Phase 2 Foundation
 * Developed by Remmy | L5 SWD
 * Instagram: @K.eed__ | Contact: 0795547233
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { NewsEventsSection } from './components/NewsEventsSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AdmissionModal } from './components/AdmissionModal';
import { PortalPreviewModal } from './components/PortalPreviewModal';
import { PowerShellGuideModal } from './components/PowerShellGuideModal';
import { ThreeCampusViewer } from './components/ThreeCampusViewer';
import { ScienceWorkbench } from './components/ScienceWorkbench';
import { GeminiAISuite } from './components/GeminiAISuite';
import { StudentDashboard } from './components/StudentDashboard';
import { TradeCode } from './types';
import { Phone, MessageCircle, Terminal, GraduationCap } from 'lucide-react';
import { formatContactUrl } from './utils/schoolLogic';

export default function App() {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isPowerShellOpen, setIsPowerShellOpen] = useState(false);
  const [isStudentDashboardOpen, setIsStudentDashboardOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeCode>('SWD');

  const handleOpenAdmissionWithTrade = (trade: TradeCode) => {
    setSelectedTrade(trade);
    setIsAdmissionOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Main Navbar */}
      <Header
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenPowerShell={() => setIsPowerShellOpen(true)}
        onOpenStudentDashboard={() => setIsStudentDashboardOpen(true)}
      />

      {/* Main Landing Page Content */}
      <main id="main-content">
        <Hero
          onOpenAdmission={() => setIsAdmissionOpen(true)}
          onOpenPortal={() => setIsPortalOpen(true)}
          onOpenPowerShell={() => setIsPowerShellOpen(true)}
          onOpenStudentDashboard={() => setIsStudentDashboardOpen(true)}
        />

        {/* 1. Interactive 3D Virtual Campus (Three.js Skill) */}
        <section id="virtual-campus" className="py-16 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Interactive 3D Procedural Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Explore EAV Kivumu Virtual Campus
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Powered by Three.js with studio PBR reflections, exponential camera damping, and collapsible bottom dock controls.
              </p>
            </div>
            <ThreeCampusViewer />
          </div>
        </section>

        {/* 2. Bioscience & Agricultural Bioinformatics Hub (Science Skill) */}
        <ScienceWorkbench />

        {/* 3. Gemini Multimodal Innovation Suite (Gemini API & Interactions API) */}
        <GeminiAISuite />

        <AboutSection />

        <DepartmentsSection onSelectTradeForAdmission={handleOpenAdmissionWithTrade} />

        <FacilitiesSection />

        <AdmissionsSection onOpenAdmissionModal={() => setIsAdmissionOpen(true)} />

        <NewsEventsSection />

        <ContactSection />

        <FAQSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenPowerShell={() => setIsPowerShellOpen(true)}
      />

      {/* Floating Action Buttons for PowerShell Guide & WhatsApp Hotline 0795547233 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
        <button
          onClick={() => setIsStudentDashboardOpen(true)}
          className="h-11 px-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg border border-emerald-500/50 flex items-center gap-2 transition hover:scale-105"
          title="Open Secure Student Academic Progress & Grades"
          aria-label="Open Student Dashboard"
        >
          <GraduationCap className="w-4 h-4 text-emerald-200" />
          <span className="text-xs font-bold text-white">
            Student Dashboard
          </span>
        </button>

        <button
          onClick={() => setIsPowerShellOpen(true)}
          className="h-11 px-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg border border-slate-700 flex items-center gap-2 transition hover:scale-105"
          title="Windows PowerShell Commands & Files"
          aria-label="Open PowerShell Guide"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-emerald-300">
            PowerShell Setup
          </span>
        </button>

        <a
          href={formatContactUrl('whatsapp', '0795547233', 'Hello Remmy, I have an inquiry about EAV Kivumu.')}
          target="_blank"
          rel="noreferrer"
          className="h-12 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-700/30 flex items-center gap-2 transition hover:scale-105"
          title="Direct WhatsApp: 0795547233"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-xs font-bold text-white">
            0795547233 (Remmy)
          </span>
        </a>
      </div>

      {/* Modals */}
      <StudentDashboard
        isOpen={isStudentDashboardOpen}
        onClose={() => setIsStudentDashboardOpen(false)}
      />

      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        initialTrade={selectedTrade}
      />

      <PortalPreviewModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onOpenStudentDashboard={() => setIsStudentDashboardOpen(true)}
      />

      <PowerShellGuideModal
        isOpen={isPowerShellOpen}
        onClose={() => setIsPowerShellOpen(false)}
      />
    </div>
  );
}
