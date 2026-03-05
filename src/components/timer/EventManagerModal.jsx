// src/components/timer/EventManagerModal.jsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { format, differenceInDays, startOfDay } from "date-fns";
import { useAppContext } from "@/context/AppContext";

export default function EventManagerModal({ isOpen, onClose }) {
  const { events, setEvents, setActiveEvent } = useAppContext();
  const [view, setView] = useState("list"); // "list" | "add"

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [dateStr, setDateStr] = useState("");

  const today = startOfDay(new Date());

  const handleSelect = (ev) => {
    setActiveEvent(ev);
    onClose();
  };

  const openAdd = () => {
    setEditingId(null);
    setTitle("");
    setDateStr("");
    setView("add");
  };

  const openEdit = (ev, e) => {
    e.stopPropagation();
    setEditingId(ev.id);
    setTitle(ev.title);
    setDateStr(ev.date);
    setView("add");
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const handleSave = () => {
    if (!title || !dateStr) return;
    if (editingId) {
      setEvents(
        events.map((ev) =>
          ev.id === editingId ? { ...ev, title, date: dateStr } : ev,
        ),
      );
    } else {
      setEvents([...events, { id: Date.now(), title, date: dateStr }]);
    }
    setView("list");
  };

  // Helper kalkulasi D-Day
  const getDDay = (targetDate) => {
    const target = startOfDay(new Date(targetDate));
    const diff = differenceInDays(target, today);
    if (diff === 0) return "D-Day";
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  const upcomingEvents = events.filter(
    (e) => differenceInDays(startOfDay(new Date(e.date)), today) >= 0,
  );
  const pastEvents = events.filter(
    (e) => differenceInDays(startOfDay(new Date(e.date)), today) < 0,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white rounded-2xl">
        <div className="relative w-full h-[650px]">
          <AnimatePresence initial={false} mode="wait">
            
            {/* VIEW: LIST */}
            {view === "list" && (
              <motion.div
                key="list"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="absolute inset-0 p-8 flex flex-col"
              >
                <div className="flex justify-between items-center mb-6 mt-4">
                  <h2 className="text-lg font-medium font-sans">Events</h2>
                  <button
                    onClick={openAdd}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                  
                  {/* UPCOMING EVENTS */}
                  <div>
                    <h3 className="text-sm text-gray-900 mb-4 font-medium">
                      Upcoming Events
                    </h3>
                    {upcomingEvents.length === 0 ? (
                      <p
                        onClick={openAdd}
                        className="text-sm text-gray-500 cursor-pointer hover:text-[#5b45c2] pl-4 transition-colors"
                      >
                        - There are no events yet
                        <br />
                        Tap to add event
                      </p>
                    ) : (
                      upcomingEvents.map((ev, index) => (
                        <div
                          key={ev.id}
                          onClick={() => handleSelect(ev)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                              {index + 1}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-[#5b45c2]"></div>
                              <span className="font-mono text-sm">
                                {getDDay(ev.date)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700">
                                {ev.title}
                              </p>
                              <p className="text-xs text-gray-400 font-mono">
                                {format(new Date(ev.date), "yyyy. MM. dd. EEE")}
                              </p>
                            </div>
                          </div>
                          
                          {/* Hover Actions */}
                          <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                            <button onClick={(e) => openEdit(ev, e)} className="p-1.5 text-gray-400 hover:text-blue-500 bg-white shadow-sm rounded-lg">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={(e) => handleDelete(ev.id, e)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white shadow-sm rounded-lg">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* PAST EVENTS */}
                  {pastEvents.length > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-900 mb-4 font-medium">
                        Past Events
                      </h3>
                      {pastEvents.map((ev, i) => (
                        <div
                          key={ev.id}
                          onClick={() => handleSelect(ev)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer group opacity-60 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                              {i + 1}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-[#5b45c2]"></div>
                              <span className="font-mono text-sm">
                                {getDDay(ev.date)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700">
                                {ev.title}
                              </p>
                              <p className="text-xs text-gray-400 font-mono">
                                {format(new Date(ev.date), "yyyy. MM. dd. EEE")}
                              </p>
                            </div>
                          </div>
                          
                          {/* Hover Actions */}
                          <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                            <button onClick={(e) => openEdit(ev, e)} className="p-1.5 text-gray-400 hover:text-blue-500 bg-white shadow-sm rounded-lg">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={(e) => handleDelete(ev.id, e)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white shadow-sm rounded-lg">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW: ADD / EDIT */}
            {view === "add" && (
              <motion.div
                key="add"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute inset-0 flex flex-col bg-white"
              >
                <div className="flex items-center gap-3 p-6 pb-2">
                  <button
                    onClick={() => setView("list")}
                    className="p-1 -ml-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <h2 className="text-lg font-medium font-sans">
                    {editingId ? "Edit event" : "Add event"}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Please enter title"
                      className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5b45c2] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">
                      End on
                    </label>
                    <input
                      type="date"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5b45c2] font-mono transition-colors"
                    />
                  </div>
                </div>

                <div className="p-6 pt-4 flex justify-between items-center border-t border-gray-50">
                  <button
                    onClick={() => setView("list")}
                    className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm font-medium bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}