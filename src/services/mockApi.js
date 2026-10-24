import { mockDashboardData } from '../mocks/dashboard.js';
import { mockSpecialRegistrations } from '../mocks/specialRegistration.js';
import { mockLostStolenDevices } from '../mocks/lostStolen.js';
import { mockParents, mockPermissions, mockServiceActions, mockRoles } from '../mocks/roleManagement.js';
import {
  mockSupportTickets,
  mockDepartments,
  mockDesignations,
  mockUsers,
  mockBlockedImeis,
  mockManufacturerUploads,
  mockMsisdnImeiRecords
} from '../mocks/office.js';

// Simulated delay helper
const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

const isWithinDateRange = (value, fromDate, toDate) => {
  if (!fromDate && !toDate) return true;
  const isoDate = String(value ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
  return (!fromDate || isoDate >= fromDate) && (!toDate || isoDate <= toDate);
};


const normalizeDepartment = (department) => {
  const name = department.name ?? department.fullName ?? '';
  const code = department.code ?? department.shortName ?? '';

  return {
    ...department,
    name,
    code,
    head: department.head ?? '',
    description: department.description ?? '',
    memberCount:
      department.memberCount ??
      mockUsers.filter((user) => user.department === name).length,
    status: department.status ?? 'Active',
  };
};

const normalizeDesignation = (designation) => {
  const title = designation.title ?? designation.fullName ?? '';
  const matchingUser = mockUsers.find((user) => user.designation === title);
  const departmentName =
    designation.departmentName ?? matchingUser?.department ?? '';
  const matchingDepartment = mockDepartments.find(
    (department) =>
      (department.name ?? department.fullName ?? '') === departmentName
  );

  return {
    ...designation,
    title,
    departmentId: designation.departmentId ?? matchingDepartment?.id ?? '',
    departmentName,
    rankGrade: designation.rankGrade ?? '',
    userCount:
      designation.userCount ??
      mockUsers.filter((user) => user.designation === title).length,
    description: designation.description ?? '',
  };
};

const normalizeOfficeUser = (user) => ({
  ...user,
  sl: user.sl ?? user.no ?? 0,
  phone: user.phone ?? user.phoneNumber ?? '',
});

const normalizeBlockedImei = (record, index = 0) => ({
  ...record,
  sl: record.sl ?? index + 1,
  blockId: record.blockId ?? String(record.id || ('block-' + (index + 1))).toUpperCase(),
  blockType: record.blockType ?? 'Single IMEI',
  blockDate: record.blockDate ?? record.blockedDate ?? '',
  blockedDate: record.blockedDate ?? record.blockDate ?? '',
  remarks: record.remarks ?? record.details ?? '',
});

const normalizeMsisdnImei = (record, index = 0) => ({
  ...record,
  sl: record.sl ?? index + 1,
  lastRegistrationDate: record.lastRegistrationDate ?? record.attachedDate ?? '',
  attachedDate: record.attachedDate ?? record.lastRegistrationDate ?? '',
});

export const mockApi = {
  // Dashboard
  async getDashboardSummary() {
    await delay(100);
    return { ...mockDashboardData };
  },

  // Special Registrations
  async getSpecialRegistrations(filters = {}) {
    await delay(120);
    let items = [...mockSpecialRegistrations];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(r =>
        r.imei.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q) ||
        r.model.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }

    items = items.filter((record) =>
      isWithinDateRange(record.date, filters.fromDate, filters.toDate)
    );

    const statusCounts = items.reduce((counts, record) => {
      counts.All += 1;
      if (Object.prototype.hasOwnProperty.call(counts, record.status)) {
        counts[record.status] += 1;
      }
      return counts;
    }, {
      All: 0,
      Pending: 0,
      'In Progress': 0,
      Accepted: 0,
      Rejected: 0,
    });

    if (filters.status && filters.status !== 'All') {
      items = items.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
    }

    return {
      items,
      total: items.length,
      statusCounts,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10
    };
  },

  async getSpecialRegistrationById(id) {
    await delay(100);
    const item = mockSpecialRegistrations.find(r => r.id === id);
    if (!item) throw new Error(`Special Registration ${id} not found`);
    return { ...item };
  },

  async updateSpecialRegistrationStatus(id, verdict, remarks) {
    await delay(150);
    const item = mockSpecialRegistrations.find(r => r.id === id);
    if (item) {
      item.status = verdict;
      if (remarks) item.remarks = remarks;
    }
    return { success: true, item };
  },

  // Lost & Stolen Devices
  async getLostStolenDevices(filters = {}) {
    await delay(120);
    let items = [...mockLostStolenDevices];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(r =>
        r.imei.toLowerCase().includes(q) ||
        r.requestedBy.toLowerCase().includes(q) ||
        r.gdNumber.toLowerCase().includes(q)
      );
    }
    items = items.filter((record) =>
      isWithinDateRange(record.reportDate, filters.fromDate, filters.toDate)
    );
    return { items, total: items.length };
  },

  // Device De-registration simulation
  async deregisterDevice(payload) {
    await delay(250);
    // Mock business-error verification trigger
    if (payload.imei === '999999999999999' || payload.triggerError) {
      throw new Error('Device de-registration is not allowed for this IMEI. Device is flagged under legal hold or EIR restriction.');
    }
    return {
      success: true,
      message: `Device with IMEI ${payload.imei} has been successfully de-registered from MSISDN ${payload.currentPhoneNumber}.`,
      referenceId: `DREG-${Date.now().toString().slice(-6)}`
    };
  },

  // Auto Registration simulation
  async autoRegisterDevice(payload) {
    await delay(250);
    return {
      success: true,
      message: `Device with IMEI ${payload.imei} is registered and paired with ${payload.currentPhoneNumber}.`,
      referenceId: `AREG-${Date.now().toString().slice(-6)}`
    };
  },

  // Role Management
  async getParents() {
    await delay(100);
    return [...mockParents];
  },
  async getPermissions() {
    await delay(100);
    return [...mockPermissions];
  },
  async getServiceActions() {
    await delay(100);
    return [...mockServiceActions];
  },
  async getRoles() {
    await delay(100);
    return [...mockRoles];
  },

  // IMEI Check
  async checkImei(imei) {
    await delay(200);
    const clean = (imei || '').trim();
    const isRegistered = !clean.startsWith('999');
    const isBlocked = clean.startsWith('864920');

    return {
      imei: clean,
      status: isBlocked ? 'Blocked' : isRegistered ? 'White Listed' : 'Not Registered',
      tac: clean.slice(0, 8),
      brand: 'Samsung Electronics',
      model: 'Galaxy Series 5G (Certified)',
      bengaliMessage: `IMEI নম্বর ${clean} বৈধ এবং বিটিআরসি এনইআইআর ডেটাবেজে নিবন্ধনের জন্য প্রস্তুত।`,
      englishMessage: `IMEI number ${clean} is valid and verified in BTRC NEIR Registry.`,
      registeredDate: '2025-11-14',
      mnoAttachment: 'Grameenphone / Robi / Banglalink active',
      importType: 'Authorized Commercial Import (Type Approved by BTRC)'
    };
  },

  // Global IMEI Block
  async blockImeiGlobally(payload) {
    await delay(250);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const suffix = Date.now().toString().slice(-6);
    const newRecord = normalizeBlockedImei({
      id: 'blk-' + suffix,
      blockId: 'GBL-' + suffix,
      imei: payload.imei,
      blockType: payload.blockType || 'Single IMEI',
      blockDate: timestamp,
      blockedDate: timestamp,
      blockedBy: 'Current Active Admin',
      reason: payload.reason || 'Manual Administrative Block Requisition',
      status: 'Blocked',
      remarks: payload.remarks || payload.details || '',
      details: payload.details || payload.remarks || '',
    });
    mockBlockedImeis.unshift(newRecord);
    return { success: true, record: newRecord };
  },

  async blockGlobalImei(payload) {
    return mockApi.blockImeiGlobally(payload);
  },

  async getBlockedImeis(filters = {}) {
    await delay(120);
    let items = mockBlockedImeis.map(normalizeBlockedImei);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((record) =>
        record.blockId.toLowerCase().includes(q) ||
        record.imei.toLowerCase().includes(q) ||
        record.reason.toLowerCase().includes(q) ||
        record.remarks.toLowerCase().includes(q) ||
        record.blockedBy.toLowerCase().includes(q)
      );
    }
    items = items.filter((record) =>
      isWithinDateRange(record.blockDate, filters.fromDate, filters.toDate)
    );
    return { items, total: items.length };
  },

  async getGlobalBlockedImeis(filters = {}) {
    return mockApi.getBlockedImeis(filters);
  },

  async unblockGlobalImei(id) {
    await delay(180);
    const record = mockBlockedImeis.find((item) => item.id === id);
    if (!record) throw new Error('Blacklist record not found.');
    record.status = 'Unblocked';
    return { success: true, record: normalizeBlockedImei(record) };
  },

  // Manufacturer Upload
  async getManufacturerUploads(filters = {}) {
    await delay(100);
    let items = [...mockManufacturerUploads];

    if (filters.search) {
      const query = filters.search.trim().toLowerCase();
      items = items.filter((record) =>
        record.imei.toLowerCase().includes(query) ||
        record.brand.toLowerCase().includes(query) ||
        record.model.toLowerCase().includes(query) ||
        record.tac.toLowerCase().includes(query)
      );
    }

    items = items.filter((record) =>
      isWithinDateRange(record.createdAt, filters.fromDate, filters.toDate)
    );

    return { items, total: items.length };
  },

  async uploadManufacturerCsv(fileName, fileCount = 250) {
    await delay(400);
    return {
      success: true,
      fileName,
      totalParsed: fileCount,
      validRecords: fileCount,
      message: `Successfully processed ${fileCount} IMEI records into BTRC National Register.`
    };
  },

  async uploadManufacturerBatch(payload = {}) {
    const fileName = payload.file?.name || 'manufacturer-imei.csv';
    const result = await mockApi.uploadManufacturerCsv(fileName);
    return {
      ...result,
      manufacturer: payload.manufacturer || '',
      batchId: `BATCH-${Date.now().toString().slice(-6)}`,
      totalProcessed: result.validRecords,
    };
  },

  // Support Tickets
  async getSupportTickets(filters = {}) {
    await delay(120);
    let items = [...mockSupportTickets];
    if (filters.status && filters.status !== 'All') {
      items = items.filter(t => t.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(t =>
        t.trackingId.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      );
    }
    items = items.filter((record) =>
      isWithinDateRange(record.date, filters.fromDate, filters.toDate)
    );
    return { items, total: items.length };
  },

  // Office Administration
  async getDepartments() {
    await delay(100);
    return mockDepartments.map(normalizeDepartment);
  },
  async getDesignations() {
    await delay(100);
    return mockDesignations.map(normalizeDesignation);
  },
  async getOfficeUsers() {
    await delay(100);
    return mockUsers.map(normalizeOfficeUser);
  },
  async saveOfficeUser(userData) {
    await delay(200);

    const normalizedPayload = {
      ...userData,
      phoneNumber: userData.phone ?? userData.phoneNumber ?? '',
    };

    if (userData.id) {
      const index = mockUsers.findIndex((user) => user.id === userData.id);
      if (index !== -1) {
        mockUsers[index] = {
          ...mockUsers[index],
          ...normalizedPayload,
        };
        return normalizeOfficeUser(mockUsers[index]);
      }
    }

    const newUser = {
      ...normalizedPayload,
      id: `usr-${Date.now().toString().slice(-4)}`,
      no: mockUsers.length + 1,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    mockUsers.push(newUser);
    return normalizeOfficeUser(newUser);
  },
  async getUsers(filters = {}) {
    await delay(120);
    let items = [...mockUsers];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.phoneNumber.toLowerCase().includes(q)
      );
    }
    return { items, total: items.length };
  },

  async getUserById(id) {
    await delay(100);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    return { ...user };
  },

  async saveUser(userData) {
    await delay(200);
    if (userData.id) {
      const idx = mockUsers.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...userData };
        return mockUsers[idx];
      }
    }
    const newUser = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      no: mockUsers.length + 1,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // MSISDN IMEI Lookup
  async getMsisdnImeiList(filters = {}) {
    await delay(120);
    let items = mockMsisdnImeiRecords.map(normalizeMsisdnImei);

    if (filters.operator && filters.operator !== 'All') {
      items = items.filter((record) => record.operator === filters.operator);
    }

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      if (filters.searchBy === 'MSISDN') {
        const normalizedQuery = q.replace(/[\s+-]/g, '');
        items = items.filter((record) =>
          record.msisdn.replace(/[\s+-]/g, '').includes(normalizedQuery)
        );
      } else if (filters.searchBy === 'IMEI') {
        items = items.filter((record) => record.imei.toLowerCase().includes(q));
      } else {
        items = items.filter((record) =>
          record.msisdn.toLowerCase().includes(q) ||
          record.imei.toLowerCase().includes(q) ||
          record.operator.toLowerCase().includes(q) ||
          record.deviceModel.toLowerCase().includes(q)
        );
      }
    }

    items = items.filter((record) =>
      isWithinDateRange(record.lastRegistrationDate, filters.fromDate, filters.toDate)
    );

    return { items, total: items.length };
  },

  async lookupMsisdnImei(type, query) {
    await delay(150);
    if (!query) return [];
    const q = query.trim().toLowerCase();

    return mockMsisdnImeiRecords
      .map(normalizeMsisdnImei)
      .filter((record) => {
        if (type === 'MSISDN') {
          return record.msisdn.replace(/[\s+-]/g, '').includes(q.replace(/[\s+-]/g, ''));
        }
        return record.imei.toLowerCase().includes(q);
      });
  }
};
