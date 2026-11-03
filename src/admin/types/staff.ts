export interface StaffStats {
  confirmedCount: number;
  cancelledCount: number;
  totalAssigned: number;
}

export interface StaffMember {
  id: string;               // e.g. "staff-101"
  name: string;             // e.g. "Tanzim Ahmed"
  phone: string;            // e.g. "01712000001"
  pin: string;              // 4-digit PIN e.g. "2233"
  role: 'tele_sales';       // Call center tele-sales agent
  isActive: boolean;        // Account active or disabled
  isAvailableToday: boolean;// Shift availability toggle for today's order routing
  avatarColor: string;      // Badge color (e.g. "#10B981")
  createdAt: string;
  stats: StaffStats;
}

export interface StaffSession {
  staffId: string;
  staffName: string;
  role: 'tele_sales';
  isImpersonatedByAdmin?: boolean;
}
