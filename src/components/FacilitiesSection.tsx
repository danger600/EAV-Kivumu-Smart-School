import React, { useState } from 'react';
import { Building2, Check, Users, Sparkles } from 'lucide-react';
import { FACILITIES } from '../data/schoolData';

export const FacilitiesSection: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Academics' | 'Practical' | 'Campus Life'>('All');

  const filteredFacilities =
    filter === 'All' ? FACILITIES : FACILITIES.filter((f) => f.category === filter);

  return (
    <section id="facilities" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold tracking-wide uppercase border border-emerald-700/40">
            <Building2 className="w-3.5 h-3.5" />
            Modern Campus Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            World-Class Learning Facilities
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Practical skills require cutting-edge equipment. Discover EAV Kivumu’s modern software laboratories, veterinary clinics, demonstration farms, and living spaces in Ngororero.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 mb-10">
          {(['All', 'Academics', 'Practical', 'Campus Life'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === cat
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl hover:border-slate-600 transition flex flex-col"
            >
              <div className="h-56 relative overflow-hidden bg-slate-950">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-700">
                  {facility.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/90 text-slate-200 text-xs font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-700">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  {facility.capacity}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{facility.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{facility.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Equipment & Features:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {facility.equipment.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
