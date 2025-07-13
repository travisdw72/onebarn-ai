import React, { useState } from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';
import { ROLE_PERMISSIONS } from '../../config/permissions.config';
import { brandConfig } from '../../config/brandConfig';

/**
 * RoleDashboardDemo Component
 * 
 * This component demonstrates the unified RBAC dashboard system by allowing
 * users to switch between different roles and see how the dashboard adapts
 * to each role's permissions and configuration.
 * 
 * Features:
 * - Role switcher with all available roles
 * - Live demonstration of RBAC permissions
 * - Real-time dashboard reconfiguration
 * - Role-specific theming and content
 */
export const RoleDashboardDemo: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('manager');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(true);

  const availableRoles = Object.values(ROLE_PERMISSIONS);

  const styles = {
    demoContainer: {
      position: 'relative' as const,
      minHeight: '100vh',
    },
    roleSwitcher: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      backgroundColor: brandConfig.colors.barnWhite,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      zIndex: 1000,
      maxWidth: '300px',
    },
    switcherHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.md,
    },
    switcherTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      margin: '0',
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.stableMahogany,
    },
    roleButton: {
      display: 'block',
      width: '100%',
      padding: brandConfig.spacing.sm,
      margin: `${brandConfig.spacing.xs} 0`,
      backgroundColor: 'transparent',
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.layout.borderRadius,
      cursor: 'pointer',
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.midnightBlack,
      transition: 'all 0.2s ease',
      textAlign: 'left' as const,
    },
    activeRoleButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      borderColor: brandConfig.colors.stableMahogany,
    },
    roleInfo: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.neutralGray,
      marginTop: brandConfig.spacing.xs,
      lineHeight: '1.3',
    },
    demoInfo: {
      backgroundColor: brandConfig.colors.pastureSage + '20',
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      margin: `${brandConfig.spacing.md} 0`,
      border: `1px solid ${brandConfig.colors.pastureSage}`,
    },
    collapsedSwitcher: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      backgroundColor: brandConfig.colors.barnWhite,
      padding: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      zIndex: 1000,
      cursor: 'pointer',
    },
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    console.log(`Switched to role: ${roleId}`);
  };

  const currentRole = ROLE_PERMISSIONS[selectedRole];

  if (!showRoleSwitcher) {
    return (
      <div style={styles.demoContainer}>
        <div 
          style={styles.collapsedSwitcher}
          onClick={() => setShowRoleSwitcher(true)}
        >
          <div style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.stableMahogany,
          }}>
            {currentRole?.badge || selectedRole.toUpperCase()}
          </div>
          <div style={{
            fontSize: brandConfig.typography.fontSizeXs,
            color: brandConfig.colors.neutralGray,
          }}>
            Click to switch roles
          </div>
        </div>
        <RoleDashboard userRole={selectedRole} />
      </div>
    );
  }

  return (
    <div style={styles.demoContainer}>
      <div style={styles.roleSwitcher}>
        <div style={styles.switcherHeader}>
          <h3 style={styles.switcherTitle}>Role Demo</h3>
          <button 
            style={styles.toggleButton}
            onClick={() => setShowRoleSwitcher(false)}
            aria-label="Hide role switcher"
          >
            ✕
          </button>
        </div>
        
        <div style={styles.demoInfo}>
          <strong>Current Role:</strong> {currentRole?.displayName}
          <br />
          <strong>Level:</strong> {currentRole?.level}/5
          <br />
          <strong>Modules:</strong> {currentRole?.dashboardModules.length}
          <br />
          <strong>Actions:</strong> {currentRole?.quickActions.length}
        </div>

        <div>
          <h4 style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontWeight: brandConfig.typography.weightSemiBold,
            color: brandConfig.colors.stableMahogany,
            margin: `${brandConfig.spacing.sm} 0`,
          }}>
            Switch Role:
          </h4>
          
          {availableRoles
            .sort((a, b) => a.level - b.level)
            .map((role) => (
              <button
                key={role.id}
                style={{
                  ...styles.roleButton,
                  ...(selectedRole === role.id ? styles.activeRoleButton : {}),
                }}
                onClick={() => handleRoleChange(role.id)}
                onMouseOver={(e) => {
                  if (selectedRole !== role.id) {
                    e.currentTarget.style.backgroundColor = `${role.color}20`;
                    e.currentTarget.style.borderColor = role.color;
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedRole !== role.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = brandConfig.colors.sterlingSilver;
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.xs }}>
                  <span style={{ fontSize: '1.2em' }}>{role.icon}</span>
                  <div>
                    <div style={{ fontWeight: brandConfig.typography.weightSemiBold }}>
                      {role.displayName}
                    </div>
                    <div style={styles.roleInfo}>
                      Level {role.level} • {role.dashboardModules.length} modules
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>

        <div style={{
          marginTop: brandConfig.spacing.md,
          fontSize: brandConfig.typography.fontSizeXs,
          color: brandConfig.colors.neutralGray,
          lineHeight: '1.4',
        }}>
          <strong>Demo Features:</strong>
          <br />• Role-based permissions
          <br />• Dynamic content filtering
          <br />• Adaptive UI theming
          <br />• Module access control
          <br />• Analytics by role level
        </div>
      </div>

      <RoleDashboard userRole={selectedRole} />
    </div>
  );
}; 