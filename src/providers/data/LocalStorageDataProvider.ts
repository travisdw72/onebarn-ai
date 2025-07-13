import { DataProvider } from "@refinedev/core";
import { brandConfig } from "../../config/brandConfig";

// ============================================================================
// LOCALSTORAGE DATA PROVIDER FOR REFINE
// ============================================================================
// This provider simulates a real backend using localStorage
// Perfect for development and prototyping before connecting to actual APIs

interface IStorageData {
  [resource: string]: {
    [id: string]: any;
  };
}

interface IStorageMetadata {
  [resource: string]: {
    nextId: number;
    totalCount: number;
    lastModified: string;
  };
}

class LocalStorageService {
  private readonly STORAGE_KEY = 'one_barn_data';
  private readonly METADATA_KEY = 'one_barn_metadata';

  // Get all data from localStorage
  private getData(): IStorageData {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  // Get metadata from localStorage
  private getMetadata(): IStorageMetadata {
    const metadata = localStorage.getItem(this.METADATA_KEY);
    return metadata ? JSON.parse(metadata) : {};
  }

  // Save data to localStorage
  private saveData(data: IStorageData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Save metadata to localStorage
  private saveMetadata(metadata: IStorageMetadata): void {
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }

  // Initialize resource if it doesn't exist
  private initializeResource(resource: string): void {
    const data = this.getData();
    const metadata = this.getMetadata();

    if (!data[resource]) {
      data[resource] = {};
      this.saveData(data);
    }

    if (!metadata[resource]) {
      metadata[resource] = {
        nextId: 1,
        totalCount: 0,
        lastModified: new Date().toISOString(),
      };
      this.saveMetadata(metadata);
    }
  }

  // Get next ID for a resource
  private getNextId(resource: string): string {
    const metadata = this.getMetadata();
    const nextId = metadata[resource]?.nextId || 1;
    
    // Update metadata
    metadata[resource] = {
      ...metadata[resource],
      nextId: nextId + 1,
      lastModified: new Date().toISOString(),
    };
    this.saveMetadata(metadata);

    return `${resource}_${nextId}`;
  }

  // Apply tenant filtering (following our RBAC architecture)
  private applyTenantFilter(data: any[], tenantId?: string): any[] {
    if (!tenantId) return data;
    return data.filter(item => item.tenantId === tenantId || !item.tenantId);
  }

  // Apply role-based filtering
  private applyRoleFilters(data: any[], filters: any[] = []): any[] {
    return data.filter(item => {
      return filters.every(filter => {
        const value = this.getNestedValue(item, filter.field);
        
        switch (filter.operator) {
          case 'eq':
            return value === filter.value;
          case 'ne':
            return value !== filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'gt':
            return Number(value) > Number(filter.value);
          case 'gte':
            return Number(value) >= Number(filter.value);
          case 'lt':
            return Number(value) < Number(filter.value);
          case 'lte':
            return Number(value) <= Number(filter.value);
          default:
            return true;
        }
      });
    });
  }

  // Get nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Apply sorting
  private applySorting(data: any[], sorters: any[] = []): any[] {
    if (!sorters.length) return data;

    return [...data].sort((a, b) => {
      for (const sorter of sorters) {
        const aValue = this.getNestedValue(a, sorter.field);
        const bValue = this.getNestedValue(b, sorter.field);
        
        let comparison = 0;
        
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        if (comparison !== 0) {
          return sorter.order === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  private applyPagination(data: any[], pagination?: { current?: number; pageSize?: number }): any[] {
    if (!pagination) return data;
    
    const { current = 1, pageSize = 10 } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    return data.slice(start, end);
  }

  // Public methods for DataProvider
  public getList(resource: string, params: any): { data: any[]; total: number } {
    this.initializeResource(resource);
    
    const allData = this.getData();
    const resourceData = Object.values(allData[resource] || {});
    
    // Apply tenant filtering
    const tenantFiltered = this.applyTenantFilter(resourceData, params.meta?.tenantId);
    
    // Apply role-based filters
    const filtered = this.applyRoleFilters(tenantFiltered, params.filters);
    
    // Apply sorting
    const sorted = this.applySorting(filtered, params.sorters);
    
    // Get total before pagination
    const total = sorted.length;
    
    // Apply pagination
    const paginated = this.applyPagination(sorted, params.pagination);
    
    return { data: paginated, total };
  }

  public getOne(resource: string, id: string, params: any): any | null {
    this.initializeResource(resource);
    
    const allData = this.getData();
    const item = allData[resource]?.[id];
    
    if (!item) return null;
    
    // Apply tenant filtering
    if (params.meta?.tenantId && item.tenantId && item.tenantId !== params.meta.tenantId) {
      return null;
    }
    
    return item;
  }

  public create(resource: string, params: any): any {
    this.initializeResource(resource);
    
    const data = this.getData();
    const metadata = this.getMetadata();
    const id = this.getNextId(resource);
    
    const newItem = {
      id,
      ...params.variables,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Add tenant ID if provided
      ...(params.meta?.tenantId && { tenantId: params.meta.tenantId }),
    };
    
    data[resource][id] = newItem;
    
    // Update metadata
    metadata[resource].totalCount += 1;
    metadata[resource].lastModified = new Date().toISOString();
    
    this.saveData(data);
    this.saveMetadata(metadata);
    
    return newItem;
  }

  public update(resource: string, id: string, params: any): any {
    this.initializeResource(resource);
    
    const data = this.getData();
    const metadata = this.getMetadata();
    const existingItem = data[resource]?.[id];
    
    if (!existingItem) {
      throw new Error(`Item with id ${id} not found in ${resource}`);
    }
    
    // Check tenant access
    if (params.meta?.tenantId && existingItem.tenantId && existingItem.tenantId !== params.meta.tenantId) {
      throw new Error('Access denied: Tenant mismatch');
    }
    
    const updatedItem = {
      ...existingItem,
      ...params.variables,
      updatedAt: new Date().toISOString(),
    };
    
    data[resource][id] = updatedItem;
    metadata[resource].lastModified = new Date().toISOString();
    
    this.saveData(data);
    this.saveMetadata(metadata);
    
    return updatedItem;
  }

  public deleteOne(resource: string, id: string, params: any): any {
    this.initializeResource(resource);
    
    const data = this.getData();
    const metadata = this.getMetadata();
    const existingItem = data[resource]?.[id];
    
    if (!existingItem) {
      throw new Error(`Item with id ${id} not found in ${resource}`);
    }
    
    // Check tenant access
    if (params.meta?.tenantId && existingItem.tenantId && existingItem.tenantId !== params.meta.tenantId) {
      throw new Error('Access denied: Tenant mismatch');
    }
    
    delete data[resource][id];
    metadata[resource].totalCount = Math.max(0, metadata[resource].totalCount - 1);
    metadata[resource].lastModified = new Date().toISOString();
    
    this.saveData(data);
    this.saveMetadata(metadata);
    
    return existingItem;
  }

  // Utility methods for development
  public seedData(resource: string, items: any[]): void {
    this.initializeResource(resource);
    
    const data = this.getData();
    const metadata = this.getMetadata();
    
    items.forEach(item => {
      const id = item.id || this.getNextId(resource);
      data[resource][id] = {
        ...item,
        id,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
    });
    
    metadata[resource].totalCount = Object.keys(data[resource]).length;
    metadata[resource].lastModified = new Date().toISOString();
    
    this.saveData(data);
    this.saveMetadata(metadata);
  }

  public clearResource(resource: string): void {
    const data = this.getData();
    const metadata = this.getMetadata();
    
    data[resource] = {};
    metadata[resource] = {
      nextId: 1,
      totalCount: 0,
      lastModified: new Date().toISOString(),
    };
    
    this.saveData(data);
    this.saveMetadata(metadata);
  }

  public clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.METADATA_KEY);
  }
}

// Create singleton instance
const storageService = new LocalStorageService();

// ============================================================================
// REFINE DATA PROVIDER IMPLEMENTATION
// ============================================================================

export const localStorageDataProvider = (): DataProvider => {
  return {
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      try {
        const result = storageService.getList(resource, {
          pagination,
          filters,
          sorters,
          meta,
        });
        
        return {
          data: result.data,
          total: result.total,
        };
      } catch (error) {
        console.error(`Error getting list for ${resource}:`, error);
        throw error;
      }
    },

    getOne: async ({ resource, id, meta }) => {
      try {
        const data = storageService.getOne(resource, String(id), { meta });
        
        if (!data) {
          throw new Error(`Resource not found: ${resource}/${id}`);
        }
        
        return { data };
      } catch (error) {
        console.error(`Error getting ${resource}/${id}:`, error);
        throw error;
      }
    },

    create: async ({ resource, variables, meta }) => {
      try {
        const data = storageService.create(resource, { variables, meta });
        return { data };
      } catch (error) {
        console.error(`Error creating ${resource}:`, error);
        throw error;
      }
    },

    update: async ({ resource, id, variables, meta }) => {
      try {
        const data = storageService.update(resource, String(id), { variables, meta });
        return { data };
      } catch (error) {
        console.error(`Error updating ${resource}/${id}:`, error);
        throw error;
      }
    },

    deleteOne: async ({ resource, id, meta }) => {
      try {
        const data = storageService.deleteOne(resource, String(id), { meta });
        return { data };
      } catch (error) {
        console.error(`Error deleting ${resource}/${id}:`, error);
        throw error;
      }
    },

    // Custom method for our specific needs
    custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
      // Handle custom operations like bulk operations, analytics, etc.
      console.log('Custom operation:', { url, method, meta });
      
      // For now, return empty response
      return { data: null };
    },

    getApiUrl: () => {
      return 'localStorage://one_barn_data';
    },
  };
};

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

export const devUtils = {
  // Seed sample data for development
  seedSampleData: () => {
    // Sample horses data
    storageService.seedData('horses', [
      {
        id: 'horse_1',
        name: 'Thunder',
        breed: 'Thoroughbred',
        age: 8,
        status: 'active',
        tenantId: 'tenant-001',
        ownerId: 'user-003',
        trainerId: 'user-002',
        healthStatus: 'excellent',
        trainingProgress: 85,
        nextSessionDate: '2024-01-15',
        monthlyRevenue: 1200,
      },
      {
        id: 'horse_2',
        name: 'Midnight',
        breed: 'Arabian',
        age: 6,
        status: 'active',
        tenantId: 'tenant-001',
        ownerId: 'user-003',
        trainerId: 'user-002',
        healthStatus: 'good',
        trainingProgress: 72,
        nextSessionDate: '2024-01-16',
        monthlyRevenue: 950,
      },
    ]);

    // Sample training sessions
    storageService.seedData('training_sessions', [
      {
        id: 'session_1',
        date: '2024-01-10',
        horseId: 'horse_1',
        trainerId: 'user-002',
        clientId: 'user-003',
        tenantId: 'tenant-001',
        notes: 'Excellent progress on jumping technique',
        progressRating: 9,
        duration: 60,
        type: 'jumping',
      },
      {
        id: 'session_2',
        date: '2024-01-12',
        horseId: 'horse_2',
        trainerId: 'user-002',
        clientId: 'user-003',
        tenantId: 'tenant-001',
        notes: 'Working on dressage fundamentals',
        progressRating: 7,
        duration: 45,
        type: 'dressage',
      },
    ]);

    console.log('✅ Sample data seeded successfully!');
  },

  // Clear all data
  clearAllData: () => {
    storageService.clearAllData();
    console.log('🗑️ All data cleared!');
  },

  // Get storage stats
  getStorageStats: () => {
    const data = JSON.parse(localStorage.getItem('one_barn_data') || '{}');
    const metadata = JSON.parse(localStorage.getItem('one_barn_metadata') || '{}');
    
    const stats = Object.keys(data).map(resource => ({
      resource,
      count: Object.keys(data[resource] || {}).length,
      lastModified: metadata[resource]?.lastModified || 'Never',
    }));
    
    console.table(stats);
    return stats;
  },
};

// Auto-seed data in development
if (process.env.NODE_ENV === 'development') {
  // Check if data exists, if not, seed it
  const existingData = localStorage.getItem('one_barn_data');
  if (!existingData || existingData === '{}') {
    console.log('🌱 Seeding development data...');
    devUtils.seedSampleData();
  }
} 