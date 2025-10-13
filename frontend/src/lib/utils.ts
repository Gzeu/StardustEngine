import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwindcss-merge';

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers with suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format EGLD amounts with proper decimals
 */
export function formatEGLD(amount: number, decimals: number = 2): string {
  return `${amount.toFixed(decimals)} EGLD`;
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100 * 10) / 10;
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Delay function for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: string): string {
  const colors = {
    'Common': '#9CA3AF',
    'Rare': '#3B82F6',
    'Epic': '#8B5CF6',
    'Legendary': '#F59E0B'
  };
  return colors[rarity as keyof typeof colors] || colors.Common;
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Local storage helpers
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silent failure
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent failure
    }
  }
};

/**
 * Color manipulation utilities
 */
export const colors = {
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  rgbToHex: (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },
  
  adjustOpacity: (color: string, opacity: number): string => {
    const rgb = colors.hexToRgb(color);
    if (!rgb) return color;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }
};

/**
 * Animation easing functions
 */
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

/**
 * Performance monitoring utilities
 */
export const performance = {
  measure: (name: string, fn: () => void): number => {
    const start = Date.now();
    fn();
    const end = Date.now();
    console.log(`Performance [${name}]: ${end - start}ms`);
    return end - start;
  },
  
  measureAsync: async (name: string, fn: () => Promise<void>): Promise<number> => {
    const start = Date.now();
    await fn();
    const end = Date.now();
    console.log(`Performance [${name}]: ${end - start}ms`);
    return end - start;
  }
};

/**
 * Game-specific utilities
 */
export const game = {
  calculateLevel: (experience: number): number => {
    // Experience formula: level = floor(sqrt(exp / 100))
    return Math.floor(Math.sqrt(experience / 100));
  },
  
  experienceForLevel: (level: number): number => {
    // Reverse formula: exp = level^2 * 100
    return level * level * 100;
  },
  
  experienceToNextLevel: (currentExp: number): number => {
    const currentLevel = game.calculateLevel(currentExp);
    const nextLevelExp = game.experienceForLevel(currentLevel + 1);
    return nextLevelExp - currentExp;
  },
  
  getRarityWeight: (rarity: string): number => {
    const weights = {
      'Common': 1,
      'Rare': 2,
      'Epic': 5,
      'Legendary': 10
    };
    return weights[rarity as keyof typeof weights] || 1;
  },
  
  generateRandomAssetId: (): string => {
    return 'asset_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};

/**
 * Validation utilities
 */
export const validate = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  walletAddress: (address: string): boolean => {
    // Basic MultiversX address validation
    return /^erd1[a-z0-9]{58}$/.test(address);
  },
  
  positiveNumber: (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }
};

/**
 * Error handling utilities
 */
export const errors = {
  handleAsyncError: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  },
  
  logError: (error: unknown, context?: string): void => {
    const message = errors.handleAsyncError(error);
    console.error(`Error ${context ? `in ${context}` : ''}: ${message}`);
  }
};