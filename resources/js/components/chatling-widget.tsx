import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { type SharedData } from '@/types';

export default function ChatlingWidget() {
  const page = usePage<SharedData>();
  const { component } = page;
  const auth = page.props.auth;

  useEffect(() => {
    console.log('ChatlingWidget - Current component:', component);
    console.log('ChatlingWidget - User authenticated:', !!auth?.user);
    
    // Cleanup function to remove script and widget
    const cleanup = () => {
      const existingScript = document.getElementById('chtl-script');
      if (existingScript) {
        existingScript.remove();
      }
      // Also remove the chatbot widget if it exists
      const chatWidget = document.querySelector('[data-chatling-widget]');
      if (chatWidget) {
        chatWidget.remove();
      }
      // Clear the window config
      delete (window as any).chtlConfig;
    };
    
    // Don't show widget if user is not authenticated
    if (!auth?.user) {
      console.log('ChatlingWidget - User not authenticated, hiding widget');
      cleanup(); // Clean up any existing widget
      return;
    }
    
    // Pages where chatbot SHOULD appear (whitelist approach)
    const allowedPages = [
      'tasks/index',
      'tasks/show',
      'tasks/create',
      'tasks/edit',
    ];

    // Check if current page is in the allowed list
    const shouldShow = allowedPages.includes(component as string);
    console.log('ChatlingWidget - Should show:', shouldShow);

    if (!shouldShow) {
      cleanup(); // Clean up any existing widget
      return;
    }

    console.log('ChatlingWidget - Loading Chatling script...');
    
    // Set Chatling config
    (window as any).chtlConfig = { chatbotId: '7795348919' };

    // Load Chatling script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-id', '7795348919');
    script.id = 'chtl-script';
    script.type = 'text/javascript';
    script.src = 'https://chatling.ai/js/embed.js';
    
    script.onload = () => {
      console.log('ChatlingWidget - Script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('ChatlingWidget - Failed to load script');
    };
    
    document.body.appendChild(script);

    // Return cleanup function
    return cleanup;
  }, [component, auth?.user]);

  return null;
}
