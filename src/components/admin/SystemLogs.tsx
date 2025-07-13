import React, { useState } from 'react';
import { FileText, Filter, Download, Search, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export const SystemLogs: React.FC = () => {
  const [logLevel, setLogLevel] = useState('all');
  const [logCategory, setLogCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:32:15',
      level: 'error',
      category: 'ai-processing',
      message: 'Failed to process video frame from camera cam-4',
      details: 'Connection timeout after 30 seconds',
      user: 'system'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:31:45',
      level: 'info',
      category: 'user-activity',
      message: 'User login successful',
      details: 'sarah@example.com logged in from 192.168.1.100',
      user: 'sarah@example.com'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:30:22',
      level: 'warning',
      category: 'database',
      message: 'Slow query detected',
      details: 'Query took 2.3 seconds: SELECT * FROM training_sessions WHERE...',
      user: 'system'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:29:18',
      level: 'info',
      category: 'ai-processing',
      message: 'Behavior analysis completed',
      details: 'Processed 1,247 frames for horse Thunder Bay',
      user: 'system'
    }
  ];

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const levelMatch = logLevel === 'all' || log.level === logLevel;
    const categoryMatch = logCategory === 'all' || log.category === logCategory;
    const searchMatch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return levelMatch && categoryMatch && searchMatch;
  });

  const handleExportLogs = () => {
    console.log('Exporting logs...');
  };

  return (
    <div className="system-logs">
      {/* Log Controls */}
      <div className="log-controls">
        <div className="controls-left">
          <div className="search-box">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          
          <div className="filter-group">
            <select
              value={logCategory}
              onChange={(e) => setLogCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="ai-processing">AI Processing</option>
              <option value="camera-feed">Camera Feed</option>
              <option value="user-activity">User Activity</option>
              <option value="database">Database</option>
              <option value="backup">Backup</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        
        <div className="controls-right">
          <button
            onClick={handleExportLogs}
            className="export-btn"
          >
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="log-stats">
        <div className="stat-card">
          <div className="stat-number error">{mockLogs.filter(l => l.level === 'error').length}</div>
          <div className="stat-label">Errors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number warning">{mockLogs.filter(l => l.level === 'warning').length}</div>
          <div className="stat-label">Warnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number info">{mockLogs.filter(l => l.level === 'info').length}</div>
          <div className="stat-label">Info</div>
        </div>
        <div className="stat-card">
          <div className="stat-number total">{mockLogs.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Logs List */}
      <div className="logs-container">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          System Logs ({filteredLogs.length})
        </h2>
        
        <div className="logs-list">
          {filteredLogs.map(log => (
            <div key={log.id} className="log-entry">
              <div className="log-header">
                <div className="log-level">
                  {getLogLevelIcon(log.level)}
                  <span className={`level-badge ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                </div>
                <div className="log-timestamp">
                  <span className="font-mono text-sm">{log.timestamp}</span>
                </div>
                <div className="log-category">
                  <span className="category-tag">{log.category}</span>
                </div>
              </div>
              
              <div className="log-content">
                <div className="log-message">
                  <span className="font-raleway font-semibold">{log.message}</span>
                </div>
                <div className="log-details">
                  <span className="font-raleway text-sm text-gray-600">{log.details}</span>
                </div>
                {log.user !== 'system' && (
                  <div className="log-user">
                    <span className="font-raleway text-xs text-gray-500">User: {log.user}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="empty-logs">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-raleway text-center text-gray-600">
              No logs found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Real-time Log Stream Toggle */}
      <div className="log-stream-controls">
        <div className="stream-toggle">
          <input type="checkbox" id="realtime" className="stream-checkbox" />
          <label htmlFor="realtime" className="stream-label">
            Real-time log streaming
          </label>
        </div>
        <div className="stream-status">
          <div className="status-dot offline"></div>
          <span className="font-raleway text-sm text-gray-600">Stream: Paused</span>
        </div>
      </div>
    </div>
  );
}; 