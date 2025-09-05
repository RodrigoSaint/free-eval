import { useEffect, useRef } from "preact/hooks";

declare global {
  interface Window {
    Chart: any;
  }
}

import { ChartDataPoint, ScoreProgressPoint } from '../core/eval.ts';

interface TimeChartProps {
  data: ChartDataPoint[] | ScoreProgressPoint[];
}

export default function TimeChart({ data }: TimeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0 || !window.Chart) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: data.map(point => `v${point.version}`),
      datasets: [{
        label: "Duration Progress",
        data: data.map(point => point.duration),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#f59e0b',
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
          ticks: {
            callback: function(value: any) {
              return value + 'ms';
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
              return `Duration: ${context.parsed.y}ms`;
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
          <p className="text-sm">No duration data available</p>
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