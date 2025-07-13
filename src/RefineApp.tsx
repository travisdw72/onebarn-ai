import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ErrorComponent, ThemedLayoutV2, useNotificationProvider } from "@refinedev/antd";
import { ConfigProvider, App as AntdApp } from "antd";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

// Our providers and configuration
import { authProvider } from "./providers/auth/AuthProvider";
import { createDataProvider } from "./config/dataProviderConfig";
import { resources, getResourcesForUser } from "./config/resources";
import { brandConfig } from "./config/brandConfig";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./providers/QueryProvider";

// Pages - we'll create these
import { HorseList, HorseCreate, HorseEdit, HorseShow } from "./pages/horses";
import { TrainingSessionList, TrainingSessionCreate, TrainingSessionEdit, TrainingSessionShow } from "./pages/training-sessions";
import { ClientList, ClientCreate, ClientEdit, ClientShow } from "./pages/clients";
import { AITrainingDashboard } from "./pages/ai-training/AITrainingDashboard";
import { Login } from "./pages/auth/Login";

// AI Training System Integration
import { TrainingSessionMonitor } from "./components/training/TrainingSessionMonitor";
import { SecureTrainingVault } from "./components/training/SecureTrainingVault";
import { ZeroTrustDeviceManager } from "./components/training/ZeroTrustDeviceManager";

// Ant Design theme configuration
const antdTheme = {
  token: {
    colorPrimary: brandConfig.colors.stableMahogany,
    colorSuccess: brandConfig.colors.hunterGreen,
    colorWarning: brandConfig.colors.goldenStraw,
    colorError: brandConfig.colors.alertRed,
    colorInfo: brandConfig.colors.skyBlue,
    
    fontFamily: brandConfig.typography.fontPrimary,
    fontSize: parseInt(brandConfig.typography.fontSizeBase),
    borderRadius: parseInt(brandConfig.layout.borderRadius),
    
    // Layout tokens
    colorBgContainer: brandConfig.colors.arenaSand,
    colorBgLayout: brandConfig.colors.barnWhite,
    colorText: brandConfig.colors.midnightBlack,
    colorTextSecondary: brandConfig.colors.weatheredWood,
  },
  components: {
    Layout: {
      headerBg: brandConfig.colors.stableMahogany,
      siderBg: brandConfig.colors.barnWhite,
      bodyBg: brandConfig.colors.arenaSand,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: brandConfig.colors.hunterGreen + '20',
      itemHoverBg: brandConfig.colors.hunterGreen + '10',
    },
    Button: {
      primaryColor: brandConfig.colors.barnWhite,
      colorPrimary: brandConfig.colors.stableMahogany,
    },
  },
};

// ============================================================================
// MAIN REFINE APPLICATION
// ============================================================================

export const RefineApp: React.FC = () => {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={antdTheme}>
          <AntdApp>
            <QueryProvider>
              <AuthProvider>
                <Refine
                  dataProvider={createDataProvider()}
                  authProvider={authProvider}
                  routerProvider={routerBindings}
                  notificationProvider={useNotificationProvider}
                  resources={resources}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "one-barn-ai-training",
                    disableTelemetry: true,
                  }}
                >
                  <Routes>
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Main Application Layout */}
                    <Route
                      element={
                        <ThemedLayoutV2
                          Header={() => (
                            <div style={{ 
                              padding: '0 24px', 
                              background: brandConfig.colors.stableMahogany,
                              color: brandConfig.colors.barnWhite,
                              display: 'flex',
                              alignItems: 'center',
                              height: '64px',
                              fontSize: brandConfig.typography.fontSizeXl,
                              fontWeight: brandConfig.typography.weightBold,
                            }}>
                              🐎 One Barn - AI Training Platform
                            </div>
                          )}
                          Sider={() => <div />} // Custom sidebar if needed
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      }
                    >
                      {/* Default redirect */}
                      <Route index element={<NavigateToResource resource="horses" />} />
                      
                      {/* ============================================================================ */}
                      {/* CORE EQUESTRIAN RESOURCES */}
                      {/* ============================================================================ */}
                      
                      {/* Horses Management */}
                      <Route path="/horses">
                        <Route index element={<HorseList />} />
                        <Route path="create" element={<HorseCreate />} />
                        <Route path="edit/:id" element={<HorseEdit />} />
                        <Route path="show/:id" element={<HorseShow />} />
                      </Route>
                      
                      {/* Training Sessions */}
                      <Route path="/training-sessions">
                        <Route index element={<TrainingSessionList />} />
                        <Route path="create" element={<TrainingSessionCreate />} />
                        <Route path="edit/:id" element={<TrainingSessionEdit />} />
                        <Route path="show/:id" element={<TrainingSessionShow />} />
                      </Route>
                      
                      {/* Clients Management */}
                      <Route path="/clients">
                        <Route index element={<ClientList />} />
                        <Route path="create" element={<ClientCreate />} />
                        <Route path="edit/:id" element={<ClientEdit />} />
                        <Route path="show/:id" element={<ClientShow />} />
                      </Route>
                      
                      {/* ============================================================================ */}
                      {/* AI TRAINING SYSTEM ROUTES */}
                      {/* ============================================================================ */}
                      
                      {/* AI Training Dashboard */}
                      <Route path="/ai-training">
                        <Route index element={<AITrainingDashboard />} />
                        <Route path="create" element={<TrainingSessionMonitor />} />
                        <Route path="edit/:id" element={<TrainingSessionMonitor />} />
                        <Route path="show/:id" element={<TrainingSessionMonitor />} />
                      </Route>
                      
                      {/* Training Devices Management */}
                      <Route path="/training-devices">
                        <Route index element={<ZeroTrustDeviceManager />} />
                        <Route path="create" element={<ZeroTrustDeviceManager />} />
                        <Route path="edit/:id" element={<ZeroTrustDeviceManager />} />
                        <Route path="show/:id" element={<ZeroTrustDeviceManager />} />
                      </Route>
                      
                      {/* Secure Training Vault */}
                      <Route path="/training-vault">
                        <Route index element={<SecureTrainingVault />} />
                      </Route>
                      
                      {/* ============================================================================ */}
                      {/* ANALYTICS & REPORTING */}
                      {/* ============================================================================ */}
                      
                      <Route path="/analytics" element={<div>Analytics Dashboard (Coming Soon)</div>} />
                      <Route path="/reports" element={<div>Reports Dashboard (Coming Soon)</div>} />
                      
                      {/* ============================================================================ */}
                      {/* SYSTEM ROUTES */}
                      {/* ============================================================================ */}
                      
                      <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
                      <Route path="/security-events" element={<div>Security Events (Coming Soon)</div>} />
                      
                      {/* Catch all route */}
                      <Route path="*" element={<ErrorComponent />} />
                    </Route>
                  </Routes>
                  
                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
              </AuthProvider>
            </QueryProvider>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
};

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

// Component to show current route and resource info
export const DevRouteInfo: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      padding: '8px 12px',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      zIndex: 9999,
      opacity: 0.8,
    }}>
      🏗️ Refine Dev Mode
    </div>
  );
};

// Export for use in main App.tsx
export default RefineApp; 