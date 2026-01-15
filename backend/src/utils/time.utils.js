// src/utils/time.utils.js

export const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

export const HOURS = [9, 10, 11, 12, 14, 15, 16, 17];

export function generateSlots() {
  const slots = [];
  for (const day of DAYS) {
    for (const hour of HOURS) {
      slots.push(`${day}_${hour}`);
    }
  }
  return slots;
}

export function parseSlot(slot) {
  const [day, hour] = slot.split("_");
  return { day, hour: Number(hour) };
}
