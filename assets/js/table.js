const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const counter = document.getElementById("counter");
const emptyNote = document.getElementById("empty");
const statusBox = document.getElementById("status");

function showStatus(text) {
  statusBox.textContent = text;
  statusBox.hidden = false;
}

function studentUrl(student) {
  return "../student/index.html?id=" + encodeURIComponent(student.id);
}

function filterStudents(students, query) {
  const text = query.trim().toLowerCase();

  if (!text) {
    return students;
  }

  return students.filter(function (student) {
    const haystack = [
      student.fullName,
      student.group,
      student.isuId,
      student.room,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.indexOf(text) !== -1;
  });
}

function createCell(text) {
  const cell = document.createElement("td");

  cell.textContent = text;

  return cell;
}

function createNameCell(student) {
  const cell = document.createElement("td");
  const link = document.createElement("a");

  link.href = studentUrl(student);
  link.textContent = student.fullName;
  cell.appendChild(link);

  return cell;
}

function createActionsCell(student) {
  const cell = document.createElement("td");

  const details = document.createElement("a");
  details.href = studentUrl(student);
  details.textContent = "Подробнее";

  const edit = document.createElement("a");
  edit.href = "../form/index.html?id=" + encodeURIComponent(student.id);
  edit.textContent = "Изменить";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Удалить";
  remove.setAttribute("data-remove-id", student.id);

  cell.appendChild(details);
  cell.appendChild(document.createTextNode(" "));
  cell.appendChild(edit);
  cell.appendChild(document.createTextNode(" "));
  cell.appendChild(remove);

  return cell;
}

function createRow(student) {
  const row = document.createElement("tr");

  row.appendChild(createNameCell(student));
  row.appendChild(createCell(student.group));
  row.appendChild(createCell(student.isuId));
  row.appendChild(createCell(formatDormitory(student.dormitory)));
  row.appendChild(createCell(student.room));
  row.appendChild(createCell(formatTerm(student.dateFrom, student.dateTo)));
  row.appendChild(createCell(formatYesNo(student.isForeigner)));
  row.appendChild(createActionsCell(student));

  return row;
}

function render() {
  const students = getStudents();
  const visible = filterStudents(students, searchInput.value);

  tableBody.textContent = "";

  for (let i = 0; i < visible.length; i++) {
    tableBody.appendChild(createRow(visible[i]));
  }

  emptyNote.hidden = visible.length > 0;
  emptyNote.textContent =
    students.length === 0 ? "Записей нет." : "Ничего не найдено";

  counter.textContent =
    students.length === visible.length
      ? "Всего записей: " + students.length
      : "Показано " + visible.length + " из " + students.length;
}

searchInput.addEventListener("input", render);
tableBody.addEventListener("click", async function (event) {
  const id = event.target.getAttribute("data-remove-id");

  if (!id) {
    return;
  }

  const student = getStudent(id);

  if (student && confirm("Удалить запись: " + student.fullName + "?")) {
    await deleteStudent(id);
    render();
    showStatus("Запись удалена: " + student.fullName + ".");
  }
});

render();
