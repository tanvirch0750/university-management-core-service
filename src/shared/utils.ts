import { WeekDays } from '@prisma/client';

type slotType = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};

export const hasTimeConflict = (
  existingSlots: slotType[],
  newSlot: slotType
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`); // here 1970 just for formating the date
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

    // existing slot: 12:30 - 13:30
    // new slot: 12:50 - 13:50
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }
  return false;
};
