import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { SpecialRegistrationReviewModal } from './SpecialRegistrationReviewModal.jsx';
import { listSpecialApplications, getSpecialApplication } from '../../services/neirSpecialRegistrationApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Eye, Download } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_STATUS_COUNTS = {
  All: 0,
  Pending: 0,
  'In Progress': 0,
  Accepted: 0,
  Rejected: 0,
};

export const SpecialRegistrationPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusCounts, setStatusCounts] = useState(DEFAULT_STATUS_COUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isMobileFeed = useMediaQuery('(max-width:1023px)');
  const { addToast } = useToast();
  const [loadError,setLoadError]=useState('');
  const [hasApplications,setHasApplications]=useState(false);
  const [loadingDetail,setLoadingDetail]=useState(false);

  const statusTabs = [
    { id: 'All', label: 'All Applications', count: statusCounts.All ?? 0 },
    { id: 'Pending', label: 'Pending Review', count: statusCounts.Pending ?? 0 },
    { id: 'In Progress', label: 'In Progress', count: statusCounts['In Progress'] ?? 0 },
    { id: 'Accepted', label: 'Accepted', count: statusCounts.Accepted ?? 0 },
    { id: 'Rejected', label: 'Rejected', count: statusCounts.Rejected ?? 0 },
  ];

  const loadRegistrations = async () => {
    try{
      setIsLoading(true);setLoadError('');
      const result=await listSpecialApplications();
      const applications=result.items||[];
      setHasApplications(applications.length>0);
      let rows=applications;
      if(searchTerm.trim()){
        const q=searchTerm.trim().toLowerCase();
        rows=rows.filter(r=>[r.imei,r.category,r.requesterName,r.citizenMobile,r.status,r.id]
          .some(value=>String(value||'').toLowerCase().includes(q)));
      }
      rows=rows.filter(r=>{
        const when=String(r.date||'').slice(0,10);
        return (!fromDate||when>=fromDate)&&(!toDate||when<=toDate);
      });
      const counts={...DEFAULT_STATUS_COUNTS};
      rows.forEach(r=>{counts.All+=1;if(Object.prototype.hasOwnProperty.call(counts,r.status))counts[r.status]+=1;});
      setStatusCounts(counts);
      const filtered=statusFilter==='All'?rows:rows.filter(r=>r.status===statusFilter);
      setData(filtered.map((r,index)=>({...r,sl:index+1})));
      setTotal(filtered.length);
    }catch(err){
      const message=err instanceof Error?err.message:'Failed to load applications.';
      setLoadError(message);setData([]);setTotal(0);setStatusCounts(DEFAULT_STATUS_COUNTS);
    }finally{setIsLoading(false);}
  };

  useEffect(() => {void loadRegistrations();},[statusFilter,searchTerm,fromDate,toDate,page,pageSize,isMobileFeed]);

  const handleOpenReview = async (item) => {
    if(loadingDetail)return;
    setLoadingDetail(true);
    try{
      const detail=await getSpecialApplication(item.id);
      const record=detail.record;
      setSelectedItem({...record,
        attachments:record.documents||[],
      });
      setIsReviewOpen(true);
    }catch(error){addToast(error instanceof Error?error.message:'Cannot open application','error');}
    finally{setLoadingDetail(false);}
  };

  const handleStatusUpdated = () => {void loadRegistrations();};

  const columns = [
    { key: 'sl', title: 'SL', width: '48px', maxWidth: '48px', isMono: true, sortable: false },
    {
      key: 'imei',
      title: 'IMEI Number',
      minWidth: '250px',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-semibold text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-secondary)] truncate">{row.brand} {row.model}</p>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Device Category',
      minWidth: '210px',
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'arrivalDate',
      title: 'Arrival Date',
      minWidth: '230px',
      isMono: true,
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val || '—'}</p>,
    },
    {
      key: 'status',
      title: 'Status',
      width: '130px',
      minWidth: '130px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'date',
      title: 'Date',
      width: '170px',
      minWidth: '170px',
      isMono: true,
      render: (val) => <p className="type-meta text-[var(--color-text-secondary)] font-mono">{val}</p>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '132px',
      minWidth: '132px',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenReview(row)}
        >
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {loadError && <div role="alert" className="p-3 rounded-lg border border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-text-primary)]">
        {loadError} <button type="button" onClick={loadRegistrations} className="ml-2 underline">Retry</button>
      </div>}
      {/* Page Header */}
      <PageHeader
        title="Special Registration"
        breadcrumbs={[
          { label: 'Special Registration' }
        ]}
        actions={
          <><Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={() => addToast('Exporting Special Registration CSV batch...', 'info')}
          >
            Export List
          </Button>
          <Button variant="outline" size="sm" onClick={loadRegistrations}>Refresh</Button></>
        }
      />

      {hasApplications && <TablePageWorkspace
        title="All Applications"
        count={total}
        tabs={statusTabs}
        activeTab={statusFilter}
        onTabChange={(id) => {
          setStatusFilter(id);
          setPage(1);
          setPageSize(DEFAULT_PAGE_SIZE);
        }}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search applications..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.imei, item.category, item.status])}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setPage(1);
                    setPageSize(DEFAULT_PAGE_SIZE);
                  }}
                  dateFilter={
                    <DateRangeFilter
                      compact
                      buttonLabel="Filter by Date"
                      className="shrink-0"
                      startDate={fromDate}
                      endDate={toDate}
                      onStartDateChange={(value) => {
                        setFromDate(value);
                        setPage(1);
                      }}
                      onEndDateChange={(value) => {
                        setToDate(value);
                        setPage(1);
                      }}
                    />
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={data}
                isLoading={isLoading||loadingDetail}
                onRowClick={handleOpenReview}
                pagination
                currentPage={page}
                totalPages={Math.ceil(total / pageSize) || 1}
                totalItems={total}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.imei}
                    subtitle={`${row.brand} ${row.model}`}
                    status={row.status}
                    fields={[
                      { label: 'Arrival Date', value: row.arrivalDate },
                      { label: 'Category', value: row.category },
                      { label: 'IMEI', value: row.imei, isMono: true },
                    ]}
                    footerMeta={row.date}
                  />
                )}
              />
      </TablePageWorkspace>}
      {!hasApplications && !isLoading && !loadError && <section className="neir-nbr-surface p-6 text-center">
        <h2 className="type-section-title text-[var(--color-text-primary)]">No Special Registration applications yet</h2>
        <p className="type-body-sm text-[var(--color-text-secondary)] mt-2">Applications submitted by citizens will appear here for review.</p>
      </section>}

      {/* Large Review Workspace Modal */}
      {selectedItem && (
        <SpecialRegistrationReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedItem(null);
          }}
          registration={selectedItem}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};
