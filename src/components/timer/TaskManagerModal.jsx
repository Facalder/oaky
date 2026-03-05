// src/components/timer/TaskManagerModal.jsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  Check,
  Minus,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function TaskManagerModal({ isOpen, onClose }) {
  const [view, setView] = useState("select");
  const { tasks, setTasks, setActiveTask } = useAppContext();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Study",
    color: "bg-purple-600",
    startAt: "05:00",
    endAt: "06:00",
    repeatEveryday: true,
    repeatDays: [],
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => setView("select"), 300);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "Study",
      color: "bg-purple-600",
      startAt: "05:00",
      endAt: "06:00",
      repeatEveryday: true,
      repeatDays: [],
    });
    setView("add");
  };

  const openEdit = (task, e) => {
    e.stopPropagation();
    setEditingId(task.id);
    setFormData({
      title: task.title,
      category: task.category,
      color: task.color,
      startAt: task.startAt || "05:00",
      endAt: task.endAt || "06:00",
      repeatEveryday: task.repeatEveryday ?? true,
      repeatDays: task.repeatDays || [],
    });
    setView("add");
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleSaveTask = () => {
    if (!formData.title) return;
    if (editingId) {
      setTasks(
        tasks.map((t) => (t.id === editingId ? { ...t, ...formData } : t)),
      );
    } else {
      setTasks([...tasks, { id: Date.now(), ...formData }]);
    }
    setView("select");
  };

  const colors = [
    "bg-purple-600",
    "bg-pink-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-lime-400",
  ];
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      repeatEveryday: false,
      repeatDays: prev.repeatDays.includes(day)
        ? prev.repeatDays.filter((d) => d !== day)
        : [...prev.repeatDays, day],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white rounded-2xl">
        <div className="relative w-full h-[680px]">
          <AnimatePresence initial={false} mode="wait">
            {/* VIEW: SELECT (List) */}
            {view === "select" && (
              <motion.div
                key="select"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="absolute inset-0 p-8 flex flex-col"
              >
                <div className="flex justify-between items-center mb-6 mt-4">
                  <h2 className="text-lg font-semibold font-sans">
                    Select task
                  </h2>
                  <button
                    onClick={openAdd}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                  {Object.keys(groupedTasks).map((category) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        {category}
                      </h3>
                      {groupedTasks[category].map((task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            setActiveTask(task);
                            handleClose();
                          }}
                          className="flex justify-between items-center border-l-2 pl-3 py-2 cursor-pointer hover:bg-gray-50 mb-1 group transition-colors"
                          style={{ borderColor: task.color.replace("bg-", "") }}
                        >
                          <span className="text-sm text-gray-600">
                            {task.title}
                          </span>
                          <div className="flex items-center gap-3">
                            {/* Hover Actions */}
                            <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                              <button
                                onClick={(e) => openEdit(task, e)}
                                className="p-1 text-gray-400 hover:text-blue-500 bg-white shadow-sm rounded-lg"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(task.id, e)}
                                className="p-1 text-gray-400 hover:text-red-500 bg-white shadow-sm rounded-lg"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <span className="text-xs text-gray-400 font-mono">
                              0h 00m
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
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
                    onClick={() => setView("select")}
                    className="p-1 -ml-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <h2 className="text-lg font-medium font-sans">
                    {editingId ? "Edit task" : "Add task"}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-6">
                  {/* TITLE */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-900">
                        Title
                      </label>
                      <span className="text-xs text-gray-400 underline cursor-pointer">
                        recent list
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Please enter title"
                      className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5b45c2] transition-colors"
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-900">
                        Category
                      </label>
                      <span className="text-xs text-gray-400 underline cursor-pointer">
                        Edit
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {["Study", "Exercise", "Daily"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            setFormData({ ...formData, category: cat })
                          }
                          className={`px-5 py-1.5 text-sm rounded-full transition-colors ${formData.category === cat ? "bg-black text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                          {cat}
                        </button>
                      ))}
                      <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* COLOR */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-3">
                      Color
                    </label>
                    <div className="flex gap-3 mb-4 text-[10px] text-gray-500">
                      <span className="px-3 py-1 bg-black text-white rounded-full cursor-pointer">
                        Original
                      </span>
                      <span className="px-3 py-1 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
                        Custom
                      </span>
                      <span className="px-3 py-1 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
                        Theme1
                      </span>
                      <span className="px-3 py-1 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
                        Theme2
                      </span>
                    </div>
                    <div className="flex gap-8 px-1">
                      {colors.map((color) => (
                        <div
                          key={color}
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110`}
                        >
                          {formData.color === color && (
                            <Check size={16} className="text-white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MANAGE TIME */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-900">
                        Manage time
                      </label>
                      <button className="border border-gray-200 rounded-full p-0.5 hover:bg-gray-50">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex-1 relative border border-gray-300 rounded-xl p-3 focus-within:border-[#5b45c2] transition-colors">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-400">
                          Start at
                        </span>
                        <input
                          type="time"
                          value={formData.startAt}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startAt: e.target.value,
                            })
                          }
                          className="w-full text-center text-lg font-mono tracking-widest text-gray-900 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 relative border border-gray-300 rounded-xl p-3 focus-within:border-[#5b45c2] transition-colors">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-400">
                          End at
                        </span>
                        <input
                          type="time"
                          value={formData.endAt}
                          onChange={(e) =>
                            setFormData({ ...formData, endAt: e.target.value })
                          }
                          className="w-full text-center text-lg font-mono tracking-widest text-gray-900 focus:outline-none"
                        />
                      </div>
                      <button className="border border-gray-200 rounded-full p-1 hover:bg-gray-50">
                        <Minus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-sm text-gray-400">Date</span>
                    <span className="text-sm text-gray-400 font-mono">
                      03. 02. Mon
                    </span>
                  </div>

                  {/* REPEAT */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-semibold text-gray-900">
                        Repeat
                      </label>
                      <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            repeatEveryday: !formData.repeatEveryday,
                            repeatDays: [],
                          })
                        }
                      >
                        <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                          Everyday
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${formData.repeatEveryday ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-400"}`}
                        >
                          {formData.repeatEveryday && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => {
                          const isSelected =
                            formData.repeatEveryday ||
                            formData.repeatDays.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => toggleDay(day)}
                              className={`w-10 h-10 rounded-full text-[11px] font-medium transition-colors ${isSelected ? "bg-[#5b45c2] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                            >
                              {day}
                            </button>
                          );
                        },
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="underline cursor-pointer hover:text-gray-600 transition-colors">
                        Set the repeat end date.
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} /> not set
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 flex justify-between items-center border-t border-gray-50">
                  <button
                    onClick={() => setView("select")}
                    className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTask}
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
