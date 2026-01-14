import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle, Trash2, Plus, Edit, Users } from 'lucide-react';
import { createElement } from 'react';

// Custom toast configurations for different types
const toastConfig = {
    success: {
        icon: CheckCircle,
        style: {
            border: '2px solid #10b981',
            padding: '16px',
            color: '#065f46',
            background: '#d1fae5',
        },
        iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
        },
        duration: 4000,
    },
    error: {
        icon: XCircle,
        style: {
            border: '2px solid #ef4444',
            padding: '16px',
            color: '#991b1b',
            background: '#fee2e2',
        },
        iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
        },
        duration: 5000,
    },
    info: {
        icon: Info,
        style: {
            border: '2px solid #3b82f6',
            padding: '16px',
            color: '#1e40af',
            background: '#dbeafe',
        },
        iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
        },
        duration: 4000,
    },
    warning: {
        icon: AlertTriangle,
        style: {
            border: '2px solid #f59e0b',
            padding: '16px',
            color: '#92400e',
            background: '#fef3c7',
        },
        iconTheme: {
            primary: '#f59e0b',
            secondary: '#fff',
        },
        duration: 4000,
    },
};

// Amazing toast notifications with custom styling
export const showToast = {
    // Success notifications
    success: (message: string) => {
        toast.success(message, {
            ...toastConfig.success,
            icon: '✅',
        });
    },

    created: (item: string) => {
        toast.success(`${item} created successfully! 🎉`, {
            ...toastConfig.success,
            icon: '➕',
        });
    },

    updated: (item: string) => {
        toast.success(`${item} updated successfully! ✨`, {
            ...toastConfig.success,
            icon: '✏️',
        });
    },

    deleted: (item: string) => {
        toast.success(`${item} deleted successfully! 🗑️`, {
            ...toastConfig.success,
            icon: '🗑️',
        });
    },

    completed: (item: string) => {
        toast.success(`${item} marked as completed! ✅`, {
            ...toastConfig.success,
            icon: '✅',
        });
    },

    // Error notifications
    error: (message: string) => {
        toast.error(message, {
            ...toastConfig.error,
            icon: '❌',
        });
    },

    // Info notifications
    info: (message: string) => {
        toast(message, {
            ...toastConfig.info,
            icon: 'ℹ️',
        });
    },

    // Warning notifications
    warning: (message: string) => {
        toast(message, {
            ...toastConfig.warning,
            icon: '⚠️',
        });
    },

    // Loading notification
    loading: (message: string) => {
        return toast.loading(message, {
            style: {
                border: '2px solid #6366f1',
                padding: '16px',
                color: '#3730a3',
                background: '#e0e7ff',
            },
        });
    },

    // Promise-based notification
    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        }, {
            success: toastConfig.success,
            error: toastConfig.error,
        });
    },

    // Team-specific notifications
    team: {
        created: () => {
            toast.success('Team created successfully! 🎉', {
                ...toastConfig.success,
                icon: '👥',
                duration: 5000,
            });
        },
        updated: () => {
            toast.success('Team updated successfully! ✨', {
                ...toastConfig.success,
                icon: '✏️',
            });
        },
        memberApproved: (name: string) => {
            toast.success(`${name} has been approved to join the team! 🎉`, {
                ...toastConfig.success,
                icon: '✅',
            });
        },
        memberRejected: (name: string) => {
            toast.info(`${name} has been rejected from the team`, {
                ...toastConfig.info,
                icon: '❌',
            });
        },
        joinRequest: (teamName: string) => {
            toast.info(`Your request to join ${teamName} has been sent! ⏳`, {
                ...toastConfig.info,
                icon: '📤',
            });
        },
    },

    // Task-specific notifications
    task: {
        created: () => {
            toast.success('Task created successfully! 📝', {
                ...toastConfig.success,
                icon: '✅',
            });
        },
        updated: () => {
            toast.success('Task updated successfully! ✨', {
                ...toastConfig.success,
                icon: '✏️',
            });
        },
        deleted: () => {
            toast.success('Task deleted successfully! 🗑️', {
                ...toastConfig.success,
                icon: '🗑️',
            });
        },
        completed: () => {
            toast.success('Task completed! Great job! 🎉', {
                ...toastConfig.success,
                icon: '✅',
                duration: 5000,
            });
        },
        statusChanged: (status: string) => {
            const emoji = status === 'completed' ? '✅' : status === 'in_progress' ? '⏳' : '📝';
            toast.success(`Task status changed to ${status}! ${emoji}`, {
                ...toastConfig.success,
                icon: emoji,
            });
        },
    },

    // Copy notification
    copied: (item: string = 'Text') => {
        toast.success(`${item} copied to clipboard! 📋`, {
            ...toastConfig.success,
            icon: '📋',
            duration: 2000,
        });
    },
};

export default showToast;
