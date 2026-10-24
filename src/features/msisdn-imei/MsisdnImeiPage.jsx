import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { CompactSelect } from '../../components/forms/Select.jsx';
import { IMEIInput, PhoneInput, TextInput } from '../../components/forms/TextInput.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Ban, Download, Eye, Radio, Search } from 'lucide-react';

const DetailRow = ({ label, value, mono = false }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[minmax(150px,0.72fr)_minmax(0,1.28fr)] gap-x-4 gap-y-1 py-2 border-b border-[var(--color-border-subtle)] last:border-b-0">
    <p className="type-meta text-[var(--color-text-secondary)]">{label}</p>
    <p className={'type-body-sm font-medium text-[var(--color-text-primary)] sm:text-right break-words ' + (mono ? 'font-mono tabular-nums' : '')}>
      {value || '—'}
    </p>
  </div>
);

export const MsisdnImeiPage = ({ initialAction = null }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('MSISDN');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const [checkImei, setCheckImei] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerImei, setRegisterImei] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [isDeregisterOpen, setIsDeregisterOpen] = useState(false);
  const [deregisterImei, setDeregisterImei] = useState('');
  const [nidLast4, setNidLast4] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isDeregistering, setIsDeregistering] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getMsisdnImeiList({
        search: searchTerm,
        searchBy,
        fromDate,
        toDate,
      });
      setData(res.items);
    } catch (err) {
      addToast('Failed to load MSISDN-IMEI records.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, searchBy, fromDate, toDate]);

  useEffect(() => {
    if (!initialAction) return;

    setIsDetailsOpen(false);
    setSelectedRecord(null);

    if (initialAction === 'check') {
      setCheckImei('');
      setCheckResult(null);
      setIsCheckOpen(true);
      return;
    }

    if (initialAction === 'register') {
      setRegisterImei('');
      setRegisterPhone('');
      setIsRegisterOpen(true);
      return;
    }

    if (initialAction === 'deregister') {
      setDeregisterImei('');
      setNidLast4('');
      setCurrentPhone('');
      setNewPhone('');
      setIsDeregisterOpen(true);
    }
  }, [initialAction]);

  const closeQuickAction = (setter) => {
    setter(false);
    if (initialAction) navigate('/msisdn-imei', { replace: true });
  };

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const openCheckDrawer = (imei = '') => {
    setCheckImei(imei);
    setCheckResult(null);
    setIsCheckOpen(true);
  };

  const openRegisterDrawer = (imei = '', phone = '') => {
    setRegisterImei(imei);
    setRegisterPhone(phone);
    setIsRegisterOpen(true);
  };

  const openDeregisterDrawer = (record) => {
    setIsDetailsOpen(false);
    setDeregisterImei(record.imei);
    setCurrentPhone(record.msisdn);
    setNidLast4('');
    setNewPhone('');
    setIsDeregisterOpen(true);
  };

  const handleCheckImei = async (event) => {
    event.preventDefault();
    if (!checkImei || checkImei.length < 14) {
      addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
      return;
    }

    try {
      setIsChecking(true);
      const result = await mockApi.checkImei(checkImei);
      setCheckResult(result);
    } catch (err) {
      addToast('Failed to query NEIR registry.', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!registerImei || registerImei.length < 14) {
      addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
      return;
    }
    if (!registerPhone.trim()) {
      addToast('Please provide the current phone number.', 'error');
      return;
    }

    try {
      setIsRegistering(true);
      const result = await mockApi.autoRegisterDevice({
        imei: registerImei,
        currentPhoneNumber: registerPhone,
      });
      addToast(result.message || 'Device paired and registered in NEIR.', 'success');
      setIsRegisterOpen(false);
      if (initialAction === 'register') navigate('/msisdn-imei', { replace: true });
      await loadData();
    } catch (err) {
      addToast(err.message || 'Auto registration failed.', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeregister = async (event) => {
    event.preventDefault();
    if (!deregisterImei || deregisterImei.length < 14) {
      addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
      return;
    }
    if (nidLast4.length !== 4) {
      addToast('Please enter exactly the last 4 digits of the registered citizen NID.', 'error');
      return;
    }
    if (!currentPhone.trim()) {
      addToast('Please provide current registered phone number.', 'error');
      return;
    }

    try {
      setIsDeregistering(true);
      const result = await mockApi.deregisterDevice({
        imei: deregisterImei,
        nidLast4,
        currentPhoneNumber: currentPhone,
        newPhoneNumber: newPhone,
      });
      addToast(result.message || 'Device de-registration instruction executed.', 'success');
      setIsDeregisterOpen(false);
      if (initialAction === 'deregister') navigate('/msisdn-imei', { replace: true });
      await loadData();
    } catch (err) {
      addToast(err.message || 'Device de-registration failed.', 'error');
    } finally {
      setIsDeregistering(false);
    }
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'imei',
      title: 'IMEI',
      isMono: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-semibold text-[var(--color-primary-dark)]">{value}</p>
          <p className="type-meta text-[var(--color-text-muted)]">{row.deviceModel}</p>
        </div>
      ),
    },
    {
      key: 'msisdn',
      title: 'MSISDN',
      isMono: true,
      render: (value) => <p className="font-mono font-semibold text-[var(--color-text-primary)]">{value}</p>,
    },
    {
      key: 'operator',
      title: 'Operator',
      render: (value) => (
        <div className="inline-flex items-center gap-1.5 type-meta font-semibold text-[var(--color-text-primary)]">
          <Radio className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <p>{value}</p>
        </div>
      ),
    },
    {
      key: 'lastRegistrationDate',
      title: 'Last Registration Date',
      isMono: true,
      render: (value) => <p className="type-meta text-[var(--color-text-secondary)] font-mono">{value}</p>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => <StatusBadge status={value} size="sm" />,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '112px',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenDetails(row)}
        >
          View details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="MSISDN IMEI List"
        actions={
          <>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => addToast('Exporting cellular binding extract...', 'info')}
            >
              Export Log
            </Button>
            <Button
              variant="outline"
              icon={Search}
              onClick={() => openCheckDrawer()}
            >
              Check IMEI
            </Button>
            <Button
              variant="primary"
              icon={Radio}
              onClick={() => openRegisterDrawer()}
            >
              Register Device
            </Button>
          </>
        }
      />

      <TablePageWorkspace
        title="MSISDN IMEI List"
        count={data.length}
        toolbar={
          <FilterBar
            embedded
            searchPlaceholder={searchBy === 'MSISDN' ? 'Search by MSISDN...' : 'Search by IMEI...'}
            searchValue={searchTerm}
            searchSuggestions={data.flatMap((item) => [item.msisdn, item.imei, item.deviceModel])}
            onSearchChange={setSearchTerm}
            onReset={() => {
              setSearchTerm('');
              setSearchBy('MSISDN');
            }}
            filters={
              <div className="w-full md:w-40">
                <CompactSelect
                  value={searchBy}
                  onChange={(event) => setSearchBy(event.target.value)}
                  options={[
                    { value: 'MSISDN', label: 'MSISDN' },
                    { value: 'IMEI', label: 'IMEI' },
                  ]}
                  placeholder=""
                  aria-label="Search by"
                />
              </div>
            }
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
              subtitle={row.msisdn}
              status={row.status}
              fields={[
                { label: 'Operator', value: row.operator },
                { label: 'Device', value: row.deviceModel },
              ]}
              footerMeta={row.lastRegistrationDate}
            />
          )}
        />
      </TablePageWorkspace>

      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onExited={() => {
            if (!isDeregisterOpen) setSelectedRecord(null);
          }}
          title="Subscriber Device Registration"
          recordId={selectedRecord.msisdn}
          status={selectedRecord.status}
          sections={[
            {
              title: 'Registration Details',
              items: [
                { label: 'MSISDN', value: selectedRecord.msisdn, isMono: true },
                { label: 'IMEI', value: selectedRecord.imei, isMono: true },
                { label: 'Operator', value: selectedRecord.operator },
                { label: 'Last Registration Date', value: selectedRecord.lastRegistrationDate, isMono: true },
              ],
            },
            {
              title: 'Device Details',
              items: [
                { label: 'Device Model', value: selectedRecord.deviceModel },
                { label: 'Registration Status', value: selectedRecord.status },
              ],
            },
          ]}
          footerActions={
            <div className="flex items-center justify-end gap-2 w-full max-md:flex-col max-md:[&>button]:w-full">
              <Button
                variant="outline"
                icon={Search}
                onClick={() => {
                  setIsDetailsOpen(false);
                  openCheckDrawer(selectedRecord.imei);
                }}
              >
                Check IMEI
              </Button>
              <Button variant="dangerOutline" icon={Ban} onClick={() => openDeregisterDrawer(selectedRecord)}>
                De-register Device
              </Button>
            </div>
          }
        />
      )}

      <FormDrawer
        isOpen={isCheckOpen}
        onClose={() => closeQuickAction(setIsCheckOpen)}
        title="Check IMEI"
        subtitle="Direct EIR database lookup"
        formId="imei-check-form"
        onSubmit={handleCheckImei}
        submitLabel="Verify IMEI"
        submitIcon={Search}
        isLoading={isChecking}
        width="w-full sm:w-[620px]"
      >
        <FormDrawerSection title="IMEI Lookup">
          <IMEIInput
            label="International Mobile Equipment Identity (IMEI)"
            value={checkImei}
            onChange={(event) => {
              setCheckImei(event.target.value);
              setCheckResult(null);
            }}
            required
          />
        </FormDrawerSection>

        {checkResult && (
          <FormDrawerSection
            title="Verification Result"
            trailing={<StatusBadge status={checkResult.status} size="sm" />}
          >
            <div>
              <DetailRow label="IMEI" value={checkResult.imei} mono />
              <DetailRow label="TAC" value={checkResult.tac} mono />
              <DetailRow label="Brand / Manufacturer" value={checkResult.brand} />
              <DetailRow label="Model" value={checkResult.model} />
              <DetailRow label="Registered Date" value={checkResult.registeredDate} mono />
              <DetailRow label="Operator Attachment" value={checkResult.mnoAttachment} />
              <DetailRow label="Import Type" value={checkResult.importType} />
              <div className="mt-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-info-border)] bg-[var(--color-info-bg)]">
                <p className="type-body-sm font-semibold text-[var(--color-text-primary)]">{checkResult.bengaliMessage}</p>
                <p className="type-meta text-[var(--color-text-secondary)] mt-1">{checkResult.englishMessage}</p>
              </div>
            </div>
          </FormDrawerSection>
        )}
      </FormDrawer>

      <FormDrawer
        isOpen={isRegisterOpen}
        onClose={() => closeQuickAction(setIsRegisterOpen)}
        title="Register Device"
        subtitle="Manual network sync registration"
        formId="device-register-form"
        onSubmit={handleRegister}
        submitLabel="Register Device"
        submitIcon={Radio}
        isLoading={isRegistering}
      >
        <FormDrawerSection title="Device Registration">
          <div className="space-y-4">
            <IMEIInput
              label="IMEI Number"
              value={registerImei}
              onChange={(event) => setRegisterImei(event.target.value)}
              required
            />
            <PhoneInput
              label="Current Phone Number"
              value={registerPhone}
              onChange={(event) => setRegisterPhone(event.target.value)}
              required
            />
          </div>
        </FormDrawerSection>
      </FormDrawer>

      <FormDrawer
        isOpen={isDeregisterOpen}
        onClose={() => {
          setSelectedRecord(null);
          closeQuickAction(setIsDeregisterOpen);
        }}
        title="De-register Device"
        subtitle="Remove or reassign the current subscriber binding"
        formId="device-deregister-form"
        onSubmit={handleDeregister}
        submitLabel="De-register Device"
        submitVariant="danger"
        submitIcon={Ban}
        isLoading={isDeregistering}
      >
        <FormDrawerSection title="Current Registration">
          <div className="space-y-4">
            <IMEIInput
              label="IMEI Number"
              value={deregisterImei}
              onChange={(event) => setDeregisterImei(event.target.value)}
              required
              readOnly={Boolean(selectedRecord)}
            />
            <TextInput
              label="Last 4 Digits of Registered NID"
              value={nidLast4}
              onChange={(event) => setNidLast4(event.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              inputMode="numeric"
              required
            />
            <PhoneInput
              label="Current Phone Number"
              value={currentPhone}
              onChange={(event) => setCurrentPhone(event.target.value)}
              required
            />
            <PhoneInput
              label="New Phone Number"
              value={newPhone}
              onChange={(event) => setNewPhone(event.target.value)}
              helperText="Optional. Leave blank to unassign the IMEI"
            />
          </div>
        </FormDrawerSection>
      </FormDrawer>
    </div>
  );
};
