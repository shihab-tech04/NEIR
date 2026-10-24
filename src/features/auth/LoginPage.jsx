import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShieldCheck, Languages, Moon, Sun } from 'lucide-react';
import { BtrcLogo } from '../../components/layout/BtrcLogo.jsx';
import { TextInput, PasswordInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { useAuth } from './AuthContext.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const { language, setLanguage, theme, setTheme, t } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await login(username, password, rememberMe);
      addToast('Signed in successfully.', 'success');
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="min-h-screen w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 flex flex-col">
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
            aria-label={t(theme === 'dark' ? 'Use light theme' : 'Use dark theme')}
            title={t(theme === 'dark' ? 'Use light theme' : 'Use dark theme')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="min-h-10 px-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] type-label font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            <Languages className="w-4 h-4" />
            <p>{language === 'en' ? 'বাংলা' : 'EN'}</p>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] gap-6 lg:gap-8 items-center pt-6 sm:pt-8 lg:pt-0 pb-10">
          <section className="hidden lg:flex min-h-[560px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-primary-light)] relative overflow-hidden p-10 xl:p-12 flex-col justify-between">
            <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-[rgba(128,194,198,0.20)]" />
            <div className="absolute -left-24 -bottom-20 w-72 h-72 rounded-full bg-[rgba(1,173,193,0.08)]" />
            <div className="absolute inset-0 opacity-45 pointer-events-none bg-[radial-gradient(rgba(1,173,193,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />

            <div className="relative z-10">
              <BtrcLogo className="h-14 w-14" showText />
              <div className="mt-14 max-w-xl">
                <p className="type-label font-semibold text-[var(--color-primary-dark)]">BTRC Administrative Portal</p>
                <h1 className="type-display text-[var(--color-text-primary)] mt-3">National Equipment Identity Register</h1>
                <p className="type-body-lg text-[var(--color-text-secondary)] mt-4 max-w-lg">
                  Secure administrative access for NEIR operations and regulatory workflows.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 max-w-lg p-4 rounded-xl bg-[var(--color-surface)]/85 border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-info-bg)] flex items-center justify-center text-[var(--color-primary-dark)] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="type-label font-semibold text-[var(--color-text-primary)]">Authorized administrative access</p>
                <p className="type-meta text-[var(--color-text-secondary)] mt-0.5">Sign in with your assigned NEIR office credentials.</p>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[440px] mx-auto lg:max-w-none">
            <div className="hidden lg:flex items-center gap-3 mb-5 px-1">
              <BtrcLogo className="h-12 w-12" showText={false} />
              <div className="min-w-0">
                <h2 className="type-page-title text-[var(--color-text-primary)]">{t('NEIR Admin Portal')}</h2>
                <p className="type-body-sm text-[var(--color-text-secondary)] mt-0.5">{t('Bangladesh Telecommunication Regulatory Commission')}</p>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-md)] overflow-hidden">
              <div className="h-1 bg-[var(--color-primary)] lg:hidden" />

              <div className="p-5 sm:p-7 lg:p-8">
                <div className="lg:hidden pb-5 mb-5 border-b border-[var(--color-border)]">
                  <BtrcLogo className="h-12 w-12" showText />
                  <p className="type-meta text-[var(--color-text-secondary)] mt-3">
                    {t('Bangladesh Telecommunication Regulatory Commission')}
                  </p>
                </div>

                <div className="mb-5 sm:mb-6">
                  <p className="type-meta font-semibold text-[var(--color-primary-dark)] mb-1.5 lg:hidden">{t('NEIR Admin Portal')}</p>
                  <h1 className="type-page-title text-[var(--color-text-primary)]">{t('Administrative sign in')}</h1>
                  <p className="type-body-sm text-[var(--color-text-secondary)] mt-2">
                    {t('Sign in to access your NEIR office workspace.')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <TextInput
                    label="Username"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter username"
                    icon={User}
                    autoComplete="username"
                  />
                  <PasswordInput
                    label="Password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />

                  <div className="flex items-center min-h-9">
                    <Checkbox
                      label="Remember this browser"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="w-full justify-center mt-1"
                  >
                    Sign in
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
