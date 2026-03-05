import { Settings, Bell } from "lucide-react";

const Navbar = () => {
    return (
         <header className="h-20 flex justify-end items-center px-8 gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#5b45c2] border border-[#e5e1f1] rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-[#5b45c2]">✨</span> Add plans with AI
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full bg-white shadow-sm transition-colors">
            <Settings size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full bg-white shadow-sm transition-colors">
            <Bell size={20} />
          </button>
        </header>
    )
}

export default Navbar;