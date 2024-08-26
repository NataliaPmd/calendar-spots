
import { DateHandler } from './helpers/DateHandler';
import { Calendar } from './models/Calendar';
import { DataLoader } from './models/DataLoader';
import { SessionManager } from './models/SessionManager';
import { SlotManager } from './models/SlotManager';
import { AvailableSlot } from './types';


export function getAvailableSpots(calendar: number, date: string, duration: number): AvailableSlot[] {
  const dataLoader = new DataLoader(); 
  const dateHandler = new DateHandler(); 
  const slotManager = new SlotManager(dateHandler); 
  const sessionManager = new SessionManager(slotManager); 

  const cal = new Calendar(
    calendar.toString(),
    dataLoader,
    dateHandler,
    slotManager,
    sessionManager
  );
  
  return cal.findAvailableSlots(date, duration);
}

// Example usage
console.log(getAvailableSpots(2, "13-04-2023", 25));