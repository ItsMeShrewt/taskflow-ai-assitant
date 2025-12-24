import { User } from './index.d';

export interface Task {
  id: number;
  user_id: number;
  assigned_to_user_id?: number;
  created_by_user_id?: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  estimated_time?: number;
  actual_time?: number;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
  progress_percentage?: number;
  assigned_to?: User;
  created_by?: User;
}

export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  order: number;
  estimated_time?: number;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  estimated_time?: number;
  assigned_to_user_id?: number;
}
