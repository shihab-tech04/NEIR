export const mockDashboardData = {
  kpis: [
    { id: 'white-list', label: 'White List Devices', value: '48,291,402', change: '+2.4% vs last month', tone: 'success', category: 'Legitimate devices' },
    { id: 'gray-list', label: 'Gray List Devices', value: '3,849,120', change: '+0.8% under grace period', tone: 'warning', category: 'Pending regularisation' },
    { id: 'blocked', label: 'Blocked Devices', value: '142,890', change: '+124 today', tone: 'danger', category: 'Blacklisted & cloning' },
    { id: 'access-denied', label: 'Access Denied', value: '18,409', change: 'Network registration reject', tone: 'danger', category: 'Unauthorized attempts' },
    { id: 'special-req-accepted', label: 'Special Requests Accepted', value: '94,210', change: '96.2% approval rate', tone: 'success', category: 'Special quota verified' },
    { id: 'special-req', label: 'Special Requests Total', value: '97,890', change: '3,680 pending queue', tone: 'info', category: 'Individual import & gifts' },
    { id: 'lost-devices', label: 'Lost Devices Reported', value: '29,481', change: '512 in last 7 days', tone: 'warning', category: 'Citizen police reports' },
    { id: 'found-devices', label: 'Found Devices Recovered', value: '12,640', change: '42.8% recovery rate', tone: 'success', category: 'Restored to owners' },
    { id: 'auto-registered', label: 'Auto Registered', value: '1,249,020', change: 'Via MNO SIM attachment', tone: 'info', category: 'Automatic network sync' },
    { id: 'device-deregistered', label: 'Device De-Registered', value: '45,830', change: 'Ownership transfers', tone: 'neutral', category: 'SIM disassociation' },
  ],
  imeiSummary: {
    total: 52283412,
    whiteList: { count: 48291402, percent: 92.4, color: '#01ADC1' },
    grayList: { count: 3849120, percent: 7.3, color: '#EF8F22' },
    blackList: { count: 142890, percent: 0.3, color: '#C62828' },
    recentMonthlyTrends: [
      { month: 'Oct 2025', whiteList: 46100000, grayList: 4100000, blackList: 130000 },
      { month: 'Nov 2025', whiteList: 46850000, grayList: 3990000, blackList: 134000 },
      { month: 'Dec 2025', whiteList: 47400000, grayList: 3910000, blackList: 138000 },
      { month: 'Jan 2026', whiteList: 47850000, grayList: 3880000, blackList: 140500 },
      { month: 'Feb 2026', whiteList: 48120000, grayList: 3860000, blackList: 141900 },
      { month: 'Mar 2026', whiteList: 48291402, grayList: 3849120, blackList: 142890 },
    ]
  },
  registrationSummary: {
    autoRegistration: { count: 1249020, change: '+5.1% M-o-M', color: '#028A97' },
    deRegistration: { count: 45830, change: '+1.2% M-o-M', color: '#01ADC1' },
    operatorBreakdown: [
      { operator: 'Grameenphone', autoCount: '584,200', deRegCount: '21,400', share: '46.8%' },
      { operator: 'Robi Axiata', autoCount: '372,400', deRegCount: '13,800', share: '29.8%' },
      { operator: 'Banglalink', autoCount: '241,100', deRegCount: '8,900', share: '19.3%' },
      { operator: 'Teletalk', autoCount: '51,320', deRegCount: '1,730', share: '4.1%' },
    ]
  }
};
