import React from 'react';
import { ChevronRight, FileText, Download, X } from 'lucide-react';
import { Button } from '../forms/Button.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const DocumentList = ({ documents = [], selectedDocId, onSelectDoc, className = '' }) => {
  const { t } = usePreferences();

  return (
    <div className={'flex flex-col gap-2 ' + className}>
      {documents.map((doc) => {
        const selected = selectedDocId === doc.id;
        return (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelectDoc?.(doc)}
            className={'w-full text-left px-0 py-3 md:p-3 border-0 border-b md:border md:rounded-[var(--radius-lg)] transition-colors flex items-center justify-between cursor-pointer ' +
              (selected ? 'md:border-[var(--color-primary)] md:bg-[var(--color-info-bg)] md:shadow-[var(--shadow-sm)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background-subtle)]')}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={'w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ' + (selected ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]')}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="type-meta font-semibold text-[var(--color-primary-dark)]">{doc.type}</p>
                <p className="type-body-sm font-medium text-[var(--color-text-primary)] truncate mt-0.5">{doc.title}</p>
                <div className="type-meta text-[var(--color-text-muted)] flex items-center gap-2 mt-0.5 font-mono">
                  <p className="hidden md:block truncate">{doc.filename}</p>
                  <p className="hidden md:block">·</p>
                  <p>{doc.size}</p>
                </div>
              </div>
            </div>
            <div className="shrink-0 ml-2">
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] md:hidden" />
              <p className={'hidden md:block type-meta px-2 py-1 rounded-[var(--radius-md)] font-medium ' + (selected ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] bg-[var(--color-background)]')}>
                {selected ? t('Viewing') : t('Inspect')}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const DocumentViewerPlaceholder = ({ document, onClosePreview, focusedMobile = false, className = '' }) => {
  const { t } = usePreferences();

  if (!document) {
    return (
      <div className={'h-full min-h-[400px] border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-background-subtle)] flex flex-col items-center justify-center p-6 text-center ' + className}>
        <FileText className="w-10 h-10 text-[var(--color-text-muted)] mb-2" />
        <h4 className="type-body-sm font-semibold text-[var(--color-text-primary)]">{t('No Document Selected')}</h4>
        <p className="type-meta text-[var(--color-text-muted)] max-w-xs mt-1">{t('Select an official document or customs receipt from the dossier list to preview.')}</p>
      </div>
    );
  }

  return (
    <section className={'flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden shadow-xs ' + (focusedMobile ? 'max-md:border-0 max-md:rounded-none max-md:shadow-none ' : '') + className}>
      <div className={(focusedMobile ? 'hidden md:flex ' : 'flex ') + 'px-4 py-3 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]'}>
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <div className="min-w-0">
            <p className="type-meta font-semibold text-[var(--color-text-primary)] truncate">{document.type}</p>
            <p className="type-meta text-[var(--color-text-secondary)] truncate mt-0.5">{document.title}</p>
          </div>
        </div>

        {onClosePreview && (
          <button
            type="button"
            onClick={onClosePreview}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] transition-colors shrink-0"
            aria-label={t('Close preview')}
            title={t('Close preview')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)] flex flex-wrap items-center gap-x-3 gap-y-2 type-meta">
        <p className="font-mono text-[var(--color-text-secondary)]">{document.filename}</p>
        <p className="text-[var(--color-text-muted)]">·</p>
        <p className="text-[var(--color-text-secondary)]">{document.size}</p>
        <p className="text-[var(--color-text-muted)]">·</p>
        <p className="text-[var(--color-text-secondary)]">{document.date || '2026-03-20'}</p>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Document "' + document.filename + '" downloaded.')}
            icon={Download}
          >
            Download
          </Button>
        </div>
      </div>

      <div className={'flex-1 overflow-auto bg-[var(--color-background-subtle)] ' + (focusedMobile ? 'min-h-[55dvh] p-3 md:min-h-[420px] md:p-4' : 'min-h-[420px] p-4')}>
        <div className={'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 ' + (focusedMobile ? 'min-h-[50dvh] md:min-h-[520px]' : 'min-h-[520px]')}>
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
            <div className="min-w-0">
              <p className="type-body-sm font-semibold text-[var(--color-text-primary)] truncate">{document.title}</p>
              <p className="type-meta font-mono text-[var(--color-text-muted)] mt-1 truncate">{document.filename}</p>
            </div>
            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="py-4 space-y-4" aria-hidden="true">
            <div className="h-2.5 w-2/5 rounded bg-[var(--color-border-subtle)]" />
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-11/12 rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-4/5 rounded bg-[var(--color-background-subtle)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-subtle)]" />
              <div className="h-24 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-subtle)]" />
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-5/6 rounded bg-[var(--color-background-subtle)]" />
              <div className="h-2 w-3/5 rounded bg-[var(--color-background-subtle)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
