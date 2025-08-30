import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Server, Cpu, HardDrive, Wifi, Shield, Zap, Activity,
  AlertCircle, CheckCircle, Clock, TrendingUp, Database
} from 'lucide-react';
import { PerformanceData, SecurityData } from '../../services/analytics';

interface SystemMonitorProps {
  performanceData: PerformanceData;
  securityData: SecurityData;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ performanceData, securityData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getHealthStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return { status: 'excellent', color: 'green', icon: CheckCircle };
    if (value >= thresholds.warning) return { status: 'good', color: 'yellow', icon: AlertCircle };
    return { status: 'critical', color: 'red', icon: AlertCircle };
  };

  const getSecurityLevel = (level: string) => {
    const levels = {
      low: { color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
      medium: { color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
      high: { color: 'orange', bg: 'bg-orange-100', text: 'text-orange-800' },
      critical: { color: 'red', bg: 'bg-red-100', text: 'text-red-800' }
    };
    return levels[level as keyof typeof levels] || levels.low;
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    icon: React.ElementType;
    thresholds: { good: number; warning: number };
    format?: (val: number) => string;
  }> = ({ title, value, unit, icon: Icon, thresholds, format }) => {
    const health = getHealthStatus(value, thresholds);
    const StatusIcon = health.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${health.color}-100`}>
              <Icon className={`h-6 w-6 text-${health.color}-600`} />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <StatusIcon className={`h-5 w-5 text-${health.color}-500`} />
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {format ? format(value) : value.toFixed(1)}
            <span className="text-lg text-gray-500 ml-1">{unit}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-${health.color}-500`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(value, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          <div className="text-sm text-gray-600 capitalize">
            Status: {health.status}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Server className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">System Monitor</h2>
              <p className="text-gray-300">Real-time infrastructure monitoring</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-300">System Time</div>
            <div className="text-xl font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {performanceData.uptime.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-300">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {performanceData.responseTime}ms
            </div>
            <div className="text-sm text-gray-300">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {performanceData.throughput}
            </div>
            <div className="text-sm text-gray-300">Requests/min</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {performanceData.errorRate.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-300">Error Rate</div>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="CPU Usage"
          value={performanceData.cpuUsage}
          unit="%"
          icon={Cpu}
          thresholds={{ good: 70, warning: 50 }}
        />
        
        <MetricCard
          title="Memory Usage"
          value={performanceData.memoryUsage}
          unit="%"
          icon={HardDrive}
          thresholds={{ good: 80, warning: 60 }}
        />
        
        <MetricCard
          title="Network Latency"
          value={performanceData.responseTime}
          unit="ms"
          icon={Wifi}
          thresholds={{ good: 200, warning: 100 }}
          format={(val) => val.toString()}
        />
      </div>

      {/* Security Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Security Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSecurityLevel(securityData.threatLevel).bg} ${getSecurityLevel(securityData.threatLevel).text}`}>
              <Shield className="h-4 w-4 mr-1" />
              {securityData.threatLevel.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500 mt-1">Threat Level</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {securityData.blockedAttacks}
            </div>
            <div className="text-sm text-gray-600">Blocked Attacks</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {securityData.suspiciousActivities}
            </div>
            <div className="text-sm text-gray-600">Suspicious Activities</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {securityData.vulnerabilities}
            </div>
            <div className="text-sm text-gray-600">Vulnerabilities</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Last security scan: {new Date(securityData.lastSecurityScan).toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Real-time Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Live Activity</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[
            { time: '10:23:45', event: 'User authentication successful', type: 'success' },
            { time: '10:23:42', event: 'API request processed', type: 'info' },
            { time: '10:23:38', event: 'Database query executed', type: 'info' },
            { time: '10:23:35', event: 'Cache miss detected', type: 'warning' },
            { time: '10:23:30', event: 'New user registration', type: 'success' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="text-sm text-gray-900">{activity.event}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SystemMonitor;
