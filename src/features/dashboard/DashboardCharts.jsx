import React, { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card } from '../../components/data-display/Card.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const chartSx = {
  '& .MuiChartsAxis-tickLabel': {
    fill: 'var(--color-text-secondary)',
    fontFamily: 'inherit',
    fontSize: 'var(--type-meta-size)',
  },
  '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
    stroke: 'var(--color-border-strong)',
  },
  '& .MuiChartsGrid-line': {
    stroke: 'var(--color-border-subtle)',
  },
  '& .MuiChartsLegend-label': {
    fill: 'var(--color-text-secondary)',
    fontFamily: 'inherit',
    fontSize: 'var(--type-meta-size)',
  },
};

const parseCount = (value) => {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toIndex = (value, baseline) => {
  if (!baseline) return 0;
  return Number(((value / baseline) * 100).toFixed(2));
};

const DashboardCharts = ({
  kpis = [],
  imeiSummary,
  registrationSummary,
}) => {
  const { t, locale } = usePreferences();

  const compactFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }),
    [locale]
  );

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale]
  );

  const getKpiValue = (id) =>
    parseCount(kpis.find((item) => item.id === id)?.value);

  const trendData = imeiSummary?.recentMonthlyTrends ?? [];
  const operatorData = registrationSummary?.operatorBreakdown ?? [];

  const indexedTrendData = useMemo(() => {
    const baseline = trendData[0];
    if (!baseline) return [];

    return trendData.map((item) => ({
      month: item.month,
      whiteList: toIndex(item.whiteList, baseline.whiteList),
      grayList: toIndex(item.grayList, baseline.grayList),
      blackList: toIndex(item.blackList, baseline.blackList),
    }));
  }, [trendData]);

  const operatorChartData = useMemo(
    () =>
      operatorData.map((item) => ({
        operator: item.operator,
        autoCount: parseCount(item.autoCount),
        deRegCount: parseCount(item.deRegCount),
      })),
    [operatorData]
  );

  const specialRequestTotal = getKpiValue('special-req');
  const specialRequestAccepted = getKpiValue('special-req-accepted');
  const specialRequestPending = Math.max(0, specialRequestTotal - specialRequestAccepted);
  const acceptanceRate = specialRequestTotal
    ? (specialRequestAccepted / specialRequestTotal) * 100
    : 0;

  const lostDevices = getKpiValue('lost-devices');
  const recoveredDevices = getKpiValue('found-devices');
  const recoveryRate = lostDevices ? (recoveredDevices / lostDevices) * 100 : 0;

  const operationalVolume = [
    { category: t('Blocked Devices'), value: getKpiValue('blocked') },
    { category: t('Special Requests Total'), value: specialRequestTotal },
    { category: t('Lost Devices Reported'), value: lostDevices },
    { category: t('Access Denied'), value: getKpiValue('access-denied') },
    { category: t('Found Devices Recovered'), value: recoveredDevices },
  ];

  const specialRequestData = [
    {
      category: t('Requests'),
      accepted: specialRequestAccepted,
      pending: specialRequestPending,
    },
  ];

  const recoveryData = [
    { category: t('Reported'), value: lostDevices },
    { category: t('Recovered'), value: recoveredDevices },
  ];

  const indexFormatter = (value) =>
    value == null ? '' : Number(value).toFixed(1);

  const countFormatter = (value) =>
    value == null ? '' : numberFormatter.format(Number(value));

  const compactCountFormatter = (value) =>
    value == null ? '' : compactFormatter.format(Number(value));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <Card
          title="IMEI Registry Composition"
          subtitle="Current active EIR classification"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <PieChart
            series={[
              {
                innerRadius: 54,
                outerRadius: 84,
                paddingAngle: 1.5,
                cornerRadius: 3,
                data: [
                  {
                    id: 'white-list',
                    value: imeiSummary?.whiteList?.count ?? 0,
                    label: t('White List'),
                    color: 'var(--color-primary)',
                  },
                  {
                    id: 'gray-list',
                    value: imeiSummary?.grayList?.count ?? 0,
                    label: t('Gray List'),
                    color: 'var(--color-warning)',
                  },
                  {
                    id: 'blocked',
                    value: imeiSummary?.blackList?.count ?? 0,
                    label: t('Blocked'),
                    color: 'var(--color-error)',
                  },
                ],
                valueFormatter: (item) => countFormatter(item.value),
              },
            ]}
            height={230}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Special Request Outcome"
          subtitle={`${acceptanceRate.toFixed(1)}% accepted`}
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={specialRequestData}
            yAxis={[
              {
                scaleType: 'band',
                dataKey: 'category',
                width: 74,
              },
            ]}
            xAxis={[
              {
                height: 28,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                dataKey: 'accepted',
                label: t('Accepted'),
                stack: 'requests',
                color: 'var(--color-primary)',
                valueFormatter: countFormatter,
              },
              {
                dataKey: 'pending',
                label: t('Pending'),
                stack: 'requests',
                color: 'var(--color-secondary)',
                valueFormatter: countFormatter,
              },
            ]}
            layout="horizontal"
            height={230}
            borderRadius={4}
            margin={{ top: 22, right: 12, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Lost Device Recovery"
          subtitle={`${recoveryRate.toFixed(1)}% recovered`}
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={recoveryData}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'category',
                height: 38,
              },
            ]}
            yAxis={[
              {
                width: 48,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                dataKey: 'value',
                color: 'var(--color-primary-dark)',
                valueFormatter: countFormatter,
              },
            ]}
            height={230}
            grid={{ horizontal: true }}
            borderRadius={4}
            margin={{ top: 12, right: 12, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>
      </div>

      <Card
        title="Recent 6-Month EIR Trajectory"
        subtitle="Indexed trend · Oct 2025 = 100"
        bodyClassName="p-3 sm:p-4"
        className="min-w-0"
      >
        <LineChart
          dataset={indexedTrendData}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'month',
              height: 34,
            },
          ]}
          yAxis={[
            {
              width: 48,
              valueFormatter: indexFormatter,
            },
          ]}
          series={[
            {
              id: 'white-list-trend',
              dataKey: 'whiteList',
              label: t('White List'),
              color: 'var(--color-primary)',
              showMark: true,
              valueFormatter: indexFormatter,
            },
            {
              id: 'gray-list-trend',
              dataKey: 'grayList',
              label: t('Gray List'),
              color: 'var(--color-secondary)',
              showMark: true,
              valueFormatter: indexFormatter,
            },
            {
              id: 'blocked-trend',
              dataKey: 'blackList',
              label: t('Blocked'),
              color: 'var(--color-error)',
              showMark: true,
              valueFormatter: indexFormatter,
            },
          ]}
          height={310}
          grid={{ horizontal: true }}
          margin={{ top: 18, right: 18, bottom: 8, left: 8 }}
          sx={chartSx}
        />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <Card
          title="Operational Volume"
          subtitle="Current dashboard event counts"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={operationalVolume}
            yAxis={[
              {
                scaleType: 'band',
                dataKey: 'category',
                width: 142,
              },
            ]}
            xAxis={[
              {
                height: 28,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                dataKey: 'value',
                color: 'var(--color-primary-dark)',
                valueFormatter: countFormatter,
              },
            ]}
            layout="horizontal"
            height={310}
            grid={{ vertical: true }}
            borderRadius={4}
            margin={{ top: 12, right: 14, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Operator Sync Breakdown"
          subtitle="Auto Sync vs De-Registration by operator"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={operatorChartData}
            yAxis={[
              {
                scaleType: 'band',
                dataKey: 'operator',
                width: 118,
              },
            ]}
            xAxis={[
              {
                height: 28,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                id: 'auto-sync',
                dataKey: 'autoCount',
                label: t('Auto Sync'),
                color: 'var(--color-primary)',
                valueFormatter: countFormatter,
              },
              {
                id: 'de-registration',
                dataKey: 'deRegCount',
                label: t('De-Reg'),
                color: 'var(--color-secondary)',
                minBarSize: 3,
                valueFormatter: countFormatter,
              },
            ]}
            layout="horizontal"
            height={310}
            grid={{ vertical: true }}
            borderRadius={3}
            margin={{ top: 16, right: 14, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
