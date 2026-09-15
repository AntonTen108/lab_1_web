var card = document.getElementById("card");
var statusBox = document.getElementById("status");
var title = document.getElementById("title");
var editLink = document.getElementById("editLink");
var deleteBtn = document.getElementById("deleteBtn");

function showStatus(text) {
  statusBox.textContent = text;
  statusBox.hidden = false;
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id") || "";
}

function renderStudent(student) {
  var days = countDays(student.dateFrom, student.dateTo);

  document.title = student.fullName + " досье студента";
  title.textContent = student.fullName;

  setText("fullName", student.fullName);
  setText("group", student.group);
  setText("isuId", student.isuId);
  setText("isForeigner", formatYesNo(student.isForeigner));

  setText("dormitory", formatDormitory(student.dormitory));
  setText("room", student.room);
  setText("term", formatTerm(student.dateFrom, student.dateTo));
  setText("duration", days ? days + " дн." : "не определена");
  setText("termState", describeTermState(student.dateFrom, student.dateTo));

  setText("notes", student.notes || "Заметок нет.");

  setText("recordId", student.id);
  setText("createdAt", formatDateTime(student.createdAt));
  setText("updatedAt", formatDateTime(student.updatedAt));

  editLink.href = "../form/index.html?id=" + encodeURIComponent(student.id);
  card.hidden = false;
}

var requestedId = getIdFromUrl();
var current = requestedId ? getStudent(requestedId) : null;

if (current) {
  renderStudent(current);
} else if (requestedId) {
  showStatus("Запись не найдена");
} else {
  showStatus("Не указан идентификатор студента");
}

deleteBtn.addEventListener("click", function () {
  if (!current) {
    return;
  }

  if (confirm("Удалить запись: " + current.fullName + "?")) {
    deleteStudent(current.id);
    window.location.href = "../table/index.html";
  }
});
