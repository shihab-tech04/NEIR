import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { TextInput, Textarea } from '../../components/forms/TextInput.jsx';
import { RoleDetailsDrawer } from './RoleDetailsDrawer.jsx';
import { RolePermissionsPanel, getRoleActionSelection } from './RolePermissionsPanel.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, Eye } from 'lucide-react';

export const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [parents, setParents] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [serviceActions, setServiceActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [editingActionIds, setEditingActionIds] = useState(new Set());
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [r, p, perms, sa] = await Promise.all([
        mockApi.getRoles(),
        mockApi.getParents(),
        mockApi.getPermissions(),
        mockApi.getServiceActions(),
      ]);
      setRoles(r);
      setParents(p);
      setPermissions(perms);
      setServiceActions(sa);
    } catch (err) {
      addToast('Failed to load roles setup.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setNewRoleName('');
    setNewRoleDesc('');
    setEditingActionIds(new Set());
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    setNewRoleDesc(role.description || '');
    setEditingActionIds(getRoleActionSelection(role, serviceActions));
    setIsCreateModalOpen(true);
  };

  const handleOpenDetails = (role) => {
    setSelectedRole(role);
    setIsDetailsOpen(true);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      addToast('Please enter role name.', 'error');
      return;
    }

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: newRoleName,
                description: newRoleDesc,
                assignedActionsCount: editingActionIds.size,
              }
            : r
        )
      );
      addToast(`Role "${newRoleName}" updated.`, 'success');
    } else {
      const newRole = {
        id: `role-${Date.now().toString().slice(-4)}`,
        name: newRoleName,
        description: newRoleDesc,
        assignedActionsCount: 0,
      };
      setRoles((prev) => [...prev, newRole]);
      addToast(`Role "${newRoleName}" created.`, 'success');
    }
    setIsCreateModalOpen(false);
  };

  const filteredRoles = roles.filter((role) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      role.name.toLowerCase().includes(query) ||
      String(role.description || '').toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: 'name',
      title: 'Role Name',
      render: (val, row) => (
        <div>
          <p>{val}</p>
          {row.description && <p>{row.description}</p>}
        </div>
      ),
    },
    {
      key: 'assignedActionsCount',
      title: 'Assigned Actions',
      width: '180px',
      isMono: true,
      render: (val) => <p>{val} actions</p>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '190px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => handleOpenDetails(row)}
            className="type-meta h-7.5 px-2.5"
          >
            View details
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => handleOpenEdit(row)}
            className="type-meta h-7.5 px-2"
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Roles"
        breadcrumbs={[
          { label: 'Role Management' },
          { label: 'Roles' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Role
          </Button>
        }
      />

      <TablePageWorkspace
        title="Role List"
        count={filteredRoles.length}
        toolbar={
          <FilterBar
            embedded
            searchPlaceholder="Search roles..."
            searchValue={searchTerm}
            searchSuggestions={roles.flatMap((role) => [role.name, role.description]).filter(Boolean)}
            onSearchChange={setSearchTerm}
          />
        }
      >
        <DataTable
          embedded
          columns={columns}
          data={filteredRoles}
          isLoading={isLoading}
          pagination
          onRowClick={handleOpenDetails}
          onMobileCardClick={handleOpenDetails}
          renderMobileCard={(row) => (
            <MobileRecordCard
              title={row.name}
              subtitle={row.description}
              fields={[
                { label: 'Assigned Actions', value: `${row.assignedActionsCount} actions`, isMono: true },
              ]}
            />
          )}
        />
      </TablePageWorkspace>

      {/* Create / Edit Role Drawer */}
      <FormDrawer
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingRole ? 'Edit Role' : 'Create Role'}
        subtitle={editingRole ? editingRole.name : 'Add a new administrative role'}
        formId="role-form"
        onSubmit={handleSaveRole}
        submitLabel={editingRole ? 'Save Changes' : 'Create Role'}
      >
        <FormDrawerSection title="Role Information">
          <div className="space-y-4 pt-1">
            <TextInput
              label="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Regional Affairs Officer"
              required
            />
            <Textarea
              label="Role Description"
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              placeholder="Describe responsibilities..."
              rows={3}
            />
          </div>
        </FormDrawerSection>

        {editingRole && (
          <FormDrawerSection
            title="Permissions"
            trailing={
              <p className="type-meta text-[var(--color-text-muted)]">
                {editingActionIds.size}/{serviceActions.length}
              </p>
            }
          >
            <RolePermissionsPanel
              roleKey={editingRole.id}
              parents={parents}
              permissions={permissions}
              serviceActions={serviceActions}
              selectedActionIds={editingActionIds}
              onChange={setEditingActionIds}
              editable
            />
          </FormDrawerSection>
        )}
      </FormDrawer>

      {selectedRole && (
        <RoleDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedRole(null);
          }}
          role={selectedRole}
          parents={parents}
          permissions={permissions}
          serviceActions={serviceActions}
          onEdit={(role) => {
            setIsDetailsOpen(false);
            setSelectedRole(null);
            handleOpenEdit(role);
          }}
        />
      )}
    </div>
  );
};
