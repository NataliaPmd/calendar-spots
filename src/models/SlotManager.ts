import { Slot, AvailableSlot } from '../types';
import { addMinutes } from 'date-fns';
import { DateHandler } from '../helpers/DateHandler';

export interface ISlotManager {
  splitIntoAvailableSlots(slots: Slot[], duration: number, dateISO: string): AvailableSlot[];
  isSlotConflicting(slot1: Slot, slot2: Slot, dateISO: string): boolean;
  splitSlotBySession(daySlot: Slot, sessionSlot: Slot, dateISO: string): Slot[];
}

export class SlotManager implements ISlotManager {
  
  constructor(private dateHandler: DateHandler, private durationBefore: number, private durationAfter: number) {}

  splitIntoAvailableSlots(slots: Slot[], duration: number, dateISO: string): AvailableSlot[] {
    const availableSlots: AvailableSlot[] = [];
    slots.forEach(slot => {
      let start = slot.start;
      let resultSlot: AvailableSlot | null;
      do {
        resultSlot = this.createAvailableSlot(start, slot.end, duration, dateISO);
        if (resultSlot) {
          availableSlots.push(resultSlot);
          start = this.dateHandler.formatDate(resultSlot.endHour, 'HH:mm');
        }
      } while (resultSlot);
    });
    return availableSlots;
  }

  isSlotConflicting(slot1: Slot, slot2: Slot, dateISO: string): boolean {
    const slot1Start = this.dateHandler.parseSlotTime(slot1.start, dateISO);
    const slot1End = this.dateHandler.parseSlotTime(slot1.end, dateISO);
    const slot2Start = this.dateHandler.parseSlotTime(slot2.start, dateISO);
    const slot2End = this.dateHandler.parseSlotTime(slot2.end, dateISO);
    return this.dateHandler.isWithinSlot(slot2Start, slot2End, slot1Start, slot1End);
  }

  splitSlotBySession(daySlot: Slot, sessionSlot: Slot, dateISO: string): Slot[] {
    const dayStart = this.dateHandler.parseSlotTime(daySlot.start, dateISO);
    const dayEnd = this.dateHandler.parseSlotTime(daySlot.end, dateISO);
    const sessionStart = this.dateHandler.parseSlotTime(sessionSlot.start, dateISO);
    const sessionEnd = this.dateHandler.parseSlotTime(sessionSlot.end, dateISO);
    return this.dateHandler.splitSlotBySession(dayStart, dayEnd, sessionStart, sessionEnd);
  }

  private createAvailableSlot(startSlot: string, endSlot: string, duration: number, dateISO: string): AvailableSlot | null {
    const startHour = this.dateHandler.parseSlotTime(startSlot, dateISO);
    const endHour = addMinutes(startHour, duration + this.durationBefore + this.durationAfter);
    if (this.dateHandler.isAfter(endHour, endSlot, dateISO)) {
      return null;
    }
    return {
      startHour,
      endHour,
      clientStartHour: addMinutes(startHour, 0),
      clientEndHour: addMinutes(startHour, duration),
    };
  }
}