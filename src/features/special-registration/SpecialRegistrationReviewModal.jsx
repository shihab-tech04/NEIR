import React, { useEffect, useRef, useState } from 'react';
import { FullScreenWorkspace } from '../../components/overlays/FullScreenWorkspace.jsx';
import { DocumentViewerPlaceholder } from '../../components/data-display/DocumentList.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Textarea } from '../../components/forms/TextInput.jsx';
import { ConfirmationDialog, Modal } from '../../components/overlays/Modal.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { updateSpecialApplication } from '../../services/neirSpecialRegistrationApi.js';
import { CheckCircle2, ChevronDown, FileText, Smartphone, ShieldCheck, XCircle } from 'lucide-react';

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
      await updateSpecialApplication(registration.id,'Accepted',remarks);
      addToast(`${registration.id} accepted.`, 'success');
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
      addToast('Please provide a rejection reason.', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateSpecialApplication(registration.id,'Rejected',rejectRemarks);
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
        title="Special Registration Review"
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
              Approve Application
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
              title="Device Specifications"
              icon={Smartphone}
              isOpen={openSections.device}
              onToggle={() => toggleSection('device')}
            >
              <div>
                <ReviewDetailRow label="IMEI Number" value={registration.imei} mono emphasis />
                <ReviewDetailRow label="Acquisition method" value={registration.category} />
                <ReviewDetailRow label="Arrival date" value={registration.arrivalDate} />
                <ReviewDetailRow label="Submitted on" value={registration.date} />
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title={`Document Checklist (${registration.attachments?.length || 0})`}
              icon={FileText}
              isOpen={openSections.attachments}
              onToggle={() => toggleSection('attachments')}
            >
              <div className="space-y-2">
                {(registration.attachments || []).map((doc) => (
                  <button key={doc.id} type="button" onClick={() => handleDocumentSelect(doc)}
                    aria-label={doc.uri ? 'Preview ' + doc.title : doc.title + ' — file unavailable'}
                    disabled={!doc.uri}
                    className={'flex w-full items-center gap-3 min-h-11 rounded-lg border border-[var(--color-border)] px-3 py-2 text-left ' +
                      (doc.uri ? 'cursor-pointer hover:bg-[var(--color-background-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary-dark)]' : 'opacity-70 cursor-not-allowed')}>
                    <CheckCircle2 aria-hidden="true" className={'h-5 w-5 shrink-0 ' + (doc.uri ? 'text-green-600' : 'text-[var(--color-text-muted)]')} />
                    <span className="min-w-0 flex-1">
                      <span className="type-body-sm block text-[var(--color-text-primary)]">{doc.title}</span>
                      {doc.filename && <span className="type-meta block truncate text-[var(--color-text-secondary)]">{doc.filename}{doc.size ? ' · ' + doc.size : ''}</span>}
                      {!doc.uri && <span className="type-meta block text-[var(--color-text-secondary)]">Uploaded file is unavailable for preview</span>}
                    </span>
                    {doc.uri && <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--color-primary-dark)]" />}
                  </button>
                ))}
                {!(registration.attachments?.length) && <p className="type-body-sm text-[var(--color-text-secondary)]">No documents selected.</p>}
              </div>
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
              {selectedDoc.uri ? <section className="flex flex-col h-full min-h-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between gap-3">
                  <p className="type-body-sm truncate font-medium">{selectedDoc.filename}</p>
                  <div className="flex gap-2">
                    <a href={selectedDoc.uri} download={selectedDoc.filename} target="_blank" rel="noopener noreferrer" className="text-sm underline text-[var(--color-primary-dark)]">Download</a>
                    <button type="button" aria-label="Close document preview" className="min-h-9 px-2 border rounded-lg" onClick={closeDesktopPreview}>Close</button>
                  </div>
                </div>
                {selectedDoc.filename?.toLowerCase().match(/\.(jpg|jpeg|png)$/)
                  ? <img src={selectedDoc.uri} alt={selectedDoc.title} className="w-full h-full min-h-0 object-contain"/>
                  : <iframe src={selectedDoc.uri} title={selectedDoc.title} className="w-full h-full min-h-[420px] border-0"/>}
              </section> : <DocumentViewerPlaceholder document={selectedDoc} onClosePreview={closeDesktopPreview} />}
            </div>
          )}
        </div>

        {selectedDoc && (
          <div key={'mobile-' + selectedDoc.id} className="md:hidden h-full min-h-[calc(90dvh-64px)] bg-[var(--color-background-subtle)]">
            {selectedDoc.uri ? <div className="h-full min-h-[55dvh] p-3 space-y-3">
              <a href={selectedDoc.uri} target="_blank" rel="noopener noreferrer" download={selectedDoc.filename}
                className="type-body-sm text-[var(--color-primary-dark)] underline">Open / download {selectedDoc.filename}</a>
              {selectedDoc.filename?.toLowerCase().match(/\.(jpg|jpeg|png)$/)
                ? <img src={selectedDoc.uri} alt={selectedDoc.title} className="w-full max-h-[72dvh] object-contain"/>
                : <iframe src={selectedDoc.uri} title={selectedDoc.title} className="w-full h-[68dvh] border-0"/>}
            </div> : <DocumentViewerPlaceholder document={selectedDoc} focusedMobile />}
          </div>
        )}
      </FullScreenWorkspace>

      <ConfirmationDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Special Registration"
        message={`Approve Special Registration ${registration.id}? This updates the application status and the citizen view.`}
        confirmLabel="Confirm Approval"
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
