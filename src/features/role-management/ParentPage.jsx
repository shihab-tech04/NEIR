import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { TextInput, NumberInput } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, FolderTree } from 'lucide-react';

const MENU_LOCATION_OPTIONS = [
  'Main Navigation Rail',
  'Top Navigation Bar',
  'Administrative Settings Rail',
  'Footer Links',
];

const normalizeMenuLocation = (location) => {
  if (location === 'Top Navigation') return 'Top Navigation Bar';
  return MENU_LOCATION_OPTIONS.includes(location) ? location : 'Main Navigation Rail';
};

export const ParentPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addToast } = useToast();

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    path: '',
    icon: 'FolderTree',
    position: 1,
    location: 'Main Navigation Rail',
    hasChildren: false,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getParents();
      setData(res);
    } catch (err) {
      addToast('Failed to load parents.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormState({
      name: '',
      path: '',
      icon: 'FolderTree',
      position: data.length + 1,
      location: 'Main Navigation Rail',
      hasChildren: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      path: item.path,
      icon: item.icon,
      position: item.position,
      location: normalizeMenuLocation(item.location),
      hasChildren: item.hasChildren || false,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.path.trim()) {
      addToast('Please enter both Name and Path.', 'error');
      return;
    }

    if (editingItem) {
      setData((prev) =>
        prev.map((p) => (p.id === editingItem.id ? { ...p, ...formState } : p))
      );
      addToast(`Parent "${formState.name}" updated.`, 'success');
    } else {
      const newItem = {
        id: `p-${Date.now().toString().slice(-4)}`,
        ...formState,
      };
      setData((prev) => [...prev, newItem]);
      addToast(`Parent "${formState.name}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      title: 'Parent Name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[var(--color-primary)]" />
          <p className="font-semibold text-[var(--color-text-primary)]">{val}</p>
        </div>
      ),
    },
    {
      key: 'path',
      title: 'Path',
      isMono: true,
      render: (val) => <p className="font-mono type-meta text-[var(--color-text-secondary)]">{val}</p>,
    },
    {
      key: 'icon',
      title: 'Icon',
      isMono: true,
      render: (val) => <p className="font-mono type-meta bg-[var(--color-background)] px-2 py-0.5 rounded border border-[var(--color-border)]">{val}</p>,
    },
    {
      key: 'location',
      title: 'Location',
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'position',
      title: 'Position',
      isMono: true,
      width: '80px',
      render: (val) => <p className="font-mono font-bold text-center block text-[var(--color-text-primary)]">{val}</p>,
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
        title="Parent"
        breadcrumbs={[
          { label: 'Role Management', href: '/role-management/roles' },
          { label: 'Parent' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Parent
          </Button>
        }
      />

      <TablePageWorkspace
        title="Parent List"
        count={filteredData.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search parents..."
                  searchValue={searchTerm}
                  searchSuggestions={data.flatMap((item) => [item.name, item.path])}
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
              subtitle={row.path}
              fields={[
                { label: 'Location', value: row.location },
                { label: 'Position', value: row.position, isMono: true },
                { label: 'Icon', value: row.icon, isMono: true },
              ]}
            />
          )}
        />
      </TablePageWorkspace>

      {/* Create / Edit Modal */}
      <FormDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Parent Module' : 'Create Parent Module'}
        subtitle={editingItem ? editingItem.path : 'Add a navigation parent module'}
        formId="parent-module-form"
        onSubmit={handleSave}
        submitLabel={editingItem ? 'Save Changes' : 'Create Parent'}
      >
        <FormDrawerSection title="Module Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <TextInput
              label="Parent Name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              placeholder="e.g. Device Operations"
              required
            />
            <TextInput
              label="Route Path"
              value={formState.path}
              onChange={(e) => setFormState({ ...formState, path: e.target.value })}
              placeholder="e.g. /device-operations"
              required
            />
            <TextInput
              label="Icon Identifier"
              value={formState.icon}
              onChange={(e) => setFormState({ ...formState, icon: e.target.value })}
              placeholder="e.g. ShieldCheck"
            />
            <TextInput
              label="Sort Position"
              type="number"
              value={formState.position}
              onChange={(e) => setFormState({ ...formState, position: Number(e.target.value) })}
              min={1}
            />
          </div>
        </FormDrawerSection>
        <FormDrawerSection title="Navigation Placement">
          <div className="space-y-4 pt-1">
            <Select
              label="Menu Location"
              value={formState.location}
              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
              options={MENU_LOCATION_OPTIONS}
            />
            <Checkbox
              label="Has Nested Child Routes"
              checked={formState.hasChildren}
              onChange={(e) => setFormState({ ...formState, hasChildren: e.target.checked })}
            />
          </div>
        </FormDrawerSection>
      </FormDrawer>
    </div>
  );
};
