# Alert System Guide

## Overview
This project now uses a custom alert dialog system built with Radix UI and Zustand. It provides beautiful, accessible alerts with four variants: success, error, warning, and info.

## Features
- ✅ Four alert types: success, error, warning, info
- ✅ Confirmation dialogs with custom actions
- ✅ Beautiful, accessible UI built with Radix UI
- ✅ Global state management with Zustand
- ✅ Consistent with shadcn/ui design system
- ✅ No page refresh required

## Usage

### Basic Alerts

```tsx
import { alert } from '@/hooks/use-alert';

// Success alert
alert.success('Your changes have been saved successfully!');

// Error alert
alert.error('Failed to update user role. Please try again.');

// Warning alert
alert.warning('This action cannot be undone.');

// Info alert
alert.info('Your session will expire in 5 minutes.');
```

### Confirmation Dialog

```tsx
import { alert } from '@/hooks/use-alert';

// Confirmation dialog with custom action
alert.confirm({
  type: 'warning',
  title: 'Delete Task',
  message: 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  onConfirm: () => {
    // Perform delete action
    deleteTask(taskId);
  },
  onCancel: () => {
    // Optional: Handle cancel action
    console.log('Delete cancelled');
  }
});
```

### Advanced Usage

```tsx
import { useAlertStore } from '@/hooks/use-alert';

// For more control, use the store directly
const alertStore = useAlertStore();

// Show alert with custom configuration
alertStore.showAlert({
  type: 'success',
  title: 'Custom Title',
  message: 'Custom message with detailed information.',
  confirmLabel: 'Got it'
});

// Check if alert is open
const isOpen = alertStore.isOpen;

// Close alert programmatically
alertStore.hideAlert();
```

## Alert Types

### Success (Green)
- Used for: Successful operations, confirmations
- Icon: CheckCircle
- Color: Green background

### Error (Red)
- Used for: Errors, failed operations
- Icon: XCircle
- Color: Red background

### Warning (Orange/Amber)
- Used for: Warnings, destructive actions requiring confirmation
- Icon: AlertTriangle
- Color: Orange background

### Info (Blue)
- Used for: Information, notifications
- Icon: Info
- Color: Blue background

## Examples in Codebase

See [resources/js/pages/users/index.tsx](resources/js/pages/users/index.tsx) for real-world examples:

```tsx
// Success example
alert.success('Role updated successfully!');

// Error example
alert.error('Failed to update role. Please try again.');

// Copy to clipboard success
alert.success('Team code copied to clipboard!');
```

## Architecture

The alert system consists of:

1. **AlertDialogCustom Component** - The visual alert dialog component
   - Location: `resources/js/components/alert-dialog-custom.tsx`
   - Built with Radix UI primitives

2. **useAlert Hook** - Global state management
   - Location: `resources/js/hooks/use-alert.ts`
   - Built with Zustand for efficient state management

3. **AlertProvider Component** - Context provider
   - Location: `resources/js/components/alert-provider.tsx`
   - Automatically included in app layout

4. **AlertDialog UI Component** - Radix UI primitives
   - Location: `resources/js/components/ui/alert-dialog.tsx`
   - Base components for building custom dialogs

## Migration from Toast

If you're migrating from `react-hot-toast`, simply replace:

```tsx
// Old (toast)
import toast from 'react-hot-toast';
toast.success('Message');
toast.error('Error message');

// New (alert)
import { alert } from '@/hooks/use-alert';
alert.success('Message');
alert.error('Error message');
```

## Benefits over Toast

1. **Better UX**: Alerts require user acknowledgment, ensuring important messages are seen
2. **Confirmation Dialogs**: Built-in support for yes/no confirmations
3. **Accessible**: Built with Radix UI for excellent accessibility
4. **Customizable**: Easy to customize colors, icons, and behavior
5. **Consistent Design**: Matches shadcn/ui design system
6. **Type Safe**: Full TypeScript support

## Dependencies

- `zustand` - State management
- `@radix-ui/react-alert-dialog` - Alert dialog primitives
- `lucide-react` - Icons

All dependencies are already installed in the project.
