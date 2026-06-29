import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | undefined | null) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatMonthYear(yyyyMm: string | undefined | null) {
  if (!yyyyMm || !yyyyMm.trim()) return '';
  const parts = yyyyMm.split('-');
  if (parts.length !== 2) return yyyyMm;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed month
  if (isNaN(year) || isNaN(month)) return yyyyMm;
  return new Date(year, month).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}
