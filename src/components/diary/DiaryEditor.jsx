// src/components/diary/DiaryEditor.jsx
"use client";
import { useState, useEffect } from "react";
import { Clock, Save, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";

export default function DiaryEditor({ date }) {
  const { records, diaries, setDiaries } = useAppContext();
  const dateStr = format(date, "yyyy-MM-dd");

  // State lokal untuk form
  const [diary, setDiary] = useState({ bad: "", good: "", next: "" });
  const [isSaved, setIsSaved] = useState(false); // Untuk indikator visual

  // Sync form state jika tanggal (date) berubah
  useEffect(() => {
    if (diaries[dateStr]) {
      setDiary(diaries[dateStr]);
    } else {
      setDiary({ bad: "", good: "", next: "" }); // Reset kalau kosong
    }
    setIsSaved(false);
  }, [dateStr, diaries]);

  // Ambil total waktu hari itu dari records
  const dayRecordSeconds = records[dateStr]?.total || 0;
  const hours = Math.floor(dayRecordSeconds / 3600);
  const minutes = Math.floor((dayRecordSeconds % 3600) / 60);
  const dailyRecord = `${hours}h ${minutes}m`;

  const handleSave = () => {
    setDiaries(prev => ({
      ...prev,
      [dateStr]: diary
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Reset tulisan saved setelah 2 detik
  };

  const handleDelete = () => {
     if (window.confirm("Are you sure you want to clear today's diary?")) {
        const newDiaries = { ...diaries };
        delete newDiaries[dateStr];
        setDiaries(newDiaries);
        setDiary({ bad: "", good: "", next: "" });
     }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold font-sans">
          {format(date, "MMM dd")} Reflection
        </h2>
        
        <div className="flex items-center gap-2 bg-[#efedf8] text-[#5b45c2] px-3 py-1.5 rounded-xl border border-[#e5e1f1]">
          <Clock size={16} />
          <span className="text-sm font-mono font-semibold">{dailyRecord}</span>
          <span className="text-[10px] ml-1 opacity-80 font-sans uppercase tracking-wider">recorded</span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            What could be better?
          </label>
          <textarea
            value={diary.bad}
            onChange={(e) => setDiary({ ...diary, bad: e.target.value })}
            placeholder="I procrastinated on..."
            className="w-full h-24 p-4 bg-[#f8f9fa] border-none rounded-2xl resize-none focus:ring-2 focus:ring-red-200 focus:outline-none text-sm font-sans transition-shadow"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            What went well?
          </label>
          <textarea
            value={diary.good}
            onChange={(e) => setDiary({ ...diary, good: e.target.value })}
            placeholder="I managed to finish..."
            className="w-full h-24 p-4 bg-[#f8f9fa] border-none rounded-2xl resize-none focus:ring-2 focus:ring-green-200 focus:outline-none text-sm font-sans transition-shadow"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#5b45c2]"></span>
            What's the plan for tomorrow?
          </label>
          <textarea
            value={diary.next}
            onChange={(e) => setDiary({ ...diary, next: e.target.value })}
            placeholder="Tomorrow I will focus on..."
            className="w-full h-24 p-4 bg-[#f8f9fa] border-none rounded-2xl resize-none focus:ring-2 focus:ring-[#5b45c2]/30 focus:outline-none text-sm font-sans transition-shadow"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        {diaries[dateStr] ? (
            <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={18} />
            </button>
        ) : <div></div>}
        
        <button 
          onClick={handleSave} 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${isSaved ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"}`}
        >
          <Save size={16} />
          {isSaved ? "Saved!" : "Save Diary"}
        </button>
      </div>
    </div>
  );
}