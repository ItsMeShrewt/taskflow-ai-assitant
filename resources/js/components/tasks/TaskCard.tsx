import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import showToast from '@/lib/toast';

interface Props {
  task: Task;
  onClick: () => void;
  onUpdate: () => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function TaskCard({ task, onClick, onUpdate }: Props) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await taskService.deleteTask(task.id);
      showToast.task.deleted();
      onUpdate();
    } catch (error) {
      console.error('Failed to delete task:', error);
      showToast.error('Failed to delete task.');
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      if (newStatus === 'completed') {
        showToast.task.completed();
      } else {
        showToast.task.statusChanged('pending');
      }
      onUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
      showToast.error('Failed to update task status.');
    }
  };

  const subtasksCompleted = task.subtasks?.filter(s => s.status === 'completed').length || 0;
  const subtasksTotal = task.subtasks?.length || 0;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {task.title}
        </h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleStatus}
            className="h-8 w-8 p-0"
          >
            <CheckCircle2
              className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}
            />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Task</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        <Badge className={priorityColors[task.priority]} variant="secondary">
          {task.priority}
        </Badge>
        <Badge className={statusColors[task.status]} variant="secondary">
          {task.status.replace('_', ' ')}
        </Badge>
      </div>

      {(task.due_date || task.estimated_time) && (
        <div className="mb-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          {task.estimated_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{task.estimated_time} min</span>
            </div>
          )}
        </div>
      )}

      {subtasksTotal > 0 && (
        <div className="mt-3 pt-3 border-t dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Subtasks: {subtasksCompleted}/{subtasksTotal}
            </span>
            <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${(subtasksCompleted / subtasksTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
