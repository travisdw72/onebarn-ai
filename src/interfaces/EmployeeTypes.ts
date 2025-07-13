export interface IEmployeeRole {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  badge: string;
  user: {
    name: string;
    title: string;
    avatar: string;
  };
}

export interface IQuickStat {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  dueTime?: string;
  completed?: boolean;
}

export interface IScheduleItem {
  id: string;
  title: string;
  client: string;
  description: string;
  time: string;
  type: string;
}

export interface IAlert {
  id: string;
  title: string;
  content: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp?: string;
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  permission: 'full' | 'limited' | 'none';
  disabled?: boolean;
  route?: string;
}

export interface IRoleDashboardData {
  stats: IQuickStat[];
  tasks?: ITask[];
  schedule?: IScheduleItem[];
  alerts?: IAlert[];
  modules: IModule[];
}

export interface IEmployeeDashboardData {
  [roleId: string]: IRoleDashboardData;
}

export interface IEmployeeDashboardProps {
  initialRole?: string;
} 