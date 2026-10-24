import React, { useState } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { IMEIInput, TextInput, PhoneInput } from '../../components/forms/TextInput.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { Alert } from '../../components/feedback/Alert.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Smartphone, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const DeviceDeregisterPage = () => {
  const [imei, setImei] = useState('862940058912341');
  const [nidLast4, setNidLast4] = useState('7192');
  const [currentPhone, setCurrentPhone] = useState('+880 1711-234567');
  const [newPhone, setNewPhone] = useState('+880 1819-998877');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleDeregister = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!imei || imei.length < 14) {
      setError('Please enter a valid 14–16 digit IMEI number.');
      return;
    }
    if (!nidLast4 || nidLast4.length !== 4) {
      setError('Please enter exactly the last 4 digits of the registered citizen NID.');
      return;
    }
    if (!currentPhone) {
      setError('Please provide current registered phone number.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await mockApi.deregisterDevice({
        imei,
        nidLast4,
        currentPhoneNumber: currentPhone,
        newPhoneNumber: newPhone,
      });
      setResult(res);
      addToast('Device de-registration instruction executed.', 'success');
    } catch (err) {
      setError(err.message || 'Device de-registration failed.');
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Device De-Registration"
        breadcrumbs={[
          { label: 'Device Operations' },
          { label: 'De-Registration' }
        ]}
      />

      {/* Centered Form Card Layout */}
      <div className="w-full">
        <Card
          title="Handset De-Registration Request"
        >
          {error && (
            <Alert
              variant="danger"
              title={error.toLowerCase().includes('not allowed') ? 'De-Registration Not Allowed' : 'Validation Error'}
              className="mb-4"
            >
              {error}
            </Alert>
          )}

          {result && (
            <Alert variant="success" title="De-Registration Successful" className="mb-4">
              <p>{result.message}</p>
              <p className="mt-1 font-mono type-meta">Reference Token: {result.referenceId}</p>
            </Alert>
          )}

          <form onSubmit={handleDeregister} className="space-y-4">
            <IMEIInput
              label="IMEI Number"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              required
            />

            <TextInput
              label="Last 4 Digits of Registered NID"
              value={nidLast4}
              onChange={(e) => setNidLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="e.g. 7192"
              maxLength={4}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhoneInput
                label="Current Phone Number"
                value={currentPhone}
                onChange={(e) => setCurrentPhone(e.target.value)}
                required
              />

              <PhoneInput
                label="New Phone Number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                helperText="Optional. Leave blank to unassign the IMEI"
              />
            </div>

            <div className="pt-2 border-t border-[var(--color-border)] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                De-register Device
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
