import React, { useMemo } from 'react';
import { Drawer, DrawerSection } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { RolePermissionsPanel, getRoleActionSelection } from './RolePermissionsPanel.jsx';
import { Edit2 } from 'lucide-react';

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[minmax(140px,0.72fr)_minmax(0,1.28fr)] sm:gap-x-4">
    <p className="type-meta text-[var(--color-text-secondary)]">{label}</p>
    <p className="type-body-sm font-medium text-[var(--color-text-primary)] sm:text-right break-words">
      {value || '—'}
    </p>
  </div>
);

export const RoleDetailsDrawer = ({
  isOpen,
  onClose,
  role,
  parents = [],
  permissions = [],
  serviceActions = [],
  onEdit,
}) => {
  const selectedActionIds = useMemo(
    () => getRoleActionSelection(role, serviceActions),
    [role, serviceActions]
  );

  if (!role) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Role Details"
      subtitle={role.name}
      width="w-full sm:w-[720px]"
      footer={
        <div className="flex w-full justify-end">
          <Button variant="primary" icon={Edit2} onClick={() => onEdit?.(role)}>
            Edit Role
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden rounded-[var(--field-radius)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <DrawerSection title="Role Information">
          <div className="divide-y divide-[var(--color-border-subtle)]">
            <DetailRow label="Role Name" value={role.name} />
            <DetailRow label="Description" value={role.description} />
            <DetailRow
              label="Assigned Actions"
              value={`${selectedActionIds.size} of ${serviceActions.length}`}
            />
          </div>
        </DrawerSection>

        <DrawerSection
          title="Assigned Permissions"
          trailing={
            <p className="type-meta text-[var(--color-text-muted)]">
              {selectedActionIds.size}/{serviceActions.length}
            </p>
          }
        >
          <RolePermissionsPanel
            roleKey={role.id}
            parents={parents}
            permissions={permissions}
            serviceActions={serviceActions}
            selectedActionIds={selectedActionIds}
            editable={false}
          />
        </DrawerSection>
      </div>
    </Drawer>
  );
};
