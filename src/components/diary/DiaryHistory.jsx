// src/components/diary/DiaryHistory.jsx
"use client";
import { Edit2, Trash2 } from "lucide-react";

export default function DiaryHistory({ entries, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 h-full flex flex-col">
      <h2 className="text-lg font-semibold font-sans mb-6">Recent Entries</h2>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-10">No entries yet. Start writing!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="p-5 border border-gray-100 rounded-2xl group hover:border-gray-200 transition-colors relative">
              
              {/* Header Card */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-mono text-gray-500 mb-1">{entry.date_string}</p>
                  <p className="text-xs font-mono font-medium text-[#5b45c2] bg-[#efedf8] inline-block px-2 py-1 rounded">
                    {entry.record_duration}
                  </p>
                </div>
                
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => onEdit(entry)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(entry.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {entry.bad_reflection && (
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{entry.bad_reflection}</p>
                  </div>
                )}
                {entry.good_reflection && (
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{entry.good_reflection}</p>
                  </div>
                )}
                {entry.next_plan && (
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5b45c2] mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{entry.next_plan}</p>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}