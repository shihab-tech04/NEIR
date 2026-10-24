import React from 'react';
import { Save } from 'lucide-react';
import { Drawer, DrawerSection } from './Drawer.jsx';
import { Button } from '../forms/Button.jsx';

export const FormDrawerSection = DrawerSection;

export const FormDrawer = ({
  isOpen,
  onClose,
  onExited,
  title,
  subtitle,
  formId,
  onSubmit,
  submitLabel,
  submitVariant = 'primary',
  submitIcon = Save,
  isLoading = false,
  width = 'w-full sm:w-[760px]',
  children,
}) => (
  <Drawer
    isOpen={isOpen}
    onClose={onClose}
    onExited={onExited}
    title={title}
    subtitle={subtitle}
    width={width}
    footer={
      <div className="flex items-center justify-end gap-2 w-full max-md:flex-col-reverse max-md:[&>button]:w-full">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          form={formId}
          variant={submitVariant}
          icon={submitIcon}
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    }
  >
    <form id={formId} onSubmit={onSubmit}>
      <div className="border border-[var(--color-border)] rounded-[var(--field-radius)] overflow-hidden bg-[var(--color-surface)]">
        {children}
      </div>
    </form>
  </Drawer>
);
