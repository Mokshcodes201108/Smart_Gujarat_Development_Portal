/**
 * Format Indian Rupee currency into Crores or Lakhs
 */
export function formatCurrencyINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  if (Math.abs(amount) >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  } else if (Math.abs(amount) >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)} Lakh`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
}

/**
 * Format full exact Rupee string with Indian grouping (e.g. ₹1,20,00,000)
 */
export function formatFullINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format dates into standard DD MMM YYYY
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get status badge classes
 */
export function getStatusBadgeProps(status: string): { bg: string; text: string; dot: string; border: string } {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-emerald-50 text-emerald-800',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        border: 'border-emerald-200'
      };
    case 'In Progress':
      return {
        bg: 'bg-blue-50 text-blue-800',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        border: 'border-blue-200'
      };
    case 'Approved':
      return {
        bg: 'bg-teal-50 text-teal-800',
        text: 'text-teal-700',
        dot: 'bg-teal-500',
        border: 'border-teal-200'
      };
    case 'Pending Approval':
      return {
        bg: 'bg-amber-50 text-amber-800',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        border: 'border-amber-200'
      };
    case 'Proposed':
      return {
        bg: 'bg-indigo-50 text-indigo-800',
        text: 'text-indigo-700',
        dot: 'bg-indigo-500',
        border: 'border-indigo-200'
      };
    case 'Cancelled':
      return {
        bg: 'bg-rose-50 text-rose-800',
        text: 'text-rose-700',
        dot: 'bg-rose-500',
        border: 'border-rose-200'
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700',
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        border: 'border-slate-200'
      };
  }
}
