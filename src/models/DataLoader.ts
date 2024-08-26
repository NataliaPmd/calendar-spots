import { readFileSync } from 'fs';
import { CalendarData } from '../types';

export interface IDataLoader {
  loadCalendarData(calendarName: string): CalendarData;
}

export class DataLoader implements IDataLoader {
  loadCalendarData(calendarName: string): CalendarData {
    try {
      const rawData = readFileSync(`./src/calendars/calendar.${calendarName}.json`, 'utf-8');
      const parsedData = JSON.parse(rawData);
      return {
        durationBefore: parsedData.durationBefore,
        durationAfter: parsedData.durationAfter,
        slots: parsedData.slots || {},
        sessions: parsedData.sessions || {},
      };
    } catch (err: any) {
      throw new Error(`Failed to load calendar data: ${err.message}`);
    }
  }
}