import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/dashboardConfig';
import { ROLE_PERMISSIONS, hasPermission } from '../../../config/permissions.config';
import { useAuth } from '../../../contexts/AuthContext';

interface IVeterinarianSupportProps {
  className?: string;
}

interface IAIAlertConfig {
  sensitivity: 'low' | 'medium' | 'high';
  categories: string[];
  escalationRules: {
    criticalTime: number;
    highTime: number;
    mediumTime: number;
  };
}

interface ITrainingModule {
  id: string;
  title: string;
  description: string;
  completedAt?: string;
  progress: number;
  category: 'ai-interpretation' | 'clinical-decision' | 'system-usage';
}

export const VeterinarianSupportTab: React.FC<IVeterinarianSupportProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [alertConfig, setAlertConfig] = useState<IAIAlertConfig>({
    sensitivity: 'high',
    categories: ['abnormal_behavior', 'vital_signs', 'gait_abnormality', 'feeding_behavior'],
    escalationRules: {
      criticalTime: 5, // minutes
      highTime: 15,
      mediumTime: 60
    }
  });

  const [trainingModules] = useState<ITrainingModule[]>([
    {
      id: 'ai-alert-interpretation',
      title: 'AI Alert Interpretation',
      description: 'Understanding AI confidence levels and alert contexts',
      progress: 85,
      category: 'ai-interpretation'
    },
    {
      id: 'clinical-decision-support',
      title: 'Clinical Decision Support',
      description: 'Using AI insights to enhance clinical decisions',
      progress: 60,
      category: 'clinical-decision'
    },
    {
      id: 'system-configuration',
      title: 'System Configuration',
      description: 'Customizing AI system settings for veterinary practice',
      progress: 40,
      category: 'system-usage'
    }
  ]);

  const containerStyle: React.CSSProperties = {
    padding: brandConfig.spacing.lg,
    backgroundColor: brandConfig.colors.arenaSand,
    borderRadius: brandConfig.layout.borderRadius,
    minHeight: '600px'
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: brandConfig.spacing.xl,
    padding: brandConfig.spacing.lg,
    backgroundColor: brandConfig.colors.milkWhite,
    borderRadius: brandConfig.layout.borderRadius,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`
  };

  const headingStyle: React.CSSProperties = {
    color: brandConfig.colors.stableMahogany,
    fontSize: brandConfig.typography.fontSize2xl,
    fontWeight: brandConfig.typography.weightBold,
    marginBottom: brandConfig.spacing.md,
    fontFamily: brandConfig.typography.fontPrimary
  };

  const subHeadingStyle: React.CSSProperties = {
    color: brandConfig.colors.hunterGreen,
    fontSize: brandConfig.typography.fontSizeLg,
    fontWeight: brandConfig.typography.weightSemiBold,
    marginBottom: brandConfig.spacing.sm,
    fontFamily: brandConfig.typography.fontPrimary
  };

  const handleSensitivityChange = (newSensitivity: 'low' | 'medium' | 'high') => {
    setAlertConfig(prev => ({ ...prev, sensitivity: newSensitivity }));
  };

  const handleCategoryToggle = (category: string) => {
    setAlertConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (!hasPermission(user?.role || 'veterinarian', 'support_tickets', 'create')) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', color: brandConfig.colors.errorRed }}>
          {dashboardConfig.messages.accessDenied}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <h1 style={headingStyle}>
        🎓 Veterinary Support & Training Center
      </h1>

      {/* AI Alert Configuration */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>🚨 AI Alert Configuration</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: brandConfig.spacing.md }}>
          
          {/* Sensitivity Settings */}
          <div style={{ padding: brandConfig.spacing.md, border: `1px solid ${brandConfig.colors.pastureSage}`, borderRadius: brandConfig.layout.borderRadius }}>
            <h3 style={{ 
              color: brandConfig.colors.ribbonBlue, 
              fontSize: brandConfig.typography.fontSizeBase,
              marginBottom: brandConfig.spacing.sm 
            }}>
              Alert Sensitivity
            </h3>
            {(['low', 'medium', 'high'] as const).map(level => (
              <label key={level} style={{ 
                display: 'block', 
                marginBottom: brandConfig.spacing.xs,
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="sensitivity"
                  value={level}
                  checked={alertConfig.sensitivity === level}
                  onChange={() => handleSensitivityChange(level)}
                  style={{ marginRight: brandConfig.spacing.xs }}
                />
                <span style={{ textTransform: 'capitalize', color: brandConfig.colors.midnightBlack }}>
                  {level} Sensitivity
                </span>
              </label>
            ))}
          </div>

          {/* Alert Categories */}
          <div style={{ padding: brandConfig.spacing.md, border: `1px solid ${brandConfig.colors.pastureSage}`, borderRadius: brandConfig.layout.borderRadius }}>
            <h3 style={{ 
              color: brandConfig.colors.ribbonBlue, 
              fontSize: brandConfig.typography.fontSizeBase,
              marginBottom: brandConfig.spacing.sm 
            }}>
              Alert Categories
            </h3>
            {['abnormal_behavior', 'vital_signs', 'gait_abnormality', 'feeding_behavior', 'respiratory_distress'].map(category => (
              <label key={category} style={{ 
                display: 'block', 
                marginBottom: brandConfig.spacing.xs,
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={alertConfig.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  style={{ marginRight: brandConfig.spacing.xs }}
                />
                <span style={{ color: brandConfig.colors.midnightBlack }}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>

          {/* Escalation Rules */}
          <div style={{ padding: brandConfig.spacing.md, border: `1px solid ${brandConfig.colors.pastureSage}`, borderRadius: brandConfig.layout.borderRadius }}>
            <h3 style={{ 
              color: brandConfig.colors.ribbonBlue, 
              fontSize: brandConfig.typography.fontSizeBase,
              marginBottom: brandConfig.spacing.sm 
            }}>
              Escalation Time (minutes)
            </h3>
            <div style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.midnightBlack }}>
              <div style={{ marginBottom: brandConfig.spacing.xs }}>
                Critical: {alertConfig.escalationRules.criticalTime}min
              </div>
              <div style={{ marginBottom: brandConfig.spacing.xs }}>
                High: {alertConfig.escalationRules.highTime}min
              </div>
              <div>
                Medium: {alertConfig.escalationRules.mediumTime}min
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Decision Support */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>🔬 Clinical Decision Support</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: brandConfig.spacing.md }}>
          
          <div style={{ padding: brandConfig.spacing.md, backgroundColor: brandConfig.colors.arenaSand, borderRadius: brandConfig.layout.borderRadius }}>
            <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
              AI Diagnostic Interpretation Guide
            </h3>
            <ul style={{ color: brandConfig.colors.midnightBlack, fontSize: brandConfig.typography.fontSizeSm }}>
              <li style={{ marginBottom: brandConfig.spacing.xs }}>Confidence levels above 85% require immediate attention</li>
              <li style={{ marginBottom: brandConfig.spacing.xs }}>Cross-reference with historical patterns</li>
              <li style={{ marginBottom: brandConfig.spacing.xs }}>Consider environmental factors in analysis</li>
              <li>Document AI insights in medical records</li>
            </ul>
          </div>

          <div style={{ padding: brandConfig.spacing.md, backgroundColor: brandConfig.colors.arenaSand, borderRadius: brandConfig.layout.borderRadius }}>
            <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
              Medical Reference Integration
            </h3>
            <div style={{ color: brandConfig.colors.midnightBlack, fontSize: brandConfig.typography.fontSizeSm }}>
              <p style={{ marginBottom: brandConfig.spacing.sm }}>
                Access integrated veterinary references and treatment protocols directly from AI suggestions.
              </p>
              <button style={{
                backgroundColor: brandConfig.colors.ribbonBlue,
                color: brandConfig.colors.milkWhite,
                border: 'none',
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                borderRadius: brandConfig.layout.borderRadius,
                cursor: 'pointer',
                fontSize: brandConfig.typography.fontSizeSm
              }}>
                Access Reference Library
              </button>
            </div>
          </div>

          <div style={{ padding: brandConfig.spacing.md, backgroundColor: brandConfig.colors.arenaSand, borderRadius: brandConfig.layout.borderRadius }}>
            <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
              Best Practices for AI-Assisted Diagnosis
            </h3>
            <ul style={{ color: brandConfig.colors.midnightBlack, fontSize: brandConfig.typography.fontSizeSm }}>
              <li style={{ marginBottom: brandConfig.spacing.xs }}>Always validate AI suggestions with physical examination</li>
              <li style={{ marginBottom: brandConfig.spacing.xs }}>Use AI insights as complementary to clinical judgment</li>
              <li>Maintain detailed records of AI-assisted diagnoses</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Training & Education */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>📚 Professional Development</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: brandConfig.spacing.md }}>
          {trainingModules.map(module => (
            <div key={module.id} style={{
              padding: brandConfig.spacing.md,
              border: `2px solid ${brandConfig.colors.pastureSage}`,
              borderRadius: brandConfig.layout.borderRadius,
              backgroundColor: brandConfig.colors.arenaSand
            }}>
              <h3 style={{ 
                color: brandConfig.colors.stableMahogany, 
                fontSize: brandConfig.typography.fontSizeBase,
                marginBottom: brandConfig.spacing.sm 
              }}>
                {module.title}
              </h3>
              <p style={{ 
                color: brandConfig.colors.midnightBlack, 
                fontSize: brandConfig.typography.fontSizeSm,
                marginBottom: brandConfig.spacing.sm 
              }}>
                {module.description}
              </p>
              
              {/* Progress Bar */}
              <div style={{ 
                width: '100%', 
                backgroundColor: brandConfig.colors.sterlingSilver, 
                borderRadius: brandConfig.layout.borderRadius,
                height: '8px',
                marginBottom: brandConfig.spacing.sm 
              }}>
                <div style={{
                  width: `${module.progress}%`,
                  backgroundColor: module.progress >= 80 ? brandConfig.colors.successGreen : 
                                 module.progress >= 50 ? brandConfig.colors.championGold : brandConfig.colors.ribbonBlue,
                  height: '100%',
                  borderRadius: brandConfig.layout.borderRadius,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: brandConfig.typography.fontSizeSm, 
                  color: brandConfig.colors.midnightBlack 
                }}>
                  Progress: {module.progress}%
                </span>
                <button style={{
                  backgroundColor: module.progress === 100 ? brandConfig.colors.successGreen : brandConfig.colors.ribbonBlue,
                  color: brandConfig.colors.milkWhite,
                  border: 'none',
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  cursor: 'pointer',
                  fontSize: brandConfig.typography.fontSizeSm
                }}>
                  {module.progress === 100 ? 'Completed' : 'Continue'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Support */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>🔧 Technical Support</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: brandConfig.spacing.md }}>
          
          <div style={{ 
            padding: brandConfig.spacing.md, 
            backgroundColor: brandConfig.colors.arenaSand, 
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center'
          }}>
            <h3 style={{ color: brandConfig.colors.errorRed, marginBottom: brandConfig.spacing.sm }}>
              🚨 Submit Technical Issue
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              marginBottom: brandConfig.spacing.md 
            }}>
              Report AI system issues or malfunctions
            </p>
            <button style={{
              backgroundColor: brandConfig.colors.errorRed,
              color: brandConfig.colors.milkWhite,
              border: 'none',
              padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
              borderRadius: brandConfig.layout.borderRadius,
              cursor: 'pointer',
              fontSize: brandConfig.typography.fontSizeSm,
              width: '100%'
            }}>
              Report Issue
            </button>
          </div>

          <div style={{ 
            padding: brandConfig.spacing.md, 
            backgroundColor: brandConfig.colors.arenaSand, 
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center'
          }}>
            <h3 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
              🔧 AI System Troubleshooting
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              marginBottom: brandConfig.spacing.md 
            }}>
              Self-service troubleshooting guides
            </p>
            <button style={{
              backgroundColor: brandConfig.colors.ribbonBlue,
              color: brandConfig.colors.milkWhite,
              border: 'none',
              padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
              borderRadius: brandConfig.layout.borderRadius,
              cursor: 'pointer',
              fontSize: brandConfig.typography.fontSizeSm,
              width: '100%'
            }}>
              View Troubleshooting
            </button>
          </div>

          <div style={{ 
            padding: brandConfig.spacing.md, 
            backgroundColor: brandConfig.colors.arenaSand, 
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center'
          }}>
            <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
              👨‍💻 Contact Technical Specialists
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              marginBottom: brandConfig.spacing.md 
            }}>
              Direct line to AI system experts
            </p>
            <button style={{
              backgroundColor: brandConfig.colors.hunterGreen,
              color: brandConfig.colors.milkWhite,
              border: 'none',
              padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
              borderRadius: brandConfig.layout.borderRadius,
              cursor: 'pointer',
              fontSize: brandConfig.typography.fontSizeSm,
              width: '100%'
            }}>
              Contact Specialist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}; 