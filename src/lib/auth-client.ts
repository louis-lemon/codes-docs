'use client';

/**
 * Client-side authentication using GitHub Personal Access Token
 *
 * Each developer creates their own PAT and enters it in the admin.
 * The token is stored in localStorage and used for GitHub API calls.
 */

const TOKEN_KEY = 'github_pat';
const USER_KEY = 'github_user';

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

/**
 * Save PAT to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Get PAT from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove PAT from localStorage
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Save user info to localStorage
 */
export function saveUser(user: GitHubUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Get user info from localStorage
 */
export function getUser(): GitHubUser | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Validate PAT by fetching user info from GitHub
 */
export async function validateToken(token: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUser();
}

/**
 * Login with PAT
 */
export async function login(token: string): Promise<{ success: boolean; user?: GitHubUser; error?: string }> {
  const user = await validateToken(token);

  if (!user) {
    return { success: false, error: 'Invalid token. Please check your PAT.' };
  }

  saveToken(token);
  saveUser(user);

  return { success: true, user };
}

/**
 * Logout
 */
export function logout(): void {
  removeToken();
}
