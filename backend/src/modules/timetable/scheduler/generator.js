import { generateSlots, parseSlot } from "../../../utils/time.utils.js";
import { checkHardConstraints } from "./constraints.js";
import { scoreSlot } from "./scoring.js";

export function generateTimetable(tasks, subjectToFaculties, rooms) {
  const slots = generateSlots();

  const state = {
    faculty: {},            // facultyId -> Set(slots)
    class: {},              // classId   -> Set(slots)
    room: {},               // room      -> Set(slots)

    facultyConsecutive: {}, // facultyId -> day -> index -> streak
    classConsecutive: {},   // classId   -> day -> index -> streak

    facultyWeeklyLoad: {},  // facultyId -> number
    classDailySlots: {},    // classId -> day -> [slotIndexes]
    lastRoomByClass: {},    // classId -> day -> room
  };

  const timetable = [];

  tasks.sort((a, b) => {
    if (a.subjectType !== b.subjectType) {
      return a.subjectType === "LAB" ? -1 : 1;
    }
    return 0;
  });

  for (const task of tasks) {
    let best = null;
    let bestScore = Infinity;

    const faculties = subjectToFaculties[task.subjectId] || [];
    if (faculties.length === 0) {
      throw new Error(
        `No faculty available for subject ${task.subjectCode}`
      );
    }

    for (const faculty of faculties) {
      const facultyId = faculty.userId.toString();

      // hard: weekly workload
      if (
        (state.facultyWeeklyLoad[facultyId] || 0) >= faculty.maxWeeklyHours
      ) continue;

      for (const slot of slots) {
        // hard: faculty availability
        if (
          faculty.availableSlots?.length &&
          !faculty.availableSlots.includes(slot)
        ) continue;

        for (const room of rooms) {
          if (
            !checkHardConstraints({
              facultyId,
              classId: task.classId,
              room,
              slot,
              state,
            })
          ) continue;

          const score = scoreSlot({
            faculty,
            classId: task.classId,
            room,
            slot,
            state,
          });

          if (score < bestScore) {
            bestScore = score;
            best = { facultyId, slot, room };
          }
        }
      }
    }

    if (!best) {
      throw new Error(
        `Failed to schedule ${task.subjectCode} for class ${task.className}`
      );
    }

    timetable.push({
      classId: task.classId,
      subjectId: task.subjectId,
      facultyId: best.facultyId,
      room: best.room,
      slot: best.slot,
    });

    // init maps
    state.faculty[best.facultyId] ??= new Set();
    state.class[task.classId] ??= new Set();
    state.room[best.room] ??= new Set();
    state.facultyWeeklyLoad[best.facultyId] ??= 0;

    // mark occupied
    state.faculty[best.facultyId].add(best.slot);
    state.class[task.classId].add(best.slot);
    state.room[best.room].add(best.slot);
    state.facultyWeeklyLoad[best.facultyId]++;

    // bookkeeping for scoring
    const { day, hour } = parseSlot(best.slot);
    const slotIndex = [9, 10, 11, 12, 14, 15, 16, 17].indexOf(hour);

    state.classDailySlots[task.classId] ??= {};
    state.classDailySlots[task.classId][day] ??= [];
    state.classDailySlots[task.classId][day].push(slotIndex);

    state.lastRoomByClass[task.classId] ??= {};
    state.lastRoomByClass[task.classId][day] = best.room;
  }

  return timetable;
}
