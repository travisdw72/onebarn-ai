import { DataProvider } from "@refinedev/core";
import axios from "axios";

// ============================================================================
// DATABASE DATA PROVIDER FOR REFINE
// ============================================================================
// This provider connects to your actual database using your API key
// Maintains the same interface as LocalStorageDataProvider for easy swapping

interface IDatabaseConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

class DatabaseService {
  private config: IDatabaseConfig;
  private client: any;

  constructor(config: IDatabaseConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Transform Refine filters to your API format
  private transformFilters(filters: any[] = []): Record<string, any> {
    return filters.reduce((params, filter) => {
      switch (filter.operator) {
        case 'eq':
          params[`${filter.field}`] = filter.value;
          break;
        case 'contains':
          params[`${filter.field}_like`] = filter.value;
          break;
        case 'gt':
          params[`${filter.field}_gt`] = filter.value;
          break;
        case 'gte':
          params[`${filter.field}_gte`] = filter.value;
          break;
        case 'lt':
          params[`${filter.field}_lt`] = filter.value;
          break;
        case 'lte':
          params[`${filter.field}_lte`] = filter.value;
          break;
        default:
          params[filter.field] = filter.value;
      }
      return params;
    }, {} as Record<string, any>);
  }

  // Transform Refine sorters to your API format
  private transformSorters(sorters: any[] = []): Record<string, any> {
    if (!sorters.length) return {};
    
    const sorter = sorters[0]; // Most APIs handle one sorter at a time
    return {
      sort: sorter.field,
      order: sorter.order
    };
  }

  // Apply tenant isolation (following your RBAC architecture)
  private addTenantHeaders(tenantId?: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }
    return headers;
  }

  // Public methods for DataProvider
  public async getList(resource: string, params: any): Promise<{ data: any[]; total: number }> {
    const queryParams = {
      page: params.pagination?.current || 1,
      limit: params.pagination?.pageSize || 10,
      ...this.transformFilters(params.filters),
      ...this.transformSorters(params.sorters)
    };

    const response = await this.client.get(`/${resource}`, {
      params: queryParams,
      headers: this.addTenantHeaders(params.meta?.tenantId)
    });

    return {
      data: response.data.data || response.data,
      total: response.data.total || response.data.count || response.data.length
    };
  }

  public async getOne(resource: string, id: string | number, params: any): Promise<any> {
    const response = await this.client.get(`/${resource}/${String(id)}`, {
      headers: this.addTenantHeaders(params.meta?.tenantId)
    });

    return response.data.data || response.data;
  }

  public async create(resource: string, params: any): Promise<any> {
    const response = await this.client.post(`/${resource}`, params.variables, {
      headers: this.addTenantHeaders(params.meta?.tenantId)
    });

    return response.data.data || response.data;
  }

  public async update(resource: string, id: string | number, params: any): Promise<any> {
    const response = await this.client.put(`/${resource}/${String(id)}`, params.variables, {
      headers: this.addTenantHeaders(params.meta?.tenantId)
    });

    return response.data.data || response.data;
  }

  public async deleteOne(resource: string, id: string | number, params: any): Promise<any> {
    const response = await this.client.delete(`/${resource}/${String(id)}`, {
      headers: this.addTenantHeaders(params.meta?.tenantId)
    });

    return response.data;
  }

  // Custom method for AI agent integration
  public async callAIAgent(endpoint: string, data: any, tenantId?: string): Promise<any> {
    const response = await this.client.post(`/ai/${endpoint}`, data, {
      headers: this.addTenantHeaders(tenantId)
    });

    return response.data;
  }

  // Public method for custom requests
  public async customRequest(config: any): Promise<any> {
    return await this.client.request(config);
  }

  // Public method to get tenant headers
  public getTenantHeaders(tenantId?: string): Record<string, string> {
    return this.addTenantHeaders(tenantId);
  }
}

// Export the DataProvider
export const databaseDataProvider = (config: IDatabaseConfig): DataProvider => {
  const service = new DatabaseService(config);

  return {
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const result = await service.getList(resource, { pagination, filters, sorters, meta });
      return {
        data: result.data,
        total: result.total,
      };
    },

    getOne: async ({ resource, id, meta }) => {
      const data = await service.getOne(resource, id, { meta });
      return { data };
    },

    create: async ({ resource, variables, meta }) => {
      const data = await service.create(resource, { variables, meta });
      return { data };
    },

    update: async ({ resource, id, variables, meta }) => {
      const data = await service.update(resource, id, { variables, meta });
      return { data };
    },

    deleteOne: async ({ resource, id, meta }) => {
      const result = await service.deleteOne(resource, id, { meta });
      return { data: result };
    },

    // Custom method for AI operations
    custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
      // If it's an AI endpoint, use the AI agent integration
      if (url.startsWith('/ai/')) {
        const data = await service.callAIAgent(url.replace('/ai/', ''), payload, meta?.tenantId);
        return { data };
      }

      // Standard custom endpoint
      const response = await service.customRequest({
        url,
        method: method || 'GET',
        data: payload,
        params: query,
        headers: {
          ...headers,
          ...service.getTenantHeaders(meta?.tenantId)
        }
      });

      return { data: response.data };
    },

    getApiUrl: () => config.baseUrl,
  };
};

// Easy configuration factory
export const createDatabaseProvider = (apiKey: string, baseUrl: string = 'http://localhost:3000/api') => {
  return databaseDataProvider({
    baseUrl,
    apiKey,
    timeout: 30000
  });
}; 