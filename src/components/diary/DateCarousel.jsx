'use client'
import { format, isAfter, isSameDay, startOfDay, subDays } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'

export default function DateCarousel({ selectedDate, onSelectDate }) {
  const dates = Array.from({ length: 7 }, (_, i) =>
    subDays(selectedDate, 3 - i),
  )
  const today = startOfDay(new Date())
  const isToday = isSameDay(selectedDate, new Date())

  return (
    <div className='w-full flex flex-col justify-center items-center py-2 mb-4 relative min-h-[140px]'>
      <div className='flex gap-4 items-center'>
        {dates.map((date, index) => {
          const isActive = date.getTime() === selectedDate.getTime()
          const isFuture = isAfter(startOfDay(date), today)

          return (
            <motion.div
              key={date.toISOString()}
              onClick={() => !isFuture && onSelectDate(date)}
              className={`flex flex-col items-center justify-center rounded-2xl transition-colors ${
                isFuture
                  ? 'w-16 h-20 bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50'
                  : isActive
                    ? 'w-20 h-24 bg-[#5b45c2] text-white shadow-md cursor-pointer'
                    : 'w-16 h-20 bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 cursor-pointer'
              }`}
              animate={{
                scale: isActive ? 1.05 : 1,
                opacity: isFuture ? 0.4 : isActive ? 1 : 0.7,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span
                className={`text-xs font-medium mb-1 ${
                  isFuture
                    ? 'text-gray-300'
                    : isActive
                      ? 'text-[#e5e1f1]'
                      : 'text-gray-400'
                }`}
              >
                {format(date, 'EEE')}
              </span>
              <span
                className={`text-xl font-mono font-semibold ${isFuture ? 'text-gray-300' : ''}`}
              >
                {format(date, 'dd')}
              </span>
            </motion.div>
          )
        })}
      </div>

      <div className='h-8 mt-4'>
        <AnimatePresence>
          {!isToday && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectDate(new Date())}
              className='flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-50 hover:text-black shadow-sm transition-colors'
            >
              <CalendarDays size={14} /> Back to Today
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
