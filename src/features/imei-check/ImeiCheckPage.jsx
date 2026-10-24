import React, { useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { IMEIInput } from '../../components/forms/TextInput.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Modal } from '../../components/overlays/Modal.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Search, Smartphone, CheckCircle2, ShieldCheck, Globe, Radio } from 'lucide-react';

export const ImeiCheckPage = () => {
  const [imei, setImei] = useState('862940058912341');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!imei || imei.length < 14) {
      addToast('Please enter a valid 14–16 digit IMEI number.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await mockApi.checkImei(imei);
      setResult(res);
      setIsResultModalOpen(true);
    } catch (err) {
      addToast('Failed to query NEIR registry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="IMEI Check"
        breadcrumbs={[
          { label: 'IMEI Check' }
        ]}
      />

      {/* Centered Operational Card */}
      <div className="w-full">
        <Card
          title="Direct EIR Database Lookup"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <IMEIInput
              label="International Mobile Equipment Identity (IMEI)"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="e.g. 862940058912341"
              required
            />

            <div className="pt-2 border-t border-[var(--color-border)] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Search}
                isLoading={isLoading}
              >
                Verify IMEI
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Result Modal Dialog */}
      {result && (
        <Modal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          title="IMEI Verification Status"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            {/* Status Header Strip */}
            <div className="p-3.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg flex items-center justify-between">
              <div>
                <p className="type-meta font-semibold text-[var(--color-text-secondary)] tracking-wider">EIR Verdict</p>
                <p className="type-body-lg font-mono font-bold text-[var(--color-text-primary)]">{result.imei}</p>
              </div>
              <StatusBadge status={result.status} size="md" />
            </div>

            {/* Bilingual Verification Message */}
            <div className="p-3.5 rounded-lg border border-[var(--color-info-border)] bg-[var(--color-info-bg)] space-y-2">
              <div className="flex items-center gap-2 type-meta font-bold text-[var(--color-primary-dark)]">
                <Globe className="w-4 h-4" />
                <p>Official Status Response</p>
              </div>
              <p className="type-body-sm font-semibold text-[var(--color-text-primary)] leading-relaxed">
                {result.bengaliMessage}
              </p>
              <p className="type-meta text-[var(--color-text-secondary)]">
                {result.englishMessage}
              </p>
            </div>

            {/* Device Specification Box */}
            <div className="border border-[var(--color-border)] rounded-lg p-3.5 space-y-2 type-meta">
              <div className="flex justify-between pb-1.5 border-b border-[var(--color-border-subtle)]">
                <p className="text-[var(--color-text-secondary)]">Brand / Manufacturer:</p>
                <p className="font-semibold text-[var(--color-text-primary)]">{result.brand}</p>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--color-border-subtle)]">
                <p className="text-[var(--color-text-secondary)]">Model & Tier:</p>
                <p className="font-medium text-[var(--color-text-primary)]">{result.model}</p>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--color-border-subtle)]">
                <p className="text-[var(--color-text-secondary)]">GSMA Type Allocation Code (TAC):</p>
                <p className="font-mono font-semibold text-[var(--color-primary)]">{result.tac}</p>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[var(--color-border-subtle)]">
                <p className="text-[var(--color-text-secondary)]">Authorization Category:</p>
                <p className="text-[var(--color-text-primary)]">{result.importType}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[var(--color-text-secondary)]">Carrier Attachment:</p>
                <p className="text-[var(--color-primary-dark)] font-medium">{result.mnoAttachment}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
