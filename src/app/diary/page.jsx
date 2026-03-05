// src/app/diary/page.jsx
"use client";
import { useState } from "react";
import DateCarousel from "@/components/diary/DateCarousel";
import DiaryHistory from "@/components/diary/DiaryHistory";
import { Clock, Save, X } from "lucide-react";
import { format, parse } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null); 
  const [historyEntries, setHistoryEntries] = useState([
    {
      id: 1,
      date_string: format(new Date(), "yyyy. MM. dd. EEE"),
      record_duration: "5h 10m",
      bad_reflection: "Got distracted by social media in the afternoon.",
      good_reflection: "Finished the UI slicing for the timer component.",
      next_plan: "Start working on the statistics page.",
    }
  ]);

  const [formData, setFormData] = useState({
    bad_reflection: "",
    good_reflection: "",
    next_plan: ""
  });

  const handleSaveDiary = () => {
    if (!formData.bad_reflection && !formData.good_reflection && !formData.next_plan) return;

    if (editingId) {
      setHistoryEntries(historyEntries.map(entry => 
        entry.id === editingId 
          ? { ...entry, ...formData, date_string: format(selectedDate, "yyyy. MM. dd. EEE") } 
          : entry
      ));
      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        date_string: format(selectedDate, "yyyy. MM. dd. EEE"),
        record_duration: "0h 00m", 
        ...formData
      };
      setHistoryEntries([newEntry, ...historyEntries]);
    }
    
    setFormData({ bad_reflection: "", good_reflection: "", next_plan: "" });
  };


  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setFormData({
      bad_reflection: entry.bad_reflection,
      good_reflection: entry.good_reflection,
      next_plan: entry.next_plan
    });
    
    try {
      const parsedDate = parse(entry.date_string, "yyyy. MM. dd. EEE", new Date());
      setSelectedDate(parsedDate);
    } catch (e) {
      console.error("Failed to parse date", e);
    }
  };

  const handleDelete = (id) => {
    setHistoryEntries(historyEntries.filter(entry => entry.id !== id));
    if (editingId === id) handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ bad_reflection: "", good_reflection: "", next_plan: "" });
  };

  return (
    <div className="px-8 py-2 mt-8 max-w-7xl mx-auto w-full h-[calc(80vh-5rem)] flex flex-col">
      {/* <div className="mb-2">
        <h1 className="text-2xl font-semibold font-sans text-gray-900">3-Line Diary</h1>
        <p className="text-gray-500 text-sm mt-1">Reflect on your day, keep it short and simple.</p>
      </div> */}

      <DateCarousel selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold font-sans">
                {editingId ? "Edit Reflection" : "Write Reflection"}
              </h2>
              <span className="text-gray-300 font-light text-lg">•</span>
              



              <AnimatePresence mode="wait">
                <motion.span 
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-mono text-[#5b45c2] bg-[#efedf8] px-2 py-0.5 rounded-md"
                >
                  {format(selectedDate, "MMM dd")}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 bg-[#f8f9fa] text-gray-500 px-3 py-1.5 rounded-xl border border-gray-100">
              <Clock size={16} />
              <span className="text-sm font-mono font-medium">0h 00m</span>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span> What could be better?
              </label>
              <textarea 
                value={formData.bad_reflection} 
                onChange={(e) => setFormData({...formData, bad_reflection: e.target.value})} 
                placeholder="I procrastinated on..." 
                className="w-full h-24 p-4 bg-[#f8f9fa] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-red-200 text-sm transition-shadow" 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> What went well?
              </label>
              <textarea 
                value={formData.good_reflection} 
                onChange={(e) => setFormData({...formData, good_reflection: e.target.value})} 
                placeholder="I managed to finish..." 
                className="w-full h-24 p-4 bg-[#f8f9fa] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-200 text-sm transition-shadow" 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#5b45c2]"></span> What's the plan for tomorrow?
              </label>
              <textarea 
                value={formData.next_plan} 
                onChange={(e) => setFormData({...formData, next_plan: e.target.value})} 
                placeholder="Tomorrow I will focus on..." 
                className="w-full h-24 p-4 bg-[#f8f9fa] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#5b45c2]/30 text-sm transition-shadow" 
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            {editingId && (
              <button 
                onClick={handleCancelEdit} 
                className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
            )}
            <button 
              onClick={handleSaveDiary} 
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Save size={16} /> {editingId ? "Update Diary" : "Save Diary"}
            </button>
          </div>
        </div>

        {/* HISTORY COMPONENT */}
        <DiaryHistory 
          entries={historyEntries} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

      </div>
    </div>
  );
}