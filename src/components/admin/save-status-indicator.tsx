'use client';

import { Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
  hasChanges: boolean;
}

export const SaveStatusIndicator = ({
  status,
  lastSaved,
  hasChanges,
}: SaveStatusIndicatorProps) => {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === 'saved' && lastSaved) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" />
        <span>Saved at {lastSaved.toLocaleTimeString()}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="h-4 w-4" />
        <span>Save failed</span>
      </div>
    );
  }

  if (hasChanges) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Unsaved changes</span>
      </div>
    );
  }

  return null;
};
