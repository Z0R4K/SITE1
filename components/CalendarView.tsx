import React from 'react';
import { CalendarEntry } from '../types';
import { CalendarIcon } from './Icons';

interface CalendarViewProps {
  entries: CalendarEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <CalendarIcon className="text-blue-400 w-5 h-5" />
        Calendário Editorial
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries?.map((entry, index) => (
          <div key={index} className="bg-slate-900 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{entry.day}</p>
            <h4 className="text-white font-medium mb-2">{entry.contentTitle}</h4>
            <span className="inline-block text-xs font-semibold bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-700">
              {entry.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;