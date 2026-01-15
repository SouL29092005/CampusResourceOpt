import { parseSlot } from "../../../utils/time.utils.js";

export function scoreSlot({ faculty, classId, room, slot, state }) {
  let score = 0;
  const { day, hour } = parseSlot(slot);

  // faculty preferred slot bonus
  if (faculty.preferredSlots?.includes(slot)) score -= 10;

  // early morning penalty
  if (hour === 9) score += 5;

  // room continuity bonus
  const prevRoom = state.lastRoomByBatch[classId._id]?.[day];
  if (prevRoom && prevRoom !== room) score += 5;

  // idle gap penalty
  const daily = state.batchDailySlots[classId._id]?.[day] || [];
  if (daily.length > 0) {
    const min = Math.min(...daily);
    const max = Math.max(...daily);
    const idle = (max - min + 1) - daily.length;
    score += idle * 3;
  }

  return score;
}
