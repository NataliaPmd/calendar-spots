import { addMinutes } from 'date-fns';
import { AvailableSlot, Slot } from '../types';
import { DataLoader, IDataLoader } from './DataLoader';
import { DateHandler } from '../helpers/DateHandler';

export class Calendar {
  private durationBefore: number;
  private durationAfter: number;
  private slots: Record<string, Slot[]>;
  private sessions: Record<string, Slot[]>;
  private dateHandler: DateHandler;

  constructor(
    calendarName: string, 
    private dataLoader: IDataLoader = new DataLoader(),
    dateHandler: DateHandler = new DateHandler()
  ) {
    const data = this.dataLoader.loadCalendarData(calendarName);
    this.durationBefore = data.durationBefore;
    this.durationAfter = data.durationAfter;
    this.slots = data.slots;
    this.sessions = data.sessions;
    this.dateHandler = dateHandler;
  }

  getDaySlots(date: string): Slot[] {
    return this.slots[date] || [];
  }

  getSessions(date: string): Slot[] {
    return this.sessions[date] || [];
  }

  findAvailableSlots(date: string, duration: number): AvailableSlot[] {
    const dateISO = this.dateHandler.formatDateToISO(date);
    const daySlots = this.getDaySlots(date);
    const realSpots = this.filterSlotsBySessions(daySlots, date, dateISO);
    return this.splitIntoAvailableSlots(realSpots, duration, dateISO);
  }

  private filterSlotsBySessions(daySlots: Slot[], date: string, dateISO: string): Slot[] {
    return daySlots.flatMap(daySlot => 
      this.getSessionFilteredSlots(date, daySlot, dateISO)
    );
  }

  private getSessionFilteredSlots(date: string, daySlot: Slot, dateISO: string): Slot[] {
    const sessions = this.getSessions(date);
    let hasConflicts = false;
    const filteredSlots = sessions.flatMap(sessionSlot => {
      const sessionStart = this.dateHandler.parseSlotTime(sessionSlot.start, dateISO);
      const sessionEnd = this.dateHandler.parseSlotTime(sessionSlot.end, dateISO);
      const slotStart = this.dateHandler.parseSlotTime(daySlot.start, dateISO);
      const slotEnd = this.dateHandler.parseSlotTime(daySlot.end, dateISO);

      if (this.dateHandler.isWithinSlot(sessionStart, sessionEnd, slotStart, slotEnd)) {
        hasConflicts = true;
        return this.dateHandler.splitSlotBySession(slotStart, slotEnd, sessionStart, sessionEnd);
      }

      return [];
    });

    return hasConflicts ? filteredSlots : [daySlot];
  }

  private splitIntoAvailableSlots(realSpots: Slot[], duration: number, dateISO: string): AvailableSlot[] {
    return realSpots.flatMap(slot => {
      let start = slot.start;
      let availableSlots: AvailableSlot[] = [];
      let resultSlot: AvailableSlot | null;
      do {
        resultSlot = this.createAvailableSlot(start, slot.end, duration, dateISO);
        if (resultSlot) {
          availableSlots.push(resultSlot);
          start = this.dateHandler.formatDate(resultSlot.endHour, 'HH:mm');
        }
      } while (resultSlot);
      return availableSlots;
    });
  }

  private createAvailableSlot(startSlot: string, endSlot: string, duration: number, dateISO: string): AvailableSlot | null {
    const startHour = this.dateHandler.parseSlotTime(startSlot, dateISO);
    const endHour = addMinutes(startHour, this.durationBefore + duration + this.durationAfter);
    const clientStartHour = addMinutes(startHour, this.durationBefore);
    const clientEndHour = addMinutes(startHour, duration);

    if (this.dateHandler.isAfter(endHour, endSlot, dateISO)) {
      return null;
    }

    return { startHour, endHour, clientStartHour, clientEndHour };
  }
}