// src/components/statistics/YearlyHeatmap.jsx
"use client";
import { useState } from "react";
import { Download, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { subDays, addDays, startOfWeek, format, isAfter, startOfDay } from "date-fns";

export default function YearlyHeatmap() {
  const { records } = useAppContext();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  let totalSecondsSelectedYear = 0;
  Object.keys(records).forEach(dateStr => {
    if (dateStr.startsWith(selectedYear.toString())) {
      totalSecondsSelectedYear += (records[dateStr].total || 0);
    }
  });
  
  const totalHours = Math.floor(totalSecondsSelectedYear / 3600);
  const totalMinutes = Math.floor((totalSecondsSelectedYear % 3600) / 60);

  const getColor = (totalSecs) => {
    if (!totalSecs || totalSecs === 0) return "bg-[#f5f5f5]";
    const hours = totalSecs / 3600;
    
    if (hours > 0 && hours <= 2) return "bg-[#dcedc8]";
    if (hours > 2 && hours <= 6) return "bg-[#aed581]";
    if (hours > 6 && hours <= 10) return "bg-[#7cb342]";
    return "bg-[#33691e]"; 
  };

  const today = startOfDay(new Date());
  const anchorDate = selectedYear === currentYear ? today : new Date(selectedYear, 11, 31);
  const anchorWeekStart = startOfWeek(anchorDate, { weekStartsOn: 0 }); 

  let lastMonth = -1;

  const weeks = Array.from({ length: 13 }, (_, weekIndex) => {
    const weekStartDate = subDays(anchorWeekStart, weekIndex * 7);
    
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      const dateToEvaluate = addDays(weekStartDate, dayIndex);
      const dateStr = format(dateToEvaluate, "yyyy-MM-dd");
      
      const isFuture = isAfter(startOfDay(dateToEvaluate), today);
      const isOutsideSelectedYear = dateToEvaluate.getFullYear() > selectedYear;
      
      if (isFuture || isOutsideSelectedYear) {
        return "bg-transparent"; 
      }

      const dayRecord = records[dateStr] || { total: 0 };
      return getColor(dayRecord.total);
    });

    const monthOfThisWeek = weekStartDate.getMonth();
    let monthLabel = "";
    if (monthOfThisWeek !== lastMonth) {
      monthLabel = format(weekStartDate, "MMM");
      lastMonth = monthOfThisWeek;
    }

    return { monthLabel, days };
  });

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col h-full items-center">
      
      <div className="flex items-end gap-6 mb-6">
        {[currentYear - 1, currentYear].map((year) => (
          <span 
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`font-sans cursor-pointer transition-all ${
              selectedYear === year 
                ? "text-4xl text-gray-900 font-medium" 
                : "text-2xl text-gray-300 hover:text-gray-400"
            }`}
          >
            {year}
          </span>
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-[10px] font-semibold text-gray-500 tracking-widest mb-1 uppercase">Total</p>
        <p className="text-2xl font-mono text-gray-900">{totalHours}h {totalMinutes}m</p>
      </div>

      <div className="flex justify-between w-full max-w-[280px] mb-4 items-end">
        <div className="flex gap-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
            <Download size={16} strokeWidth={2} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
            <Clock size={16} strokeWidth={2} />
          </button>
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-1">
            <div className="w-[14px] h-[14px] rounded-[3px] bg-[#dcedc8]"></div>
            <div className="w-[14px] h-[14px] rounded-[3px] bg-[#aed581]"></div>
            <div className="w-[14px] h-[14px] rounded-[3px] bg-[#7cb342]"></div>
            <div className="w-[14px] h-[14px] rounded-[3px] bg-[#33691e]"></div>
          </div>
          <div className="text-[9px] font-mono text-gray-400 flex gap-[3px]">
            <span>0~2</span>
            <span>2~6</span>
            <span>6~10</span>
            <span>10+</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[280px]">
        <div className="pl-10 mb-2">
           <div className="grid grid-cols-7 gap-1 text-[10px] font-sans text-gray-400 text-center">
            <span className="text-red-400">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-blue-400">Sat</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex items-center gap-2">
              <div className="w-8 text-[10px] font-sans text-gray-500 text-right font-medium">
                {week.monthLabel}
              </div>
              <div className="flex-1 grid grid-cols-7 gap-1">
                {week.days.map((colorClass, dIdx) => (
                  <div 
                    key={dIdx} 
                    className={`w-full aspect-square rounded-[3px] ${colorClass}`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}