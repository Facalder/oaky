"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { format, differenceInDays, startOfDay } from "date-fns";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  // --- DATA STATES ---
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [records, setRecords] = useState({}); // Format: { "YYYY-MM-DD": { total: 0, tasks: { id: 0 } } }
  
  // --- TIMER STATES ---
  const [activeTask, setActiveTask] = useState({ id: 'default', title: "Select task", color: "bg-gray-300" });
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeMode, setActiveMode] = useState("stopwatch"); // "stopwatch" | "pomodoro"
  
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); 
  const [pomodoroSession, setPomodoroSession] = useState("focus");

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("dote_tasks")) || [
      { id: 1, title: "Weight Training", category: "Exercise", color: "bg-[#5b45c2]" },
      { id: 2, title: "Reading every day", category: "Daily", color: "bg-green-400" }
    ];
    const savedEvents = JSON.parse(localStorage.getItem("dote_events")) || [];
    const savedRecords = JSON.parse(localStorage.getItem("dote_records")) || {};
    
    setTasks(savedTasks);
    setEvents(savedEvents);
    setRecords(savedRecords);
    
    if (savedTasks.length > 0) setActiveTask(savedTasks[0]);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("dote_tasks", JSON.stringify(tasks));
      localStorage.setItem("dote_events", JSON.stringify(events));
      localStorage.setItem("dote_records", JSON.stringify(records));
    }
  }, [tasks, events, records, isMounted]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (activeMode === "pomodoro") {
            const limit = pomodoroSession === "focus" ? FOCUS_TIME : BREAK_TIME;
            if (prev + 1 >= limit) {
              handlePause(limit);
              setPomodoroSession(pomodoroSession === "focus" ? "break" : "focus");
              return 0; 
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeMode, pomodoroSession]);

  const handlePause = (timeToSave = time) => {
    setIsRunning(false);
    if (timeToSave === 0) return;

    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    setRecords(prev => {
      const todayRecord = prev[todayStr] || { total: 0, tasks: {} };
      const taskTotal = todayRecord.tasks[activeTask.id] || 0;
      
      const isValidWork = activeMode === "stopwatch" || pomodoroSession === "focus";
      const addTime = isValidWork ? timeToSave : 0;

      return {
        ...prev,
        [todayStr]: {
          total: todayRecord.total + addTime,
          tasks: {
            ...todayRecord.tasks,
            [activeTask.id]: taskTotal + addTime
          }
        }
      };
    });

    if (activeMode === "stopwatch") setTime(0); 
  };

  const toggleTimer = () => {
    if (isRunning) {
      handlePause();
    } else {
      setIsRunning(true);
    }
  };

  const getTaskTotalToday = (taskId) => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return records[todayStr]?.tasks[taskId] || 0;
  };

  if (!isMounted) return null; 

  const toggleTaskCompletion = (taskId) => {
  setTasks((prevTasks) =>
    prevTasks.map((t) =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    )
  );
};

  return (
    <AppContext.Provider value={{
      tasks, setTasks, events, setEvents, records, setRecords,
      activeTask, setActiveTask, activeEvent, setActiveEvent,
      activeMode, setActiveMode, isRunning, toggleTimer,
      time, setTime, pomodoroSession, FOCUS_TIME, BREAK_TIME,
      getTaskTotalToday, toggleTaskCompletion
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);