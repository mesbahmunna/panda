import { StaffMember, StaffSession } from '../types/staff';

const STAFF_KEY = 'baby_staff_members';
const SESSION_KEY = 'baby_staff_active_session';
const RR_INDEX_KEY = 'baby_staff_rr_index';

export const SEED_STAFF: StaffMember[] = [
  {
    id: 'staff-101',
    name: 'Tanzim Ahmed',
    phone: '01712000001',
    pin: '1111',
    role: 'tele_sales',
    isActive: true,
    isAvailableToday: true,
    avatarColor: '#10B981', // Emerald
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    stats: {
      confirmedCount: 14,
      cancelledCount: 1,
      totalAssigned: 18
    }
  },
  {
    id: 'staff-102',
    name: 'Nusrat Jahan',
    phone: '01712000002',
    pin: '2222',
    role: 'tele_sales',
    isActive: true,
    isAvailableToday: true,
    avatarColor: '#8B5CF6', // Purple
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    stats: {
      confirmedCount: 12,
      cancelledCount: 2,
      totalAssigned: 16
    }
  },
  {
    id: 'staff-103',
    name: 'Shakil Hossain',
    phone: '01712000003',
    pin: '3333',
    role: 'tele_sales',
    isActive: true,
    isAvailableToday: false, // Off duty today
    avatarColor: '#F59E0B', // Amber
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    stats: {
      confirmedCount: 8,
      cancelledCount: 0,
      totalAssigned: 9
    }
  }
];

export const getStaffMembers = (): StaffMember[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STAFF_KEY) : null;
    if (!raw) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STAFF_KEY, JSON.stringify(SEED_STAFF));
      }
      return SEED_STAFF;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STAFF_KEY, JSON.stringify(SEED_STAFF));
      }
      return SEED_STAFF;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to get staff from storage', err);
    return SEED_STAFF;
  }
};

export const getStaffById = (id: string): StaffMember | undefined => {
  const all = getStaffMembers();
  return all.find((s) => s.id === id);
};

export const saveStaffMember = (member: StaffMember): StaffMember => {
  const current = getStaffMembers();
  const index = current.findIndex((s) => s.id === member.id);
  let updated: StaffMember[];

  if (index > -1) {
    updated = [...current];
    updated[index] = member;
  } else {
    updated = [...current, member];
  }

  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_staff_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save staff member', err);
  }

  return member;
};

export const deleteStaffMember = (id: string): void => {
  const current = getStaffMembers();
  const updated = current.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_staff_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete staff member', err);
  }
};

export const toggleStaffAvailableToday = (id: string): boolean => {
  const current = getStaffMembers();
  let nextState = false;
  const updated = current.map((s) => {
    if (s.id === id) {
      nextState = !s.isAvailableToday;
      return { ...s, isAvailableToday: nextState };
    }
    return s;
  });

  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_staff_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to toggle staff duty', err);
  }

  return nextState;
};

export const getAvailableStaffToday = (): StaffMember[] => {
  const all = getStaffMembers();
  return all.filter((s) => s.isActive && s.isAvailableToday);
};

/**
 * Fair-Share Equal Round-Robin Order Distribution Algorithm
 * Distributes incoming customer orders sequentially among staff available today.
 */
export const getNextStaffForDistribution = (): StaffMember | null => {
  const available = getAvailableStaffToday();
  if (available.length === 0) {
    return null; // No staff active today; order goes to admin pool
  }

  let lastIndex = 0;
  try {
    const rawIndex = localStorage.getItem(RR_INDEX_KEY);
    if (rawIndex !== null) {
      lastIndex = parseInt(rawIndex, 10);
    }
  } catch {}

  const nextIndex = (lastIndex + 1) % available.length;
  try {
    localStorage.setItem(RR_INDEX_KEY, nextIndex.toString());
  } catch {}

  const selected = available[nextIndex];

  // Update total assigned stat
  const all = getStaffMembers();
  const updatedAll = all.map((s) => {
    if (s.id === selected.id) {
      return {
        ...s,
        stats: {
          ...s.stats,
          totalAssigned: (s.stats?.totalAssigned || 0) + 1
        }
      };
    }
    return s;
  });

  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updatedAll));
  } catch {}

  return selected;
};

export const recordStaffOrderAction = (
  staffId: string,
  action: 'confirmed' | 'cancelled'
): void => {
  const all = getStaffMembers();
  const updated = all.map((s) => {
    if (s.id === staffId) {
      return {
        ...s,
        stats: {
          ...s.stats,
          confirmedCount: action === 'confirmed' ? (s.stats.confirmedCount || 0) + 1 : s.stats.confirmedCount,
          cancelledCount: action === 'cancelled' ? (s.stats.cancelledCount || 0) + 1 : s.stats.cancelledCount
        }
      };
    }
    return s;
  });

  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('baby_staff_updated', { detail: updated }));
  } catch {}
};

/**
 * Authentication & Session Management
 */
export const verifyStaffLogin = (pinOrPhone: string, pin?: string): StaffMember | null => {
  const all = getStaffMembers();
  const inputPin = pin ? pin.trim() : pinOrPhone.trim();
  const inputPhone = pin ? pinOrPhone.trim() : '';

  for (const s of all) {
    if (!s.isActive) continue;
    if (inputPhone) {
      if (s.phone === inputPhone && s.pin === inputPin) {
        return s;
      }
    } else {
      if (s.pin === inputPin) {
        return s;
      }
    }
  }

  return null;
};

export const getActiveStaffSession = (): StaffSession | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
};

export const setActiveStaffSession = (staff: StaffMember, isImpersonated = false): void => {
  const session: StaffSession = {
    staffId: staff.id,
    staffName: staff.name,
    role: 'tele_sales',
    isImpersonatedByAdmin: isImpersonated
  };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('baby_staff_session_changed', { detail: session }));
  } catch {}
};

export const clearStaffSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent('baby_staff_session_changed', { detail: null }));
  } catch {}
};

export const isImpersonatingAdmin = (): boolean => {
  const session = getActiveStaffSession();
  return Boolean(session?.isImpersonatedByAdmin);
};
