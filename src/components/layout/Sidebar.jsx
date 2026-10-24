import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileCheck2, ShieldAlert, Smartphone, Radio, Users, CheckCircle,
  UploadCloud, Headphones, Ban, Building2, Search, ChevronDown, ChevronRight,
  FolderTree, KeyRound, Layers, ShieldCheck, Network, Award, UserCheck
} from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },

  { name: 'MSISDN IMEI List', path: '/msisdn-imei', icon: Search },
  { name: 'IMEI Check', path: '/imei-check', icon: CheckCircle },
  { name: 'Auto Registration', path: '/auto-registration', icon: Radio },
  { name: 'Device De-Register', path: '/device-deregister', icon: Smartphone },
  { name: 'Global IMEI Block', path: '/global-imei-block', icon: Ban },
  { name: 'Manufacturer IMEI Upload', path: '/manufacturer-imei-upload', to: '/manufacturer-imei-upload?upload=1', icon: UploadCloud },

  { name: 'Special Registration', path: '/special-registration', icon: FileCheck2 },
  { name: 'Lost & Stolen', path: '/lost-stolen', icon: ShieldAlert },
  { name: 'Support Ticket', path: '/support-ticket', icon: Headphones },

  {
    name: 'Office', path: '/office', icon: Building2,
    children: [
      { name: 'Department', path: '/office/departments', icon: Network },
      { name: 'Designation', path: '/office/designations', icon: Award },
      { name: 'User', path: '/office/users', icon: UserCheck },
    ]
  },
  {
    name: 'Role Management', path: '/role-management', icon: Users,
    children: [
      { name: 'Parent', path: '/role-management/parent', icon: FolderTree },
      { name: 'Permission', path: '/role-management/permission', icon: KeyRound },
      { name: 'Service Action', path: '/role-management/service-action', icon: Layers },
      { name: 'Role Setup', path: '/role-management/roles', icon: ShieldCheck },
    ]
  },
];

export const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();
  const { t } = usePreferences();
  const [openSubmenus, setOpenSubmenus] = useState({
    '/role-management': location.pathname.startsWith('/role-management'),
    '/global-imei-block': location.pathname.startsWith('/global-imei-block'),
    '/office': location.pathname.startsWith('/office'),
  });

  const toggleSubmenu = (path) => {
    setOpenSubmenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <aside
      className={'hidden lg:flex h-full min-h-0 flex-col bg-[var(--color-surface)] text-[var(--color-text-primary)] border-r border-[var(--color-border)] transition-[width] duration-[var(--motion-base)] shrink-0 select-none z-20 ' + (isCollapsed ? 'w-14' : 'w-60')}
    >
      <nav className="flex-1 overflow-y-auto pt-4 pb-2 px-2 space-y-0.5" aria-label={t('Navigation')}>
        {navigationItems.map((item) => {
          if (item.type === 'section') {
            return isCollapsed ? (
              <div key={item.name} className="my-2 border-t border-[var(--color-border-subtle)]" aria-hidden="true" />
            ) : (
              <div key={item.name} className="px-3 pt-3 pb-1 first:pt-0">
                <p className="type-meta font-semibold text-[var(--color-text-muted)]">{t(item.name)}</p>
              </div>
            );
          }

          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const activeSection = hasChildren ? location.pathname.startsWith(item.path) : location.pathname === item.path;
          const submenuOpen = openSubmenus[item.path] || activeSection;

          if (hasChildren && !isCollapsed) {
            return (
              <div key={item.path} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.path)}
                  className={'w-full min-h-10 flex items-center justify-between px-3 py-2 rounded-[var(--field-radius)] type-nav transition-colors cursor-pointer ' +
                    (activeSection
                      ? 'bg-[var(--color-primary-alpha-8)] text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white')}
                  aria-expanded={submenuOpen}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <p className="truncate">{t(item.name)}</p>
                  </div>
                  {submenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {submenuOpen && (
                  <div className="ml-4 pl-3 border-l border-[var(--color-border)] space-y-1 py-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const activeChild = child.exact ? location.pathname === child.path : location.pathname.startsWith(child.path);
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end={child.exact}
                          className={'min-h-10 flex items-center gap-2.5 px-3 py-2 rounded-[var(--field-radius)] type-nav transition-colors ' +
                            (activeChild
                              ? 'bg-[var(--color-primary)] text-white font-semibold shadow-[var(--shadow-sm)]'
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white')}
                        >
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <p className="truncate">{t(child.name)}</p>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.to || item.path}
              title={isCollapsed ? t(item.name) : undefined}
              className={({ isActive }) =>
                'min-h-10 flex items-center ' + (isCollapsed ? 'justify-center px-2' : 'gap-2.5 px-3') + ' py-2 rounded-[var(--field-radius)] type-nav transition-colors ' +
                (isActive
                  ? 'bg-[var(--color-primary)] text-white font-semibold shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white')
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <p className="truncate">{t(item.name)}</p>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
