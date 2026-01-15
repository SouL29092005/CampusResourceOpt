export function flattenClasses(classes) {
  const tasks = [];

  for (const cls of classes) {
    for (const subject of cls.subjects) {
      for (let i = 0; i < subject.weeklyHours; i++) {
        tasks.push({
          classId: cls._id.toString(),
          className: cls.className,
          semester: cls.semester,

          subjectId: subject._id?.toString() || subject.subjectCode,
          subjectCode: subject.subjectCode,
          subjectType: subject.type,
        });
      }
    }
  }

  return tasks;
}
