import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Drawer, DrawerSection } from '../../components/overlays/Drawer.jsx';
import { TextInput, PasswordInput, PhoneInput, Textarea } from '../../components/forms/TextInput.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Save } from 'lucide-react';

const emptyForm = {
  fullName: '',
  email: '',
  username: '',
  phone: '',
  department: 'Engineering & Operations',
  designation: 'Director (EIR)',
  role: 'Super Admin',
  password: '',
  confirmPassword: '',
  status: 'Active',
  notes: '',
};

export const UserFormDrawer = ({
  isOpen,
  user = null,
  onClose,
  onExited,
  onSaved,
}) => {
  const isEditing = Boolean(user?.id);
  const { addToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState(emptyForm);
  const [changePassword, setChangePassword] = useState(true);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const loadDependencies = async () => {
      try {
        const [depts, des, roleList] = await Promise.all([
          mockApi.getDepartments(),
          mockApi.getDesignations(),
          mockApi.getRoles(),
        ]);

        if (cancelled) return;
        setDepartments(depts);
        setDesignations(des);
        setRoles(roleList);

        if (user) {
          setFormState({
            fullName: user.fullName || '',
            email: user.email || '',
            username: user.username || '',
            phone: user.phone || '',
            department: user.department || depts[0]?.name || '',
            designation: user.designation || des[0]?.title || '',
            role: user.role || roleList[0]?.name || '',
            password: '',
            confirmPassword: '',
            status: user.status || 'Active',
            notes: user.notes || 'Authorized operational account.',
          });
          setChangePassword(false);
        } else {
          setFormState({
            ...emptyForm,
            department: depts.find((item) => item.name === emptyForm.department)?.name || depts[0]?.name || '',
            designation: des.find((item) => item.title === emptyForm.designation)?.title || des[0]?.title || '',
            role: roleList.find((item) => item.name === emptyForm.role)?.name || roleList[0]?.name || '',
          });
          setChangePassword(true);
        }
      } catch (err) {
        if (!cancelled) addToast('Failed to load form dependencies.', 'error');
      }
    };

    loadDependencies();
    return () => {
      cancelled = true;
    };
  }, [isOpen, user]);

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.fullName.trim() || !formState.email.trim() || !formState.username.trim()) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    if (changePassword) {
      if (!formState.password || formState.password.length < 6) {
        addToast('Password must be at least 6 characters long.', 'error');
        return;
      }
      if (formState.password !== formState.confirmPassword) {
        addToast('Password confirmation does not match.', 'error');
        return;
      }
    }

    try {
      setIsLoading(true);
      const savedUser = await mockApi.saveOfficeUser({
        id: isEditing ? user.id : undefined,
        ...formState,
      });

      addToast(
        isEditing
          ? `Officer account for ${formState.fullName} updated.`
          : `New officer account for ${formState.fullName} created.`,
        'success'
      );

      await onSaved?.(savedUser);
      onClose();
    } catch (err) {
      addToast('Failed to save user account.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      onExited={onExited}
      title={isEditing ? 'Edit Officer Account' : 'Create New Officer'}
      subtitle={isEditing ? user?.email : 'Add a new administrative user'}
      width="w-full sm:w-[760px]"
      footer={
        <div className="flex items-center justify-end gap-2 w-full max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="office-user-form"
            variant="primary"
            icon={Save}
            isLoading={isLoading}
          >
            {isEditing ? 'Save Changes' : 'Create Officer Account'}
          </Button>
        </div>
      }
    >
      <form id="office-user-form" onSubmit={handleSubmit}>
        <div className="border border-[var(--color-border)] rounded-[var(--field-radius)] overflow-hidden bg-[var(--color-surface)]">
          <DrawerSection title="Personnel & Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <TextInput
                label="Full Name (Official)"
                value={formState.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="e.g. Engr. Md. Shakil Ahmed"
                required
              />
              <TextInput
                label="Official Email Address"
                type="email"
                value={formState.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="e.g. shakil.ahmed@btrc.gov.bd"
                required
              />
              <TextInput
                label="System Username"
                value={formState.username}
                onChange={(event) => updateField('username', event.target.value.toLowerCase().replace(/\s+/g, '.'))}
                placeholder="e.g. shakil.btrc"
                required
              />
              <PhoneInput
                label="Official Contact Phone"
                value={formState.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="+880 1711-XXXXXX"
                required
              />
            </div>
          </DrawerSection>

          <DrawerSection title="Organizational Assignment & Security Role">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Select
                label="Department"
                value={formState.department}
                onChange={(event) => updateField('department', event.target.value)}
                options={departments.map((item) => item.name)}
                required
              />
              <Select
                label="Official Designation"
                value={formState.designation}
                onChange={(event) => updateField('designation', event.target.value)}
                options={designations.map((item) => item.title)}
                required
              />
              <Select
                label="Assigned Security Role"
                value={formState.role}
                onChange={(event) => updateField('role', event.target.value)}
                options={roles.map((item) => item.name)}
                required
              />
              <Select
                label="Account Status"
                value={formState.status}
                onChange={(event) => updateField('status', event.target.value)}
                options={['Active', 'Inactive', 'Suspended']}
                required
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Administrative Notes"
                  value={formState.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  placeholder="Office location, desk extension, and clearance notes..."
                  rows={2}
                />
              </div>
            </div>
          </DrawerSection>

          <DrawerSection title="Portal Authentication Credentials">
            <div className="space-y-4 pt-1">
              {isEditing && (
                <Checkbox
                  label="Reset / Change Officer Password"
                  checked={changePassword}
                  onChange={(event) => setChangePassword(event.target.checked)}
                />
              )}

              {changePassword ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Account Password"
                    value={formState.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <PasswordInput
                    label="Confirm Password"
                    value={formState.confirmPassword}
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              ) : (
                <p className="type-body-sm text-[var(--color-text-secondary)]">
                  Existing password remains unchanged.
                </p>
              )}
            </div>
          </DrawerSection>
        </div>
      </form>
    </Drawer>
  );
};

// Legacy deep links no longer render a full-page user form.
export const UserFormPage = () => <Navigate to="/office/users" replace />;
