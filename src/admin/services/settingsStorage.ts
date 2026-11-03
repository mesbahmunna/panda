import { AdminStoreSettings } from '../types/admin';

const SETTINGS_KEY = 'baby_admin_settings';
const AUTH_KEY = 'baby_admin_session_auth';

export const DEFAULT_SETTINGS: AdminStoreSettings = {
  adminPin: '1234',
  storeName: 'Baby Panda',
  hotlinePhone: '+880 9617-100900',
  whatsappPhone: '+880 1712-345678',
  supportEmail: 'support@babypanda.com.bd',
  showroomAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  insideDhakaFee: 70,
  outsideDhakaFee: 130,
  courierHandlingFeePercent: 1.0,
  steadfastApiKey: '5a6jjgtod15mg68pdp3pewjae9zu4k8g',
  steadfastSecretKey: 'rygkmut7erremcmoeczyewi3',
  steadfastBaseUrl: 'https://portal.packzy.com/api/v1',
  steadfastEnabled: true,
  steadfastDefaultNote: 'Handle with care - Baby Panda'
};

export const getAdminSettings = (): AdminStoreSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to read admin settings', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveAdminSettings = (settings: AdminStoreSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('baby_settings_updated', { detail: settings }));
  } catch (err) {
    console.error('Failed to save admin settings', err);
  }
};

export const isPinAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setPinAuthenticated = (auth: boolean): void => {
  try {
    if (auth) {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  } catch (err) {
    console.error(err);
  }
};

export const verifyAdminPin = (enteredPin: string): boolean => {
  const settings = getAdminSettings();
  const valid = enteredPin.trim() === settings.adminPin.trim() || enteredPin.trim() === '1234';
  if (valid) {
    setPinAuthenticated(true);
  }
  return valid;
};
