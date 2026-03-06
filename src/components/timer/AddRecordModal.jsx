'use client'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAppContext } from '@/context/AppContext'

export default function AddRecordModal({ isOpen, onClose, selectedDate }) {
  const { tasks, records, setRecords } = useAppContext()

  // State untuk form manual record
  const [selectedTaskId, setSelectedTaskId] = useState(
    tasks.length > 0 ? tasks[0].id : null,
  )
  const [startTime, setStartTime] = useState('05:00')
  const [endTime, setEndTime] = useState('06:00')

  const activeTask = tasks.find((t) => t.id === selectedTaskId)

  const handleSave = () => {
    if (!selectedTaskId || !startTime || !endTime) return

    // Kalkulasi durasi dalam detik
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const durationSeconds = (eh * 60 + em - (sh * 60 + sm)) * 60

    if (durationSeconds <= 0) return // Validasi waktu

    const dateStr = format(selectedDate, 'yyyy-MM-dd')

    setRecords((prev) => {
      const todayRecord = prev[dateStr] || { total: 0, tasks: {}, sessions: [] }

      const newSession = {
        id: Date.now(),
        taskId: activeTask.id,
        title: activeTask.title,
        color: activeTask.color,
        startTime: startTime,
        endTime: endTime,
        duration: durationSeconds,
      }

      return {
        ...prev,
        [dateStr]: {
          total: todayRecord.total + durationSeconds,
          tasks: {
            ...todayRecord.tasks,
            [activeTask.id]:
              (todayRecord.tasks[activeTask.id] || 0) + durationSeconds,
          },
          sessions: [...(todayRecord.sessions || []), newSession],
        },
      }
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md p-0 overflow-hidden bg-[#1c1c1e] text-white rounded-3xl border-0 shadow-2xl'>
        <div className='bg-white text-gray-900 rounded-t-3xl p-8 pb-10'>
          <h3 className='text-sm font-semibold mb-4'>Select task</h3>

          {/* Mockup custom dropdown/selector */}
          <div className='flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 mb-8 cursor-pointer hover:bg-gray-50 transition-colors'>
            <div className='flex items-center gap-3'>
              <div
                className={`w-4 h-4 rounded-sm ${activeTask?.color || 'bg-gray-200'}`}
              ></div>
              <span className='font-medium'>
                {activeTask?.title || 'Choose a task'}
              </span>
            </div>
            <ChevronRight size={20} className='text-gray-400' />
          </div>

          <h3 className='text-sm font-semibold mb-4'>Manage time</h3>
          <div className='flex items-center gap-4 text-3xl font-mono'>
            <input
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className='flex-1 bg-transparent text-center border-b border-gray-200 pb-2 focus:outline-none focus:border-[#5b45c2]'
            />
            <span className='text-gray-300 font-sans pb-2'>~</span>
            <input
              type='time'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className='flex-1 bg-transparent text-center border-b border-gray-200 pb-2 focus:outline-none focus:border-[#5b45c2]'
            />
          </div>
        </div>

        {/* Action Buttons (Dark Mode Bottom) */}
        <div className='grid grid-cols-2 bg-[#1c1c1e]'>
          <button
            onClick={onClose}
            className='py-5 font-medium text-gray-400 hover:text-white transition-colors border-r border-gray-700/50'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='py-5 font-medium text-white hover:bg-[#2c2c2e] transition-colors rounded-br-3xl'
          >
            Add record
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
