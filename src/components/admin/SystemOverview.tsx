import React from 'react';
import { Activity, Users, Database, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SystemOverviewProps {
  systemData: any;
  activeUsers: number;
  onUserImpersonate: (userId: string) => void;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({
  systemData,
  activeUsers,
  onUserImpersonate
}) => {
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="system-overview">
      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <Activity className="w-6 h-6 text-stable-mahogany" />
            <h3 className="font-raleway font-semibold">System Health</h3>
          </div>
          <div className="metric-content">
            <div className={`health-status ${getHealthColor(systemData.systemHealth.overall)}`}>
              <CheckCircle className="w-5 h-5" />
              <span className="font-raleway font-bold text-lg">
                {systemData.systemHealth.overall.toUpperCase()}
              </span>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="label">Uptime:</span>
                <span className="value">{systemData.systemHealth.uptime}</span>
              </div>
              <div className="detail-item">
                <span className="label">Last Incident:</span>
                <span className="value">{systemData.systemHealth.lastIncident}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Users className="w-6 h-6 text-ribbon-blue" />
            <h3 className="font-raleway font-semibold">Active Users</h3>
          </div>
          <div className="metric-content">
            <div className="metric-number">
              <span className="font-bebas text-4xl text-ribbon-blue">{activeUsers}</span>
              <span className="font-raleway text-sm text-gray-600">online now</span>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="label">Total Active:</span>
                <span className="value">{systemData.users.totalActive}</span>
              </div>
              <div className="detail-item">
                <span className="label">New Today:</span>
                <span className="value">{systemData.users.newToday}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Database className="w-6 h-6 text-hunter-green" />
            <h3 className="font-raleway font-semibold">Database</h3>
          </div>
          <div className="metric-content">
            <div className="metric-number">
              <span className="font-bebas text-4xl text-hunter-green">
                {systemData.infrastructure.database.connections}
              </span>
              <span className="font-raleway text-sm text-gray-600">connections</span>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="label">Query Time:</span>
                <span className="value">{systemData.infrastructure.database.queryTime}ms</span>
              </div>
              <div className="detail-item">
                <span className="label">Storage:</span>
                <span className="value">{systemData.infrastructure.database.storage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <AlertTriangle className="w-6 h-6 text-victory-rose" />
            <h3 className="font-raleway font-semibold">Alerts</h3>
          </div>
          <div className="metric-content">
            <div className="metric-number">
              <span className="font-bebas text-4xl text-victory-rose">
                {systemData.systemHealth.activeAlerts}
              </span>
              <span className="font-raleway text-sm text-gray-600">active</span>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="label">Resolved Today:</span>
                <span className="value">{systemData.systemHealth.resolvedToday}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="infrastructure-status">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          Infrastructure Status
        </h2>
        
        <div className="infrastructure-grid">
          <div className="infra-card">
            <h3 className="font-raleway font-semibold mb-3">Servers</h3>
            <div className="server-status">
              <div className="status-bar">
                <div className="status-fill" style={{ width: '100%' }}></div>
              </div>
              <div className="status-text">
                <span>{systemData.infrastructure.servers.online}/{systemData.infrastructure.servers.total} Online</span>
                <span>Load: {systemData.infrastructure.servers.load}%</span>
              </div>
            </div>
          </div>

          <div className="infra-card">
            <h3 className="font-raleway font-semibold mb-3">AI Processing</h3>
            <div className="ai-status">
              <div className="processing-queue">
                <div className="queue-item">
                  <span className="label">Queued:</span>
                  <span className="value">{systemData.infrastructure.aiProcessing.queued}</span>
                </div>
                <div className="queue-item">
                  <span className="label">Processing:</span>
                  <span className="value">{systemData.infrastructure.aiProcessing.processing}</span>
                </div>
                <div className="queue-item">
                  <span className="label">Completed:</span>
                  <span className="value">{systemData.infrastructure.aiProcessing.completed}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="infra-card">
            <h3 className="font-raleway font-semibold mb-3">Barn Network</h3>
            <div className="barn-status">
              <div className="barn-summary">
                <div className="summary-item">
                  <span className="label">Active Barns:</span>
                  <span className="value">{systemData.barns.active}/{systemData.barns.total}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Horses:</span>
                  <span className="value">{systemData.barns.totalHorses}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Cameras Online:</span>
                  <span className="value">{systemData.barns.totalCameras}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          Quick Actions
        </h2>
        
        <div className="action-buttons">
          <button className="action-btn primary">
            <Database className="w-5 h-5" />
            Database Backup
          </button>
          <button className="action-btn secondary">
            <Activity className="w-5 h-5" />
            System Restart
          </button>
          <button className="action-btn secondary">
            <Users className="w-5 h-5" />
            User Sessions
          </button>
          <button className="action-btn secondary">
            <Clock className="w-5 h-5" />
            Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  );
}; 