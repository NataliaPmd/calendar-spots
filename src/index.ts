
import { Calendar } from './models/Calendar';
import { AvailableSlot } from './types';


export function getAvailableSpots(calendar: number, date: string, duration: number): AvailableSlot[] {
  const cal = new Calendar(calendar.toString());
  return cal.findAvailableSlots(date, duration);
}

// Example usage
console.log(getAvailableSpots(2, "13-04-2023", 25));