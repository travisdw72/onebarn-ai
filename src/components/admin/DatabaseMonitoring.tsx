import React, { useState } from 'react';
import { Database, Activity, HardDrive, Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface DatabaseMonitoringProps {
  systemData: any;
}

export const DatabaseMonitoring: React.FC<DatabaseMonitoringProps> = ({
  systemData
}) => {
  const [activeQuery, setActiveQuery] = useState('');

  const mockConnections = [
    {
      id: 'conn-1',
      user: 'app_user',
      database: 'onebarn_prod',
      status: 'active',
      duration: '45m',
      queries: 1247
    },
    {
      id: 'conn-2',
      user: 'ai_processor',
      database: 'onebarn_prod',
      status: 'active',
      duration: '2h 15m',
      queries: 8934
    }
  ];

  return (
    <div className="database-monitoring">
      {/* Database Health Overview */}
      <div className="db-health-grid">
        <div className="health-card">
          <div className="card-header">
            <Database className="w-6 h-6 text-stable-mahogany" />
            <h3 className="font-raleway font-semibold">Connection Pool</h3>
          </div>
          <div className="card-content">
            <div className="connection-meter">
              <div className="meter-bar">
                <div 
                  className="meter-fill"
                  style={{ 
                    width: `${(systemData.infrastructure.database.connections / systemData.infrastructure.database.maxConnections) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="meter-text">
                <span className="font-bebas text-2xl">
                  {systemData.infrastructure.database.connections}
                </span>
                <span className="font-raleway text-sm text-gray-600">
                  / {systemData.infrastructure.database.maxConnections} connections
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="health-card">
          <div className="card-header">
            <Zap className="w-6 h-6 text-champion-gold" />
            <h3 className="font-raleway font-semibold">Query Performance</h3>
          </div>
          <div className="card-content">
            <div className="performance-metric">
              <span className="font-bebas text-3xl text-champion-gold">
                {systemData.infrastructure.database.queryTime}ms
              </span>
              <span className="font-raleway text-sm text-gray-600">avg response</span>
            </div>
            <div className="performance-status">
              <div className="status-indicator good">
                <div className="status-dot"></div>
                <span className="font-raleway text-sm">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        <div className="health-card">
          <div className="card-header">
            <HardDrive className="w-6 h-6 text-ribbon-blue" />
            <h3 className="font-raleway font-semibold">Storage</h3>
          </div>
          <div className="card-content">
            <div className="storage-meter">
              <div className="meter-bar">
                <div 
                  className="meter-fill storage"
                  style={{ width: `${systemData.infrastructure.database.storage}%` }}
                ></div>
              </div>
              <div className="meter-text">
                <span className="font-bebas text-2xl text-ribbon-blue">
                  {systemData.infrastructure.database.storage}%
                </span>
                <span className="font-raleway text-sm text-gray-600">used</span>
              </div>
            </div>
          </div>
        </div>

        <div className="health-card">
          <div className="card-header">
            <Activity className="w-6 h-6 text-hunter-green" />
            <h3 className="font-raleway font-semibold">Backup Status</h3>
          </div>
          <div className="card-content">
            <div className="backup-status">
              <div className="backup-info">
                <span className="font-raleway font-semibold text-hunter-green">
                  Last Backup: 2 hours ago
                </span>
                <span className="font-raleway text-sm text-gray-600">
                  Next: in 4 hours
                </span>
              </div>
              <button className="backup-btn">
                <RefreshCw className="w-4 h-4" />
                Run Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <div className="connections-section">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          Active Database Connections
        </h2>
        
        <div className="connections-table">
          <div className="table-header">
            <div className="header-cell">Connection ID</div>
            <div className="header-cell">User</div>
            <div className="header-cell">Database</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Duration</div>
            <div className="header-cell">Queries</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {mockConnections.map(conn => (
            <div key={conn.id} className="table-row">
              <div className="table-cell font-mono text-sm">{conn.id}</div>
              <div className="table-cell">{conn.user}</div>
              <div className="table-cell">{conn.database}</div>
              <div className="table-cell">
                <span className={`status-badge ${conn.status}`}>
                  {conn.status}
                </span>
              </div>
              <div className="table-cell">{conn.duration}</div>
              <div className="table-cell">{conn.queries.toLocaleString()}</div>
              <div className="table-cell">
                <button className="action-btn-sm danger">Kill</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Console */}
      <div className="query-console">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          Database Query Console
        </h2>
        
        <div className="console-container">
          <div className="query-input">
            <textarea
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              placeholder="Enter SQL query..."
              className="query-textarea font-mono"
              rows={4}
            />
            <div className="query-actions">
              <button 
                className="execute-btn"
                disabled={!activeQuery.trim()}
              >
                <Zap className="w-4 h-4" />
                Execute Query
              </button>
              <button className="clear-btn">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 