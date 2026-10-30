import type { ReactNode } from 'react'
import { Refresh, Alert } from '@/components/icons'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-primary-100/60 dark:bg-ink-800 ${className}`} />
}

export function SurahSkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface flex items-center gap-4 rounded-2xl p-4">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export function AyahSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="ml-auto h-16 w-full" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-500/[0.07]">
      <span className="flex items-center gap-2.5 text-sm text-red-700 dark:text-red-300">
        <Alert className="h-4 w-4 shrink-0" />
        {message}
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
        >
          <Refresh className="h-3.5 w-3.5" /> Coba lagi
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary-200 px-6 py-14 text-center dark:border-ink-700">
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-400 dark:bg-ink-800">{icon}</span>
      <p className="text-base font-semibold text-ink-700 dark:text-primary-100">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-ink-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl dark:text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
      {children}
    </div>
  )
}
