import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '../shared/ui/layout/AppLayout'
import { Card } from '../shared/ui/Card'
import { Button } from '../shared/ui/Button'
import {
  fetchMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../entities/notification/api'
import { notificationIcon } from '../entities/notification/ui/notification-icon'
import { formatRelativeTimeFr } from '../shared/lib/relative-time'

type Filter = 'ALL' | 'UNREAD'

export function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>('ALL')
  const queryClient = useQueryClient()

  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ['notifications', 'mine'],
    queryFn: fetchMyNotifications,
  })

  const markOneMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'mine'] }),
  })

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'mine'] }),
  })

  const filtered = (notifications ?? []).filter((n) => filter === 'ALL' || !n.isRead)
  const hasUnread = (notifications ?? []).some((n) => !n.isRead)

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-slate-900">Notifications</h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => markAllMutation.mutate()}
          disabled={!hasUnread}
          isLoading={markAllMutation.isPending}
        >
          Tout marquer comme lu
        </Button>
      </div>

      <div className="mt-4 flex gap-2">
        {(['ALL', 'UNREAD'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f === 'ALL' ? 'Toutes' : 'Non lues'}
          </button>
        ))}
      </div>

      <Card className="mt-4 p-0">
        {isLoading && <p className="p-8 text-center text-slate-500">Chargement...</p>}
        {isError && (
          <p className="p-8 text-center text-danger-600">Impossible de charger les notifications.</p>
        )}

        {notifications && (
          <ul className="divide-y divide-slate-50">
            {filtered.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 ${!n.isRead ? 'bg-brand-50/40' : ''}`}
              >
                <span className="text-lg" aria-hidden="true">
                  {notificationIcon(n.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800">{n.message}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatRelativeTimeFr(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markOneMutation.mutate(n.id)}
                    className="shrink-0 text-xs font-medium text-brand-600 hover:underline"
                  >
                    Marquer lu
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {notifications && filtered.length === 0 && (
          <p className="p-8 text-center text-slate-500">
            {filter === 'UNREAD' ? 'Aucune notification non lue.' : 'Aucune notification.'}
          </p>
        )}
      </Card>
    </AppLayout>
  )
}
