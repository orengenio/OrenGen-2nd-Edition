// B2B CRM Types with Role-Based Access

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SALES_MANAGER = 'sales_manager',
  SALES_REP = 'sales_rep',
  ACCOUNT_MANAGER = 'account_manager',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'enterprise';
  website?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  annualRevenue?: number;
  employeeCount?: number;
  status: 'prospect' | 'active' | 'inactive' | 'churned';
  ownerId: string; // Assigned sales rep
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

export interface Contact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department?: string;
  isPrimary: boolean; // Primary contact for company
  linkedInUrl?: string;
  status: 'lead' | 'qualified' | 'customer' | 'partner';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  companyId: string;
  contactId: string;
  title: string;
  value: number;
  currency: 'USD' | 'EUR' | 'GBP';
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number; // 0-100
  expectedCloseDate: string;
  actualCloseDate?: string;
  lostReason?: string;
  ownerId: string;
  products: DealProduct[];
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

export interface DealProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject: string;
  description?: string;
  companyId?: string;
  contactId?: string;
  dealId?: string;
  ownerId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: string;
  completedAt?: string;
  duration?: number; // minutes
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currency: 'USD' | 'EUR' | 'GBP';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface Permission {
  resource: 'companies' | 'contacts' | 'deals' | 'activities' | 'users' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Role-based permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { resource: 'companies', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] }
  ],
  [UserRole.ADMIN]: [
    { resource: 'companies', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'settings', actions: ['read', 'update'] }
  ],
  [UserRole.SALES_MANAGER]: [
    { resource: 'companies', actions: ['create', 'read', 'update'] },
    { resource: 'contacts', actions: ['create', 'read', 'update'] },
    { resource: 'deals', actions: ['create', 'read', 'update'] },
    { resource: 'activities', actions: ['create', 'read', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ],
  [UserRole.SALES_REP]: [
    { resource: 'companies', actions: ['create', 'read', 'update'] }, // Own records only
    { resource: 'contacts', actions: ['create', 'read', 'update'] }, // Own records only
    { resource: 'deals', actions: ['create', 'read', 'update'] }, // Own records only
    { resource: 'activities', actions: ['create', 'read', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ],
  [UserRole.ACCOUNT_MANAGER]: [
    { resource: 'companies', actions: ['read', 'update'] },
    { resource: 'contacts', actions: ['read', 'update'] },
    { resource: 'deals', actions: ['read', 'update'] },
    { resource: 'activities', actions: ['create', 'read', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ],
  [UserRole.VIEWER]: [
    { resource: 'companies', actions: ['read'] },
    { resource: 'contacts', actions: ['read'] },
    { resource: 'deals', actions: ['read'] },
    { resource: 'activities', actions: ['read'] },
    { resource: 'users', actions: [] },
    { resource: 'settings', actions: [] }
  ]
};

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

// Analytics & Reporting
export interface SalesMetrics {
  totalRevenue: number;
  dealsWon: number;
  dealsLost: number;
  averageDealSize: number;
  conversionRate: number;
  averageSalesCycle: number; // days
  forecastedRevenue: number;
}
