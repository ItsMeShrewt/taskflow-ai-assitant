import { useState } from 'react';
import { Task, Subtask } from '@/types/task';
import { taskService } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Props {
  task: Task;
  onUpdate: () => void;
}

export default function SubtaskList({ task, onUpdate }: Props) {
  const [newSubtask, setNewSubtask] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    setAdding(true);
    try {
      await taskService.createSubtask(task.id, { title: newSubtask });
      setNewSubtask('');
      onUpdate();
    } catch (error) {
      console.error('Failed to create subtask:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    const newStatus = subtask.status === 'completed' ? 'pending' : 'completed';
    try {
      await taskService.updateSubtask(task.id, subtask.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    if (!confirm('Are you sure you want to delete this subtask?')) return;
    
    try {
      await taskService.deleteSubtask(task.id, subtaskId);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  const subtasks = task.subtasks || [];
  const completedCount = subtasks.filter(s => s.status === 'completed').length;
  const totalTime = subtasks.reduce((sum, s) => sum + (s.estimated_time || 0), 0);

  return (
    <div className="rounded-lg border bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Subtasks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount} of {subtasks.length} completed
            {totalTime > 0 && ` · ${totalTime} min total`}
          </p>
        </div>
        {subtasks.length > 0 && (
          <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: subtasks.length ? `${(completedCount / subtasks.length) * 100}%` : '0%' }}
            />
          </div>
        )}
      </div>

      <form onSubmit={handleAddSubtask} className="mb-4 flex gap-2">
        <Input
          value={newSubtask}
          onChange={e => setNewSubtask(e.target.value)}
          placeholder="Add a subtask..."
          disabled={adding}
        />
        <Button type="submit" disabled={adding || !newSubtask.trim()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </form>

      {subtasks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No subtasks yet. Add one to break down this task!
        </p>
      ) : (
        <div className="space-y-2">
          {subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 rounded-md border p-3 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <Checkbox
                checked={subtask.status === 'completed'}
                onCheckedChange={() => handleToggleSubtask(subtask)}
                className="flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {subtask.title}
                </p>
                {subtask.estimated_time && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {subtask.estimated_time} min
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteSubtask(subtask.id)}
                className="flex-shrink-0 h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
