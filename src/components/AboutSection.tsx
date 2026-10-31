import React from 'react';
import { Target, Compass, HeartHandshake, Award, Shield, UserCheck } from 'lucide-react';
import { LEADERSHIP, SCHOOL_INFO } from '../data/schoolData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Tradition & Innovation Since 1982
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About EAV Kivumu Smart School
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Located in scenic <strong className="text-slate-800">Ngororero District, Western Province</strong>, École Agro-Vétérinaire de Kivumu has been a beacon of excellence for over four decades, preparing skilled Rwandan professionals who lead in technology, sustainable farming, and veterinary health.
          </p>
        </div>

        {/* Vision, Mission, Values cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Vision */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be Rwanda's premier model TVET center, transforming youth into world-class software engineers, veterinary clinicians, and modern agri-business pioneers equipped with technical integrity.
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To provide competency-based practical training aligned with national TVET standards (RTB/NESA), fostering entrepreneurship, scientific inquiry, digital fluency, and cultural discipline.
            </p>
          </div>

          {/* Core Values */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Core Values</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Ubupfura:</strong> Integrity & Ethical Discipline</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Umurava:</strong> Professional diligence & craftsmanship</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Guhanga:</strong> Digital innovation & problem-solving</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Ubumwe:</strong> Collaborative solidarity & community service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* School Leadership */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900">School Administration & Leadership</h3>
            <p className="text-slate-600 text-sm mt-1">
              Experienced educators and technologists steering EAV Kivumu into the smart school era.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition group"
              >
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {leader.contact && (
                    <div className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded shadow">
                      {leader.contact}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                    {leader.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">{leader.role}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">{leader.qualification}</p>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
