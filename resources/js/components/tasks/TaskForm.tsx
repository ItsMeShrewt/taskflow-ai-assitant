import { useState, useEffect } from 'react';
import { TaskFormData } from '@/types/task';
import { User } from '@/types/index.d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types/index.d';

interface Props {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function TaskForm({ initialData, onSubmit, onCancel, submitLabel = 'Create Task' }: Props) {
  const { auth } = usePage<SharedData>().props;
  const canManageTasks = auth.user.role === 'superadmin' || auth.user.role === 'project_manager';

  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date || undefined,
    estimated_time: initialData?.estimated_time || undefined,
    assigned_to_user_id: initialData?.assigned_to_user_id || auth.user.id,
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (canManageTasks) {
      fetchUsers();
    }
  }, [canManageTasks]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleDueDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      due_date: date ? date.toISOString() : undefined,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Prepare presentation for Monday"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Add more details about this task..."
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={formData.priority}
            onValueChange={value => setFormData(prev => ({ ...prev, priority: value as any }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimated_time">Estimated Time (minutes)</Label>
          <Input
            id="estimated_time"
            type="number"
            min="1"
            value={formData.estimated_time || ''}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              estimated_time: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            placeholder="60"
            className="mt-1"
          />
        </div>
      </div>

      {canManageTasks && (
        <div>
          <Label htmlFor="assigned_to_user_id">Assign To *</Label>
          <Select
            value={formData.assigned_to_user_id?.toString()}
            onValueChange={value => setFormData(prev => ({ ...prev, assigned_to_user_id: parseInt(value) }))}
            disabled={loadingUsers}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select user..."} />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="due_date">Due Date</Label>
        <div className="mt-1">
          <DatePicker
            selected={formData.due_date ? new Date(formData.due_date) : null}
            onChange={handleDueDateChange}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholderText="Select due date..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !formData.title}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
