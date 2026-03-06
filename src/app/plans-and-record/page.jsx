// src/app/plans/page.jsx
'use client'
import { format, startOfDay, subDays } from 'date-fns'
import {
  AlignRight,
  ChevronLeft,
  Eraser,
  MoreVertical,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import AddRecordModal from '@/components/timer/AddRecordModal'
import { useAppContext } from '@/context/AppContext'

export default function PlansPage() {
  const { tasks, records } = useAppContext()

  // State
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

  // Navigasi
  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1))

  // Helper Total Waktu
  const formatTotalTime = (seconds) => {
    if (!seconds) return '0h 00m'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m.toString().padStart(2, '0')}m`
  }

  // --- FILTER & GROUP TASKS ---
  // Sesuai UI baru, kita kelompokkan jadi "Today" dan "Upcoming" (dummy filter based on repeatEveryday)
  const todayTasks = tasks.filter((t) => t.repeatEveryday)
  const upcomingTasks = tasks.filter((t) => !t.repeatEveryday)

  const groupByCategory = (taskList) => {
    return taskList.reduce((acc, task) => {
      if (!acc[task.category]) acc[task.category] = []
      acc[task.category].push(task)
      return acc
    }, {})
  }

  const groupedToday = groupByCategory(todayTasks)
  const groupedUpcoming = groupByCategory(upcomingTasks)

  const activeTasks = tasks

  // --- KALKULASI HEADER (PLAN & RECORD) ---
  let totalPlanMinutes = 0
  tasks.forEach((task) => {
    if (task.startAt && task.endAt) {
      const [sh, sm] = task.startAt.split(':').map(Number)
      const [eh, em] = task.endAt.split(':').map(Number)
      totalPlanMinutes += eh * 60 + em - (sh * 60 + sm)
    }
  })
  const planHours = Math.floor(totalPlanMinutes / 60)
  const planMins = totalPlanMinutes % 60

  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dailyRecord = records[dateStr] || { total: 0, sessions: [], tasks: {} }
  const totalRecordSeconds = dailyRecord.total
  const recordHours = Math.floor(totalRecordSeconds / 3600)
  const recordMins = Math.floor((totalRecordSeconds % 3600) / 60)

  // --- GRID HELPER ---
  const hoursGrid = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 5
    const label =
      hour > 12
        ? (hour - 12).toString().padStart(2, '0')
        : hour.toString().padStart(2, '0')
    return { hour, label, isPM: hour >= 12 }
  })

  const getTopOffset = (timeStr) => {
    if (!timeStr) return 0
    const [h, m] = timeStr.split(':').map(Number)
    const totalMins = h * 60 + m
    const startMins = 5 * 60
    return ((totalMins - startMins) / 60) * 60
  }

  const getBlockStyle = (colorClass) => {
    const colorMap = {
      'bg-purple-600': { bg: '#f3e8ff', border: '#d8b4fe', solid: '#c4b5fd' },
      'bg-pink-500': { bg: '#fce7f3', border: '#f9a8d4', solid: '#f472b6' },
      'bg-red-500': { bg: '#fee2e2', border: '#fca5a5', solid: '#f87171' },
      'bg-orange-500': { bg: '#ffedd5', border: '#fdba74', solid: '#fb923c' },
      'bg-yellow-400': { bg: '#fef9c3', border: '#fde047', solid: '#facc15' },
      'bg-lime-400': { bg: '#ecfccb', border: '#d9f99d', solid: '#a3e635' },
      'bg-green-400': { bg: '#dcfce7', border: '#bef264', solid: '#4ade80' },
      'bg-[#5b45c2]': { bg: '#efedf8', border: '#c4b8f3', solid: '#c4b8f3' }, // Diubah agar record bg sama dgn border
    }
    return (
      colorMap[colorClass] || {
        bg: '#f3f4f6',
        border: '#e5e7eb',
        solid: '#9ca3af',
      }
    )
  }

  // Render List Helper
  const renderTaskList = (groupedData) =>
    Object.keys(groupedData).map((category) => (
      <div key={category} className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold text-[17px] text-gray-900'>
            {category}
          </h3>
          <span className='text-[#5b45c2] text-xs font-mono font-medium'>
            0h 00m
          </span>
        </div>

        <div className='space-y-6'>
          {groupedData[category].map((task) => {
            const isCompleted = task.isCompleted
            const taskRecordSecs = dailyRecord.tasks[task.id] || 0

            return (
              <div
                key={task.id}
                className='flex items-start justify-between group'
              >
                <div className='flex gap-4 items-start'>
                  <div
                    className={`w-[4px] h-[26px] mt-1 ${task.color} rounded-full ${isCompleted ? 'opacity-40' : ''}`}
                  ></div>
                  <div>
                    <p
                      className={`text-[16px] font-medium mb-1.5 transition-all ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}
                    >
                      {task.title}
                    </p>
                    <p
                      className={`text-[12px] ${isCompleted ? 'text-gray-300' : 'text-gray-400'}`}
                    >
                      {task.startAt || '20:00'} - {task.endAt || '22:00'}
                    </p>
                    <p
                      className={`text-[12px] mt-0.5 ${isCompleted ? 'text-gray-300' : 'text-gray-400'}`}
                    >
                      {task.repeatEveryday
                        ? 'Everyday'
                        : task.repeatDays?.length
                          ? task.repeatDays.join(', ')
                          : 'Custom'}
                    </p>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-2 mt-1'>
                  <div className='flex items-center gap-3 text-xs text-gray-500 font-mono'>
                    <span className='uppercase font-sans font-medium text-[10px] tracking-wider'>
                      Total :
                    </span>
                    <span className='text-gray-900 font-medium'>
                      {formatTotalTime(taskRecordSecs)}
                    </span>
                    <MoreVertical
                      size={16}
                      className='text-gray-400 cursor-pointer'
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ))

  return (
    <div className='p-8 pt-0 grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-8 h-full'>
      {/* PANEL KIRI: TO-DO LIST (UI BARU) */}
      <div className='bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col h-full min-h-[500px]'>
        {/* Header: Title & Navigation */}
        <div className='flex items-center justify-between mb-8 relative'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={handlePrevDay}
              className='p-1 hover:bg-gray-100 rounded-md transition-colors'
            >
              <ChevronLeft
                size={24}
                strokeWidth={2}
                className='text-gray-800'
              />
            </button>
            <h2 className='font-semibold text-2xl tracking-wide text-gray-900 font-sans'>
              To-do list
            </h2>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className='flex justify-end gap-3 mb-8'>
          <button
            type='button'
            onClick={() => setIsRecordModalOpen(true)}
            className='flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700'
          >
            To-do list <Plus size={16} />
          </button>
          <button
            type='button'
            className='flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700'
          >
            Category <AlignRight size={16} />
          </button>
        </div>

        {/* Tasks List Container */}
        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
          {/* Section: Today */}
          <div className='bg-gray-100/70 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg mb-6'>
            Today
          </div>
          {renderTaskList(groupedToday)}

          {/* Section: Upcoming */}
          <div className='bg-gray-100/70 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg mb-6 mt-8'>
            Upcoming
          </div>
          {renderTaskList(groupedUpcoming)}
        </div>
      </div>

      {/* PANEL KANAN: CALENDAR TIMELINE VIEW */}
      <div className='bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col h-full overflow-hidden relative'>
        <button
          type='button'
          className='absolute top-8 right-8 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border border-gray-200 transition-colors z-10 bg-white shadow-sm'
        >
          <Eraser size={18} />
        </button>

        <div className='flex w-full pt-4 pb-8 border-b border-gray-100 relative'>
          <div className='flex-1 flex flex-col items-center justify-center'>
            <span className='text-[11px] text-gray-400 font-medium tracking-widest mb-1 uppercase'>
              Plan
            </span>
            <span className='text-3xl font-mono text-gray-900'>
              {planHours}h {planMins.toString().padStart(2, '0')}m
            </span>
          </div>
          <div className='w-px h-full bg-gray-100 absolute left-1/2 top-0 bottom-0'></div>
          <div className='flex-1 flex flex-col items-center justify-center'>
            <span className='text-[11px] text-gray-400 font-medium tracking-widest mb-1 uppercase'>
              Record
            </span>
            <span className='text-3xl font-mono text-gray-900'>
              {recordHours}h {recordMins.toString().padStart(2, '0')}m
            </span>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto custom-scrollbar relative mt-6 pr-4'>
          <div className='relative w-full h-[720px]'>
            {/* GRID LINES */}
            {hoursGrid.map((grid, index) => (
              <div
                key={grid.hour}
                className='absolute w-full flex items-start'
                style={{ top: `${index * 60}px` }}
              >
                <div className='w-12 flex items-center justify-between pr-4 relative -top-3'>
                  {grid.isPM && grid.hour === 12 && (
                    <span className='text-[10px] text-gray-400 font-medium absolute -left-6'>
                      PM
                    </span>
                  )}
                  {!grid.isPM && grid.hour === 12 && (
                    <span className='text-[10px] text-gray-400 font-medium absolute -left-6'>
                      AM
                    </span>
                  )}
                  <span className='text-xs text-gray-400 font-mono w-full text-right'>
                    {grid.label}
                  </span>
                </div>
                <div className='flex-1 border-t-[1.5px] border-dotted border-gray-200 ml-2 relative'>
                  <div className='absolute left-1/2 w-px h-[60px] bg-gray-100 -top-[2px]'></div>
                </div>
              </div>
            ))}

            {/* BLOCK PLAN (KIRI) */}
            <div className='absolute left-[70px] w-[calc(50%-40px)] top-0 bottom-0 pointer-events-none'>
              {activeTasks.map((task) => {
                if (!task.startAt || !task.endAt) return null
                const top = getTopOffset(task.startAt)
                const height = getTopOffset(task.endAt) - top
                const colors = getBlockStyle(task.color)

                if (top < 0 || top > 720) return null

                return (
                  <div
                    key={`plan-${task.id}`}
                    className='absolute rounded-[10px] p-3 overflow-hidden flex items-start z-10'
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      width: '100%',
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      borderWidth: '1px',
                    }}
                  >
                    <span className='text-[13px] font-medium text-gray-600 leading-tight'>
                      {task.title}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* BLOCK RECORD (KANAN) - Solid Fill */}
            <div className='absolute left-[calc(50%+24px)] w-[calc(50%-40px)] top-0 bottom-0 pointer-events-none'>
              {dailyRecord.sessions?.map((session) => {
                if (!session.startTime || !session.endTime) return null
                const top = getTopOffset(session.startTime)
                const height = getTopOffset(session.endTime) - top
                const colors = getBlockStyle(session.color)

                if (top < 0 || top > 720) return null

                return (
                  <div
                    key={`rec-${session.id}`}
                    className='absolute rounded-[10px] p-3 overflow-hidden flex items-start shadow-sm z-10'
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      width: '100%',
                      backgroundColor: colors.solid,
                      border: 'none',
                    }}
                  >
                    <span className='text-[13px] font-medium text-gray-900 leading-tight mix-blend-color-burn'>
                      {session.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <AddRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  )
}
