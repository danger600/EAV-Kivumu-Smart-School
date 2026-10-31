import React from 'react';
import { Bell, Calendar, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/schoolData';

export const NewsEventsSection: React.FC = () => {
  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase border border-emerald-200 mb-2">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              Latest Bulletins & Calendar
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              School News & Announcements
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Stay informed with official circulars, academic milestones, and campus activities from EAV Kivumu.
            </p>
          </div>
        </div>

        {/* News Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {ANNOUNCEMENTS.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition ${
                item.isImportant
                  ? 'bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      item.category === 'Admissions'
                        ? 'bg-emerald-600 text-white'
                        : item.category === 'Notice'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.summary}
                </p>

                <p className="text-slate-700 text-xs bg-white/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>School Administration</span>
                <span className="text-emerald-700 font-semibold">Official Release</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
