import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
  Activity,
  Ban,
  CheckCircle2,
  Download,
  RefreshCw,
  ShieldAlert,
  Clock,
  Table2,
  ChartNoAxesCombined,
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { MetricCard } from '../../components/data-display/MetricCard.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { mockApi } from '../../services/mockApi.js';
import { LoadingState } from '../../components/feedback/FeedbackStates.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const DashboardCharts = lazy(() => import('./DashboardCharts.jsx'));

const DUPLICATED_SUMMARY_KPIS = new Set([
  'white-list',
  'gray-list',
  'auto-registered',
  'device-deregistered',
]);

const KPI_ICONS = {
  'blocked': Ban,
  'access-denied': Ban,
  'special-req-accepted': CheckCircle2,
  'special-req': Activity,
  'lost-devices': ShieldAlert,
  'found-devices': Clock,
};

const DashboardMobileDataCard = ({ title, fields = [] }) => {
  const { t } = usePreferences();

  return (
    <article className="bg-[var(--color-surface)] px-4 py-4">
      <h4 className="type-card-title text-[var(--color-text-primary)]">{title}</h4>
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <p className="type-meta text-[var(--color-text-secondary)]">{t(field.label)}</p>
            <p className={'type-body-sm font-semibold font-mono tabular-nums mt-1 break-words ' + (field.className || 'text-[var(--color-text-primary)]')}>
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
};

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-24');
  const [analyticsView, setAnalyticsView] = useState('data');
  const { addToast } = useToast();
  const { t } = usePreferences();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getDashboardSummary();
      setData(res);
    } catch (err) {
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadReport = () => {
    addToast('Generating BTRC National Equipment Identity Register Summary PDF report...', 'info');
  };

  if (isLoading || !data) {
    return <LoadingState message="Loading NEIR Executive Dashboard..." />;
  }

  const operationalKpis = data.kpis.filter((kpi) => !DUPLICATED_SUMMARY_KPIS.has(kpi.id));

  const trendColumns = [
    { key: 'month', title: 'Period' },
    {
      key: 'whiteList',
      title: 'White List',
      isMono: true,
      render: (value) => <p className="text-[var(--color-success)]">{value.toLocaleString()}</p>,
    },
    {
      key: 'grayList',
      title: 'Gray List',
      isMono: true,
      render: (value) => <p className="text-[var(--color-warning-text)]">{value.toLocaleString()}</p>,
    },
    {
      key: 'blackList',
      title: 'Blocked',
      isMono: true,
      render: (value) => <p className="text-[var(--color-error)]">{value.toLocaleString()}</p>,
    },
  ];

  const operatorColumns = [
    { key: 'operator', title: 'Operator' },
    {
      key: 'autoCount',
      title: 'Auto Sync',
      isMono: true,
      render: (value) => <p className="text-[var(--color-primary-dark)]">{value}</p>,
    },
    {
      key: 'deRegCount',
      title: 'De-Reg',
      isMono: true,
      render: (value) => <p className="text-[var(--color-primary-dark)]">{value}</p>,
    },
    {
      key: 'share',
      title: 'Share',
      render: (value) => <p className="font-semibold">{value}</p>,
    },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        className="dashboard-page-header"
        title="Dashboard"
        description="Monitor device registration, status, and operational activity."
        actions={
          <div className="grid grid-cols-1 gap-2 w-full sm:flex sm:flex-wrap sm:items-center sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
            <DateRangeFilter
              compact
              startDate={fromDate}
              endDate={toDate}
              onStartDateChange={setFromDate}
              onEndDateChange={setToDate}
            />
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={loadData}
              title="Refresh statistics"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </div>
        }
      />

      <section aria-label="Operational metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationalKpis.map((kpi) => {
            const Icon = KPI_ICONS[kpi.id] || Activity;
            return (
              <MetricCard
                key={kpi.id}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                category={kpi.category}
                tone={kpi.tone}
                icon={Icon}
                compact
              />
            );
          })}
        </div>
      </section>

      <section aria-label={t('Dashboard analytics view')}>
        <nav
          className="mb-4 overflow-x-auto overscroll-x-contain snap-x snap-proximity [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={t('Analytics view')}
          role="tablist"
        >
          <div className="inline-flex items-center gap-1 min-w-max p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            {[
              { id: 'data', label: 'Data View', icon: Table2 },
              { id: 'graph', label: 'Graph View', icon: ChartNoAxesCombined },
            ].map((view) => {
              const active = analyticsView === view.id;
              const ViewIcon = view.icon;
              return (
                <button
                  key={view.id}
                  type="button"
                  id={`dashboard-${view.id}-tab`}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`dashboard-${view.id}-panel`}
                  onClick={() => setAnalyticsView(view.id)}
                  className={'min-h-11 md:min-h-10 px-3.5 sm:px-4 py-2 snap-center rounded-[var(--radius-md)] type-label font-medium inline-flex items-center gap-2 border transition-colors whitespace-nowrap ' +
                    (active
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-[var(--shadow-sm)]'
                      : 'bg-transparent border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-primary-dark)]')}
                >
                  <ViewIcon className="w-4 h-4 shrink-0" />
                  <p>{t(view.label)}</p>
                </button>
              );
            })}
          </div>
        </nav>

        <div
          id={`dashboard-${analyticsView}-panel`}
          role="tabpanel"
          aria-labelledby={`dashboard-${analyticsView}-tab`}
        >
          {analyticsView === 'data' ? (
            <div className="space-y-5">
                    <Card
                      title="Registry Overview"
                      bodyClassName="p-0"
                    >
                      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.75fr]">
                        <section className="p-5 xl:border-r border-[var(--color-border)]">
                          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
                            <div>
                              <p className="type-label font-semibold text-[var(--color-text-primary)]">IMEI Distribution</p>
                              <p className="type-meta text-[var(--color-text-secondary)] mt-0.5">Active EIR device classification</p>
                            </div>
                            <p className="type-meta font-mono text-[var(--color-text-secondary)]">
                              Total 52,283,412
                            </p>
                          </div>
              
                          <div className="h-2.5 w-full rounded-full bg-[var(--color-background)] overflow-hidden flex">
                            <div
                              style={{ width: `${data.imeiSummary.whiteList.percent}%` }}
                              className="bg-[var(--color-success)]"
                              title={`White List: ${data.imeiSummary.whiteList.percent}%`}
                            />
                            <div
                              style={{ width: `${data.imeiSummary.grayList.percent}%` }}
                              className="bg-[var(--color-warning)]"
                              title={`Gray List: ${data.imeiSummary.grayList.percent}%`}
                            />
                            <div
                              style={{ width: `${data.imeiSummary.blackList.percent}%` }}
                              className="bg-[var(--color-error)]"
                              title={`Blocked: ${data.imeiSummary.blackList.percent}%`}
                            />
                          </div>
              
                          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border-subtle)] mt-4">
                            <div className="py-3 sm:py-0 sm:pr-5">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                                <p className="type-meta font-semibold text-[var(--color-success)]">White List</p>
                              </div>
                              <p className="type-body-lg font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1.5">
                                {data.imeiSummary.whiteList.count.toLocaleString()}
                              </p>
                              <p className="type-meta text-[var(--color-text-muted)] mt-0.5">
                                {data.imeiSummary.whiteList.percent}% of active fleet
                              </p>
                            </div>
              
                            <div className="py-3 sm:py-0 sm:px-5">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                                <p className="type-meta font-semibold text-[var(--color-warning-text)]">Gray List</p>
                              </div>
                              <p className="type-body-lg font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1.5">
                                {data.imeiSummary.grayList.count.toLocaleString()}
                              </p>
                              <p className="type-meta text-[var(--color-text-muted)] mt-0.5">
                                {data.imeiSummary.grayList.percent}% under grace
                              </p>
                            </div>
              
                            <div className="py-3 sm:py-0 sm:pl-5">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
                                <p className="type-meta font-semibold text-[var(--color-error)]">Blocked</p>
                              </div>
                              <p className="type-body-lg font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1.5">
                                {data.imeiSummary.blackList.count.toLocaleString()}
                              </p>
                              <p className="type-meta text-[var(--color-text-muted)] mt-0.5">
                                {data.imeiSummary.blackList.percent}% blocked
                              </p>
                            </div>
                          </div>
                        </section>
              
                        <section className="p-5 border-t xl:border-t-0 border-[var(--color-border)]">
                          <p className="type-label font-semibold text-[var(--color-text-primary)]">Registration Activity</p>
                          <p className="type-meta text-[var(--color-text-secondary)] mt-0.5">Current automated registration flow</p>
              
                          <div className="grid grid-cols-2 divide-x divide-[var(--color-border-subtle)] mt-5">
                            <div className="pr-4">
                              <p className="type-meta text-[var(--color-text-secondary)]">Auto Registered</p>
                              <p className="type-body-lg font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1">
                                {data.registrationSummary.autoRegistration.count.toLocaleString()}
                              </p>
                              <p className="type-meta text-[var(--color-success)] font-medium mt-0.5">
                                {data.registrationSummary.autoRegistration.change}
                              </p>
                            </div>
              
                            <div className="pl-4">
                              <p className="type-meta text-[var(--color-text-secondary)]">De-Registered</p>
                              <p className="type-body-lg font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1">
                                {data.registrationSummary.deRegistration.count.toLocaleString()}
                              </p>
                              <p className="type-meta text-[var(--color-primary-dark)] font-medium mt-0.5">
                                {data.registrationSummary.deRegistration.change}
                              </p>
                            </div>
                          </div>
              
                          <div className="pt-4 mt-5 border-t border-[var(--color-border-subtle)] flex items-start gap-2.5 type-meta text-[var(--color-success)]">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>All operator interfaces are healthy.</p>
                          </div>
                        </section>
                      </div>
                    </Card>
                            <div className="grid grid-cols-1 min-[1760px]:grid-cols-2 gap-4 items-start">
                          <Card
                            title="Recent 6-Month EIR Trajectory"
                            bodyClassName="p-0"
                            className="min-w-0"
                          >
                            <DataTable
                              embedded
                              stickyHeader={false}
                              keyField="month"
                              columns={trendColumns}
                              data={data.imeiSummary.recentMonthlyTrends}
                              renderMobileCard={(row) => (
                                <DashboardMobileDataCard
                                  title={row.month}
                                  fields={[
                                    {
                                      label: 'White List',
                                      value: row.whiteList.toLocaleString(),
                                      className: 'text-[var(--color-success)]',
                                    },
                                    {
                                      label: 'Gray List',
                                      value: row.grayList.toLocaleString(),
                                      className: 'text-[var(--color-warning-text)]',
                                    },
                                    {
                                      label: 'Blocked',
                                      value: row.blackList.toLocaleString(),
                                      className: 'text-[var(--color-error)]',
                                    },
                                  ]}
                                />
                              )}
                            />
                          </Card>
              
                          <Card
                            title="Operator Sync Breakdown"
                            bodyClassName="p-0"
                            className="min-w-0"
                          >
                            <DataTable
                              embedded
                              stickyHeader={false}
                              keyField="operator"
                              columns={operatorColumns}
                              data={data.registrationSummary.operatorBreakdown}
                              renderMobileCard={(row) => (
                                <DashboardMobileDataCard
                                  title={row.operator}
                                  fields={[
                                    {
                                      label: 'Auto Sync',
                                      value: row.autoCount,
                                      className: 'text-[var(--color-primary-dark)]',
                                    },
                                    {
                                      label: 'De-Reg',
                                      value: row.deRegCount,
                                      className: 'text-[var(--color-primary-dark)]',
                                    },
                                    {
                                      label: 'Share',
                                      value: row.share,
                                    },
                                  ]}
                                />
                              )}
                            />
                          </Card>
                        </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div
                  className="min-h-[320px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-sm)] flex items-center justify-center"
                  aria-live="polite"
                >
                  <p className="type-meta text-[var(--color-text-secondary)]">{t('Loading charts...')}</p>
                </div>
              }
            >
              <DashboardCharts
                kpis={data.kpis}
                imeiSummary={data.imeiSummary}
                registrationSummary={data.registrationSummary}
              />
            </Suspense>
          )}
        </div>
      </section>    </div>
  );
};
