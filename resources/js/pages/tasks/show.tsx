import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';
import TaskDetail from '@/components/tasks/TaskDetail';
import SubtaskList from '@/components/tasks/SubtaskList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Props {
  taskId: number;
}

export default function TaskDetailPage({ taskId }: Props) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTask = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTask(taskId);
      setTask(data);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tasks',
      href: '/tasks',
    },
    {
      title: task?.title || 'Loading...',
      href: `/tasks/${taskId}`,
    },
  ];

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Loading..." />
        <div className="flex h-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!task) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Task not found" />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task not found</h2>
            <Button onClick={() => router.visit('/tasks')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${task.title} - TaskFlow`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => router.visit('/tasks')}
          className="w-fit gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="grid gap-6">
          <TaskDetail task={task} onUpdate={loadTask} />
          <SubtaskList task={task} onUpdate={loadTask} />
        </div>
      </div>
    </AppLayout>
  );
}
