'use client';

import { Toaster } from 'sonner';

/**
 * Toast notification provider for the admin CMS.
 * Uses Sonner for modern, accessible toast notifications.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-100 dark:group-[.toaster]:border-gray-700',
          description: 'group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-blue-600 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-gray-700 dark:group-[.toast]:text-gray-300',
          success: 'group-[.toaster]:border-green-500',
          error: 'group-[.toaster]:border-red-500',
          warning: 'group-[.toaster]:border-yellow-500',
          info: 'group-[.toaster]:border-blue-500',
        },
      }}
    />
  );
}
