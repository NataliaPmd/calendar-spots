import { Slot } from '../types';
import { ISlotManager } from './SlotManager';

export interface ISessionManager {
  filterSlotsBySessions(daySlots: Slot[], sessions: Slot[], dateISO: string): Slot[];
}

export class SessionManager implements ISessionManager {
  constructor(
    private slotManager: ISlotManager,
  ) {}

  filterSlotsBySessions(daySlots: Slot[], sessions: Slot[], dateISO: string): Slot[] {
    if (!daySlots.length) return [];
    return daySlots.flatMap(daySlot =>
      this.getSessionFilteredSlots(daySlot, sessions, dateISO)
    );
  }

  private getSessionFilteredSlots(daySlot: Slot, sessions: Slot[], dateISO: string): Slot[] {
    let hasConflicts = false;
    const filteredSlots = sessions.flatMap(sessionSlot => {
      if (this.slotManager.isSlotConflicting(daySlot, sessionSlot, dateISO)) {
        hasConflicts = true;
        return this.slotManager.splitSlotBySession(daySlot, sessionSlot, dateISO);
      }
      return [];
    });
    return hasConflicts ? filteredSlots : [daySlot];
  }
}