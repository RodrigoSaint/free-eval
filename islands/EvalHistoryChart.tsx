/** @jsxImportSource react */
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  version: number;
  score: number;
  date: string;
}

interface EvalHistoryChartProps {
  data: ChartDataPoint[];
}

export default function EvalHistoryChart({ data }: EvalHistoryChartProps) {
  if (!data || data.length === 0) {
    return React.createElement('div', {
      className: "bg-white border border-gray-200 rounded-lg p-8 text-center"
    }, React.createElement('div', {
      className: "text-gray-400"
    }, [
      React.createElement('svg', {
        key: 'icon',
        className: "w-12 h-12 mx-auto mb-3",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, [
        React.createElement('path', { key: 'path1', d: "M3 3v18h18" }),
        React.createElement('path', { key: 'path2', d: "m19 9-5 5-4-4-3 3" })
      ]),
      React.createElement('p', {
        key: 'text',
        className: "text-sm"
      }, "No history data available")
    ]));
  }

  const formatTooltipValue = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatTooltipLabel = (label: number) => {
    const dataPoint = data.find(d => d.version === label);
    if (dataPoint) {
      return `v${label} - ${new Date(dataPoint.date).toLocaleDateString()}`;
    }
    return `v${label}`;
  };

  return React.createElement('div', {
    className: "bg-white border border-gray-200 rounded-lg p-6"
  }, React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 200
  }, React.createElement(AreaChart, {
    data: data,
    margin: {
      top: 10,
      right: 30,
      left: 0,
      bottom: 0,
    }
  }, [
    React.createElement(CartesianGrid, {
      key: 'grid',
      strokeDasharray: "3 3",
      stroke: "#f0f0f0"
    }),
    React.createElement(XAxis, {
      key: 'xaxis',
      dataKey: "version",
      axisLine: false,
      tickLine: false,
      tick: { fontSize: 12, fill: '#6b7280' },
      tickFormatter: (value: number) => `v${value}`
    }),
    React.createElement(YAxis, {
      key: 'yaxis',
      axisLine: false,
      tickLine: false,
      tick: { fontSize: 12, fill: '#6b7280' },
      tickFormatter: (value: number) => `${(value * 100).toFixed(0)}%`,
      domain: [0, 1]
    }),
    React.createElement(Tooltip, {
      key: 'tooltip',
      formatter: [formatTooltipValue, 'Score'] as any,
      labelFormatter: formatTooltipLabel,
      contentStyle: {
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      }
    }),
    React.createElement(Area, {
      key: 'area',
      type: "monotone",
      dataKey: "score",
      stroke: "#3b82f6",
      fill: "#3b82f6",
      fillOpacity: 0.3,
      strokeWidth: 2
    })
  ])));
}