"use client";
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Calendar } from "lucide-react";

const data = [
  { date: "2.18", duration: 0.5, total: 0.5 },
  { date: "19", duration: 1.2, total: 1.7 },
  { date: "20", duration: 0.8, total: 2.5 },
  { date: "21", duration: 2.0, total: 4.5 },
  { date: "22", duration: 0, total: 4.5 },
  { date: "23", duration: 1.0, total: 5.5 },
  { date: "24", duration: 0.3, total: 5.8 },
];

export default function Charts() {
  return (
    <div className="flex flex-col gap-6 h-full">
      



      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold font-sans text-gray-900 mb-4">Duration</h3>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Total</p>
                <p className="font-mono font-medium text-gray-900">5h 46m</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Avg</p>
                <p className="font-mono font-medium text-gray-900">0h 49m</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Max</p>
                <p className="font-mono font-medium text-gray-900">1h 27m</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <Calendar size={14} /> 26.02.24 - 26.03.02
          </div>
        </div>

        <div className="flex-1 w-full min-h-[160px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#d1d5db', fontFamily: 'monospace' }} 
                dy={10}
              />
              <RechartsTooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="duration" 
                fill="#dcedc8" 
                radius={[4, 4, 4, 4]} 
                barSize={8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>




      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold font-sans text-gray-900">Total duration</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <Calendar size={14} /> 26.02.24 - 26.03.02
          </div>
        </div>

        <div className="flex-1 w-full min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dcedc8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#dcedc8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#d1d5db', fontFamily: 'monospace' }}
                dy={10}
              />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#aed581" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}