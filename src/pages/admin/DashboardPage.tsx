import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, Stethoscope, Calendar, CheckCircle2, XCircle, UserPlus, Plus, type LucideIcon } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { StatTile } from '../../shared/ui/charts/StatTile'
import { BarChart } from '../../shared/ui/charts/BarChart'
import { DonutChart } from '../../shared/ui/charts/DonutChart'
import { fetchDashboardStats } from '../../entities/admin-stats/api'
import { statusLabel } from '../../shared/lib/appointment-status'
import { statusChartColor, sortByStatusOrder } from '../../shared/lib/status-chart-colors'
import { formatRelativeTimeFr } from '../../shared/lib/relative-time'

const DAY_LABELS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function shortDayLabel(dateOnly: string): string {
  const date = new Date(`${dateOnly}T00:00:00`)
  return DAY_LABELS_FR[date.getDay()]
}

const ACTIVITY_ICON: Record<string, LucideIcon> = {
  APPOINTMENT_CREATED: Calendar,
  APPOINTMENT_CONFIRMED: CheckCircle2,
  APPOINTMENT_CANCELLED: XCircle,
  USER_REGISTERED: UserPlus,
}

export function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchDashboardStats,
  })

  return (
    <AppLayout>
      {isLoading && <p className="mt-8 text-center text-slate-500">Chargement...</p>}
      {isError && (
        <p className="mt-8 text-center text-danger-600">Impossible de charger les statistiques.</p>
      )}

      {stats && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile label="Patients" value={stats.counts.patients} icon={Users} />
            <StatTile label="Médecins" value={stats.counts.doctors} icon={Stethoscope} />
            <StatTile label="RDV aujourd'hui" value={stats.counts.appointmentsToday} icon={Calendar} />
            <StatTile label="Confirmés" value={stats.counts.confirmedAppointments} icon={CheckCircle2} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <p className="text-section-title text-slate-900">Rendez-vous sur 7 jours</p>
              <p className="text-xs text-slate-400">Rendez-vous créés par jour</p>
              <div className="mt-4">
                <BarChart
                  data={stats.appointmentsPerDay.map((d) => ({
                    key: d.date,
                    label: shortDayLabel(d.date),
                    value: d.count,
                  }))}
                />
              </div>
            </Card>

            <Card>
              <p className="text-section-title text-slate-900">Répartition par statuts</p>
              <div className="mt-4">
                <DonutChart
                  data={sortByStatusOrder(stats.statusBreakdown).map((s) => ({
                    key: s.status,
                    label: statusLabel(s.status),
                    value: s.count,
                    color: statusChartColor(s.status),
                  }))}
                />
              </div>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <p className="text-section-title text-slate-900">Activité récente</p>
              <ul className="mt-3 flex flex-col divide-y divide-slate-100">
                {stats.recentActivity.map((item, index) => {
                  const ActivityIcon = ACTIVITY_ICON[item.type]
                  return (
                    <li key={index} className="flex items-center gap-3 py-2.5 text-sm">
                      {ActivityIcon && (
                        <ActivityIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      )}
                      <span className="flex-1 text-slate-700">{item.message}</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatRelativeTimeFr(item.at)}
                      </span>
                    </li>
                  )
                })}
                {stats.recentActivity.length === 0 && (
                  <li className="py-3 text-sm text-slate-500">Aucune activité récente.</li>
                )}
              </ul>
            </Card>

            <Card>
              <p className="text-section-title text-slate-900">Actions rapides</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/app/doctors/new">
                  <Button className="w-full justify-start gap-2" variant="secondary">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Ajouter un médecin
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  )
}
