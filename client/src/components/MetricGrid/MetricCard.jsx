import React from 'react';
import { Download, Loader2, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import Sparkline from './Sparkline';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald',
  trend,
  trendPercentage,
  trendDirection = 'up',
  trendTimeframe = 'vs last month',
  sparklineData,
  onDownload,
  isDownloading = false,
}) {
  const accentColorMap = {
    emerald: {
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      trend: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60',
      spark: 'emerald',
    },
    cyan: {
      badge: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      trend: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-800/60',
      spark: 'cyan',
    },
    amber: {
      badge: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      trend: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60',
      spark: 'amber',
    },
    indigo: {
      badge: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      trend: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/60',
      spark: 'indigo',
    },
  };

  const scheme = accentColorMap[color] || accentColorMap.emerald;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700">
      {/* Top row: Title, Main Value & Action Icon */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                {value}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onDownload && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                disabled={isDownloading}
                title={`Download ${title} Analytics PDF Report`}
                aria-label={`Download ${title} PDF report`}
                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 bg-slate-50 hover:bg-emerald-50/80 dark:bg-slate-800/80 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700/80 transition shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <div className={`p-2.5 rounded-xl border ${scheme.badge}`}>
              {Icon && <Icon className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Middle row: Trend Percentage Indicator + Mini Sparkline Chart */}
        <div className="mt-3.5 flex items-center justify-between gap-3">
          {trendPercentage ? (
            <div className="flex items-center space-x-1.5">
              <div
                className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-lg border font-mono text-[11px] font-bold ${scheme.trend}`}
              >
                {trendDirection === 'down' ? (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                )}
                <span>{trendPercentage}</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-sans">
                {trendTimeframe}
              </span>
            </div>
          ) : (
            <div />
          )}

          {sparklineData && sparklineData.length > 1 && (
            <div className="w-24 sm:w-28 shrink-0">
              <Sparkline
                data={sparklineData}
                color={scheme.spark}
                height={28}
                strokeWidth={2}
                showArea={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Subtitle, Trend Badge, and Inline PDF Trigger */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{subtitle}</span>
        <div className="flex items-center space-x-2 shrink-0">
          {trend && (
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {trend}
            </span>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              disabled={isDownloading}
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition ml-1 cursor-pointer"
            >
              <span>PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
