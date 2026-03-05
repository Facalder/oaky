"use client";
import { useState } from "react";
import { Clock, Save } from "lucide-react";

export default function DiaryEditor({ date }) {
  const [diary, setDiary] = useState({ bad: "", good: "", next: "" });

  const dailyRecord = "4h 30m";

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold font-sans">Write Reflection</h2>
        
        <div className="flex items-center gap-2 bg-[#efedf8] text-[#5b45c2] px-3 py-1.5 rounded-xl">
          <Clock size={16} />
          <span className="text-sm font-mono font-semibold">{dailyRecord}</span>
          <span className="text-xs ml-1 opacity-80 font-sans">recorded today</span>
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
            className="w-full h-24 p-4 bg-[#f8f9fa] border-none rounded-2xl resize-none focus:ring-2 focus:ring-red-200 focus:outline-none text-sm font-sans"
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
            className="w-full h-24 p-4 bg-[#f8f9fa] border-none rounded-2xl resize-none focus:ring-2 focus:ring-green-200 focus:outline-none text-sm font-sans"
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
            className="w-full h-24 p-4 bg-[#f8f9fa] border-none rounded-2xl resize-none focus:ring-2 focus:ring-[#5b45c2]/30 focus:outline-none text-sm font-sans"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <Save size={16} />
          Save Diary
        </button>
      </div>
    </div>
  );
}