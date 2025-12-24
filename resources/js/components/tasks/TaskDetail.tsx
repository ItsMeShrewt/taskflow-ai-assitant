import { useState } from 'react';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Pencil, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  task: Task;
  onUpdate: () => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function TaskDetail({ task, onUpdate }: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdate = async (data: any) => {
    try {
      await taskService.updateTask(task.id, data);
      setIsEditDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {task.title}
          </h1>
          <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(true)} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge className={statusColors[task.status]}>
            {task.status.replace('_', ' ')}
          </Badge>
        </div>

        {task.description && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {task.due_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Due: {format(new Date(task.due_date), 'MMMM d, yyyy h:mm a')}
              </span>
            </div>
          )}
          
          {task.estimated_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Estimated: {task.estimated_time} minutes
              </span>
            </div>
          )}
        </div>

        {task.ai_analysis && (
          <div className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-200">
                  AI Analysis
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                  {task.ai_analysis}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Button
            size="sm"
            variant={task.status === 'pending' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('pending')}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={task.status === 'in_progress' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('in_progress')}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            variant={task.status === 'completed' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            initialData={task}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update Task"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
