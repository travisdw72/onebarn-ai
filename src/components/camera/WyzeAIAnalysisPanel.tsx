import React from 'react';

interface AIAnalysisResult {
  timestamp: string;
  imageSize: number;
  motionDetected: boolean;
  objectsDetected: number;
  confidence: number;
  frameNumber: number;
}

interface WyzeAIAnalysisPanelProps {
  analysisResults: AIAnalysisResult[];
  className?: string;
}

export const WyzeAIAnalysisPanel: React.FC<WyzeAIAnalysisPanelProps> = ({
  analysisResults,
  className = ''
}) => {
  if (analysisResults.length === 0) {
    return (
      <div className={`ai-analysis-panel ${className}`} style={{
        background: '#1e1e1e',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', opacity: 0.7 }}>
          🤖 Waiting for AI analysis data...
        </div>
      </div>
    );
  }

  const latestResult = analysisResults[analysisResults.length - 1];
  const motionCount = analysisResults.filter(r => r.motionDetected).length;
  const avgConfidence = analysisResults.reduce((acc, r) => acc + r.confidence, 0) / analysisResults.length;

  return (
    <div className={`ai-analysis-panel ${className}`} style={{
      background: '#1e1e1e',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px', 
        fontWeight: 'bold',
        borderBottom: '1px solid #333',
        paddingBottom: '8px'
      }}>
        🤖 Wyze AI Analysis Dashboard
      </h3>

      {/* Real-time Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ 
          background: '#2d2d2d', 
          padding: '8px', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Current Frame</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            #{latestResult.frameNumber}
          </div>
        </div>

        <div style={{ 
          background: latestResult.motionDetected ? '#2d5a2d' : '#2d2d2d', 
          padding: '8px', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Motion</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {latestResult.motionDetected ? '✅' : '❌'}
          </div>
        </div>

        <div style={{ 
          background: '#2d2d2d', 
          padding: '8px', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Objects</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {latestResult.objectsDetected}
          </div>
        </div>

        <div style={{ 
          background: '#2d2d2d', 
          padding: '8px', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Confidence</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {Math.round(latestResult.confidence)}%
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        background: '#2d2d2d', 
        padding: '12px', 
        borderRadius: '4px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          📊 Analysis Summary
        </div>
        <div style={{ fontSize: '12px', display: 'flex', gap: '16px' }}>
          <span>Total Frames: {analysisResults.length}</span>
          <span>Motion Detected: {motionCount}</span>
          <span>Avg Confidence: {Math.round(avgConfidence)}%</span>
        </div>
      </div>

      {/* Recent Analysis History */}
      <div style={{ 
        background: '#2d2d2d', 
        padding: '12px', 
        borderRadius: '4px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          📝 Recent Analysis History
        </div>
        {analysisResults.slice(-5).reverse().map((result, index) => (
          <div key={result.timestamp} style={{ 
            fontSize: '11px', 
            padding: '4px 0',
            borderBottom: index < 4 ? '1px solid #333' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              Frame #{result.frameNumber} - {new Date(result.timestamp).toLocaleTimeString()}
            </span>
            <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: result.motionDetected ? '#4caf50' : '#666' }}>
                {result.motionDetected ? '🔴' : '⚫'}
              </span>
              <span>{result.objectsDetected} obj</span>
              <span>{Math.round(result.confidence)}%</span>
            </span>
          </div>
        ))}
      </div>

      {/* Status Footer */}
      <div style={{ 
        marginTop: '16px', 
        fontSize: '11px', 
        opacity: 0.7,
        textAlign: 'center',
        borderTop: '1px solid #333',
        paddingTop: '8px'
      }}>
        🚀 AI Analysis powered by Wyze Bridge • Updated: {new Date(latestResult.timestamp).toLocaleString()}
      </div>
    </div>
  );
}; 