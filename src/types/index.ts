export interface CalendarData {
  durationBefore: number;
  durationAfter: number;
  slots: Record<string, Slot[]>;
  sessions: Record<string, Slot[]>;
}

export interface Slot {
  start: string;
  end: string;
}

export interface AvailableSlot {
  startHour: Date;
  endHour: Date;
  clientStartHour: Date;
  clientEndHour: Date;
}