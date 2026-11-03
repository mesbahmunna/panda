/**
 * Audio Alert Utility for Admin & Staff Call Center
 * Uses Web Audio API synthesizer for zero-dependency, 100% offline, crisp notification sounds.
 */

const SOUND_PREF_KEY = 'baby_notification_sound_enabled';

class SoundAlertManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SOUND_PREF_KEY);
        this.soundEnabled = saved === null ? true : saved === 'true';
      } catch {
        this.soundEnabled = true;
      }

      // Unlock AudioContext on first user interaction anywhere on the page
      const unlockAudio = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            this.isUnlocked = true;
          }).catch(() => {});
        } else {
          this.isUnlocked = true;
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };

      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem(SOUND_PREF_KEY, enabled.toString());
      window.dispatchEvent(new CustomEvent('baby_sound_pref_changed', { detail: enabled }));
    } catch {}

    if (enabled) {
      // Play brief test pip when enabled
      this.playNote(880, 0, 0.08, 0.15, 'sine');
    }
  }

  public toggle(): boolean {
    const next = !this.soundEnabled;
    this.setEnabled(next);
    return next;
  }

  /**
   * Helper to play a smooth synthesized musical note with exponential decay envelope
   */
  private playNote(
    freq: number,
    startTimeOffset: number,
    duration: number,
    volume: number = 0.3,
    type: OscillatorType = 'sine'
  ): void {
    const ctx = this.initContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime + startTimeOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    // Envelope: quick attack to prevent clicking, smooth decay
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  /**
   * Play Admin New Order Chime (Bright 4-note cash-in arpeggio: C5 -> E5 -> G5 -> C6)
   */
  public playNewOrderAlert(): void {
    if (!this.soundEnabled) return;

    try {
      // Note 1: C5 (523.25 Hz)
      this.playNote(523.25, 0.0, 0.22, 0.35, 'triangle');
      // Note 2: E5 (659.25 Hz)
      this.playNote(659.25, 0.1, 0.22, 0.35, 'triangle');
      // Note 3: G5 (783.99 Hz)
      this.playNote(783.99, 0.2, 0.25, 0.4, 'sine');
      // Note 4: C6 (1046.50 Hz) - Bright resonant finale
      this.playNote(1046.50, 0.32, 0.45, 0.45, 'sine');
    } catch (e) {
      console.warn('Audio alert playback failed:', e);
    }
  }

  /**
   * Play Staff Call Desk Assigned Lead Chime (High-contrast double-bell phone lead alert)
   */
  public playStaffAssignedAlert(): void {
    if (!this.soundEnabled) return;

    try {
      // Crisp telephone desk ding: D5 -> A5 with harmonic ring
      this.playNote(587.33, 0.0, 0.18, 0.35, 'sine');
      this.playNote(880.00, 0.08, 0.3, 0.45, 'triangle');
      // Second bell echo
      this.playNote(880.00, 0.28, 0.35, 0.4, 'sine');
      this.playNote(1174.66, 0.34, 0.5, 0.45, 'triangle');
    } catch (e) {
      console.warn('Staff audio alert playback failed:', e);
    }
  }
}

export const soundManager = new SoundAlertManager();

export interface NewOrderNotificationDetail {
  orderId: string;
  customerName?: string;
  phoneNumber?: string;
  total?: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  district?: string;
  timestamp: number;
}

/**
 * Global subscriber for new order events across tabs and current tab
 */
export const subscribeToNewOrderEvents = (
  callback: (detail: NewOrderNotificationDetail) => void
): (() => void) => {
  // 1. Same-tab custom event
  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<NewOrderNotificationDetail>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  // 2. Cross-tab storage event
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === 'baby_latest_order_event' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch {}
    }
  };

  window.addEventListener('baby_new_order_event', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('baby_new_order_event', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};

/**
 * Helper to dispatch new order alert across tabs
 */
export const broadcastNewOrderEvent = (detail: Omit<NewOrderNotificationDetail, 'timestamp'>): void => {
  const fullDetail: NewOrderNotificationDetail = {
    ...detail,
    timestamp: Date.now()
  };

  try {
    // Cross-tab trigger via localStorage
    localStorage.setItem('baby_latest_order_event', JSON.stringify(fullDetail));
  } catch {}

  try {
    // Current-tab trigger via window CustomEvent
    window.dispatchEvent(new CustomEvent('baby_new_order_event', { detail: fullDetail }));
  } catch {}
};
