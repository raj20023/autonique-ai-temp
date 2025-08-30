import React from 'react';
import { motion } from 'framer-motion';

interface ChartProps {
  data: any[];
  title: string;
  subtitle?: string;
  height?: number;
}

// Real-time metrics chart with animated lines
export const RealTimeMetricsChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-400 font-medium">Live</span>
      </div>
    </div>
    <div className="relative" style={{ height: `${height}px` }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Simple line chart simulation */}
        <motion.path
          d={`M 0,${height/2} Q ${data.length * 20},${height/3} ${data.length * 40},${height/2}`}
          stroke="url(#lineGradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Data points */}
        {data.slice(0, 5).map((_, index) => (
          <motion.circle
            key={index}
            cx={index * 80 + 40}
            cy={height/2 + Math.sin(index) * 50}
            r="4"
            fill="#3b82f6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2 }}
          />
        ))}
      </svg>
    </div>
  </motion.div>
);

// Advanced area chart with multiple metrics
export const MultiMetricAreaChart: React.FC<ChartProps> = ({ data, title, height = 400 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
  >
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <div className="relative" style={{ height: `${height}px` }}>
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="bg-blue-500/20 rounded-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">1,234</div>
            <div className="text-sm text-blue-300">Users</div>
          </div>
        </div>
        <div className="bg-green-500/20 rounded-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">$5,678</div>
            <div className="text-sm text-green-300">Revenue</div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Radial progress chart for KPIs
export const RadialKPIChart: React.FC<{ value: number; max: number; title: string; color: string }> =
  ({ value, max, title, color }) => {
    const percentage = (value / max) * 100;

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
      >
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <motion.path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${percentage}, 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          </div>
        </div>
        <h4 className="text-sm font-medium text-gray-300">{title}</h4>
        <p className="text-lg font-semibold text-white">{value.toLocaleString()}</p>
      </motion.div>
    );
  };

// Heatmap chart for user activity
export const ActivityHeatmap: React.FC<{ data: any[] }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
  >
    <h3 className="text-lg font-semibold text-white mb-4">User Activity Heatmap</h3>
    <div className="grid grid-cols-12 gap-1">
      {data.slice(0, 24).map((hour, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.02 }}
          className={`h-8 rounded ${
            hour.users > 30 ? 'bg-red-500' :
            hour.users > 20 ? 'bg-orange-400' :
            hour.users > 10 ? 'bg-yellow-400' :
            'bg-green-400'
          }`}
          title={`${hour.hour}:00 - ${hour.users} users`}
        />
      ))}
    </div>
    <div className="flex justify-between text-xs text-gray-400 mt-2">
      <span>00:00</span>
      <span>12:00</span>
      <span>23:00</span>
    </div>
  </motion.div>
);

// 3D-style revenue chart
export const Revenue3DChart: React.FC<ChartProps> = ({ data, title, height = 350 }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: -10 }}
    animate={{ opacity: 1, rotateY: 0 }}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    style={{ perspective: '1000px' }}
  >
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <div className="relative" style={{ height: `${height}px` }}>
      <div className="grid grid-cols-6 gap-2 h-full items-end">
        {data.slice(0, 6).map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${Math.random() * 80 + 20}%` }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="bg-gradient-to-t from-green-400 to-blue-500 rounded-t-lg"
            title={`${item.month}: $${item.projected}`}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// Animated donut chart for user distribution
export const UserDistributionDonut: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    >
      <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
            const offset = data.slice(0, index).reduce((sum, d) => sum + (d.value / data.reduce((total, dt) => total + dt.value, 0)) * 100, 0);

            return (
              <motion.circle
                key={index}
                cx="50"
                cy="50"
                r="15.915"
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth="8"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${percentage} ${100 - percentage}` }}
                transition={{ delay: index * 0.2, duration: 1 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {data.reduce((sum, d) => sum + d.value, 0)}
            </div>
            <div className="text-sm text-gray-300">Total Users</div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-300">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
