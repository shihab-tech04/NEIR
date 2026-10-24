import React, { useEffect, useState } from 'react';
import { RadioGroup } from '../../components/forms/RadioGroup.jsx';
import { IMEIInput, Textarea } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { CSVUpload } from '../../components/forms/FileUpload.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { ConfirmationDialog } from '../../components/overlays/Modal.jsx';
import { Alert } from '../../components/feedback/Alert.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Ban } from 'lucide-react';

const initialState = {
  blockType: 'single',
  imei: '864920194820194',
  batchImeis: '',
  selectedFile: null,
  reason: 'Law Enforcement Requisition (Police GD)',
  remarks: 'DMP Detective Branch Requisition #DB-2026-9912. Immediate nationwide blacklist.',
};

export const BlockImeiDrawer = ({
  isOpen,
  onClose,
  onExited,
  onBlocked,
}) => {
  const [blockType, setBlockType] = useState(initialState.blockType);
  const [imei, setImei] = useState(initialState.imei);
  const [batchImeis, setBatchImeis] = useState(initialState.batchImeis);
  const [selectedFile, setSelectedFile] = useState(initialState.selectedFile);
  const [reason, setReason] = useState(initialState.reason);
  const [remarks, setRemarks] = useState(initialState.remarks);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    setBlockType(initialState.blockType);
    setImei(initialState.imei);
    setBatchImeis(initialState.batchImeis);
    setSelectedFile(initialState.selectedFile);
    setReason(initialState.reason);
    setRemarks(initialState.remarks);
    setIsConfirmOpen(false);
  }, [isOpen]);

  const handleInitiateBlock = (event) => {
    event.preventDefault();

    if (blockType === 'single') {
      if (!imei || imei.length < 14) {
        addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
        return;
      }
    } else if (!batchImeis.trim() && !selectedFile) {
      addToast('Please enter batch IMEI list or attach a CSV file.', 'error');
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleExecuteBlock = async () => {
    try {
      setIsLoading(true);
      const result = await mockApi.blockGlobalImei({
        blockType: blockType === 'single' ? 'Single IMEI' : 'Batch List',
        imei:
          blockType === 'single'
            ? imei
            : `${batchImeis.split('\n').filter(Boolean).length || 5} Batch IMEIs`,
        reason,
        remarks,
      });

      addToast('Global IMEI Blacklist directive broadcasted across all 4 MNOs.', 'success');
      setIsConfirmOpen(false);
      await onBlocked?.(result.record);
      onClose();
    } catch (err) {
      addToast('Failed to execute global block instruction.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormDrawer
        isOpen={isOpen}
        onClose={onClose}
        onExited={onExited}
        title="Block IMEI"
        subtitle="Create a nationwide EIR blacklist directive"
        formId="global-imei-block-form"
        onSubmit={handleInitiateBlock}
        submitLabel="Block IMEI Globally"
        submitVariant="danger"
        submitIcon={Ban}
        isLoading={isLoading}
      >
        <FormDrawerSection title="Block Target">
          <div className="flex flex-col gap-4 pt-1">
            <Alert variant="warning" title="Critical Regulatory Action">
              Blocking an IMEI prevents network attachment across all operators.
            </Alert>

            <RadioGroup
              label="Block Mode"
              name="blockType"
              value={blockType}
              onChange={setBlockType}
              variant="cards"
              className="w-full"
              options={[
                { value: 'single', label: 'Single IMEI Target' },
                { value: 'batch', label: 'Batch IMEI List / Bulk Requisition' },
              ]}
            />

            {blockType === 'single' ? (
              <IMEIInput
                label="Target IMEI Number"
                value={imei}
                onChange={(event) => setImei(event.target.value)}
                placeholder="e.g. 864920194820194"
                required
              />
            ) : (
              <div className="space-y-3">
                <Textarea
                  label="Batch IMEI List (One per line)"
                  value={batchImeis}
                  onChange={(event) => setBatchImeis(event.target.value)}
                  placeholder={'864920194820194\n862940058912341\n354890112458901'}
                  rows={4}
                />
                <p className="type-meta text-center text-[var(--color-text-muted)]">or upload CSV</p>
                <CSVUpload
                  label="Batch Requisition CSV File"
                  onFileSelect={setSelectedFile}
                />
              </div>
            )}
          </div>
        </FormDrawerSection>

        <FormDrawerSection title="Legal & Operational Justification">
          <div className="space-y-4 pt-1">
            <Select
              label="Official Blocking Reason / Authority"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              options={[
                'Law Enforcement Requisition (Police GD)',
                'Court Order / Judicial Mandate',
                'National Security Agency Directive',
                'Confirmed Stolen / Armed Robbery',
                'Cloned / Duplicated IMEI Fraud',
                'Unapproved Illegal Import Seizure',
              ]}
              required
            />

            <Textarea
              label="Operational Case Reference / Remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder="Enter Thana GD reference number, court case ID, or investigating officer details..."
              rows={3}
              required
            />
          </div>
        </FormDrawerSection>
      </FormDrawer>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteBlock}
        title="Confirm Nationwide IMEI Blacklist"
        message={`Are you sure you want to permanently blacklist ${
          blockType === 'single' ? `IMEI ${imei}` : 'this batch of handsets'
        }? This will immediately bar cellular service across all MNOs.`}
        confirmLabel="Execute Global Block"
        tone="danger"
        isLoading={isLoading}
      />
    </>
  );
};
