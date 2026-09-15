var STUDENT_PREFIX = "stud_";
var STORAGE_DAYS = 300;

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getStudents() {
  var names = getCookieNames();
  var students = [];

  for (var i = 0; i < names.length; i++) {
    if (names[i].indexOf(STUDENT_PREFIX) !== 0) {
      continue;
    }

    var student = getCookieJSON(names[i]);

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
  var now = new Date().toISOString();
  var existing = data.id ? getStudent(data.id) : null;

  var student = {
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
