import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { CSVUpload } from '../../components/forms/FileUpload.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Download, Eye, UploadCloud } from 'lucide-react';

const manufacturerOptions = [
  'Oppo Bangladesh Ltd.',
  'Realme Bangladesh',
  'Samsung Electronics Bangladesh Ltd.',
  'Symphony Mobile (Edison Group)',
  'Vivo Mobile Bangladesh',
  'Walton Digi-Tech Industries Ltd.',
  'Xiaomi Technology Bangladesh',
];

export const ManufacturerUploadPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [manufacturer, setManufacturer] = useState('Samsung Electronics Bangladesh Ltd.');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.getManufacturerUploads({
        search: searchTerm,
        fromDate,
        toDate,
      });
      setData(response.items ?? response);
    } catch (err) {
      addToast('Failed to load manufacturer IMEI records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, fromDate, toDate]);

  useEffect(() => {
    if (searchParams.get('upload') === '1') {
      setIsUploadOpen(true);
    }
  }, [searchParams]);

  const closeUploadDrawer = () => {
    setIsUploadOpen(false);
    if (searchParams.get('upload') === '1') {
      setSearchParams({}, { replace: true });
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      'imei1,imei2,brand,model,tac\n862940058912341,862940058912342,Samsung,Galaxy A55,86294005\n867543048192019,867543048192020,Xiaomi,Redmi Note 13,86754304\n354890112458901,354890112458902,Apple,iPhone 15 Pro,35489011';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'btrc_neir_manufacturer_imei_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Sample CSV template downloaded.', 'info');
  };

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      addToast('Please attach a CSV data file first.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const result = await mockApi.uploadManufacturerBatch({
        manufacturer,
        file: selectedFile,
      });
      addToast(
        result.message || `Batch ${result.batchId} processed successfully.`,
        'success'
      );
      closeUploadDrawer();
      setSelectedFile(null);
      await loadData();
    } catch (err) {
      addToast(err.message || 'Failed to process batch upload.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const columns = [
    { key: 'sn', title: 'SL', width: '60px', isMono: true },
    {
      key: 'imei',
      title: 'IMEI',
      isMono: true,
      render: (value) => (
        <p className="font-mono font-semibold text-[var(--color-primary-dark)]">{value}</p>
      ),
    },
    { key: 'brand', title: 'Brand' },
    { key: 'model', title: 'Model' },
    {
      key: 'tac',
      title: 'TAC',
      isMono: true,
      render: (value) => <p className="font-mono text-[var(--color-text-secondary)]">{value}</p>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => <StatusBadge status={value} size="sm" />,
    },
    {
      key: 'createdAt',
      title: 'Upload Date',
      isMono: true,
      render: (value) => <p className="type-meta font-mono text-[var(--color-text-secondary)]">{value}</p>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '112px',
      sortable: false,
      render: (_, row) => (
        <Button variant="outline" size="sm" icon={Eye} onClick={() => handleOpenDetails(row)}>
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Manufacturer IMEI Upload"
        actions={
          <>
            <Button variant="outline" icon={Download} onClick={handleDownloadSample}>
              Download CSV Template
            </Button>
            <Button variant="primary" icon={UploadCloud} onClick={() => setIsUploadOpen(true)}>
              Upload CSV
            </Button>
          </>
        }
      />

      <TablePageWorkspace
        title="Manufacturer IMEI Records"
        count={data.length}
        toolbar={
          <FilterBar
            embedded
            searchPlaceholder="Search IMEI, brand, model or TAC..."
            searchValue={searchTerm}
            searchSuggestions={data.flatMap((item) => [item.imei, item.brand, item.model, item.tac])}
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
        <DataTable
          embedded
          columns={columns}
          data={data}
          isLoading={isLoading}
          pagination
          onRowClick={handleOpenDetails}
          renderMobileCard={(row) => (
            <MobileRecordCard
              title={row.imei}
              subtitle={row.brand}
              status={row.status}
              fields={[
                { label: 'Model', value: row.model },
                { label: 'TAC', value: row.tac },
              ]}
              footerMeta={row.createdAt}
            />
          )}
        />
      </TablePageWorkspace>

      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onExited={() => setSelectedRecord(null)}
          title="Manufacturer IMEI Record"
          recordId={selectedRecord.imei}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Device Details',
              items: [
                { label: 'IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'TAC', value: selectedRecord.tac, isMono: true },
                { label: 'Brand', value: selectedRecord.brand },
                { label: 'Model', value: selectedRecord.model },
              ],
            },
            {
              title: 'Upload Details',
              items: [
                { label: 'Status', value: selectedRecord.status },
                { label: 'Upload Date', value: selectedRecord.createdAt, isMono: true },
              ],
            },
          ]}
        />
      )}

      <FormDrawer
        isOpen={isUploadOpen}
        onClose={closeUploadDrawer}
        title="Upload Manufacturer IMEI"
        subtitle="Validate and ingest a manufacturer CSV batch"
        formId="manufacturer-imei-upload-form"
        onSubmit={handleUpload}
        submitLabel="Upload & Whitelist"
        submitIcon={UploadCloud}
        isLoading={isUploading}
      >
        <FormDrawerSection title="Batch Details">
          <div className="space-y-4">
            <Select
              label="Licensed Manufacturer / Importer"
              value={manufacturer}
              onChange={(event) => setManufacturer(event.target.value)}
              options={manufacturerOptions}
              required
            />
            <CSVUpload
              label="Manufactured Handsets CSV File"
              helperText="Required columns: imei1, imei2, brand, model, tac"
              onFileSelect={setSelectedFile}
              onSampleDownload={handleDownloadSample}
            />
          </div>
        </FormDrawerSection>

        <FormDrawerSection title="Batch Validation">
          <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-info-border)] bg-[var(--color-info-bg)]">
            <p className="type-body-sm font-medium text-[var(--color-text-primary)]">
              IMEI format, TAC and duplicate checks run automatically when the CSV is submitted.
            </p>
            <p className="type-meta text-[var(--color-text-secondary)] mt-1">
              Invalid rows remain excluded from the whitelist operation.
            </p>
          </div>
        </FormDrawerSection>
      </FormDrawer>
    </div>
  );
};
