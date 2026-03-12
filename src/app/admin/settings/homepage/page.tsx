'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, Home } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/components/admin/auth-provider';
import { HomepageCardForm } from '@/components/admin/settings';
import { SaveStatusIndicator, type SaveStatus } from '@/components/admin/save-status-indicator';
import { getSettings, updateSettings } from '@/lib/github-client';
import { cn } from '@/lib/utils';
import type { HomepageSettings, HomepageCard, IconName } from '@/types/settings';

const createEmptyCard = (prefix: string): HomepageCard => ({
  id: `${prefix}-${Date.now()}`,
  title: '',
  description: '',
  href: '',
  icon: 'BookOpen' as IconName,
});

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

export default function HomepageSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [sha, setSha] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSettings<HomepageSettings>('homepage');
      if (result) {
        setSettings(result.data);
        setSha(result.sha);
      } else {
        toast.error('Homepage settings not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to load settings: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated, fetchSettings]);

  const handleSave = useCallback(async () => {
    if (!settings || !sha) return;

    // Validate required fields
    const validateCards = (cards: HomepageCard[], sectionName: string): boolean => {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card.title.trim()) {
          toast.error(`${sectionName} card ${i + 1}: Title is required`);
          return false;
        }
        if (!card.description.trim()) {
          toast.error(`${sectionName} card ${i + 1}: Description is required`);
          return false;
        }
        if (!card.href.trim()) {
          toast.error(`${sectionName} card ${i + 1}: Link is required`);
          return false;
        }
      }
      return true;
    };

    if (!validateCards(settings.quickStart.cards, 'Quick Start')) return;
    if (!validateCards(settings.techStack.cards, 'Tech Stack')) return;

    setSaving(true);
    setSaveStatus('saving');
    const toastId = toast.loading('Saving settings...');

    try {
      const result = await updateSettings('homepage', settings, sha);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save');
      }

      if (result.sha) {
        setSha(result.sha);
      }
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasChanges(false);

      toast.success('Saved! Deploying...', {
        id: toastId,
        duration: 8000,
        action: {
          label: 'View Deploy',
          onClick: () => window.open(result.workflowUrl, '_blank'),
        },
      });
    } catch (err) {
      setSaveStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Save failed: ${message}`, { id: toastId });
    } finally {
      setSaving(false);
    }
  }, [settings, sha]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Generic section handlers
  type SectionKey = 'quickStart' | 'techStack';

  const updateSectionTitle = (section: SectionKey, title: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: { ...settings[section], title },
    });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const updateSectionCard = (section: SectionKey, index: number, card: HomepageCard) => {
    if (!settings) return;
    const newCards = [...settings[section].cards];
    newCards[index] = card;
    setSettings({
      ...settings,
      [section]: { ...settings[section], cards: newCards },
    });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const deleteSectionCard = (section: SectionKey, index: number) => {
    if (!settings) return;
    const newCards = settings[section].cards.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      [section]: { ...settings[section], cards: newCards },
    });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const addSectionCard = (section: SectionKey) => {
    if (!settings) return;
    const prefix = section === 'quickStart' ? 'qs' : 'ts';
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        cards: [...settings[section].cards, createEmptyCard(prefix)],
      },
    });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Settings not found</p>
        <Link href="/admin/settings" className="mt-4 text-blue-600 hover:underline">
          Back to settings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div
        className={cn(
          'sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4',
          'bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm',
          'border-b border-gray-200 dark:border-gray-700'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/settings"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-600" />
                Homepage Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure Quick Start and Tech Stack sections
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
            {/* Save Status - hidden on mobile when idle */}
            <div className="hidden sm:block">
              <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} hasChanges={hasChanges} />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors',
                'bg-blue-600 text-white hover:bg-blue-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
        {/* Mobile save status */}
        <div className="sm:hidden mt-2">
          <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} hasChanges={hasChanges} />
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Start Section
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={settings.quickStart.title}
              onChange={(e) => updateSectionTitle('quickStart', e.target.value)}
              placeholder="Quick Start"
              className={cn(
                'w-full max-w-md px-3 py-2 rounded-lg transition-all duration-200',
                'border bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cards ({settings.quickStart.cards.length})
          </h3>
          {settings.quickStart.cards.map((card, index) => (
            <HomepageCardForm
              key={card.id}
              card={card}
              onChange={(updated) => updateSectionCard('quickStart', index, updated)}
              onDelete={() => deleteSectionCard('quickStart', index)}
            />
          ))}
          <button
            onClick={() => addSectionCard('quickStart')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              'border-2 border-dashed border-gray-300 dark:border-gray-600',
              'text-gray-600 dark:text-gray-400',
              'hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400',
              'w-full justify-center'
            )}
          >
            <Plus className="h-4 w-4" />
            Add Quick Start Card
          </button>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Technology Stack Section
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={settings.techStack.title}
              onChange={(e) => updateSectionTitle('techStack', e.target.value)}
              placeholder="Technology Stack"
              className={cn(
                'w-full max-w-md px-3 py-2 rounded-lg transition-all duration-200',
                'border bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500'
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cards ({settings.techStack.cards.length})
          </h3>
          {settings.techStack.cards.map((card, index) => (
            <HomepageCardForm
              key={card.id}
              card={card}
              onChange={(updated) => updateSectionCard('techStack', index, updated)}
              onDelete={() => deleteSectionCard('techStack', index)}
            />
          ))}
          <button
            onClick={() => addSectionCard('techStack')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              'border-2 border-dashed border-gray-300 dark:border-gray-600',
              'text-gray-600 dark:text-gray-400',
              'hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400',
              'w-full justify-center'
            )}
          >
            <Plus className="h-4 w-4" />
            Add Tech Stack Card
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Cmd/Ctrl + S</kbd> to save
      </div>
    </div>
  );
}
