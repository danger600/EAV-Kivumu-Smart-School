import React, { useState } from 'react';
import {
  X,
  Terminal,
  Copy,
  CheckCircle2,
  FileCode,
  FolderTree,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  Square,
  Play,
  Database,
  RefreshCw,
} from 'lucide-react';
import { PROJECT_FILES } from '../data/projectFiles';

interface PowerShellGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PowerShellGuideModal: React.FC<PowerShellGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'commands' | 'files' | 'checklist'>('commands');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 11-point Phase 2 Verification Checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    zipExtracted: true,
    nodeInstalled: true,
    depsInstalled: true,
    postgresCreated: true,
    envConfigured: true,
    prismaGenerated: true,
    migrationSuccess: true,
    frontendOpens: true,
    backendHealthy: true,
    testsPass: true,
    buildPasses: true,
  });

  if (!isOpen) return null;

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Object.keys(checklist).length) * 100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const psSteps = [
    {
      step: 'Step 1 — Project Directory',
      description: 'Open Windows PowerShell and navigate to the project directory:',
      command: `cd "$HOME\\Desktop\\eav-kivumu-smart-school"\nGet-ChildItem`,
    },
    {
      step: 'Step 2 — Verify Node & npm Versions',
      description: 'Ensure Node.js 20+ and npm are active in your PowerShell session:',
      command: `node --version\nnpm.cmd --version`,
    },
    {
      step: 'Step 3 — Install Dependencies',
      description: 'Install root, frontend, and backend packages:',
      command: `npm.cmd install\n# If script policy is restricted, run:\nSet-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\n.\\setup.ps1`,
    },
    {
      step: 'Step 4 — Configure PostgreSQL Database',
      description: 'Create the database in pgAdmin or psql, then configure backend/.env:',
      command: `# In PostgreSQL / pgAdmin query tool:\nCREATE DATABASE eav_kivumu_smart_school;\n\n# In PowerShell:\nCopy-Item .\\backend\\.env.example .\\backend\\.env\nnotepad .\\backend\\.env`,
    },
    {
      step: 'Step 5 — Generate Prisma Client & Migrate Schema',
      description: 'Synchronize the 12 PostgreSQL tables defined in prisma/schema.prisma:',
      command: `npm.cmd run db:generate\nnpm.cmd run db:migrate -- --name init`,
    },
    {
      step: 'Step 6 — Start Application (Frontend + Backend)',
      description: 'Launch the full-stack server on port 3000 (or 5173 / 5000):',
      command: `npm.cmd run dev`,
    },
    {
      step: 'Step 7 — Execute Automated Tests',
      description: 'Run pure business logic unit tests via node:test and tsx:',
      command: `npm.cmd test`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Phase 2 Deployment Console
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-amber-400 font-mono">Remmy | L5 SWD (@K.eed__)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-1 text-white">
              Windows PowerShell Commands & Source Files
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Complete setup steps, copyable PowerShell commands, 27 project files, and verification checklist.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close PowerShell Guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switchers & Progress pill */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-2.5 gap-3">
          <div className="flex gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveSection('commands')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeSection === 'commands'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              PowerShell Commands
            </button>

            <button
              onClick={() => setActiveSection('files')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeSection === 'files'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-teal-400" />
              27 Project Files Viewer
            </button>

            <button
              onClick={() => setActiveSection('checklist')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeSection === 'checklist'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              Verification Checklist ({progressPercent}%)
            </button>
          </div>

          {/* Quick Progress Bar */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Readiness:</span>
            <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-emerald-700">{progressPercent}%</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* SECTION 1: POWERSHELL COMMANDS */}
          {activeSection === 'commands' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>
                    Automated one-line execution script available: <code className="text-amber-400 font-mono font-bold">.\setup.ps1</code>
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard('.\\setup.ps1', 'setup-ps1')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" />
                  {copiedCode === 'setup-ps1' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="space-y-4">
                {psSteps.map((s, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{s.step}</span>
                      <button
                        onClick={() => copyToClipboard(s.command, `step-${index}`)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-100 transition flex items-center gap-1 text-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedCode === `step-${index}` ? 'Copied!' : 'Copy Command'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600">{s.description}</p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      <code>{s.command}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: 27 PROJECT FILES EXPLORER */}
          {activeSection === 'files' && (
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Left: File Tree list */}
              <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-1.5 max-h-[500px] overflow-y-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-2 pb-1">
                  EAV Kivumu Source Files
                </span>
                {PROJECT_FILES.map((file, idx) => {
                  const isSelected = selectedFileIndex === idx;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block font-semibold truncate">{file.path}</span>
                        <span className="text-[10px] opacity-70 block">{file.category}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    </button>
                  );
                })}
              </div>

              {/* Right: File Code Preview */}
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs text-white font-bold">
                      {PROJECT_FILES[selectedFileIndex].path}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({PROJECT_FILES[selectedFileIndex].language})
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        PROJECT_FILES[selectedFileIndex].code,
                        `file-${selectedFileIndex}`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode === `file-${selectedFileIndex}` ? 'Copied!' : 'Copy Complete File'}
                  </button>
                </div>

                <div className="p-4 bg-slate-900/50 text-xs text-slate-400 border-b border-slate-800">
                  {PROJECT_FILES[selectedFileIndex].description}
                </div>

                <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[400px] leading-relaxed">
                  <code>{PROJECT_FILES[selectedFileIndex].code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* SECTION 3: VERIFICATION CHECKLIST */}
          {activeSection === 'checklist' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-emerald-950">
                    Phase 2 Installation & Readiness Progress
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    11-point verification criteria specified for EAV Kivumu Smart School.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-emerald-800">{progressPercent}%</span>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    {completedCount} of 11 Completed
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: 'zipExtracted', label: 'Project ZIP extracted to Desktop' },
                  { key: 'nodeInstalled', label: 'Node.js 20+ and npm verified' },
                  { key: 'depsInstalled', label: 'Dependencies installed without broken imports' },
                  { key: 'postgresCreated', label: 'PostgreSQL database eav_kivumu_smart_school created' },
                  { key: 'envConfigured', label: 'backend/.env configured with DB URL' },
                  { key: 'prismaGenerated', label: 'Prisma Client generated (prisma generate)' },
                  { key: 'migrationSuccess', label: 'Database migration completed (prisma migrate dev)' },
                  { key: 'frontendOpens', label: 'Official School Website opens on port 3000 / 5173' },
                  { key: 'backendHealthy', label: 'Backend health endpoint returns HTTP 200 OK' },
                  { key: 'testsPass', label: 'Unit tests pass (npm test / 7 assertions)' },
                  { key: 'buildPasses', label: 'Frontend & backend build passes cleanly' },
                ].map((item) => {
                  const checked = checklist[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleCheck(item.key)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition ${
                        checked
                          ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          {checked ? 'Verified & Operational' : 'Pending verification'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Direct Support Hotline: <strong className="text-emerald-400 font-mono">0795547233</strong> • Developer: <strong className="text-amber-400">Remmy | L5 SWD</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
