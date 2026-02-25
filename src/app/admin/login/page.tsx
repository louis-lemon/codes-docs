'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Key, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/admin/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      setError('Please enter your Personal Access Token');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(token.trim());

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Invalid token');
    }

    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Github className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your GitHub Personal Access Token to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Personal Access Token
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Key className="h-5 w-5" />
            )}
            Sign In
          </button>
        </form>

        {/* Instructions */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
            How to create a Personal Access Token:
          </h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Go to GitHub Settings → Developer settings</li>
            <li>Click "Personal access tokens" → "Tokens (classic)"</li>
            <li>Click "Generate new token (classic)"</li>
            <li>Select <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">repo</code> scope</li>
            <li>Generate and copy the token</li>
          </ol>
          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=Docs%20CMS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create token on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Your token is stored locally in your browser and never sent to any server.
        </p>
      </div>
    </div>
  );
}
