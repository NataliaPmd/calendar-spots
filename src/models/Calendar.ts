import { Slot, AvailableSlot } from '../types';
import { DataLoader, IDataLoader } from './DataLoader';
import { DateHandler } from '../helpers/DateHandler';
import { ISessionManager, SessionManager } from './SessionManager';
import { ISlotManager, SlotManager } from './SlotManager';

export class Calendar {
  private durationBefore: number;
  private durationAfter: number;
  private slots: Record<string, Slot[]>;
  private sessions: Record<string, Slot[]>;
  private dateHandler: DateHandler;
  private slotManager: ISlotManager;
  private sessionManager: ISessionManager;

  constructor(
    calendarName: string,
    private dataLoader: IDataLoader = new DataLoader(),
  ) {
    const data = this.dataLoader.loadCalendarData(calendarName);
    this.durationBefore = data.durationBefore;
    this.durationAfter = data.durationAfter;
    this.slots = data.slots;
    this.sessions = data.sessions;
    this.dateHandler = new DateHandler();
    this.slotManager = new SlotManager(this.dateHandler, this.durationBefore, this.durationAfter);
    this.sessionManager = new SessionManager(this.slotManager);
  }

  getDaySlots(date: string): Slot[] {
    return this.slots[date] || [];
  }

  getSessions(date: string): Slot[] {
    return this.sessions[date] || [];
  }

  findAvailableSlots(date: string, duration: number): AvailableSlot[] {
    if (duration <= 0) throw new Error("Duration must be greater than zero");

    const dateISO = this.dateHandler.formatDateToISO(date);
    const daySlots = this.getDaySlots(date);
    // Filter slots based on sessions
    const filteredSlots = this.sessionManager.filterSlotsBySessions(daySlots, this.getSessions(date), dateISO);
    // Find available slots based on the filtered slots
    return this.slotManager.splitIntoAvailableSlots(filteredSlots, duration, dateISO);
  }
}