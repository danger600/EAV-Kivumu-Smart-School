/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EAV Kivumu Smart School - Phase 2 Foundation
 * Developed by Remmy | L5 SWD
 * Instagram: @tigernsanz | Contact: 0795547233
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
import { TradeCode } from './types';
import { Phone, MessageCircle, Terminal } from 'lucide-react';
import { formatContactUrl } from './utils/schoolLogic';

export default function App() {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isPowerShellOpen, setIsPowerShellOpen] = useState(false);
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
      />

      {/* Main Landing Page Content */}
      <main id="main-content">
        <Hero
          onOpenAdmission={() => setIsAdmissionOpen(true)}
          onOpenPortal={() => setIsPortalOpen(true)}
          onOpenPowerShell={() => setIsPowerShellOpen(true)}
        />

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
      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        initialTrade={selectedTrade}
      />

      <PortalPreviewModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
      />

      <PowerShellGuideModal
        isOpen={isPowerShellOpen}
        onClose={() => setIsPowerShellOpen(false)}
      />
    </div>
  );
}
