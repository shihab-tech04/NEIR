import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Eye, Download, Ban } from 'lucide-react';

export const LostStolenPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadError, setLoadError] = useState('');
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      const res = await mockApi.getLostStolenDevices({
        search: searchTerm,
        fromDate,
        toDate,
      });
      setData(res.items);
    } catch (err) {
      const message = err.message || 'Failed to retrieve lost/stolen registry.';
      setLoadError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, fromDate, toDate]);

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'imei',
      title: 'IMEI Number',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-semibold text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-secondary)] truncate">{row.deviceDetails.brand} {row.deviceDetails.model} ({row.deviceDetails.color})</p>
        </div>
      ),
    },
    {
      key: 'requestedBy',
      title: 'Requested By / Thana GD',
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-medium text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-muted)] font-mono">{row.thana}</p>
        </div>
      ),
    },
    {
      key: 'reportDate',
      title: 'Report Date',
      isMono: true,
      render: (val) => <p className="type-meta text-[var(--color-text-secondary)] font-mono">{val}</p>,
    },
    {
      key: 'status',
      title: 'Current Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenDetails(row)}
          className="type-meta h-7.5 px-2.5"
        >
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lost and Stolen Devices"
        breadcrumbs={[
          { label: 'Lost & Stolen' }
        ]}
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={() => addToast('Downloading Lost/Stolen EIR police extract...', 'info')}
          >
            Export
          </Button>
        }
      />

      <TablePageWorkspace
        title="Lost & Stolen Registry"
        count={data.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search records..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.imei, item.gdNumber, item.requestedBy, item.thana])}
                  onSearchChange={setSearchTerm}
                  dateFilter={
                    <DateRangeFilter
                      compact
                      className="shrink-0"
                      startDate={fromDate}
                      endDate={toDate}
                      onStartDateChange={setFromDate}
                      onEndDateChange={setToDate}
                    />
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading}
          pagination
                onRowClick={handleOpenDetails}
                isError={Boolean(loadError)}
                errorMessage={loadError}
                onRetry={loadData}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.imei}
                    subtitle={`${row.deviceDetails.brand} ${row.deviceDetails.model}`}
                    status={row.status}
                    fields={[
                      { label: 'Requested By', value: row.requestedBy },
                      { label: 'GD Number', value: row.gdNumber, isMono: true },
                      { label: 'Last Seen Carrier', value: row.deviceDetails.lastSeenOperator },
                    ]}
                    footerMeta={row.reportDate}
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Right-Side Record Details Drawer */}
      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          onExited={() => {
            setSelectedRecord(null);
          }}
          title="Lost / Stolen Handset Dossier"
          recordId={selectedRecord.id}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Police & Citizen Information',
              items: [
                { label: 'Complainant Name', value: selectedRecord.requestedBy },
                { label: 'General Diary (GD) No.', value: selectedRecord.gdNumber, isMono: true },
                { label: 'Police Station / Thana', value: selectedRecord.thana },
                { label: 'Citizen NID', value: selectedRecord.ownerNid, isMono: true },
                { label: 'Contact Phone', value: selectedRecord.ownerPhone, isMono: true },
              ]
            },
            {
              title: 'Device & Radio Network Information',
              items: [
                { label: 'IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'Brand & Model', value: `${selectedRecord.deviceDetails.brand} ${selectedRecord.deviceDetails.model}` },
                { label: 'Color', value: selectedRecord.deviceDetails.color },
                { label: 'Last Reported Location', value: selectedRecord.deviceDetails.lastSeenLocation },
                { label: 'Last Active MNO Carrier', value: selectedRecord.deviceDetails.lastSeenOperator },
                { label: 'Last Cellular Ping', value: selectedRecord.deviceDetails.lastSeenTimestamp, isMono: true },
              ]
            },
            {
              title: 'Audit & EIR Trigger Trail',
              items: selectedRecord.actionHistory.map(h => ({
                label: `${h.date} (${h.actor})`,
                value: h.event
              }))
            }
          ]}
          footerActions={
            <Button
              variant="danger"
              icon={Ban}
              onClick={() => {
                addToast(`Re-broadcasted Blacklist command for IMEI ${selectedRecord.imei}`, 'success');
                setIsDrawerOpen(false);
              }}
            >
              Re-Broadcast Blacklist
            </Button>
          }
        />
      )}
    </div>
  );
};
