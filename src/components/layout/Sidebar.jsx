"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Calendar, BarChart2, Users, BookOpen, Heart, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside className="w-64 h-screen bg-[#f8f9fa] flex flex-col justify-between border-r border-gray-100 p-4 shrink-0">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8 mt-2">
          <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center font-bold text-xs">
            _
          </div>
          <h1 className="font-semibold text-lg font-sans">Oaky</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive("/") ? "bg-[#efedf8] text-[#5b45c2]" : "text-gray-600 hover:bg-gray-100"}`}>
            <Clock size={18} /> Timer
          </Link>
          <Link href="/plans-and-record" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive("/plans") ? "bg-[#efedf8] text-[#5b45c2]" : "text-gray-600 hover:bg-gray-100"}`}>
            <Calendar size={18} /> Plans and Records
          </Link>
          <Link href="/statistic" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive("/statistic") ? "bg-[#efedf8] text-[#5b45c2]" : "text-gray-600 hover:bg-gray-100"}`}>
            <BarChart2 size={18} /> Statistics
          </Link>
          <Link href="/diary" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive("/diary") ? "bg-[#efedf8] text-[#5b45c2]" : "text-gray-600 hover:bg-gray-100"}`}>
            <BookOpen size={18} /> 3-Line Diary
          </Link>
        </nav>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-orange-200 rounded-full flex-shrink-0"></div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Keyla Na</p>
            <p className="text-xs text-gray-500">student</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 w-full py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50">
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  );
}