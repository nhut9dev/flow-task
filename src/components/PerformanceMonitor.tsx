'use client';

import { memo, useEffect, useState } from 'react';

import { useMemoryMonitor, usePerformanceTimer, useRenderPerformance } from '~hooks/usePerformance';

interface PerformanceMonitorProps {
  componentName: string;
  enabled?: boolean;
}

const PerformanceMonitor = memo<PerformanceMonitorProps>(
  ({ componentName, enabled = process.env.NODE_ENV === 'development' }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [stats, setStats] = useState<{
      renderCount: number;
      memoryStats: any;
      lastRenderTime: number;
    }>({
      renderCount: 0,
      memoryStats: null,
      lastRenderTime: 0,
    });

    const { getRenderStats } = useRenderPerformance(componentName);
    const { getMemoryStats } = useMemoryMonitor();
    const { startTimer, endTimer } = usePerformanceTimer();

    useEffect(() => {
      if (!enabled) return;

      const updateStats = () => {
        const renderStats = getRenderStats();
        const memoryStats = getMemoryStats();

        setStats({
          renderCount: renderStats.renderCount,
          memoryStats,
          lastRenderTime: renderStats.timeSinceLastRender,
        });
      };

      updateStats();
      const interval = setInterval(updateStats, 1000);

      return () => clearInterval(interval);
    }, [enabled, getRenderStats, getMemoryStats]);

    if (!enabled) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">Performance Monitor</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showDetails ? '−' : '+'}
          </button>
        </div>

        <div className="space-y-1">
          <div>Component: {componentName}</div>
          <div>Renders: {stats.renderCount}</div>
          <div>Last render: {stats.lastRenderTime.toFixed(2)}ms</div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t space-y-1">
            {stats.memoryStats && (
              <>
                <div>Memory (current): {stats.memoryStats.current}</div>
                <div>Memory (peak): {stats.memoryStats.peak}</div>
                <div>Memory (increase): {stats.memoryStats.increase}</div>
              </>
            )}

            <div className="mt-2 pt-2 border-t">
              <button
                onClick={() => {
                  startTimer('manual-test');
                  setTimeout(() => endTimer('manual-test'), 100);
                }}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                Test Timer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;
