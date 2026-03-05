// src/components/statistics/Charts.jsx
"use client";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { Calendar } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { format, subDays, startOfDay } from "date-fns";

export default function Charts() {
  const { records } = useAppContext();
  const today = startOfDay(new Date());
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  let cumulativeTotalHours = 0;
  let maxDurationSeconds = 0;
  let totalAllTimeSeconds = 0;
  let activeDaysCount = 0;

  const chartData = last7Days.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayRecord = records[dateStr] || { total: 0 };

    const daySeconds = dayRecord.total;
    const dayHours = Number((daySeconds / 3600).toFixed(2)); // Konversi ke jam desimal untuk chart

    cumulativeTotalHours += dayHours;
    totalAllTimeSeconds += daySeconds;

    if (daySeconds > 0) {
      activeDaysCount++;
      if (daySeconds > maxDurationSeconds) {
        maxDurationSeconds = daySeconds;
      }
    }

    return {
      dateLabel: format(date, "M.dd"), // "3.02"
      duration: dayHours,
      totalDuration: Number(cumulativeTotalHours.toFixed(2)),
    };
  });

  const formatTimeText = (totalSeconds) => {
    if (!totalSeconds) return "0h 0m";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const avgSeconds =
    activeDaysCount > 0 ? Math.floor(totalAllTimeSeconds / activeDaysCount) : 0;
  const dateRangeStr = `${format(last7Days[0], "yy.MM.dd")} - ${format(last7Days[6], "yy.MM.dd")}`;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold font-sans text-gray-900 mb-4">
              Duration
            </h3>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Total</p>
                <p className="font-mono font-medium text-gray-900">
                  {formatTimeText(totalAllTimeSeconds)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Avg</p>
                <p className="font-mono font-medium text-gray-900">
                  {formatTimeText(avgSeconds)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Max</p>
                <p className="font-mono font-medium text-gray-900">
                  {formatTimeText(maxDurationSeconds)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <Calendar size={14} /> {dateRangeStr}
          </div>
        </div>

        <div className="flex-1 w-full min-h-[160px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="dateLabel"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#9ca3af",
                  fontFamily: "monospace",
                }}
                dy={10}
              />
              <RechartsTooltip
                cursor={{ fill: "#f8f9fa" }}
                formatter={(value) => [`${value} hrs`, "Duration"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="duration"
                fill="#dcedc8"
                radius={[4, 4, 4, 4]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold font-sans text-gray-900">
            Total duration
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <Calendar size={14} /> {dateRangeStr}
          </div>
        </div>

        <div className="flex-1 w-full min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dcedc8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f4fbf0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="dateLabel"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#9ca3af",
                  fontFamily: "monospace",
                }}
                dy={10}
              />
              <RechartsTooltip
                formatter={(value) => [`${value} hrs`, "Total"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="totalDuration"
                stroke="#aed581"
                strokeWidth={3}
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
