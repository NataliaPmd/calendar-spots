import { format, parse, isAfter, isBefore, isEqual } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { Slot } from '../types';


export interface IDateHandler {
  parseSlotTime(time: string, dateISO: string): Date;
  formatDateToISO(date: string): string;
  formatDate(date: Date, formatStr: string): string;
  isAfter(date1: Date, time2: string, dateISO: string): boolean;
  isWithinSlot(sessionStart: Date, sessionEnd: Date, slotStart: Date, slotEnd: Date): boolean;
  splitSlotBySession(slotStart: Date, slotEnd: Date, sessionStart: Date, sessionEnd: Date): Slot[];
}

export class DateHandler {
  parseSlotTime(time: string, dateISO: string): Date {
    const parsedDate = parse(`${dateISO} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    return fromZonedTime(parsedDate, 'Etc/UTC');
  }

  formatDateToISO(date: string): string {
    return format(parse(date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
  }

  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr);
  }

  isAfter(date1: Date, time2: string, dateISO: string): boolean {
    return isAfter(date1, this.parseSlotTime(time2, dateISO));
  }

  isWithinSlot(sessionStart: Date, sessionEnd: Date, slotStart: Date, slotEnd: Date): boolean {
    return (isAfter(sessionStart, slotStart) && isBefore(sessionEnd, slotEnd)) ||
           (isEqual(sessionStart, slotStart) && isBefore(sessionEnd, slotEnd)) ||
           (isAfter(sessionStart, slotStart) && isEqual(sessionEnd, slotEnd)) ||
           (isEqual(sessionStart, slotStart) && isEqual(sessionEnd, slotEnd));
  }

  splitSlotBySession(slotStart: Date, slotEnd: Date, sessionStart: Date, sessionEnd: Date): Slot[] {
    const slots: Slot[] = [];
    if (isAfter(sessionStart, slotStart)) {
      slots.push({ start: this.formatDate(slotStart, 'HH:mm'), end: this.formatDate(sessionStart, 'HH:mm') });
    }
    if (isBefore(sessionEnd, slotEnd)) {
      slots.push({ start: this.formatDate(sessionEnd, 'HH:mm'), end: this.formatDate(slotEnd, 'HH:mm') });
    }
    return slots;
  }
}