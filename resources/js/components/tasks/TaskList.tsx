import { Task } from '@/types/task';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTasksChange: () => void;
}

export default function TaskList({ tasks, onTaskClick, onTasksChange }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          No tasks found. Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onUpdate={onTasksChange}
        />
      ))}
    </div>
  );
}
