// src/components/timer/TimerSection.jsx
"use client";
import { useState } from "react";
import TaskManagerModal from "./TaskManagerModal";
import EventManagerModal from "./EventManagerModal";
import { useAppContext } from "@/context/AppContext";
import { differenceInDays, startOfDay, format } from "date-fns";
import { Play, Square, ChevronRight } from "lucide-react";

export default function TimerSection() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const {
    activeTask,
    activeEvent,
    activeMode,
    setActiveMode,
    isRunning,
    toggleTimer,
    time,
    pomodoroSession,
    FOCUS_TIME,
    BREAK_TIME,
    getTaskTotalToday,
  } = useAppContext();

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  let displayTime =
    activeMode === "stopwatch"
      ? time
      : (pomodoroSession === "focus" ? FOCUS_TIME : BREAK_TIME) - time;

  const getDDay = (targetDate) => {
    const target = startOfDay(new Date(targetDate));
    const diff = differenceInDays(target, startOfDay(new Date()));
    if (diff === 0) return "D-Day";
    return diff > 0 ? `D+${diff}` : `D-${Math.abs(diff)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-sm border border-gray-50 h-full relative">
      {/* Tabs */}
      <div className="bg-[#f8f9fa] p-1.5 rounded-full flex items-center gap-1 mb-8 w-full max-w-sm shrink-0">
        <button
          onClick={() => !isRunning && setActiveMode("stopwatch")}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${activeMode === "stopwatch" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Stopwatch
        </button>
        <button
          onClick={() => !isRunning && setActiveMode("pomodoro")}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${activeMode === "pomodoro" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Pomodoro
        </button>
       
      </div>

      {/* Bagian Tengah: Lingkaran Timer & Tombol Play */}
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
        {/* Lingkaran Timer */}
        <div
          onClick={() => !isRunning && setIsTaskModalOpen(true)}
          className={`relative w-[340px] h-[340px] flex flex-col items-center justify-center rounded-full transition-transform group mb-8 ${!isRunning && "cursor-pointer hover:scale-[1.02]"}`}
          style={{
            background: "radial-gradient(circle, #ffffff 60%, #fffcfc 100%)",
            boxShadow: isRunning
              ? "0 0 60px rgba(255, 100, 100, 0.08) inset"
              : "0 0 40px rgba(0, 0, 0, 0.02) inset",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#fce4e4"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          </svg>

          <div className="relative z-10 text-center">
            <p className="text-gray-400 text-[15px] mb-2 font-mono tracking-wide">
              {activeMode === "pomodoro"
                ? pomodoroSession === "focus"
                  ? "Focus Session"
                  : "Break Time"
                : format(new Date(), "yyyy. MM. dd. EEE")}
            </p>
            <h1 className="text-7xl font-light tracking-tight font-mono mb-4 text-gray-900">
              {formatTime(displayTime)}
            </h1>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${activeTask.color}`}
                ></span>
                <span className="text-[15px] text-gray-600">
                  {activeTask.title}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-mono tracking-wider">
                {formatTime(getTaskTotalToday(activeTask.id))}
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Play/Pause Pill Tepat di Bawah Lingkaran */}
        <div
          onClick={toggleTimer}
          className="flex items-center bg-white rounded-[20px] p-1.5 pl-6 pr-2 border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 hover:shadow transition-all"
        >
          <span className="font-mono font-semibold text-lg tracking-wider text-gray-900 mr-6">
            {formatTime(displayTime)}
          </span>
          <div className="w-[42px] h-[42px] rounded-xl bg-gray-900 flex items-center justify-center text-white">
            {isRunning ? (
              <Square size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-1" />
            )}
          </div>
        </div>
      </div>

      {/* Bagian Bawah Kiri/Kanan: Event & Panah */}
      <div className="w-full flex items-end justify-between pt-8 shrink-0">
        {/* D-Day / Event */}
        <div
          onClick={() => setIsEventModalOpen(true)}
          className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
        >
          {activeEvent ? (
            <>
              <span className="text-[15px] text-gray-900 font-medium mb-1 font-mono tracking-wide">
                {getDDay(activeEvent.date)}
              </span>
              <span className="text-sm text-gray-400 font-light">
                {activeEvent.title}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400 hover:text-gray-600">
              Select event
            </span>
          )}
        </div>

        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <ChevronRight size={24} strokeWidth={1.5} />
        </button>
      </div>

      <TaskManagerModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <EventManagerModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
}
