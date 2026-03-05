// src/components/diary/DiaryHistory.jsx
"use client";
import { Edit2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { format, parseISO } from "date-fns";

export default function DiaryHistory({ onSelectDate }) {
  const { diaries, records } = useAppContext();

  // Ubah object diaries menjadi array dan sort dari tanggal terbaru
  const entries = Object.keys(diaries)
    .map((dateStr) => {
      const dayRecordSeconds = records[dateStr]?.total || 0;
      const hours = Math.floor(dayRecordSeconds / 3600);
      const minutes = Math.floor((dayRecordSeconds % 3600) / 60);

      return {
        dateStr,
        parsedDate: parseISO(dateStr),
        record_duration: `${hours}h ${minutes}m`,
        ...diaries[dateStr],
      };
    })
    .sort((a, b) => b.parsedDate - a.parsedDate); // Sort descending

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 h-full flex flex-col">
      <h2 className="text-lg font-semibold font-sans mb-6">Recent Entries</h2>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-10">No entries yet. Start writing!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.dateStr} className="p-5 border border-gray-100 rounded-2xl group hover:border-[#e5e1f1] transition-colors relative">
              
              {/* Header Card */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-mono text-gray-500 mb-1">{format(entry.parsedDate, "yyyy. MM. dd. EEE")}</p>
                  <p className="text-xs font-mono font-medium text-[#5b45c2] bg-[#efedf8] inline-block px-2 py-1 rounded">
                    {entry.record_duration}
                  </p>
                </div>
                
                {/* Tombol Edit (Akan menggeser carousel ke tanggal ini) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => onSelectDate(entry.parsedDate)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit this entry"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {entry.bad && (
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{entry.bad}</p>
                  </div>
                )}
                {entry.good && (
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{entry.good}</p>
                  </div>
                )}
                {entry.next && (
                  <div className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5b45c2] mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed">{entry.next}</p>
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