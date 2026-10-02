import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { fetchMyNotifications } from '../../../entities/notification/api'

export function NotificationBell() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'mine'],
    queryFn: fetchMyNotifications,
    // Not a live socket — a short polling interval keeps the badge roughly
    // current without building a whole realtime layer for this phase.
    refetchInterval: 30_000,
  })

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length

  return (
    <Link
      to="/app/notifications"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      aria-label={unreadCount > 0 ? `Notifications (${unreadCount} non lues)` : 'Notifications'}
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger-600 px-1 text-[10px] font-semibold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
