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
import { signInSpecialReviewer, listSpecialApplications, getSpecialApplication, SPECIAL_REVIEW_SESSION_KEY } from '../../services/neirSpecialRegistrationApi.js';
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
  const [reviewToken,setReviewToken]=useState(()=>window.sessionStorage.getItem(SPECIAL_REVIEW_SESSION_KEY)||'');
  const [reviewUsername,setReviewUsername]=useState('neir-special-reviewer');
  const [reviewPassword,setReviewPassword]=useState('');
  const [reviewLoginBusy,setReviewLoginBusy]=useState(false);
  const [reviewLoginError,setReviewLoginError]=useState('');
  const [loadError,setLoadError]=useState('');
  const [loadingDetail,setLoadingDetail]=useState(false);
  const signInReviewer=async(event)=>{
    event.preventDefault();
    if(reviewLoginBusy)return;
    setReviewLoginBusy(true);setReviewLoginError('');
    try{
      const result=await signInSpecialReviewer(reviewUsername.trim(),reviewPassword);
      window.sessionStorage.setItem(SPECIAL_REVIEW_SESSION_KEY,result.token);
      setReviewToken(result.token);
      setReviewPassword('');
    }catch(error){setReviewLoginError(error instanceof Error?error.message:'Unable to sign in.');}
    finally{setReviewLoginBusy(false);}
  };
  const signOutReviewer=()=>{
    window.sessionStorage.removeItem(SPECIAL_REVIEW_SESSION_KEY);
    setReviewToken('');setData([]);setTotal(0);setSelectedItem(null);setStatusCounts(DEFAULT_STATUS_COUNTS);
  };

  const statusTabs = [
    { id: 'All', label: 'All Applications', count: statusCounts.All ?? 0 },
    { id: 'Pending', label: 'Pending Review', count: statusCounts.Pending ?? 0 },
    { id: 'In Progress', label: 'In Progress', count: statusCounts['In Progress'] ?? 0 },
    { id: 'Accepted', label: 'Accepted', count: statusCounts.Accepted ?? 0 },
    { id: 'Rejected', label: 'Rejected', count: statusCounts.Rejected ?? 0 },
  ];

  const loadRegistrations = async () => {
    if(!reviewToken)return;
    try{
      setIsLoading(true);setLoadError('');
      const result=await listSpecialApplications(reviewToken);
      let rows=result.items||[];
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
      if(/sign in again|expired/i.test(message))signOutReviewer();
    }finally{setIsLoading(false);}
  };

  useEffect(() => {if(reviewToken)void loadRegistrations();},[reviewToken,statusFilter,searchTerm,fromDate,toDate,page,pageSize,isMobileFeed]);

  const handleOpenReview = async (item) => {
    if(loadingDetail)return;
    setLoadingDetail(true);
    try{
      const detail=await getSpecialApplication(reviewToken,item.id);
      const record=detail.record;
      setSelectedItem({...record,
        requesterPhone:record.citizenMobile,
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
      key: 'requesterName',
      title: 'Requester / NID',
      minWidth: '230px',
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-medium text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-muted)] font-mono">{row.requesterNid}</p>
        </div>
      ),
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

  if(!reviewToken)return (
    <section className="max-w-xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-sm)] p-5 sm:p-7">
      <h2 className="type-page-title text-[var(--color-text-primary)]">Special Registration review</h2>
      <p className="type-body-sm text-[var(--color-text-secondary)] mt-2 mb-6">
        Sign in with an authorized Special Registration reviewer account. The general Admin preview login does not grant application access.
      </p>
      <form onSubmit={signInReviewer} className="flex flex-col gap-4">
        <label className="type-label font-medium">Reviewer username
          <input required autoComplete="username" value={reviewUsername}
            onChange={e=>setReviewUsername(e.target.value)}
            className="mt-1.5 w-full min-h-11 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"/>
        </label>
        <label className="type-label font-medium">Reviewer password
          <input type="password" required autoComplete="current-password" value={reviewPassword}
            onChange={e=>setReviewPassword(e.target.value)}
            className="mt-1.5 w-full min-h-11 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"/>
        </label>
        {reviewLoginError && <p role="alert" className="type-body-sm text-red-700">{reviewLoginError}</p>}
        <Button type="submit" variant="primary" isLoading={reviewLoginBusy}>Access Special Registration</Button>
      </form>
    </section>
  );
  return (
    <div className="space-y-4">
      {loadError && <div role="alert" className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-800">{loadError} <button type="button" onClick={loadRegistrations} className="ml-2 underline">Retry</button></div>}
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
          <Button variant="outline" size="sm" onClick={loadRegistrations}>Refresh</Button>
          <Button variant="outline" size="sm" onClick={signOutReviewer}>Reviewer sign out</Button></>
        }
      />

      <TablePageWorkspace
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
                  searchSuggestions={data.flatMap((item) => [item.imei, item.brand, item.model, item.requesterName, item.requesterNid])}
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
                      { label: 'Requester', value: row.requesterName },
                      { label: 'Category', value: row.category },
                      { label: 'Challan No', value: row.customsChallanNo, isMono: true },
                    ]}
                    footerMeta={row.date}
                  />
                )}
              />
      </TablePageWorkspace>

      {/* Large Review Workspace Modal */}
      {selectedItem && (
        <SpecialRegistrationReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedItem(null);
          }}
          registration={selectedItem}
          reviewerToken={reviewToken}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};
