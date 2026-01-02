import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';
import TaskTable from '@/components/tasks/TaskTable';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';
import ChatlingWidget from '@/components/chatling-widget';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [teamTasks, setTeamTasks] = useState<Task[]>([]);
  const [canManageTasks, setCanManageTasks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  
  const lastKnownUpdate = useRef<string | null>(null);
  const isCheckingRef = useRef(false);

  const loadTasks = async () => {
    console.log('Loading tasks with filters:', filters);
    setLoading(true);
    try {
      const response = await taskService.getTasks(filters);
      console.log('Tasks response:', response);
      
      if (response.canManageTasks) {
        // PM view - separate tasks
        setMyTasks(response.myTasks || []);
        setTeamTasks(response.teamTasks || []);
        setCanManageTasks(true);
        console.log('PM: My tasks:', response.myTasks?.length, 'Team tasks:', response.teamTasks?.length);
      } else {
        // Member view - single task list
        setTasks(response.data || []);
        setCanManageTasks(false);
        console.log('Member tasks:', response.data?.length);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  // Smart polling: only reload when tasks actually change
  useEffect(() => {
    const checkForUpdates = async () => {
      if (isCheckingRef.current) return;
      
      isCheckingRef.current = true;
      
      try {
        const params = lastKnownUpdate.current 
          ? { last_known: lastKnownUpdate.current }
          : {};
          
        const response = await axios.get('/api/check-updates/tasks', { params });
        
        if (response.data.last_update) {
          if (lastKnownUpdate.current === null) {
            // First check, just store the timestamp
            lastKnownUpdate.current = response.data.last_update;
            console.log('[Tasks] Initial timestamp stored:', lastKnownUpdate.current);
          } else if (response.data.has_update) {
            // Data has changed, reload tasks
            console.log('[Tasks] Update detected! Reloading tasks...');
            lastKnownUpdate.current = response.data.last_update;
            await loadTasks();
          } else {
            console.log('[Tasks] No changes detected');
          }
        }
      } catch (error) {
        console.error('[Tasks] Error checking for updates:', error);
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Initial check
    checkForUpdates();

    // Check every 3 seconds
    const interval = setInterval(checkForUpdates, 3000);

    return () => clearInterval(interval);
  }, []); // Empty deps - runs once on mount

  const handleCreateTask = async (data: any) => {
    try {
      console.log('Creating task with data:', data);
      const response = await taskService.createTask(data);
      console.log('Task created:', response);
      setIsCreateDialogOpen(false);
      await loadTasks();
      console.log('Tasks reloaded after creation');
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Check console for details.');
    }
  };

  const handleTaskClick = (task: Task) => {
    router.visit(`/tasks/${task.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Tasks - TaskFlow" />

      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {canManageTasks ? 'All Tasks' : 'My Tasks'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              AI-powered task management to help you stay productive
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <TaskFilters filters={filters} onFiltersChange={setFilters} />

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : canManageTasks ? (
          /* PM View - Separate sections */
          <div className="space-y-8">
            {/* My Tasks Section */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Tasks
                </h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {myTasks.length}
                </span>
              </div>
              {myTasks.length > 0 ? (
                <TaskTable tasks={myTasks} onTaskClick={handleTaskClick} />
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400">No tasks assigned to you</p>
                </div>
              )}
            </div>

            {/* Team Tasks Section */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Team Tasks
                </h2>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {teamTasks.length}
                </span>
              </div>
              {teamTasks.length > 0 ? (
                <TaskTable tasks={teamTasks} onTaskClick={handleTaskClick} />
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400">No tasks assigned to team members</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Member View - Single table */
          <TaskTable tasks={tasks} onTaskClick={handleTaskClick} />
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <ChatlingWidget />
    </AppLayout>
  );
}
