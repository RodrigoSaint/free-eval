import { useEffect, useRef } from "preact/hooks";

declare global {
  interface Window {
    Chart: any;
  }
}

interface ChartDataPoint {
  version: number;
  score: number;
  date: string;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
}

export default function SimpleChart({ data }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0 || !window.Chart) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: data.map(point => `v${point.version}`),
      datasets: [{
        label: "Score Progress",
        data: data.map(point => Math.round(point.score)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#3b82f6',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          },
          grid: {
            color: '#f0f0f0',
          }
        },
        x: {
          grid: {
            color: '#f0f0f0',
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `Score: ${context.parsed.y}%`;
            }
          }
        }
      }
    };

    chartRef.current = new window.Chart(ctx, {
      type: 'line',
      data: chartData,
      options: options
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          <p className="text-sm">No history data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="w-full h-48">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}