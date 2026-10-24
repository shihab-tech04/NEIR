export const mockLostStolenDevices = [
  {
    id: 'LS-2026-0412',
    sl: 1,
    imei: '864920194820194',
    requestedBy: 'Tariqul Anam (Gulshan Thana GD #492)',
    reportDate: '2026-03-21 09:15',
    status: 'Lost',
    gdNumber: 'GD-GUL-2026-492',
    thana: 'Gulshan Thana, DMP',
    ownerNid: '1988269123849102',
    ownerPhone: '+880 1712-449911',
    deviceDetails: {
      brand: 'Samsung',
      model: 'Galaxy S23 5G',
      color: 'Phantom Black',
      lastSeenLocation: 'Gulshan-2 Circle, Dhaka',
      lastSeenOperator: 'Grameenphone',
      lastSeenTimestamp: '2026-03-20 22:40'
    },
    actionHistory: [
      { date: '2026-03-21 09:15', actor: 'Officer In-Charge (Gulshan PS)', event: 'Lost device GD record logged in NEIR' },
      { date: '2026-03-21 09:16', actor: 'NEIR System Auto-Trigger', event: 'IMEI pushed to Gray/Monitor block list across all 4 MNOs' }
    ]
  },
  {
    id: 'LS-2026-0411',
    sl: 2,
    imei: '352940194857201',
    requestedBy: 'Shirin Sultana (Dhanmondi PS GD #891)',
    reportDate: '2026-03-20 18:40',
    status: 'Lost',
    gdNumber: 'GD-DHAN-2026-891',
    thana: 'Dhanmondi Thana, DMP',
    ownerNid: '1994269184029184',
    ownerPhone: '+880 1819-223344',
    deviceDetails: {
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      color: 'Deep Purple',
      lastSeenLocation: 'Dhanmondi Lake Road 32',
      lastSeenOperator: 'Robi',
      lastSeenTimestamp: '2026-03-20 17:10'
    },
    actionHistory: [
      { date: '2026-03-20 18:40', actor: 'SI Mahbubur Rahman', event: 'Stolen device police report registered' }
    ]
  },
  {
    id: 'LS-2026-0410',
    sl: 3,
    imei: '861049283719402',
    requestedBy: 'Kazi Mahbub (Uttara East PS GD #204)',
    reportDate: '2026-03-18 14:20',
    status: 'Found',
    gdNumber: 'GD-UTT-2026-204',
    thana: 'Uttara East Thana, DMP',
    ownerNid: '1982269102948192',
    ownerPhone: '+880 1911-884422',
    deviceDetails: {
      brand: 'Xiaomi',
      model: 'Redmi Note 13 Pro',
      color: 'Midnight Black',
      lastSeenLocation: 'Sector 7, Uttara',
      lastSeenOperator: 'Banglalink',
      lastSeenTimestamp: '2026-03-18 11:05'
    },
    actionHistory: [
      { date: '2026-03-18 14:20', actor: 'ASI Nazrul Islam', event: 'Initial theft complaint logged' },
      { date: '2026-03-19 16:30', actor: 'DB Cyber Police Unit', event: 'Handset recovered during seizure operation' },
      { date: '2026-03-20 10:00', actor: 'BTRC Desk Officer', event: 'Status updated to Found upon police verification' }
    ]
  },
  {
    id: 'LS-2026-0409',
    sl: 4,
    imei: '357890192847102',
    requestedBy: 'Rezaul Karim (Motijheel PS GD #112)',
    reportDate: '2026-03-17 11:00',
    status: 'Blocked',
    gdNumber: 'GD-MOT-2026-112',
    thana: 'Motijheel Thana, DMP',
    ownerNid: '1975269184029481',
    ownerPhone: '+880 1715-098765',
    deviceDetails: {
      brand: 'Realme',
      model: '12 Pro+ 5G',
      color: 'Submarine Blue',
      lastSeenLocation: 'Dilkusha C/A, Dhaka',
      lastSeenOperator: 'Grameenphone',
      lastSeenTimestamp: '2026-03-16 19:30'
    },
    actionHistory: [
      { date: '2026-03-17 11:00', actor: 'Motijheel PS Duty Officer', event: 'Complaint lodged' },
      { date: '2026-03-17 11:05', actor: 'BTRC NEIR Core Engine', event: 'Hard EIR blacklist instruction broadcast to MSC/HSS' }
    ]
  }
];
