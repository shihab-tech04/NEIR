import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { TextInput } from '../../components/forms/TextInput.jsx';
import { Select, SearchableSelect } from '../../components/forms/Select.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2 } from 'lucide-react';

export const ServiceActionPage = () => {
  const [serviceActions, setServiceActions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [parents, setParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParentFilter, setSelectedParentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    name: '',
    parentId: '',
    permissionId: '',
    path: '',
    method: 'GET',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [actions, perms, pars] = await Promise.all([
        mockApi.getServiceActions(),
        mockApi.getPermissions(),
        mockApi.getParents(),
      ]);
      setServiceActions(actions);
      setPermissions(perms);
      setParents(pars);
    } catch (err) {
      addToast('Failed to load service actions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    const initialParent = parents.length > 0 ? parents[0].id : '';
    const availablePerms = permissions.filter((p) => p.parentId === initialParent);

    setFormState({
      name: '',
      parentId: initialParent,
      permissionId: availablePerms.length > 0 ? availablePerms[0].id : '',
      path: '',
      method: 'GET',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const permObj = permissions.find((p) => p.id === item.permissionId);
    setFormState({
      name: item.name,
      parentId: permObj ? permObj.parentId : '',
      permissionId: item.permissionId,
      path: item.path,
      method: item.method,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.path.trim() || !formState.permissionId) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    const permObj = permissions.find((p) => p.id === formState.permissionId);
    const parentObj = parents.find((p) => p.id === formState.parentId);

    if (editingItem) {
      setServiceActions((prev) =>
        prev.map((sa) =>
          sa.id === editingItem.id
            ? {
                ...sa,
                ...formState,
                permissionName: permObj ? permObj.name : sa.permissionName,
                parentName: parentObj ? parentObj.name : sa.parentName,
              }
            : sa
        )
      );
      addToast(`Service Action "${formState.name}" updated.`, 'success');
    } else {
      const newItem = {
        id: `sa-${Date.now().toString().slice(-4)}`,
        ...formState,
        permissionName: permObj ? permObj.name : 'Permission Node',
        parentName: parentObj ? parentObj.name : 'Parent Module',
      };
      setServiceActions((prev) => [...prev, newItem]);
      addToast(`Service Action "${formState.name}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  // Dependent permissions based on selected Parent
  const dependentPermissions = permissions.filter(
    (p) => !formState.parentId || p.parentId === formState.parentId
  );

  const filteredData = serviceActions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.permissionName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getMethodBadge = (method) => (
    <p className="type-meta font-medium text-[var(--color-text-primary)]">
      {method.charAt(0) + method.slice(1).toLowerCase()}
    </p>
  );

  const columns = [
    {
      key: 'name',
      title: 'Service Action Name',
      render: (val) => <p>{val}</p>,
    },
    {
      key: 'permissionName',
      title: 'Permission Name',
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'parentName',
      title: 'Parent Name',
      render: (val) => (
        <p className="type-meta text-[var(--color-text-secondary)] bg-[var(--color-background)] px-2 py-0.5 rounded border border-[var(--color-border)]">
          {val}
        </p>
      ),
    },
    {
      key: 'path',
      title: 'Path',
      isMono: true,
      render: (val) => <p className="font-mono type-meta text-[var(--color-text-secondary)]">{val}</p>,
    },
    {
      key: 'method',
      title: 'Method',
      width: '90px',
      render: (val) => getMethodBadge(val),
    },
    {
      key: 'actions',
      title: 'Action',
      width: '90px',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Edit2}
          onClick={() => handleOpenEdit(row)}
          className="type-meta h-7 px-2"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Service Action"
        breadcrumbs={[
          { label: 'Role Management', href: '/role-management/roles' },
          { label: 'Service Action' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Service Action
          </Button>
        }
      />

      <TablePageWorkspace
        title="Service Action List"
        count={filteredData.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search service actions..."
                  searchValue={searchTerm}
                  searchSuggestions={serviceActions.flatMap((item) => [item.name, item.path, item.permissionName, item.parentName])}
                  onSearchChange={setSearchTerm}
                  onReset={() => setSearchTerm('')}
                />
        }
      >
        <DataTable
          embedded
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          pagination
          onMobileCardClick={handleOpenEdit}
          renderMobileCard={(row) => (
            <MobileRecordCard
              title={row.name}
              subtitle={row.permissionName}
              fields={[
                { label: 'Parent Module', value: row.parentName },
                { label: 'Path', value: row.path, isMono: true },
                { label: 'Method', value: row.method.charAt(0) + row.method.slice(1).toLowerCase(), isMono: true },
              ]}
            />
          )}
        />
      </TablePageWorkspace>

      {/* Create / Edit Modal */}
      <FormDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Service Action' : 'Create Service Action'}
        subtitle={editingItem ? editingItem.path : 'Add an operational service endpoint'}
        formId="service-action-form"
        onSubmit={handleSave}
        submitLabel={editingItem ? 'Save Changes' : 'Create Service Action'}
      >
        <FormDrawerSection title="Permission Mapping">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <Select
              label="Parent Module"
              value={formState.parentId}
              onChange={(e) => {
                const pId = e.target.value;
                const perms = permissions.filter((p) => p.parentId === pId);
                setFormState({
                  ...formState,
                  parentId: pId,
                  permissionId: perms.length > 0 ? perms[0].id : '',
                });
              }}
              options={parents.map((p) => ({ value: p.id, label: p.name }))}
              required
            />
            <Select
              label="Associated Permission"
              value={formState.permissionId}
              onChange={(e) => setFormState({ ...formState, permissionId: e.target.value })}
              options={dependentPermissions.map((p) => ({ value: p.id, label: p.name }))}
              required
            />
          </div>
        </FormDrawerSection>
        <FormDrawerSection title="Service Endpoint">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <TextInput
              label="Service Action Name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              placeholder="e.g. Broadcast Global IMEI Blacklist"
              required
            />
            <Select
              label="Action HTTP Method"
              value={formState.method}
              onChange={(e) => setFormState({ ...formState, method: e.target.value })}
              options={[
                { value: 'GET', label: 'Get' },
                { value: 'POST', label: 'Post' },
                { value: 'PUT', label: 'Put' },
                { value: 'DELETE', label: 'Delete' },
              ]}
              required
            />
            <div className="sm:col-span-2">
              <TextInput
                label="API Route Path"
                value={formState.path}
                onChange={(e) => setFormState({ ...formState, path: e.target.value })}
                placeholder="e.g. /api/v1/imei/global-block"
                required
              />
            </div>
          </div>
        </FormDrawerSection>
      </FormDrawer>
    </div>
  );
};
