import React from 'react';

export default function Badge({ children, variant = 'default', dot = true, size = 'sm' }) {
  const dotColorMap = {
    default: 'bg-slate-400 dark:bg-slate-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    purple: 'bg-purple-500',
    bio: 'bg-lime-500',
  };

  const textColorMap = {
    default: 'text-slate-600 dark:text-slate-400',
    emerald: 'text-emerald-700 dark:text-emerald-400 font-medium',
    teal: 'text-teal-700 dark:text-teal-400 font-medium',
    cyan: 'text-cyan-700 dark:text-cyan-400 font-medium',
    amber: 'text-amber-700 dark:text-amber-400 font-medium',
    red: 'text-rose-700 dark:text-rose-400 font-medium',
    purple: 'text-purple-700 dark:text-purple-400 font-medium',
    bio: 'text-lime-700 dark:text-lime-400 font-medium',
  };

  const sizeMap = {
    xs: 'text-[11px] gap-1.5',
    sm: 'text-xs gap-1.5',
    md: 'text-sm gap-2',
  };

  const dotColor = dotColorMap[variant] || dotColorMap.default;
  const textColor = textColorMap[variant] || textColorMap.default;
  const textSize = sizeMap[size] || sizeMap.sm;

  return (
    <span className={`inline-flex items-center ${textSize} ${textColor}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
