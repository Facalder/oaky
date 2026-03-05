import YearlyHeatmap from "@/components/statistics/YearlyHeatmap";
import Charts from "@/components/statistics/Charts";

export default function StatisticsPage() {
  return (
    <div className="p-8 max-w-7xl mt-4 mx-auto w-full h-[calc(100vh-5rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 h-full min-h-[600px]">
        
        <div className="h-full">
          <YearlyHeatmap />
        </div>

        <div className="h-full">
          <Charts />
        </div>

      </div>
    </div>
  );
}