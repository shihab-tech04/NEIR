import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { FormDrawer, FormDrawerSection } from '../../components/overlays/FormDrawer.jsx';
import { TextInput, Textarea } from '../../components/forms/TextInput.jsx';
import { Select, CompactSelect } from '../../components/forms/Select.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, Award } from 'lucide-react';

export const DesignationsPage = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { addToast } = useToast();

  const [formState, setFormState] = useState({
    title: '',
    departmentId: '',
    rankGrade: 'Grade-5',
    description: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [des, depts] = await Promise.all([
        mockApi.getDesignations(),
        mockApi.getDepartments(),
      ]);
      setDesignations(des);
      setDepartments(depts);
    } catch (err) {
      addToast('Failed to load designations.', 'error');
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
      title: '',
      departmentId: departments.length > 0 ? departments[0].id : '',
      rankGrade: 'Grade-5',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      title: item.title,
      departmentId: item.departmentId,
      rankGrade: item.rankGrade,
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.departmentId) {
      addToast('Please complete required fields.', 'error');
      return;
    }

    const deptObj = departments.find((d) => d.id === formState.departmentId);
    const departmentName = deptObj ? deptObj.name : 'Engineering';

    if (editingItem) {
      setDesignations((prev) =>
        prev.map((d) =>
          d.id === editingItem.id ? { ...d, ...formState, departmentName } : d
        )
      );
      addToast(`Designation "${formState.title}" updated.`, 'success');
    } else {
      const newItem = {
        id: `des-${Date.now().toString().slice(-4)}`,
        ...formState,
        departmentName,
        userCount: 0,
      };
      setDesignations((prev) => [...prev, newItem]);
      addToast(`Designation "${formState.title}" created.`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredData = designations.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDeptFilter === 'All' || d.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'title',
      title: 'Designation Title',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[var(--color-primary)]" />
          <p className="font-semibold text-[var(--color-text-primary)]">{val}</p>
        </div>
      ),
    },
    {
      key: 'departmentName',
      title: 'Department',
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'rankGrade',
      title: 'Pay Grade / Rank',
      isMono: true,
      width: '130px',
      render: (val) => val ? (
        <p className="font-mono type-meta bg-[var(--color-background)] px-2 py-0.5 rounded border border-[var(--color-border)] font-semibold text-[var(--color-primary)]">
          {val}
        </p>
      ) : <p className="type-meta text-[var(--color-text-muted)]">—</p>,
    },
    {
      key: 'userCount',
      title: 'Staff Assigned',
      width: '120px',
      isMono: true,
      render: (val) => <p className="font-mono type-meta text-[var(--color-text-secondary)]">{val} Officers</p>,
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
        title="Designation"
        breadcrumbs={[
          { label: 'Office' },
          { label: 'Designation' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Designation
          </Button>
        }
      />

      <TablePageWorkspace
        title="Designation List"
        count={filteredData.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Filter designations..."
                  searchValue={searchTerm}
                  searchSuggestions={designations.flatMap((item) => [item.title, item.departmentName])}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setSelectedDeptFilter('All');
                  }}
                  filters={
                    <div className="w-full md:w-56">
                      <CompactSelect
                        value={selectedDeptFilter}
                        onChange={(e) => setSelectedDeptFilter(e.target.value)}
                        options={[
                          { value: 'All', label: 'All Departments' },
                          ...departments.map((d) => ({ value: d.id, label: d.name })),
                        ]}
                        placeholder=""
                        aria-label="Filter by department"
                      />
                    </div>
                  }
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
              title={row.title}
              subtitle={row.departmentName}
              fields={[
                { label: 'Pay Grade / Rank', value: row.rankGrade, isMono: true },
                { label: 'Staff Assigned', value: `${row.userCount} officers`, isMono: true },
              ]}
            />
          )}
        />
      </TablePageWorkspace>

      <FormDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Designation' : 'Create Designation'}
        subtitle={editingItem ? editingItem.departmentName : 'Add a new official designation'}
        formId="designation-form"
        onSubmit={handleSave}
        submitLabel={editingItem ? 'Save Changes' : 'Create Designation'}
      >
        <FormDrawerSection title="Designation Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <TextInput
              label="Designation Title"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="e.g. Senior Deputy Director (Spectrum)"
              required
            />
            <Select
              label="Department"
              value={formState.departmentId}
              onChange={(e) => setFormState({ ...formState, departmentId: e.target.value })}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              required
            />
            <div className="sm:col-span-2">
              <TextInput
                label="National Pay Grade / Rank"
                value={formState.rankGrade}
                onChange={(e) => setFormState({ ...formState, rankGrade: e.target.value })}
                placeholder="e.g. Grade-4"
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Job Description Summary"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="Brief scope of responsibilities..."
                rows={3}
              />
            </div>
          </div>
        </FormDrawerSection>
      </FormDrawer>
    </div>
  );
};
