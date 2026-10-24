import React, { useEffect, useMemo, useState } from 'react';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

export const getRoleActionSelection = (role, serviceActions = []) => {
  const selected = new Set();
  if (!role) return selected;

  if (role.name === 'Super Admin') {
    serviceActions.forEach((action) => selected.add(action.id));
    return selected;
  }

  serviceActions
    .slice(0, Math.min(serviceActions.length, role.assignedActionsCount || 0))
    .forEach((action) => selected.add(action.id));

  return selected;
};

export const RolePermissionsPanel = ({
  roleKey,
  parents = [],
  permissions = [],
  serviceActions = [],
  selectedActionIds = new Set(),
  onChange,
  editable = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedParents, setExpandedParents] = useState(new Set());

  useEffect(() => {
    setSearchTerm('');
    setExpandedParents(new Set());
  }, [roleKey, editable]);

  const query = searchTerm.trim().toLowerCase();

  const visibleParents = useMemo(() => {
    const baseParents = editable
      ? parents
      : parents.filter((parent) => {
          const permissionIds = permissions
            .filter((permission) => permission.parentId === parent.id)
            .map((permission) => permission.id);

          return serviceActions.some(
            (action) =>
              permissionIds.includes(action.permissionId) &&
              selectedActionIds.has(action.id)
          );
        });

    if (!query) return baseParents;

    return baseParents.filter((parent) => {
      if (parent.name.toLowerCase().includes(query)) return true;

      const parentPermissions = permissions.filter(
        (permission) => permission.parentId === parent.id
      );

      return parentPermissions.some((permission) => {
        if (
          permission.name.toLowerCase().includes(query) ||
          String(permission.path || '').toLowerCase().includes(query)
        ) {
          return true;
        }

        return serviceActions.some(
          (action) =>
            action.permissionId === permission.id &&
            (editable || selectedActionIds.has(action.id)) &&
            (
              action.name.toLowerCase().includes(query) ||
              String(action.path || '').toLowerCase().includes(query) ||
              String(action.method || '').toLowerCase().includes(query)
            )
        );
      });
    });
  }, [
    parents,
    permissions,
    serviceActions,
    selectedActionIds,
    editable,
    query,
  ]);

  const toggleParent = (parentId) => {
    if (query) return;
    setExpandedParents((previous) => {
      const next = new Set(previous);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  const toggleAction = (actionId) => {
    if (!editable || !onChange) return;
    const next = new Set(selectedActionIds);
    if (next.has(actionId)) next.delete(actionId);
    else next.add(actionId);
    onChange(next);
  };

  const setParentSelection = (parentId, select) => {
    if (!editable || !onChange) return;

    const permissionIds = permissions
      .filter((permission) => permission.parentId === parentId)
      .map((permission) => permission.id);

    const actionIds = serviceActions
      .filter((action) => permissionIds.includes(action.permissionId))
      .map((action) => action.id);

    const next = new Set(selectedActionIds);
    actionIds.forEach((id) => {
      if (select) next.add(id);
      else next.delete(id);
    });
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <TextInput
        density="compact"
        icon={Search}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder={editable ? 'Search permissions...' : 'Search assigned permissions...'}
        aria-label={editable ? 'Search permissions' : 'Search assigned permissions'}
      />

      {editable && (
        <div className="flex items-center justify-between gap-3">
          <p className="type-meta text-[var(--color-text-secondary)]">
            {selectedActionIds.size} of {serviceActions.length} actions selected
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onChange?.(new Set(serviceActions.map((action) => action.id)))
              }
            >
              Select all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange?.(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {!editable && (
        <p className="type-meta text-[var(--color-text-secondary)]">
          {selectedActionIds.size} assigned actions
        </p>
      )}

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {visibleParents.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="type-body-sm font-medium text-[var(--color-text-primary)]">
              {editable ? 'No matching permissions' : 'No assigned permissions'}
            </p>
            <p className="type-meta text-[var(--color-text-secondary)] mt-1">
              {query ? 'Try a different search term.' : 'No actions are assigned to this role.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {visibleParents.map((parent) => {
              const parentPermissions = permissions.filter(
                (permission) => permission.parentId === parent.id
              );

              const allParentActions = serviceActions.filter((action) =>
                parentPermissions.some(
                  (permission) => permission.id === action.permissionId
                )
              );

              const selectedParentActions = allParentActions.filter((action) =>
                selectedActionIds.has(action.id)
              );

              const allSelected =
                allParentActions.length > 0 &&
                selectedParentActions.length === allParentActions.length;

              const isExpanded = query
                ? true
                : expandedParents.has(parent.id);

              const visiblePermissions = parentPermissions.filter((permission) => {
                const permissionActions = serviceActions.filter(
                  (action) =>
                    action.permissionId === permission.id &&
                    (editable || selectedActionIds.has(action.id))
                );

                if (!editable && permissionActions.length === 0) return false;

                if (!query || parent.name.toLowerCase().includes(query)) {
                  return true;
                }

                if (
                  permission.name.toLowerCase().includes(query) ||
                  String(permission.path || '').toLowerCase().includes(query)
                ) {
                  return true;
                }

                return permissionActions.some(
                  (action) =>
                    action.name.toLowerCase().includes(query) ||
                    String(action.path || '').toLowerCase().includes(query) ||
                    String(action.method || '').toLowerCase().includes(query)
                );
              });

              return (
                <section key={parent.id}>
                  <div className="flex min-h-11 items-center gap-2 px-3 hover:bg-[var(--color-background-subtle)]">
                    <button
                      type="button"
                      onClick={() => toggleParent(parent.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                      )}

                      <p className="type-body-sm font-medium text-[var(--color-text-primary)] truncate">
                        {parent.name}
                      </p>

                      <p className="type-meta text-[var(--color-text-muted)] shrink-0">
                        {editable
                          ? `${selectedParentActions.length}/${allParentActions.length}`
                          : `${selectedParentActions.length} actions`}
                      </p>
                    </button>

                    {editable && allParentActions.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setParentSelection(parent.id, !allSelected)
                        }
                        className="rounded-[var(--radius-sm)] px-2 py-1 type-meta font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                      >
                        {allSelected ? 'Clear' : 'Select all'}
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-background)]">
                      {visiblePermissions.length === 0 ? (
                        <p className="px-9 py-3 type-meta text-[var(--color-text-muted)]">
                          No permissions configured
                        </p>
                      ) : (
                        <div className="divide-y divide-[var(--color-border-subtle)]">
                          {visiblePermissions.map((permission) => {
                            const actionsForPermission = serviceActions.filter((action) => {
                              if (action.permissionId !== permission.id) return false;
                              if (!editable && !selectedActionIds.has(action.id)) return false;

                              if (
                                !query ||
                                parent.name.toLowerCase().includes(query) ||
                                permission.name.toLowerCase().includes(query)
                              ) {
                                return true;
                              }

                              return (
                                action.name.toLowerCase().includes(query) ||
                                String(action.path || '').toLowerCase().includes(query) ||
                                String(action.method || '').toLowerCase().includes(query)
                              );
                            });

                            return (
                              <div key={permission.id} className="px-3 py-3 sm:pl-9">
                                <div className="flex flex-col gap-0.5">
                                  <p className="type-body-sm font-medium text-[var(--color-text-primary)]">
                                    {permission.name}
                                  </p>
                                  <p className="type-meta text-[var(--color-text-muted)] break-all">
                                    {permission.path}
                                  </p>
                                </div>

                                {actionsForPermission.length === 0 ? (
                                  <p className="mt-2 type-meta text-[var(--color-text-muted)]">
                                    No actions configured
                                  </p>
                                ) : editable ? (
                                  <div className="mt-2 space-y-0.5">
                                    {actionsForPermission.map((action) => (
                                      <Checkbox
                                        key={action.id}
                                        className="min-h-10 w-full rounded-[var(--radius-sm)] px-1.5 py-1 hover:bg-[var(--color-surface-hover)]"
                                        label={action.name}
                                        description={`${action.method.charAt(0) + action.method.slice(1).toLowerCase()} · ${action.path}`}
                                        checked={selectedActionIds.has(action.id)}
                                        onChange={() => toggleAction(action.id)}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="mt-2 divide-y divide-[var(--color-border-subtle)]">
                                    {actionsForPermission.map((action) => (
                                      <div key={action.id} className="py-2">
                                        <p className="type-body-sm font-medium text-[var(--color-text-primary)]">
                                          {action.name}
                                        </p>
                                        <p className="type-meta text-[var(--color-text-secondary)] mt-0.5 break-all">
                                          {action.method.charAt(0) + action.method.slice(1).toLowerCase()} · {action.path}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
