const STUDENT_PREFIX = "stud_";
const STORAGE_DAYS = 300;

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getStudents() {
  const names = getCookieNames();
  const students = [];

  for (let i = 0; i < names.length; i++) {
    if (names[i].indexOf(STUDENT_PREFIX) !== 0) {
      continue;
    }

    const student = getCookieJSON(names[i]);

    if (student && student.id) {
      students.push(student);
    }
  }

  students.sort(function (a, b) {
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });

  return students;
}

function getStudent(id) {
  if (!id) {
    return null;
  }

  return getCookieJSON(STUDENT_PREFIX + id);
}

function saveStudent(data) {
  const now = new Date().toISOString();
  const existing = data.id ? getStudent(data.id) : null;

  const student = {
    id: data.id || makeId(),
    fullName: data.fullName,
    group: data.group,
    isuId: data.isuId,
    dormitory: data.dormitory,
    room: data.room,
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    isForeigner: Boolean(data.isForeigner),
    notes: data.notes,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  setCookieJSON(STUDENT_PREFIX + student.id, student, STORAGE_DAYS);

  return student;
}

function deleteStudent(id) {
  deleteCookie(STUDENT_PREFIX + id);
}
