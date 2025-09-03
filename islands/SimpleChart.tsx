import { useEffect, useRef } from "preact/hooks";

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

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Find min/max values
    const maxScore = 1; // Always 100%
    const minScore = 0; // Always 0%
    const minVersion = Math.min(...data.map(d => d.version));
    const maxVersion = Math.max(...data.map(d => d.version));

    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (scores)
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines (versions)
    if (data.length > 1) {
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
      }
    }

    // Draw area fill
    if (data.length > 1) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      
      // Start from bottom-left
      const startX = padding;
      const startY = padding + chartHeight;
      ctx.moveTo(startX, startY);
      
      // Draw to first point
      const firstX = padding;
      const firstY = padding + chartHeight - (data[0].score * chartHeight);
      ctx.lineTo(firstX, firstY);
      
      // Draw curve through points
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (point.score * chartHeight);
        ctx.lineTo(x, y);
      });
      
      // Close the area back to bottom
      const lastX = padding + chartWidth;
      const lastY = padding + chartHeight;
      ctx.lineTo(lastX, lastY);
      ctx.lineTo(startX, startY);
      ctx.fill();
    }

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (point.score * chartHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#3b82f6';
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (point.score * chartHeight);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    
    // X-axis labels (versions)
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = rect.height - 10;
      ctx.fillText(`v${point.version}`, x, y);
    });
    
    // Y-axis labels (percentages)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i + 4;
      const percentage = Math.round((1 - i / 4) * 100);
      ctx.fillText(`${percentage}%`, padding - 10, y);
    }

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
      <canvas
        ref={canvasRef}
        className="w-full h-48"
        style={{ display: 'block' }}
      />
    </div>
  );
}