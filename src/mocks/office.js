export const mockSupportTickets = [
  {
    id: 'TICK-90812',
    sl: 1,
    name: 'Mustafizur Rahman',
    date: '2026-03-21 15:40',
    trackingId: 'TRK-2026-89102',
    phone: '+880 1711-892019',
    status: 'Pending',
    category: 'Special Registration Delay',
    subject: 'Verification pending for 48 hours for iPhone 15 Pro imported from Dubai',
    details: 'Submitted all passport and duty payment slips on March 19. Status still showing in queue. Requesting urgent clearance for official SIM activation.',
    operator: 'Grameenphone',
    history: [
      { date: '2026-03-21 15:40', actor: 'Citizen Portal', note: 'Support inquiry logged via self-service portal' }
    ]
  },
  {
    id: 'TICK-90811',
    sl: 2,
    name: 'Farzana Chowdhury',
    date: '2026-03-20 11:25',
    trackingId: 'TRK-2026-89045',
    phone: '+880 1819-334455',
    status: 'Pending',
    category: 'De-Registration Discrepancy',
    subject: 'Unable to de-register previous handset after purchasing new phone',
    details: 'System returns error that NID last 4 digits do not match carrier KYC database.',
    operator: 'Robi',
    history: [
      { date: '2026-03-20 11:25', actor: 'Citizen Portal', note: 'Inquiry received' }
    ]
  },
  {
    id: 'TICK-90810',
    sl: 3,
    name: 'Anisul Hoque',
    date: '2026-03-19 14:10',
    trackingId: 'TRK-2026-88941',
    phone: '+880 1912-778899',
    status: 'Resolved',
    category: 'Gray List Notice Query',
    subject: 'SMS received regarding gray listed IMEI regularisation',
    details: 'Received notice regarding device purchased locally from authorized dealer. Submitted dealer invoice.',
    operator: 'Banglalink',
    history: [
      { date: '2026-03-19 14:10', actor: 'Citizen Portal', note: 'Inquiry logged' },
      { date: '2026-03-20 10:30', actor: 'Officer Tanvir (Helpdesk)', note: 'Invoice validated against importer batch. White-list updated. SMS confirmation sent.' }
    ]
  },
  {
    id: 'TICK-90809',
    sl: 4,
    name: 'Dr. Shahinur Alam',
    date: '2026-03-18 09:50',
    trackingId: 'TRK-2026-88710',
    phone: '+880 1552-114477',
    status: 'Resolved',
    category: 'Lost Device GD Sync',
    subject: 'Police GD filed yesterday not reflecting in NEIR portal',
    details: 'General Diary was filed at Dhanmondi Thana. Please verify status update.',
    operator: 'Teletalk',
    history: [
      { date: '2026-03-18 09:50', actor: 'Citizen', note: 'Inquiry created' },
      { date: '2026-03-18 16:15', actor: 'SI Nazim (DMP Desk)', note: 'GD record synced and blacklist broadcast verified.' }
    ]
  }
];

export const mockDepartments = [
  { id: 'dept-1', sl: 1, fullName: 'Engineering and Operations Division', shortName: 'E&O' },
  { id: 'dept-2', sl: 2, fullName: 'Spectrum Management Division', shortName: 'SMD' },
  { id: 'dept-3', sl: 3, fullName: 'Legal and Licensing Division', shortName: 'LLD' },
  { id: 'dept-4', sl: 4, fullName: 'Systems & Services Division', shortName: 'SSD' },
  { id: 'dept-5', sl: 5, fullName: 'Cyber & Information Security Division', shortName: 'CISD' },
  { id: 'dept-6', sl: 6, fullName: 'Administration and HR Division', shortName: 'Admin & HR' },
];

export const mockDesignations = [
  { id: 'desig-1', sl: 1, fullName: 'Director General', shortName: 'DG' },
  { id: 'desig-2', sl: 2, fullName: 'Director', shortName: 'Dir' },
  { id: 'desig-3', sl: 3, fullName: 'Deputy Director', shortName: 'DD' },
  { id: 'desig-4', sl: 4, fullName: 'Senior Assistant Director', shortName: 'Sr. AD' },
  { id: 'desig-5', sl: 5, fullName: 'Assistant Director', shortName: 'AD' },
  { id: 'desig-6', sl: 6, fullName: 'Assistant Maintenance Engineer', shortName: 'AME' },
  { id: 'desig-7', sl: 7, fullName: 'Helpdesk Operations Officer', shortName: 'HOO' },
];

export const mockUsers = [
  {
    id: 'usr-1',
    no: 1,
    fullName: 'Brig. Gen. Md. Anwarul Kabir',
    firstName: 'Md. Anwarul',
    lastName: 'Kabir',
    username: 'anwarul.kabir',
    phoneNumber: '+880 1711-554433',
    email: 'anwarul.kabir@btrc.gov.bd',
    role: 'Super Admin',
    status: 'Active',
    department: 'Engineering and Operations Division',
    designation: 'Director General',
    presentAddress: 'IEB Bhaban, Ramna, Dhaka-1000',
    permanentAddress: 'House 14, Road 5, Dhanmondi, Dhaka',
    createdAt: '2024-01-15'
  },
  {
    id: 'usr-2',
    no: 2,
    fullName: 'Kazi Golam Mostafa',
    firstName: 'Kazi Golam',
    lastName: 'Mostafa',
    username: 'kg.mostafa',
    phoneNumber: '+880 1819-667788',
    email: 'kg.mostafa@btrc.gov.bd',
    role: 'Admin',
    status: 'Active',
    department: 'Systems & Services Division',
    designation: 'Director',
    presentAddress: 'Officers Quarter, BTRC Complex, Agargaon, Dhaka',
    permanentAddress: 'Kotwali, Chattogram',
    createdAt: '2024-03-10'
  },
  {
    id: 'usr-3',
    no: 3,
    fullName: 'Dr. Nusrat Parveen',
    firstName: 'Nusrat',
    lastName: 'Parveen',
    username: 'nusrat.parveen',
    phoneNumber: '+880 1912-990011',
    email: 'nusrat.parveen@btrc.gov.bd',
    role: 'Application Manager',
    status: 'Active',
    department: 'Spectrum Management Division',
    designation: 'Deputy Director',
    presentAddress: 'Sector 4, Uttara, Dhaka',
    permanentAddress: 'Rajshahi Sadar, Rajshahi',
    createdAt: '2024-06-01'
  },
  {
    id: 'usr-4',
    no: 4,
    fullName: 'Mahmudul Hasan Tanvir',
    firstName: 'Mahmudul Hasan',
    lastName: 'Tanvir',
    username: 'mh.tanvir',
    phoneNumber: '+880 1678-445566',
    email: 'tanvir.neir@btrc.gov.bd',
    role: 'Corporate Affairs',
    status: 'Active',
    department: 'Engineering and Operations Division',
    designation: 'Assistant Director',
    presentAddress: 'Mirpur DOHS, Dhaka',
    permanentAddress: 'Kushtia Sadar, Kushtia',
    createdAt: '2024-09-15'
  },
  {
    id: 'usr-5',
    no: 5,
    fullName: 'Zubair Ahmed Siddiqui',
    firstName: 'Zubair Ahmed',
    lastName: 'Siddiqui',
    username: 'zubair.siddiqui',
    phoneNumber: '+880 1552-332211',
    email: 'zubair.siddiqui@btrc.gov.bd',
    role: 'Regional Affairs',
    status: 'Inactive',
    department: 'Cyber & Information Security Division',
    designation: 'Senior Assistant Director',
    presentAddress: 'Gulshan-1, Dhaka',
    permanentAddress: 'Sylhet Sadar, Sylhet',
    createdAt: '2024-11-20'
  }
];

export const mockBlockedImeis = [
  {
    id: 'blk-1',
    imei: '864920194820194',
    blockedDate: '2026-03-21 09:16',
    blockedBy: 'Admin (DMP Police GD Sync)',
    reason: 'Reported Stolen / Armed Robbery (GD-GUL-2026-492)',
    status: 'Blocked',
    details: 'Hard EIR Blacklist deployed to GP, Robi, Banglalink, and Teletalk HSS registers. IMSI attach rejection configured.'
  },
  {
    id: 'blk-2',
    imei: '357890192847102',
    blockedDate: '2026-03-17 11:05',
    blockedBy: 'Kazi Golam Mostafa (Director SSD)',
    reason: 'Counterfeit TAC / Clone Pattern Detected',
    status: 'Blocked',
    details: 'Over 14,000 distinct MSISDN attachments observed within 1 hour on single TAC range. Regulatory fraud intervention.'
  },
  {
    id: 'blk-3',
    imei: '867019284710928',
    blockedDate: '2026-03-12 14:22',
    blockedBy: 'BTRC Security Desk',
    reason: 'Smuggled Commercial Consignment (Customs Seizure)',
    status: 'Blocked',
    details: 'National Board of Revenue customs intelligence notification #CUS-INT-2026-8819.'
  },
  {
    id: 'blk-4',
    imei: '351982019482014',
    blockedDate: '2026-03-05 16:50',
    blockedBy: 'Super Admin',
    reason: 'Reported Lost by Foreign Diplomat',
    status: 'Blocked',
    details: 'Diplomatic security council requisition.'
  }
];

export const mockManufacturerUploads = [
  { id: 'up-1', sn: 1, imei: '869401928471029', brand: 'Walton Digi-Tech', model: 'Primo S9 Pro', tac: '86940192', status: 'Active', createdAt: '2026-03-21 11:30' },
  { id: 'up-2', sn: 2, imei: '869401928471030', brand: 'Walton Digi-Tech', model: 'Primo S9 Pro', tac: '86940192', status: 'Active', createdAt: '2026-03-21 11:30' },
  { id: 'up-3', sn: 3, imei: '869401928471031', brand: 'Walton Digi-Tech', model: 'Primo S9 Pro', tac: '86940192', status: 'Active', createdAt: '2026-03-21 11:30' },
  { id: 'up-4', sn: 4, imei: '359281948102941', brand: 'Symphony Mobile', model: 'Helio 50', tac: '35928194', status: 'Active', createdAt: '2026-03-20 16:45' },
  { id: 'up-5', sn: 5, imei: '359281948102942', brand: 'Symphony Mobile', model: 'Helio 50', tac: '35928194', status: 'Active', createdAt: '2026-03-20 16:45' },
  { id: 'up-6', sn: 6, imei: '862019482019482', brand: 'Samsung Electronics BD (Fair)', model: 'Galaxy A55 5G', tac: '86201948', status: 'Active', createdAt: '2026-03-19 14:10' },
  { id: 'up-7', sn: 7, imei: '862019482019483', brand: 'Samsung Electronics BD (Fair)', model: 'Galaxy A55 5G', tac: '86201948', status: 'Active', createdAt: '2026-03-19 14:10' }
];

export const mockMsisdnImeiRecords = [
  { sl: 1, imei: '862940058912341', msisdn: '+880 1711-234567', operator: 'Grameenphone', status: 'Active', lastRegistrationDate: '2026-03-15 11:20', deviceModel: 'Samsung Galaxy S24 Ultra' },
  { sl: 2, imei: '359281119283745', msisdn: '+880 1819-876543', operator: 'Robi', status: 'Active', lastRegistrationDate: '2026-03-18 09:45', deviceModel: 'Apple iPhone 15 Pro' },
  { sl: 3, imei: '867543048192019', msisdn: '+880 1912-349876', operator: 'Banglalink', status: 'Active', lastRegistrationDate: '2026-02-28 14:10', deviceModel: 'Xiaomi 14 Ultra Test Unit' },
  { sl: 4, imei: '354890102948571', msisdn: '+880 1713-902145', operator: 'Grameenphone', status: 'Active', lastRegistrationDate: '2026-03-19 10:20', deviceModel: 'Google Pixel 8 Pro' },
  { sl: 5, imei: '864920194820194', msisdn: '+880 1712-449911', operator: 'Grameenphone', status: 'Blocked', lastRegistrationDate: '2026-01-10 16:30', deviceModel: 'Samsung Galaxy S23 5G' },
];
