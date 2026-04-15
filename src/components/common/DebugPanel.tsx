import { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn';
  message: string;
}

export function DebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Restore logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('debug_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('debug_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    // Capture console.log
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      originalLog(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog('log', message);
    };

    // Capture console.error
    const originalError = console.error;
    console.error = (...args: any[]) => {
      originalError(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog('error', message);
    };

    // Capture console.warn
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      originalWarn(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog('warn', message);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const addLog = (level: 'log' | 'error' | 'warn', message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, level, message }].slice(-15)); // Keep last 15 logs
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-mono"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white rounded-lg shadow-2xl max-w-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <span className="text-xs font-bold">🐛 DEBUG LOGS</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-xs hover:bg-slate-700 px-2 py-1 rounded"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={() => setLogs([])}
            className="text-xs hover:bg-slate-700 px-2 py-1 rounded"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs hover:bg-slate-700 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Logs */}
      {!isMinimized && (
        <div className="max-h-64 overflow-y-auto font-mono text-xs space-y-1 p-3">
          {logs.length === 0 ? (
            <div className="text-slate-500">Waiting for logs...</div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  log.level === 'error'
                    ? 'text-red-400'
                    : log.level === 'warn'
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}
              >
                <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                <span className="font-bold">{log.level.toUpperCase()}</span>:{' '}
                <span className="whitespace-pre-wrap break-words">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
