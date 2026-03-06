'use client'
import { differenceInDays, format, startOfDay } from 'date-fns'
import { Check } from 'lucide-react'
import TimerSection from '@/components/timer/TimerSection'
import { useAppContext } from '@/context/AppContext'

export default function Home() {
  const { tasks, activeTask, setActiveTask, events, toggleTaskCompletion } =
    useAppContext()
  const today = startOfDay(new Date())

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = []
    acc[task.category].push(task)
    return acc
  }, {})

  const upcomingEvents = events
    .filter((e) => differenceInDays(startOfDay(new Date(e.date)), today) >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className='p-8 pt-0 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 h-full'>
      <div className='flex flex-col h-full'>
        <TimerSection />
      </div>

      <div className='flex flex-col gap-6 h-full min-h-0'>
        <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col flex-1 overflow-hidden min-h-[300px]'>
          <div className='flex-1 overflow-y-auto pr-2 space-y-6'>
            {Object.keys(groupedTasks).map((category) => (
              <div key={category}>
                <h3 className='font-semibold text-gray-900 mb-4'>{category}</h3>
                <div className='space-y-4'>
                  {groupedTasks[category].map((task) => {
                    const isActive = activeTask.id === task.id
                    const isCompleted = task.isCompleted

                    return (
                      <div
                        key={task.id}
                        className='flex items-start justify-between group'
                      >
                        <div className='flex gap-3 items-start'>
                          <div
                            className={`w-[3px] h-[22px] mt-1 ${task.color} rounded-full ${isCompleted ? 'opacity-40' : ''}`}
                          ></div>
                          <div>
                            <p
                              className={`text-[15px] font-medium mb-1 transition-all ${isCompleted ? 'line-through text-gray-400' : isActive ? 'text-gray-900' : 'text-gray-600'}`}
                            >
                              {task.title}
                            </p>
                            <p
                              className={`text-[10px] ${isCompleted ? 'text-gray-300' : 'text-gray-400'}`}
                            >
                              {task.startAt || '10:00'} -{' '}
                              {task.endAt || '12:00'}{' '}
                              <span className='ml-2 font-mono font-medium text-gray-900 opacity-50'>
                                0%
                              </span>
                            </p>
                            <p
                              className={`text-[10px] mt-0.5 ${isCompleted ? 'text-gray-300' : 'text-gray-400'}`}
                            >
                              {task.repeatEveryday
                                ? 'Everyday'
                                : task.repeatDays?.length
                                  ? task.repeatDays.join(', ')
                                  : 'Custom'}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-2 mt-1'>
                          <span className='text-[10px] text-[#5b45c2] bg-[#efedf8] px-2 py-1 rounded-full font-mono font-medium'>
                            0h 0m
                          </span>

                          <button
                            type='button'
                            aria-label='Toggle task completion'
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                              isCompleted
                                ? 'bg-[#5b45c2] border-[#5b45c2]'
                                : 'border-2 border-gray-200 hover:border-[#5b45c2]'
                            }`}
                          >
                            {isCompleted && (
                              <Check
                                size={12}
                                className='text-white'
                                strokeWidth={3}
                              />
                            )}
                          </button>

                          <button
                            type='button'
                            onClick={() => setActiveTask(task)}
                            className='bg-[#5b45c2] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#4a37a0] transition-colors'
                          >
                            Select task
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-50 h-[200px] flex flex-col shrink-0'>
          <h3 className='font-semibold mb-4 shrink-0'>Events</h3>
          <div className='flex-1 overflow-y-auto pr-2 space-y-3'>
            {upcomingEvents.length === 0 ? (
              <div className='w-full py-4 border border-gray-100 rounded-2xl text-sm text-gray-500 text-center font-medium'>
                No upcoming events
              </div>
            ) : (
              upcomingEvents.map((ev) => {
                const diff = differenceInDays(
                  startOfDay(new Date(ev.date)),
                  today,
                )
                const dDay = diff === 0 ? 'D-Day' : `D-${diff}`
                return (
                  <div
                    key={ev.id}
                    className='flex items-center justify-between border-b border-gray-50 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0'
                  >
                    <div>
                      <p className='text-sm font-medium text-gray-800'>
                        {ev.title}
                      </p>
                      <p className='text-[10px] text-gray-400 font-mono mt-0.5'>
                        {format(new Date(ev.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className='text-xs font-mono font-semibold text-[#5b45c2] bg-[#efedf8] px-2 py-1 rounded-md'>
                      {dDay}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
