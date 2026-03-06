// src/app/diary/page.jsx
'use client'
import { useState } from 'react'
import DateCarousel from '@/components/diary/DateCarousel'
import DiaryEditor from '@/components/diary/DiaryEditor'
import DiaryHistory from '@/components/diary/DiaryHistory'

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className='p-8 max-w-7xl mx-auto w-full h-[calc(100vh-5rem)] flex flex-col'>
      <DateCarousel
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0'>
        <div className='h-full'>
          <DiaryEditor date={selectedDate} />
        </div>

        <div className='h-full'>
          <DiaryHistory onSelectDate={setSelectedDate} />
        </div>
      </div>
    </div>
  )
}
