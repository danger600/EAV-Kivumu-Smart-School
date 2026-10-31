import React, { useState } from 'react';
import {
  Code,
  Stethoscope,
  Sprout,
  BookOpen,
  CheckCircle,
  Briefcase,
  Wrench,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DEPARTMENTS } from '../data/schoolData';
import { TradeCode } from '../types';

interface DepartmentsSectionProps {
  onSelectTradeForAdmission: (trade: TradeCode) => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  onSelectTradeForAdmission,
}) => {
  const [activeCode, setActiveCode] = useState<TradeCode>('SWD');

  const activeDept = DEPARTMENTS.find((d) => d.code === activeCode) || DEPARTMENTS[0];

  const getIcon = (code: TradeCode) => {
    switch (code) {
      case 'SWD':
        return <Code className="w-5 h-5" />;
      case 'VET':
        return <Stethoscope className="w-5 h-5" />;
      case 'AGR':
        return <Sprout className="w-5 h-5" />;
      case 'GEN':
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <section id="departments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide uppercase border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Accredited Academic & TVET Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trades & Academic Departments
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            EAV Kivumu provides specialized technical and scientific curricula certified under the Rwanda TVET Board (RTB) Competence-Based Curriculum (CBC).
          </p>
        </div>

        {/* Trade Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {DEPARTMENTS.map((dept) => {
            const isSelected = dept.code === activeCode;
            return (
              <button
                key={dept.code}
                onClick={() => setActiveCode(dept.code)}
                className={`p-4 rounded-xl flex items-center gap-3 text-left transition border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {getIcon(dept.code)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
                    {dept.code}
                  </span>
                  <span className="font-bold text-sm block leading-snug truncate">
                    {dept.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Department Details Panel */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Description & Levels */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                  <span>Department of {activeDept.name}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {activeDept.tagline}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                  {activeDept.description}
                </p>
              </div>

              {/* Levels Offered */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Progression Levels & Qualifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDept.levels.map((lvl) => (
                    <span
                      key={lvl}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Graduate Career Pathways
                </h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {activeDept.careers.map((career) => (
                    <div
                      key={career}
                      className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Key Distinctives
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeDept.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Labs, Stats & Quick Apply */}
            <div className="lg:col-span-5 space-y-5">
              {/* Stats Box */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Department Metrics
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-xl font-extrabold text-slate-900">
                      {activeDept.keyStats.students}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium mt-0.5">
                      Scholars
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-xl font-extrabold text-slate-900">
                      {activeDept.keyStats.teachers}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium mt-0.5">
                      Faculty
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-xl font-extrabold text-slate-900">
                      {activeDept.keyStats.labs}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium mt-0.5">
                      Laboratories
                    </span>
                  </div>
                </div>

                {/* Practical Workshops */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    Dedicated Practical Facilities:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {activeDept.workshops.map((w, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Head of Department */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Head of Department
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {activeDept.headOfDepartment.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {activeDept.headOfDepartment.qualification}
                  </p>
                </div>
              </div>

              {/* Action: Apply for this trade */}
              <button
                onClick={() => onSelectTradeForAdmission(activeDept.code)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
              >
                <span>Apply for {activeDept.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
