import { Task } from '@/types/task';
import { User } from '@/types/index.d';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Calendar, Clock, Eye, ListTodo, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types/index.d';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

export default function TaskTable({ tasks, onTaskClick }: Props) {
  const { auth } = usePage<SharedData>().props;
  const canManageTasks = auth.user.role === 'superadmin' || auth.user.role === 'project_manager';
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-8 px-2 lg:px-3"
            >
              Task
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="max-w-md">
              <div className="font-medium text-gray-900 dark:text-white">
                {task.title}
              </div>
              {!canManageTasks && task.description && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                  {task.description}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-8 px-2 lg:px-3"
            >
              Priority
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const priority = row.getValue('priority') as Task['priority'];
          const config = priorityConfig[priority];
          return (
            <Badge variant="secondary" className={config.className}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-8 px-2 lg:px-3"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue('status') as Task['status'];
          const config = statusConfig[status];
          return (
            <Badge variant="secondary" className={config.className}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'due_date',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-8 px-2 lg:px-3"
            >
              Due Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const dueDate = row.getValue('due_date') as string | undefined;
          if (!dueDate) return <span className="text-gray-400 dark:text-gray-500">—</span>;
          
          const date = new Date(dueDate);
          const isOverdue = date < new Date() && row.original.status !== 'completed';
          
          return (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{format(date, 'MMM dd, yyyy')}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'estimated_time',
        header: 'Time',
        cell: ({ row }) => {
          const estimated = row.getValue('estimated_time') as number | undefined;
          if (!estimated) return <span className="text-gray-400 dark:text-gray-500">—</span>;
          
          // Convert minutes to hours and minutes
          const hours = Math.floor(estimated / 60);
          const minutes = estimated % 60;
          const timeStr = hours > 0 
            ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
            : `${minutes}m`;
          
          return (
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{timeStr}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'progress_percentage',
        header: 'Progress',
        cell: ({ row }) => {
          const progress = row.getValue('progress_percentage') as number | undefined || 0;
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 dark:bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium min-w-[3ch] text-right">
                {progress}%
              </span>
            </div>
          );
        },
      },
      // Only show "Assigned To" column for admins/PMs
      ...(canManageTasks ? [{
        accessorKey: 'assigned_to',
        header: 'Assigned To',
        cell: ({ row }) => {
          const assignedTo = row.original.assigned_to;
          if (!assignedTo) return <span className="text-gray-400 dark:text-gray-500">—</span>;
          
          return (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <UserIcon className="h-4 w-4" />
              <span className="text-sm">{assignedTo.name}</span>
            </div>
          );
        },
      }] as ColumnDef<Task>[] : []),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const task = row.original;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTaskClick(task)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    [onTaskClick]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (tasks.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <ListTodo className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No tasks found</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="font-semibold text-gray-700 dark:text-gray-300">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow 
              key={row.id}
              className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
              onClick={() => onTaskClick(row.original)}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} onClick={(e: React.MouseEvent) => {
                  // Prevent row click when clicking action button
                  if (cell.column.id === 'actions') {
                    e.stopPropagation();
                  }
                }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, tasks.length)} of{' '}
          {tasks.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
