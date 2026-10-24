/**
 * BTRC NEIR Admin Portal
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext.jsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute.jsx';
import { ToastProvider } from './components/feedback/Toast.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { PreferencesProvider } from './system/PreferencesContext.jsx';

import { LoginPage } from './features/auth/LoginPage.jsx';
import { DashboardPage } from './features/dashboard/DashboardPage.jsx';
import { SpecialRegistrationPage } from './features/special-registration/SpecialRegistrationPage.jsx';
import { LostStolenPage } from './features/lost-stolen/LostStolenPage.jsx';

import { ParentPage } from './features/role-management/ParentPage.jsx';
import { PermissionPage } from './features/role-management/PermissionPage.jsx';
import { ServiceActionPage } from './features/role-management/ServiceActionPage.jsx';
import { RolesPage } from './features/role-management/RolesPage.jsx';

import { ManufacturerUploadPage } from './features/manufacturer-upload/ManufacturerUploadPage.jsx';
import { SupportTicketPage } from './features/support-ticket/SupportTicketPage.jsx';
import { GlobalImeiBlockListPage } from './features/global-imei-block/GlobalImeiBlockListPage.jsx';

import { DepartmentsPage } from './features/office/DepartmentsPage.jsx';
import { DesignationsPage } from './features/office/DesignationsPage.jsx';
import { UsersListPage } from './features/office/UsersListPage.jsx';
import { UserFormPage } from './features/office/UserFormPage.jsx';

import { MsisdnImeiPage } from './features/msisdn-imei/MsisdnImeiPage.jsx';
import { NotFoundPage } from './features/not-found/NotFoundPage.jsx';

export default function App() {
  return (
    <HashRouter>
      <PreferencesProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="special-registration" element={<SpecialRegistrationPage />} />
                <Route path="lost-stolen" element={<LostStolenPage />} />
                <Route path="device-deregister" element={<MsisdnImeiPage initialAction="deregister" />} />
                <Route path="auto-registration" element={<MsisdnImeiPage initialAction="register" />} />

                <Route path="role-management" element={<Navigate to="/role-management/roles" replace />} />
                <Route path="role-management/parent" element={<ParentPage />} />
                <Route path="role-management/permission" element={<PermissionPage />} />
                <Route path="role-management/service-action" element={<ServiceActionPage />} />
                <Route path="role-management/roles" element={<RolesPage />} />

                <Route path="imei-check" element={<MsisdnImeiPage initialAction="check" />} />
                <Route path="manufacturer-imei-upload" element={<ManufacturerUploadPage />} />
                <Route path="support-ticket" element={<SupportTicketPage />} />

                <Route path="global-imei-block" element={<GlobalImeiBlockListPage />} />
                <Route path="global-imei-block/list" element={<Navigate to="/global-imei-block" replace />} />

                <Route path="office" element={<Navigate to="/office/departments" replace />} />
                <Route path="office/departments" element={<DepartmentsPage />} />
                <Route path="office/designations" element={<DesignationsPage />} />
                <Route path="office/users" element={<UsersListPage />} />
                <Route path="office/users/new" element={<UserFormPage />} />
                <Route path="office/users/:id/edit" element={<UserFormPage />} />

                <Route path="msisdn-imei" element={<MsisdnImeiPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </PreferencesProvider>
    </HashRouter>
  );
}
