import React, { useEffect, useRef, useState } from 'react';
import { FullScreenWorkspace } from '../../components/overlays/FullScreenWorkspace.jsx';
import { DocumentList, DocumentViewerPlaceholder } from '../../components/data-display/DocumentList.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Textarea } from '../../components/forms/TextInput.jsx';
import { ConfirmationDialog, Modal } from '../../components/overlays/Modal.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { mockApi } from '../../services/mockApi.js';
import { CheckCircle2, ChevronDown, FileText, Smartphone, User, ShieldCheck, XCircle } from 'lucide-react';

const CollapsibleSection = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  const { t } = usePreferences();

  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full min-h-11 px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[var(--color-background-subtle)] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-4 h-4 text-[var(--color-primary-dark)] shrink-0" />
          <p className="type-label font-semibold text-[var(--color-text-primary)] truncate">{t(title)}</p>
        </div>
        <ChevronDown
          className={'w-4 h-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-[var(--motion-base)] ' + (isOpen ? 'rotate-180' : '')}
        />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-[var(--color-border)]">
          {children}
        </div>
      )}
    </section>
  );
};

const ReviewDetailRow = ({ label, value, mono = false, emphasis = false }) => {
  const { t } = usePreferences();
  const displayValue = value === null || value === undefined || value === '' ? '—' : value;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(150px,0.75fr)_minmax(0,1.25fr)] gap-x-4 gap-y-1 py-2 border-b border-[var(--color-border-subtle)] last:border-b-0">
      <p className="type-meta text-[var(--color-text-secondary)]">{t(label)}</p>
      <p className={'type-body-sm sm:text-right break-words ' +
        (mono ? 'font-mono tabular-nums ' : '') +
        (emphasis ? 'font-semibold text-[var(--color-primary-dark)]' : 'font-medium text-[var(--color-text-primary)]')}>
        {displayValue}
      </p>
    </div>
  );
};

export const SpecialRegistrationReviewModal = ({
  isOpen,
  onClose,
  registration,
  onStatusUpdated,
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState(registration?.remarks || '');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const [openSections, setOpenSections] = useState({
    requester: true,
    device: true,
    attachments: true,
    remarks: true,
  });
  const { addToast } = useToast();
  const workspaceScrollRef = useRef(null);
  const reviewScrollPositionRef = useRef(0);
  const previewCloseTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (previewCloseTimerRef.current) {
        window.clearTimeout(previewCloseTimerRef.current);
        previewCloseTimerRef.current = null;
      }
      setIsPreviewClosing(false);
      setSelectedDoc(null);
      return;
    }

    setIsPreviewClosing(false);
    setSelectedDoc(null);
    setRemarks(registration?.remarks || '');
  }, [isOpen, registration?.id, registration?.remarks]);

  useEffect(() => () => {
    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current);
    }
  }, []);

  if (!registration) return null;

  const toggleSection = (section) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  const closeDesktopPreview = () => {
    if (!selectedDoc || isPreviewClosing) return;

    setIsPreviewClosing(true);
    if (previewCloseTimerRef.current) window.clearTimeout(previewCloseTimerRef.current);
    previewCloseTimerRef.current = window.setTimeout(() => {
      setSelectedDoc(null);
      setIsPreviewClosing(false);
      previewCloseTimerRef.current = null;
    }, 180);
  };

  const handleDocumentSelect = (document) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      reviewScrollPositionRef.current = workspaceScrollRef.current?.scrollTop || 0;
      setSelectedDoc(document);
      requestAnimationFrame(() => {
        if (workspaceScrollRef.current) workspaceScrollRef.current.scrollTop = 0;
      });
      return;
    }

    if (selectedDoc?.id === document.id) {
      closeDesktopPreview();
      return;
    }

    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current);
      previewCloseTimerRef.current = null;
    }
    setIsPreviewClosing(false);
    setSelectedDoc(document);
  };

  const handleMobileDocumentBack = () => {
    setSelectedDoc(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (workspaceScrollRef.current) {
          workspaceScrollRef.current.scrollTop = reviewScrollPositionRef.current;
        }
      });
    });
  };

  const handleWorkspaceClose = () => {
    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current);
      previewCloseTimerRef.current = null;
    }
    setIsPreviewClosing(false);
    setSelectedDoc(null);
    onClose();
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await mockApi.updateSpecialRegistrationStatus(registration.id, 'Accepted', remarks);
      addToast(`${registration.id} approved. IMEI added to White List.`, 'success');
      setIsApproveOpen(false);
      onStatusUpdated && onStatusUpdated(registration.id, 'Accepted');
      handleWorkspaceClose();
    } catch (err) {
      addToast('Failed to approve application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectRemarks.trim()) {
      addToast('Please provide an official rejection reason.', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      await mockApi.updateSpecialRegistrationStatus(registration.id, 'Rejected', rejectRemarks);
      addToast(`${registration.id} rejected. Review remarks saved.`, 'info');
      setIsRejectOpen(false);
      onStatusUpdated && onStatusUpdated(registration.id, 'Rejected');
      handleWorkspaceClose();
    } catch (err) {
      addToast('Failed to reject application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FullScreenWorkspace
        isOpen={isOpen}
        onClose={handleWorkspaceClose}
        title="Special Registration Review Dossier"
        identifier={registration.id}
        status={registration.status}
        mobileTitle={selectedDoc ? selectedDoc.type : undefined}
        mobileIdentifier={selectedDoc ? `${selectedDoc.title} · ${selectedDoc.size}` : registration.id}
        onMobileBack={selectedDoc ? handleMobileDocumentBack : undefined}
        hideMobileFooter={Boolean(selectedDoc)}
        contentRef={workspaceScrollRef}
        contentClassName={selectedDoc ? 'max-md:p-0 lg:h-full lg:overflow-hidden' : ''}
        maxWidth={selectedDoc ? 'max-w-[92vw]' : 'max-w-[720px]'}
        footer={
          <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:justify-end md:gap-3">
            <Button
              variant="dangerOutline"
              icon={XCircle}
              className="w-full md:w-auto"
              onClick={() => setIsRejectOpen(true)}
            >
              Reject Application
            </Button>
            <Button
              variant="primary"
              icon={CheckCircle2}
              className="w-full md:w-auto"
              onClick={() => setIsApproveOpen(true)}
            >
              Approve & Whitelist
            </Button>
          </div>
        }
      >
        <div className={(selectedDoc ? 'hidden md:grid ' : 'grid ') + 'grid-cols-1 gap-4 h-full min-h-0 transition-[grid-template-columns] duration-[var(--motion-slow)] ease-out ' + (selectedDoc ? 'lg:grid-cols-12' : '')}>
          <div className={selectedDoc
            ? 'lg:col-span-5 min-h-0 space-y-4 lg:overflow-y-auto lg:overscroll-contain lg:pr-1'
            : 'w-full max-w-5xl mx-auto space-y-4'}
          >
            <CollapsibleSection
              title="Requester & Citizen Identity"
              icon={User}
              isOpen={openSections.requester}
              onToggle={() => toggleSection('requester')}
            >
              <div>
                <ReviewDetailRow label="Full Name" value={registration.requesterName} />
                <ReviewDetailRow label="National ID / Passport" value={registration.requesterNid} mono />
                <ReviewDetailRow label="Contact Phone" value={registration.requesterPhone} mono />
                <ReviewDetailRow label="Application Date" value={registration.date} mono />
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Device Specifications"
              icon={Smartphone}
              isOpen={openSections.device}
              onToggle={() => toggleSection('device')}
            >
              <div>
                <ReviewDetailRow label="IMEI Number" value={registration.imei} mono emphasis />
                <ReviewDetailRow label="Brand / Make" value={registration.brand} />
                <ReviewDetailRow label="Model" value={registration.model} />
                <ReviewDetailRow label="Device Type" value={registration.deviceType} />
                <ReviewDetailRow label="Serial Number" value={registration.serialNumber} mono />
                <ReviewDetailRow label="Purchase Country" value={registration.purchaseCountry} />
                <ReviewDetailRow label="Customs Challan / Baggage No" value={registration.customsChallanNo} mono emphasis />
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title={`Dossier Attachments (${registration.attachments?.length || 0})`}
              icon={FileText}
              isOpen={openSections.attachments}
              onToggle={() => toggleSection('attachments')}
            >
              <DocumentList
                documents={registration.attachments || []}
                selectedDocId={selectedDoc?.id}
                onSelectDoc={handleDocumentSelect}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Application Verification Remarks"
              icon={ShieldCheck}
              isOpen={openSections.remarks}
              onToggle={() => toggleSection('remarks')}
            >
              <Textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter officer evaluation notes, customs tax verification references, or clearance remarks..."
                rows={3}
                aria-label="Application Verification Remarks"
              />
            </CollapsibleSection>
          </div>

          {selectedDoc && (
            <div
              key={selectedDoc.id}
              className={'lg:col-span-7 min-h-0 h-full flex flex-col min-w-0 ' + (isPreviewClosing ? 'preview-panel-exit' : 'preview-panel-enter')}
            >
              <DocumentViewerPlaceholder
                document={selectedDoc}
                onClosePreview={closeDesktopPreview}
              />
            </div>
          )}
        </div>

        {selectedDoc && (
          <div key={'mobile-' + selectedDoc.id} className="md:hidden h-full min-h-[calc(90dvh-64px)] bg-[var(--color-background-subtle)]">
            <DocumentViewerPlaceholder
              document={selectedDoc}
              focusedMobile
            />
          </div>
        )}
      </FullScreenWorkspace>

      <ConfirmationDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Special Registration"
        message={`Are you sure you want to approve Special Registration ${registration.id}? This will immediately broadcast IMEI ${registration.imei} to the EIR White List across Grameenphone, Robi, Banglalink, and Teletalk.`}
        confirmLabel="Confirm & Whitelist"
        tone="primary"
        isLoading={isSubmitting}
      />

      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Special Registration"
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full max-md:flex-col-reverse max-md:[&>button]:w-full">
            <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={isSubmitting}
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="type-meta text-[var(--color-text-secondary)]">
            Please enter the official regulatory reason for rejecting application {registration.id}. This will be communicated to the applicant.
          </p>
          <Textarea
            label="Official Rejection Reason"
            value={rejectRemarks}
            onChange={(event) => setRejectRemarks(event.target.value)}
            placeholder="e.g. Customs duty voucher invalid, mismatching IMEI serial on invoice, or exceeded allowable personal baggage quota."
            rows={3}
            required
          />
        </div>
      </Modal>
    </>
  );
};
