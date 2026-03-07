'use client'
import { format } from 'date-fns'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false)

  // --- DATA STATES ---
  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])
  const [records, setRecords] = useState({}) // Format: { "YYYY-MM-DD": { total: 0, tasks: { id: 0 } } }
  const [diaries, setDiaries] = useState({}) // Format: { "yyyy-MM-dd": { bad: "", good: "", next: "" } }

  // --- TIMER STATES ---
  const [activeTask, setActiveTask] = useState({
    id: 'default',
    title: 'Select task',
    color: 'bg-gray-300',
  })
  const [activeEvent, setActiveEvent] = useState(null)
  const [activeMode, setActiveMode] = useState('stopwatch') // "stopwatch" | "pomodoro"

  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [pomodoroSession, setPomodoroSession] = useState('focus')

  const FOCUS_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  // 1. INITIAL LOAD DARI LOCALSTORAGE
  useEffect(() => {
    const normalizeTask = (task) => {
      const repeatEveryday =
        task.repeatEveryday ??
        task.isEveryday ??
        (Array.isArray(task.repeatDays) ? task.repeatDays.length === 0 : true)

      return {
        id: task.id,
        title: task.title ?? '',
        category: task.category ?? 'Daily',
        color: task.color ?? 'bg-purple-600',
        startAt: task.startAt ?? '05:00',
        endAt: task.endAt ?? '06:00',
        repeatEveryday,
        repeatDays: Array.isArray(task.repeatDays) ? task.repeatDays : [],
        isCompleted: task.isCompleted ?? false,
      }
    }

    // Berikan default value (array dummy awal) jika localStorage masih kosong
    const defaultTasks = [
      {
        id: 1,
        title: 'Weight Training',
        category: 'Exercise',
        color: 'bg-[#5b45c2]',
        startAt: '05:00',
        endAt: '06:00',
        repeatEveryday: true,
        repeatDays: [],
        isCompleted: false,
      },
      {
        id: 2,
        title: 'Reading every day',
        category: 'Daily',
        color: 'bg-green-400',
        startAt: '05:00',
        endAt: '06:00',
        repeatEveryday: true,
        repeatDays: [],
        isCompleted: false,
      },
    ]

    const savedTasks =
      JSON.parse(localStorage.getItem('dote_tasks')) || defaultTasks
    const savedEvents = JSON.parse(localStorage.getItem('dote_events')) || []
    const savedRecords = JSON.parse(localStorage.getItem('dote_records')) || {}
    const savedDiaries = JSON.parse(localStorage.getItem('dote_diaries')) || {}

    const normalizedTasks = (savedTasks || []).map(normalizeTask)
    setTasks(normalizedTasks)
    setEvents(savedEvents)
    setRecords(savedRecords)
    setDiaries(savedDiaries)

    if (normalizedTasks.length > 0) {
      setActiveTask(normalizedTasks[0])
    }

    setIsMounted(true)
  }, [])

  // 2. AUTO-SAVE KE LOCALSTORAGE KETIKA DATA BERUBAH
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dote_tasks', JSON.stringify(tasks))
      localStorage.setItem('dote_events', JSON.stringify(events))
      localStorage.setItem('dote_records', JSON.stringify(records))
      localStorage.setItem('dote_diaries', JSON.stringify(diaries))
    }
  }, [tasks, events, records, diaries, isMounted])

  // 4. FUNGSI PAUSE DAN SIMPAN DURASI
  const handlePause = useCallback(
    (timeToSave = time) => {
      setIsRunning(false)
      if (timeToSave === 0) return

      const todayStr = format(new Date(), 'yyyy-MM-dd')

      // Kalkulasi Start Time dan End Time dari sesi yang baru berjalan
      const end = new Date()
      const start = new Date(end.getTime() - timeToSave * 1000)

      const startTimeStr = format(start, 'HH:mm')
      const endTimeStr = format(end, 'HH:mm')

      setRecords((prev) => {
        const todayRecord = prev[todayStr] || {
          total: 0,
          tasks: {},
          sessions: [],
        }
        const taskTotal = todayRecord.tasks[activeTask.id] || 0

        const isValidWork =
          activeMode === 'stopwatch' || pomodoroSession === 'focus'
        const addTime = isValidWork ? timeToSave : 0

        // Buat sesi baru
        const newSession = {
          id: Date.now(),
          taskId: activeTask.id,
          title: activeTask.title,
          color: activeTask.color,
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: timeToSave,
        }

        return {
          ...prev,
          [todayStr]: {
            total: todayRecord.total + addTime,
            tasks: {
              ...todayRecord.tasks,
              [activeTask.id]: taskTotal + addTime,
            },
            // Masukkan sesi ke dalam array jika itu adalah waktu kerja valid
            sessions: isValidWork
              ? [...(todayRecord.sessions || []), newSession]
              : todayRecord.sessions || [],
          },
        }
      })

      if (activeMode === 'stopwatch') setTime(0)
    },
    [activeMode, activeTask, pomodoroSession, time],
  )

  // 3. ENGINE TIMER UTAMA
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (activeMode === 'pomodoro') {
            const limit = pomodoroSession === 'focus' ? FOCUS_TIME : BREAK_TIME
            if (prev + 1 >= limit) {
              handlePause(limit)
              setPomodoroSession(
                pomodoroSession === 'focus' ? 'break' : 'focus',
              )
              return 0
            }
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, activeMode, pomodoroSession, handlePause])

  const toggleTimer = () => {
    if (isRunning) {
      handlePause()
    } else {
      setIsRunning(true)
    }
  }

  const getTaskTotalToday = (taskId) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    return records[todayStr]?.tasks[taskId] || 0
  }

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    )
  }

  if (!isMounted) return null

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        events,
        setEvents,
        records,
        setRecords,
        diaries,
        setDiaries,
        activeTask,
        setActiveTask,
        activeEvent,
        setActiveEvent,
        activeMode,
        setActiveMode,
        isRunning,
        toggleTimer,
        time,
        setTime,
        pomodoroSession,
        FOCUS_TIME,
        BREAK_TIME,
        getTaskTotalToday,
        toggleTaskCompletion,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
