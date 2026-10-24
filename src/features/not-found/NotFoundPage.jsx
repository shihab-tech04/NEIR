import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/forms/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error)] flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <p className="type-meta font-mono font-bold text-[var(--color-error)] tracking-wider bg-[var(--color-error-bg)] px-2.5 py-1 rounded">
        404 — Endpoint Not Found
      </p>
      <h1 className="type-display text-[var(--color-text-primary)] mt-3">
        Regulatory Route Unavailable
      </h1>
      <p className="type-meta text-[var(--color-text-secondary)] max-w-md mt-1">
        This page could not be found.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
