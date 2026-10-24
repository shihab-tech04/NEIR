export const getLocale = (language = 'en') => language === 'bn' ? 'bn-BD' : 'en-BD';

export const formatNumber = (value, language = 'en', options = {}) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return new Intl.NumberFormat(getLocale(language), options).format(number);
};

export const formatPercent = (value, language = 'en', maximumFractionDigits = 1) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '—';
  return new Intl.NumberFormat(getLocale(language), {
    style: 'percent',
    maximumFractionDigits,
  }).format(number > 1 ? number / 100 : number);
};

export const formatDate = (value, language = 'en', options = {}) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(getLocale(language), {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options,
  }).format(date);
};

export const formatDateTime = (value, language = 'en') => formatDate(value, language, {
  hour: '2-digit',
  minute: '2-digit',
});

export const formatImei = (value) => {
  if (!value) return '—';
  return String(value).replace(/\s+/g, '').replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

export const formatPhone = (value) => {
  if (!value) return '—';
  const digits = String(value).replace(/[^\d+]/g, '');
  if (digits.startsWith('+880') && digits.length >= 14) {
    return digits.replace(/^(\+880)(\d{3})(\d{3})(\d+)$/, '$1 $2 $3 $4');
  }
  return String(value);
};
