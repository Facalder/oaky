"use client";
import { Download, Clock } from "lucide-react";

export default function YearlyHeatmap() {
  // Generate baris per minggu secara vertikal (terbaru di atas, terlama di bawah)
  // Total 13 minggu untuk mereplikasi proporsi di gambar (Maret -> Januari)
  const weeks = Array.from({ length: 13 }, (_, weekIndex) => {
    // Tentukan posisi label bulan di sisi kiri
    let monthLabel = "";
    if (weekIndex === 0) monthLabel = "Mar"; // Minggu pertama (Paling atas)
    if (weekIndex === 5) monthLabel = "Feb"; // Pertengahan
    if (weekIndex === 10) monthLabel = "Jan"; // Paling bawah

    // Generate 7 kotak (hari) untuk baris minggu ini
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      // Mock data hijau-hijau tipis untuk visual
      const id = weekIndex * 7 + dayIndex;
      if (id === 3 || id === 18 || id === 42) return "bg-[#dcedc8]";
      if (id === 12 || id === 25) return "bg-[#aed581]";
      if (id === 30) return "bg-[#7cb342]";
      return "bg-[#f5f5f5]";
    });

    return { monthLabel, days };
  });

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col h-full items-center">
      
      {/* Header Tahun */}
      <div className="flex items-end gap-6 mb-6">
        <span className="text-2xl font-sans text-gray-300 cursor-pointer">2025</span>
        <span className="text-4xl font-sans text-gray-900 font-medium cursor-pointer">2026</span>
      </div>

      {/* Teks TOTAL */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-semibold text-gray-500 tracking-widest mb-1 uppercase">Total</p>
        <p className="text-2xl font-mono text-gray-900">0h 00m</p>
      </div>

      {/* Toolbar & Legend */}
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

      {/* Wrapper Utama Grid & Header Hari */}
      <div className="w-full max-w-[280px]">
        
        {/* Header Hari (Sun - Sat) */}
        {/* pl-8 digunakan untuk memberi ruang kosong di kiri tempat label bulan berada */}
        <div className="pl-8 mb-2">
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

        {/* Heatmap Vertikal */}
        <div className="flex flex-col gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex items-center gap-2">
              {/* Y-Axis: Label Bulan di kiri */}
              <div className="w-6 text-[10px] font-sans text-gray-600 text-right">
                {week.monthLabel}
              </div>
              
              {/* X-Axis: 7 Hari dalam Seminggu */}
              <div className="flex-1 grid grid-cols-7 gap-1">
                {week.days.map((color, dIdx) => (
                  <div 
                    key={dIdx} 
                    className={`w-full aspect-square rounded-[3px] ${color}`}
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