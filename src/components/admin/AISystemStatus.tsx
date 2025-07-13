import React, { useState } from 'react';
import { Brain, Camera, Activity, AlertTriangle, CheckCircle, Zap, TrendingUp } from 'lucide-react';

interface AISystemStatusProps {
  systemData: any;
}

export const AISystemStatus: React.FC<AISystemStatusProps> = ({
  systemData
}) => {
  const [selectedModel, setSelectedModel] = useState('behavior-detection');

  const mockAIModels = [
    {
      id: 'behavior-detection',
      name: 'Behavior Detection',
      version: 'v2.1.3',
      status: 'active',
      accuracy: 94.2,
      lastTrained: '3 days ago',
      predictions: 15847,
      errors: 23
    },
    {
      id: 'health-monitoring',
      name: 'Health Monitoring',
      version: 'v1.8.1',
      status: 'active',
      accuracy: 91.7,
      lastTrained: '1 week ago',
      predictions: 8934,
      errors: 12
    },
    {
      id: 'emergency-detection',
      name: 'Emergency Detection',
      version: 'v3.0.0',
      status: 'active',
      accuracy: 98.1,
      lastTrained: '2 days ago',
      predictions: 2341,
      errors: 3
    }
  ];

  const mockCameraFeeds = [
    {
      id: 'cam-1',
      name: 'Barn A - Stalls 1-5',
      status: 'processing',
      fps: 30,
      resolution: '1080p',
      aiLoad: 67,
      alerts: 2
    },
    {
      id: 'cam-2',
      name: 'Barn B - Stalls 6-10',
      status: 'processing',
      fps: 30,
      resolution: '1080p',
      aiLoad: 45,
      alerts: 0
    },
    {
      id: 'cam-3',
      name: 'Pasture North',
      status: 'offline',
      fps: 0,
      resolution: 'N/A',
      aiLoad: 0,
      alerts: 0
    }
  ];

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'training': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCameraStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-green-600 bg-green-50 border-green-200';
      case 'offline': return 'text-red-600 bg-red-50 border-red-200';
      case 'error': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="ai-system-status">
      {/* AI Processing Overview */}
      <div className="ai-overview-grid">
        <div className="overview-card">
          <div className="card-header">
            <Brain className="w-6 h-6 text-stable-mahogany" />
            <h3 className="font-raleway font-semibold">AI Engine Status</h3>
          </div>
          <div className="card-content">
            <div className="status-indicator active">
              <CheckCircle className="w-5 h-5" />
              <span className="font-raleway font-bold text-lg">ACTIVE</span>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="label">Models Running:</span>
                <span className="value">3/3</span>
              </div>
              <div className="detail-item">
                <span className="label">Processing Queue:</span>
                <span className="value">{systemData.infrastructure.aiProcessing.queued}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <Activity className="w-6 h-6 text-champion-gold" />
            <h3 className="font-raleway font-semibold">Processing Rate</h3>
          </div>
          <div className="card-content">
            <div className="metric-number">
              <span className="font-bebas text-4xl text-champion-gold">
                {systemData.infrastructure.aiProcessing.processing}
              </span>
              <span className="font-raleway text-sm text-gray-600">frames/sec</span>
            </div>
            <div className="metric-details">
              <div className="detail-item">
                <span className="label">Completed Today:</span>
                <span className="value">{systemData.infrastructure.aiProcessing.completed.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <TrendingUp className="w-6 h-6 text-hunter-green" />
            <h3 className="font-raleway font-semibold">Accuracy Rate</h3>
          </div>
          <div className="card-content">
            <div className="metric-number">
              <span className="font-bebas text-4xl text-hunter-green">94.2%</span>
              <span className="font-raleway text-sm text-gray-600">avg accuracy</span>
            </div>
            <div className="trend-indicator up">
              <TrendingUp className="w-4 h-4" />
              <span className="font-raleway text-sm">+2.1% this week</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <AlertTriangle className="w-6 h-6 text-victory-rose" />
            <h3 className="font-raleway font-semibold">Error Rate</h3>
          </div>
          <div className="card-content">
            <div className="metric-number">
              <span className="font-bebas text-4xl text-victory-rose">
                {systemData.infrastructure.aiProcessing.errors}
              </span>
              <span className="font-raleway text-sm text-gray-600">errors/hour</span>
            </div>
            <div className="trend-indicator down">
              <TrendingUp className="w-4 h-4 rotate-180" />
              <span className="font-raleway text-sm">-15% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Models Status */}
      <div className="ai-models-section">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          AI Models Performance
        </h2>
        
        <div className="models-grid">
          {mockAIModels.map(model => (
            <div 
              key={model.id} 
              className={`model-card ${selectedModel === model.id ? 'selected' : ''}`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="model-header">
                <h3 className="font-raleway font-semibold">{model.name}</h3>
                <span className={`model-status ${getModelStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              
              <div className="model-metrics">
                <div className="metric-row">
                  <span className="label">Version:</span>
                  <span className="value font-mono">{model.version}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Accuracy:</span>
                  <span className="value font-bold text-hunter-green">{model.accuracy}%</span>
                </div>
                <div className="metric-row">
                  <span className="label">Predictions:</span>
                  <span className="value">{model.predictions.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Errors:</span>
                  <span className="value text-victory-rose">{model.errors}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Last Trained:</span>
                  <span className="value">{model.lastTrained}</span>
                </div>
              </div>
              
              <div className="model-actions">
                <button className="model-btn primary">
                  <Zap className="w-4 h-4" />
                  Retrain
                </button>
                <button className="model-btn secondary">
                  View Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Feed Processing */}
      <div className="camera-processing-section">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          Camera Feed Processing
        </h2>
        
        <div className="camera-processing-table">
          <div className="table-header">
            <div className="header-cell">Camera</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">FPS</div>
            <div className="header-cell">Resolution</div>
            <div className="header-cell">AI Load</div>
            <div className="header-cell">Active Alerts</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {mockCameraFeeds.map(camera => (
            <div key={camera.id} className="table-row">
              <div className="table-cell">
                <div className="camera-cell">
                  <Camera className="w-5 h-5 text-stable-mahogany" />
                  <div>
                    <div className="font-raleway font-medium">{camera.name}</div>
                    <div className="font-mono text-xs text-gray-600">{camera.id}</div>
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <span className={`status-badge ${getCameraStatusColor(camera.status)}`}>
                  {camera.status}
                </span>
              </div>
              <div className="table-cell">{camera.fps}</div>
              <div className="table-cell">{camera.resolution}</div>
              <div className="table-cell">
                <div className="load-meter">
                  <div 
                    className="load-fill"
                    style={{ width: `${camera.aiLoad}%` }}
                  ></div>
                  <span className="load-text">{camera.aiLoad}%</span>
                </div>
              </div>
              <div className="table-cell">
                {camera.alerts > 0 ? (
                  <span className="alert-count">{camera.alerts}</span>
                ) : (
                  <span className="no-alerts">0</span>
                )}
              </div>
              <div className="table-cell">
                <div className="table-actions">
                  <button className="action-btn-sm primary">
                    View Feed
                  </button>
                  <button className="action-btn-sm secondary">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 