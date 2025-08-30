import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, ComposedChart, ScatterChart, Scatter
} from 'recharts';

interface ChartProps {
  data: any[];
  title: string;
  subtitle?: string;
  height?: number;
}

// Gradient definitions for charts
const gradients = (
  <defs>
    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
    </linearGradient>
    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
    </linearGradient>
    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#667eea" />
      <stop offset="100%" stopColor="#764ba2" />
    </linearGradient>
  </defs>
);

// Real-time metrics chart with animated lines
export const RealTimeMetricsChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-600 font-medium">Live</span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {gradients}
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="time" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: 'none', 
            borderRadius: '8px',
            color: 'white'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#667eea" 
          strokeWidth={3}
          dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#667eea', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </motion.div>
);

// Advanced area chart with multiple metrics
export const MultiMetricAreaChart: React.FC<ChartProps> = ({ data, title, height = 400 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        {gradients}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
        <XAxis dataKey="name" stroke="#4f46e5" fontSize={12} />
        <YAxis stroke="#4f46e5" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid #e0e7ff', 
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="users" 
          stackId="1" 
          stroke="#8884d8" 
          fill="url(#colorUsers)" 
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stackId="1" 
          stroke="#82ca9d" 
          fill="url(#colorRevenue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
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
        className="bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
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
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          </div>
        </div>
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <p className="text-lg font-semibold text-gray-900">{value.toLocaleString()}</p>
      </motion.div>
    );
  };

// Heatmap chart for user activity
export const ActivityHeatmap: React.FC<{ data: any[] }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white rounded-xl shadow-lg p-6"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Heatmap</h3>
    <div className="grid grid-cols-24 gap-1">
      {data.map((hour, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.02 }}
          className={`h-8 rounded ${
            hour.users > 30 ? 'bg-red-500' :
            hour.users > 20 ? 'bg-orange-400' :
            hour.users > 10 ? 'bg-yellow-400' :
            'bg-green-300'
          }`}
          title={`${hour.hour}:00 - ${hour.users} users`}
        />
      ))}
    </div>
    <div className="flex justify-between text-xs text-gray-500 mt-2">
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
    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg p-6"
    style={{ perspective: '1000px' }}
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        {gradients}
        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
        <XAxis dataKey="month" stroke="#059669" fontSize={12} />
        <YAxis stroke="#059669" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid #10b981', 
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }} 
        />
        <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
        <Line 
          type="monotone" 
          dataKey="projected" 
          stroke="#f59e0b" 
          strokeWidth={3}
          strokeDasharray="5 5"
        />
      </ComposedChart>
    </ResponsiveContainer>
  </motion.div>
);

// Animated donut chart for user distribution
export const UserDistributionDonut: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '8px',
              color: 'white'
            }} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
