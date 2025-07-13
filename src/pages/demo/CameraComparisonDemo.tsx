import React, { useState } from 'react';
import { ReoLinkCameraFeed } from '../../components/camera/ReoLinkCameraFeed';
import { WyzeCameraFeed } from '../../components/camera/WyzeCameraFeed';
import { WyzeAIAnalysisPanel } from '../../components/camera/WyzeAIAnalysisPanel';

export const CameraComparisonDemo: React.FC = () => {
  const [reoLinkError, setReoLinkError] = useState<string>('');
  const [wyzeError, setWyzeError] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<'reolink' | 'wyze' | 'both'>('both');
  const [wyzeAIResults, setWyzeAIResults] = useState<any[]>([]);
  const [wyzeSnapshots, setWyzeSnapshots] = useState<string[]>([]);

  const renderSetupInstructions = () => (
    <div style={{
      background: '#f5f5f5',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>📋 Setup Instructions</h3>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
        <div style={{ flex: 1 }}>
          <h4>🔧 ReoLink E1 Pro Setup</h4>
          <ol style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <li>Camera must be on same network (192.168.254.35)</li>
            <li>Start RTSP conversion server: <code>node rtsp-conversion-server.js</code></li>
            <li>Server runs on port 3001</li>
            <li>✅ Currently working with streaming</li>
            <li>⚠️ PTZ controls have limited API support</li>
          </ol>
        </div>
        
        <div style={{ flex: 1 }}>
          <h4>🐳 Wyze Cam V4 Setup</h4>
          <ol style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <li>Install Docker: <code>winget install Docker.DockerDesktop</code></li>
            <li>Run Wyze bridge: <code>docker-compose -f docker-compose.wyze.yml up -d</code></li>
            <li>Configure Wyze credentials in docker-compose.yml</li>
            <li>Bridge Web UI: <a href="http://localhost:8888" target="_blank">http://localhost:8888</a></li>
            <li>✅ Full PTZ control support</li>
            <li>✅ Better API reliability</li>
          </ol>
        </div>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div style={{
      background: '#e8f4f8',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>📊 Camera Comparison</h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ background: '#d1ecf1' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Feature</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>ReoLink E1 Pro</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Wyze Cam V4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>RTSP Support</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>✅ Native</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🔧 Via Bridge</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Network Access</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🏠 Local Only</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>☁️ Cloud + Local</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>PTZ Control</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>⚠️ Limited</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>✅ Full Support</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Setup Complexity</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🟢 Simple</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🟡 Moderate</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Cost</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>💰 Higher</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>💰 Lower</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Latency</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🟢 Low</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🟡 Medium</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>AI Analysis</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🟡 Frame-based</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>🟢 Snapshot-based</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Streaming Type</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>📹 Live Video</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>📸 Snapshots (V4 limit)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderCameraSelector = () => (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'center'
    }}>
      <button
        onClick={() => setSelectedCamera('reolink')}
        style={{
          padding: '8px 16px',
          background: selectedCamera === 'reolink' ? '#2196f3' : '#f0f0f0',
          color: selectedCamera === 'reolink' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ReoLink Only
      </button>
      <button
        onClick={() => setSelectedCamera('wyze')}
        style={{
          padding: '8px 16px',
          background: selectedCamera === 'wyze' ? '#2196f3' : '#f0f0f0',
          color: selectedCamera === 'wyze' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Wyze Only
      </button>
      <button
        onClick={() => setSelectedCamera('both')}
        style={{
          padding: '8px 16px',
          background: selectedCamera === 'both' ? '#2196f3' : '#f0f0f0',
          color: selectedCamera === 'both' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Side by Side
      </button>
    </div>
  );

  const renderCameraFeeds = () => {
    if (selectedCamera === 'reolink') {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <h4>ReoLink E1 Pro</h4>
            <ReoLinkCameraFeed
              onConnectionStatusChange={(connected) => {
                if (!connected) {
                  setReoLinkError('Connection lost');
                }
              }}
              onFrameCapture={(imageData) => {
                // Handle frame capture for AI analysis
                console.log('Frame captured:', imageData.length);
              }}
            />
            {reoLinkError && (
              <div style={{ color: 'red', marginTop: '8px' }}>
                ❌ Error: {reoLinkError}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedCamera === 'wyze') {
      return (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div>
            <h4>🤖 Wyze Cam V4 - AI Analysis Demo</h4>
            <WyzeCameraFeed
              cameraId="wyze_cam_v4"
              width={600}
              height={400}
              onError={setWyzeError}
              onFrameCapture={(imageData) => {
                // Store snapshots for analysis
                setWyzeSnapshots(prev => [...prev.slice(-4), imageData]); // Keep last 5
              }}
              onAIAnalysis={(analysisData) => {
                // Store AI results for display
                setWyzeAIResults(prev => [...prev.slice(-19), analysisData]); // Keep last 20
              }}
            />
            {wyzeError && (
              <div style={{ color: 'red', marginTop: '8px' }}>
                ❌ Error: {wyzeError}
              </div>
            )}
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              Stream: Snapshots (V4 restriction) → AI Analysis<br/>
              Port: 8888 | Status: {wyzeError ? 'Error' : 'Connected'}
            </div>
          </div>
          
          <div style={{ minWidth: '400px' }}>
            <h4>🧠 Real-time AI Analysis</h4>
            <WyzeAIAnalysisPanel 
              analysisResults={wyzeAIResults}
            />
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div>
          <h4>🔧 ReoLink E1 Pro</h4>
          <ReoLinkCameraFeed
            onConnectionStatusChange={(connected) => {
              if (!connected) {
                setReoLinkError('Connection lost');
              }
            }}
            onFrameCapture={(imageData) => {
              // Handle frame capture for AI analysis
              console.log('Frame captured:', imageData.length);
            }}
          />
          {reoLinkError && (
            <div style={{ color: 'red', marginTop: '8px', fontSize: '12px' }}>
              ❌ Error: {reoLinkError}
            </div>
          )}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Stream: RTSP → HLS Conversion<br/>
            Port: 3001 | Status: {reoLinkError ? 'Error' : 'Connected'}
          </div>
        </div>

        <div>
          <h4>🤖 Wyze Cam V4 + AI</h4>
          <WyzeCameraFeed
            cameraId="wyze_cam_v4"
            width={600}
            height={400}
            onError={setWyzeError}
            onFrameCapture={(imageData) => {
              // Store snapshots for analysis
              setWyzeSnapshots(prev => [...prev.slice(-4), imageData]); // Keep last 5
            }}
            onAIAnalysis={(analysisData) => {
              // Store AI results for display
              setWyzeAIResults(prev => [...prev.slice(-19), analysisData]); // Keep last 20
            }}
          />
          {wyzeError && (
            <div style={{ color: 'red', marginTop: '8px', fontSize: '12px' }}>
              ❌ Error: {wyzeError}
            </div>
          )}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Stream: Snapshots → AI Analysis<br/>
            Port: 8888 | Status: {wyzeError ? 'Error' : 'Connected'}
          </div>
        </div>
        
        {/* AI Analysis Panel for side-by-side view */}
        {wyzeAIResults.length > 0 && (
          <div style={{ minWidth: '350px', maxWidth: '400px' }}>
            <h4>🧠 Wyze AI Analysis</h4>
            <WyzeAIAnalysisPanel 
              analysisResults={wyzeAIResults}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🎥 Camera Integration + AI Analysis Demo</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Compare ReoLink E1 Pro (direct RTSP) vs Wyze Cam V4 (cloud bridge) with real-time AI analysis
      </p>

      {renderSetupInstructions()}
      {renderComparison()}
      {renderCameraSelector()}
      {renderCameraFeeds()}

      <div style={{
        background: '#fff3cd',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>🚀 Recommendation</h3>
        <p>
          <strong>For Demo:</strong> Use ReoLink (already working perfectly)<br/>
          <strong>For Production:</strong> Consider Wyze V4 for better PTZ control and lower scaling costs<br/>
          <strong>For AI Analysis:</strong> Wyze snapshots are actually perfect for AI processing!
        </p>
        
        <h4>✨ AI Analysis Benefits:</h4>
        <ul>
          <li>🤖 <strong>Wyze Snapshots:</strong> Perfect for AI - no video processing overhead</li>
          <li>📊 <strong>Real-time Analysis:</strong> Motion detection, object counting, confidence scoring</li>
          <li>⚡ <strong>Efficient:</strong> Snapshots consume less bandwidth than video streams</li>
          <li>🎯 <strong>Focused:</strong> AI processes key moments, not redundant video frames</li>
        </ul>
        
        <h4>Next Steps:</h4>
        <ul>
          <li>✅ ReoLink streaming is production-ready</li>
          <li>🔧 Wyze setup requires Docker configuration</li>
          <li>🎯 Both can integrate with your AI analysis pipeline</li>
          <li>📊 Wyze AI analysis now working with real-time insights</li>
          <li>🚀 Consider Wyze for AI-focused applications - snapshots are ideal!</li>
        </ul>
      </div>
    </div>
  );
}; 