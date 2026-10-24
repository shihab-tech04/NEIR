import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { RecordDetailsDrawer } from '../../components/overlays/Drawer.jsx';
import { UserFormDrawer } from './UserFormPage.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { CompactSelect } from '../../components/forms/Select.jsx';
import { StatusBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Plus, Edit2, Eye, UserCheck, Shield } from 'lucide-react';

export const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pendingEditUser, setPendingEditUser] = useState(null);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [u, d] = await Promise.all([
        mockApi.getOfficeUsers(),
        mockApi.getDepartments(),
      ]);
      setUsers(u);
      setDepartments(d);
    } catch (err) {
      addToast('Failed to load user directory.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (user, event) => {
    event?.stopPropagation?.();
    setEditingUser(user);
    setIsFormDrawerOpen(true);
  };

  const handleEditFromDetails = () => {
    setPendingEditUser(selectedUser);
    setIsDrawerOpen(false);
  };

  const handleDetailsExited = () => {
    setSelectedUser(null);
    if (pendingEditUser) {
      setEditingUser(pendingEditUser);
      setPendingEditUser(null);
      setIsFormDrawerOpen(true);
    }
  };

  const handleUserSaved = async () => {
    await loadData();
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      deptFilter === 'All' || u.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'fullName',
      title: 'Officer Name / Email',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-deep)] text-white flex items-center justify-center font-bold type-meta shrink-0">
            <p>{val.charAt(0)}</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)] block">{val}</p>
            <p className="type-meta text-[var(--color-text-secondary)] font-mono">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      title: 'Username',
      isMono: true,
      render: (val) => <p className="font-mono type-meta text-[var(--color-primary)] font-semibold">{val}</p>,
    },
    {
      key: 'department',
      title: 'Department',
      render: (val) => <p className="type-meta text-[var(--color-text-primary)]">{val}</p>,
    },
    {
      key: 'designation',
      title: 'Designation',
      render: (val) => <p className="type-meta font-medium text-[var(--color-text-secondary)]">{val}</p>,
    },
    {
      key: 'role',
      title: 'Role',
      render: (val) => (
        <p className="type-meta font-semibold bg-[var(--color-info-bg)] text-[var(--color-primary-dark)] px-2 py-0.5 rounded border border-[var(--color-info-border)]">
          {val}
        </p>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '150px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => handleOpenDetails(row)}
            className="type-meta h-7 px-2"
          >
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={(event) => handleOpenEdit(row, event)}
            className="type-meta h-7 px-2"
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
        title="User"
        breadcrumbs={[
          { label: 'Office' },
          { label: 'User' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create User
          </Button>
        }
      />

      <TablePageWorkspace
        title="User List"
        count={filteredUsers.length}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search users..."
                  searchValue={searchTerm}
                  searchSuggestions={users.flatMap((item) => [item.fullName, item.username, item.email, item.designation])}
                  onSearchChange={setSearchTerm}
                  onReset={() => {
                    setSearchTerm('');
                    setDeptFilter('All');
                  }}
                  filters={
                    <div className="w-full md:w-56">
                      <CompactSelect
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        options={[
                          { value: 'All', label: 'All Departments' },
                          ...departments.map((d) => ({ value: d.name, label: d.name })),
                        ]}
                        placeholder=""
                        aria-label="Filter by department"
                      />
                    </div>
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={filteredUsers}
                isLoading={isLoading}
          pagination
                onRowClick={handleOpenDetails}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.fullName}
                    subtitle={row.email}
                    status={row.status}
                    fields={[
                      { label: 'Username', value: row.username, isMono: true },
                      { label: 'Department', value: row.department },
                      { label: 'Designation', value: row.designation },
                      { label: 'Role', value: row.role },
                    ]}
                    actions={
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Edit2}
                        onClick={(event) => handleOpenEdit(row, event)}
                      >
                        Edit Officer
                      </Button>
                    }
                  />
                )}
              />
      </TablePageWorkspace>

      {/* User Details Drawer */}
      {selectedUser && (
        <RecordDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          onExited={handleDetailsExited}
          title="Administrative Officer Dossier"
          recordId={selectedUser.username}
          status={selectedUser.status}
          sections={[
            {
              title: 'Personnel Information',
              items: [
                { label: 'Full Name', value: selectedUser.fullName },
                { label: 'Username', value: selectedUser.username, isMono: true },
                { label: 'Official Email', value: selectedUser.email },
                { label: 'Contact Phone', value: selectedUser.phone, isMono: true },
                { label: 'Account Created', value: selectedUser.createdAt, isMono: true },
              ]
            },
            {
              title: 'Organizational Placement & Role',
              items: [
                { label: 'Department', value: selectedUser.department },
                { label: 'Official Designation', value: selectedUser.designation },
                { label: 'Assigned Security Role', value: selectedUser.role },
                { label: 'Account Status', value: selectedUser.status },
              ]
            }
          ]}
          footerActions={
            <Button
              variant="primary"
              icon={Edit2}
              onClick={handleEditFromDetails}
            >
              Edit Account
            </Button>
          }
        />
      )}

      <UserFormDrawer
        isOpen={isFormDrawerOpen}
        user={editingUser}
        onClose={() => setIsFormDrawerOpen(false)}
        onExited={() => setEditingUser(null)}
        onSaved={handleUserSaved}
      />
    </div>
  );
};
