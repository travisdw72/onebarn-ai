import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ITenantContext {
  tenantId: string | null;
  setTenantId: (id: string) => void;
  tenantName: string | null;
  setTenantName: (name: string) => void;
  tenantConfig: Record<string, any> | null;
  setTenantConfig: (config: Record<string, any>) => void;
}

const TenantContext = createContext<ITenantContext | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [tenantConfig, setTenantConfig] = useState<Record<string, any> | null>(null);

  const value = {
    tenantId,
    setTenantId,
    tenantName,
    setTenantName,
    tenantConfig,
    setTenantConfig,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}; 