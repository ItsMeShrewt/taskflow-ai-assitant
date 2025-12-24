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
    
    // Don't show widget if user is not authenticated
    if (!auth?.user) {
      console.log('ChatlingWidget - User not authenticated, hiding widget');
      return;
    }
    
    // Pages where chatbot should NOT appear (even for authenticated users)
    const excludedPages = [
      'welcome',
      'auth/login',
      'auth/register',
      'auth/forgot-password',
      'auth/reset-password',
      'auth/verify-email',
      'auth/two-factor-challenge',
      'auth/confirm-password',
      'role-selection',
    ];

    // Check if current page is excluded
    const shouldHide = excludedPages.includes(component as string);
    console.log('ChatlingWidget - Should hide:', shouldHide);

    if (shouldHide) {
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

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.getElementById('chtl-script');
      if (existingScript) {
        existingScript.remove();
      }
      // Also remove the chatbot widget if it exists
      const chatWidget = document.querySelector('[data-chatling-widget]');
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, [component, auth?.user]);

  return null;
}
