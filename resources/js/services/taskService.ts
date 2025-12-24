import api from '@/lib/api';
import { Task, TaskFormData, Subtask } from '@/types/task';

interface TasksResponse {
  data: Task[];
  canManageTasks?: boolean;
  myTasks?: Task[];
  teamTasks?: Task[];
}

export const taskService = {
  // Get all tasks
  async getTasks(params?: {
    status?: string;
    priority?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }) {
    const response = await api.get<TasksResponse>('/tasks', { params });
    return response.data;
  },

  // Get single task
  async getTask(id: number) {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  async createTask(data: TaskFormData) {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  // Update task
  async updateTask(id: number, data: Partial<TaskFormData>) {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  async deleteTask(id: number) {
    await api.delete(`/tasks/${id}`);
  },

  // Subtasks
  async getSubtasks(taskId: number) {
    const response = await api.get<Subtask[]>(`/tasks/${taskId}/subtasks`);
    return response.data;
  },

  async createSubtask(taskId: number, data: { title: string; description?: string; estimated_time?: number }) {
    const response = await api.post<Subtask>(`/tasks/${taskId}/subtasks`, data);
    return response.data;
  },

  async updateSubtask(taskId: number, subtaskId: number, data: Partial<Subtask>) {
    const response = await api.put<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
    return response.data;
  },

  async deleteSubtask(taskId: number, subtaskId: number) {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  },

  async reorderSubtasks(taskId: number, subtasks: { id: number; order: number }[]) {
    await api.post(`/tasks/${taskId}/subtasks/reorder`, { subtasks });
  },
};
