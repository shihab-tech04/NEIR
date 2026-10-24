export const mockParents = [
  { id: 'p-1', name: 'Dashboard Module', path: '/dashboard', icon: 'LayoutDashboard', location: 'Top Navigation Bar', position: 1, hasChildren: false },
  { id: 'p-2', name: 'Special Registration', path: '/special-registration', icon: 'FileCheck2', location: 'Main Navigation Rail', position: 2, hasChildren: false },
  { id: 'p-3', name: 'Lost & Stolen', path: '/lost-stolen', icon: 'ShieldAlert', location: 'Main Navigation Rail', position: 3, hasChildren: false },
  { id: 'p-4', name: 'Device Operations', path: '/device-deregister', icon: 'Smartphone', location: 'Main Navigation Rail', position: 4, hasChildren: true },
  { id: 'p-5', name: 'Role Management', path: '/role-management', icon: 'Users', location: 'Main Navigation Rail', position: 5, hasChildren: true },
  { id: 'p-6', name: 'Global IMEI Block', path: '/global-imei-block', icon: 'Ban', location: 'Main Navigation Rail', position: 6, hasChildren: true },
  { id: 'p-7', name: 'Office Administration', path: '/office', icon: 'Building2', location: 'Main Navigation Rail', position: 7, hasChildren: true },
  { id: 'p-8', name: 'Support Tickets', path: '/support-ticket', icon: 'Headphones', location: 'Main Navigation Rail', position: 8, hasChildren: false },
];

export const mockPermissions = [
  { id: 'perm-1', name: 'View Dashboard Analytics', position: 1, parentId: 'p-1', parentName: 'Dashboard Module', path: '/dashboard/view', icon: 'Eye' },
  { id: 'perm-2', name: 'Export Dashboard Reports', position: 2, parentId: 'p-1', parentName: 'Dashboard Module', path: '/dashboard/export', icon: 'Download' },
  { id: 'perm-3', name: 'View Special Registration List', position: 1, parentId: 'p-2', parentName: 'Special Registration', path: '/special-registration/list', icon: 'List' },
  { id: 'perm-4', name: 'Review Special Registration Dossier', position: 2, parentId: 'p-2', parentName: 'Special Registration', path: '/special-registration/review', icon: 'FileText' },
  { id: 'perm-5', name: 'Approve / Reject Special Reg', position: 3, parentId: 'p-2', parentName: 'Special Registration', path: '/special-registration/decision', icon: 'CheckSquare' },
  { id: 'perm-6', name: 'Parent Management', position: 1, parentId: 'p-5', parentName: 'Role Management', path: '/role-management/parent', icon: 'FolderTree' },
  { id: 'perm-7', name: 'Permission Setup', position: 2, parentId: 'p-5', parentName: 'Role Management', path: '/role-management/permission', icon: 'KeyRound' },
  { id: 'perm-8', name: 'Service Action Setup', position: 3, parentId: 'p-5', parentName: 'Role Management', path: '/role-management/service-action', icon: 'Layers' },
  { id: 'perm-9', name: 'Role & Assignment Matrix', position: 4, parentId: 'p-5', parentName: 'Role Management', path: '/role-management/roles', icon: 'ShieldCheck' },
  { id: 'perm-10', name: 'Block IMEI Trigger', position: 1, parentId: 'p-6', parentName: 'Global IMEI Block', path: '/global-imei-block/action', icon: 'ShieldX' },
  { id: 'perm-11', name: 'View Blocked IMEI Registry', position: 2, parentId: 'p-6', parentName: 'Global IMEI Block', path: '/global-imei-block/list', icon: 'ListOrdered' },
  { id: 'perm-12', name: 'Department Directory', position: 1, parentId: 'p-7', parentName: 'Office Administration', path: '/office/departments', icon: 'Network' },
  { id: 'perm-13', name: 'Designation Directory', position: 2, parentId: 'p-7', parentName: 'Office Administration', path: '/office/designations', icon: 'Award' },
  { id: 'perm-14', name: 'User Management & Provisioning', position: 3, parentId: 'p-7', parentName: 'Office Administration', path: '/office/users', icon: 'UserCheck' },
];

export const mockServiceActions = [
  { id: 'sa-1', name: 'Get Dashboard Summary Metrics', permissionId: 'perm-1', permissionName: 'View Dashboard Analytics', parentName: 'Dashboard Module', path: '/api/v1/dashboard/summary', method: 'GET' },
  { id: 'sa-2', name: 'Download Compliance PDF Report', permissionId: 'perm-2', permissionName: 'Export Dashboard Reports', parentName: 'Dashboard Module', path: '/api/v1/dashboard/report/pdf', method: 'POST' },
  { id: 'sa-3', name: 'Query Special Registration Grid', permissionId: 'perm-3', permissionName: 'View Special Registration List', parentName: 'Special Registration', path: '/api/v1/special-registrations', method: 'GET' },
  { id: 'sa-4', name: 'Fetch Application Dossier & Files', permissionId: 'perm-4', permissionName: 'Review Special Registration Dossier', parentName: 'Special Registration', path: '/api/v1/special-registrations/{id}', method: 'GET' },
  { id: 'sa-5', name: 'Execute Approval or Rejection', permissionId: 'perm-5', permissionName: 'Approve / Reject Special Reg', parentName: 'Special Registration', path: '/api/v1/special-registrations/{id}/verdict', method: 'POST' },
  { id: 'sa-6', name: 'Create Parent Navigation Item', permissionId: 'perm-6', permissionName: 'Parent Management', parentName: 'Role Management', path: '/api/v1/roles/parents', method: 'POST' },
  { id: 'sa-7', name: 'Update Parent Navigation Config', permissionId: 'perm-6', permissionName: 'Parent Management', parentName: 'Role Management', path: '/api/v1/roles/parents/{id}', method: 'PUT' },
  { id: 'sa-8', name: 'Create Granular Permission Node', permissionId: 'perm-7', permissionName: 'Permission Setup', parentName: 'Role Management', path: '/api/v1/roles/permissions', method: 'POST' },
  { id: 'sa-9', name: 'Broadcast Global IMEI Blacklist', permissionId: 'perm-10', permissionName: 'Block IMEI Trigger', parentName: 'Global IMEI Block', path: '/api/v1/imei/global-block', method: 'POST' },
  { id: 'sa-10', name: 'Retrieve Blocked IMEI Registry', permissionId: 'perm-11', permissionName: 'View Blocked IMEI Registry', parentName: 'Global IMEI Block', path: '/api/v1/imei/blocked-list', method: 'GET' },
  { id: 'sa-11', name: 'Add Operational User', permissionId: 'perm-14', permissionName: 'User Management & Provisioning', parentName: 'Office Administration', path: '/api/v1/office/users', method: 'POST' },
  { id: 'sa-12', name: 'Update Operational User Record', permissionId: 'perm-14', permissionName: 'User Management & Provisioning', parentName: 'Office Administration', path: '/api/v1/office/users/{id}', method: 'PUT' },
];

export const mockRoles = [
  { id: 'role-1', name: 'Super Admin', assignedActionsCount: 48, description: 'Complete administrative privileges over NEIR engine, spectrum policies, and user provisioning.' },
  { id: 'role-2', name: 'Admin', assignedActionsCount: 36, description: 'High-level operational control over registrations, EIR blacklist modifications, and ticket resolutions.' },
  { id: 'role-3', name: 'Application Manager', assignedActionsCount: 22, description: 'Responsible for evaluating and approving Special Registration applications and handset document verifications.' },
  { id: 'role-4', name: 'Regional Affairs', assignedActionsCount: 16, description: 'Regional telecom monitoring, lost/stolen device police desk interface, and local inquiry management.' },
  { id: 'role-5', name: 'Corporate Affairs', assignedActionsCount: 14, description: 'Handles manufacturer bulk uploads, bulk NOC allocations, and MNO synchronization audits.' },
];
