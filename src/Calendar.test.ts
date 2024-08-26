const Calendar = require('./index')
import { parseISO } from 'date-fns';

describe('getAvailableSpots', () => {
  it('Should get 1 available spot for calendar 1', () => {
    const result = Calendar.getAvailableSpots(1, "10-04-2023", 30);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].startHour).toEqual(parseISO('2023-04-10T16:00:00.000Z'));
    expect(result[0].endHour).toEqual(parseISO('2023-04-10T16:50:00.000Z'));
  });

  it('Should get 1 available spot for calendar 2', () => {
    const result = Calendar.getAvailableSpots(2, "13-04-2023", 25);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].startHour).toEqual(parseISO('2023-04-13T18:00:00.000Z'));
    expect(result[0].endHour).toEqual(parseISO('2023-04-13T18:25:00.000Z'));
  });

  it('Should get no available spots for calendar 3', () => {
    const result = Calendar.getAvailableSpots(3, "16-04-2023", 25);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});