export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Ticket {
  id: number;
  title: string;
  description?: string;
  statusName: string;
  priority: Priority;
  assigneeUsername?: string;
  reporterUsername?: string;
  projectKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketCreate {
  title: string;
  description?: string;
  projectKey: string;
  priority?: Priority;
  assigneeUsername?: string;
}

export interface TicketPage {
  content: Ticket[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}