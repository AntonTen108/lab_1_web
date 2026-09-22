var DRAFT_COOKIE = "draft_new_student";
var DRAFT_DAYS = 30;

var form = document.getElementById("application-form");
var formTitle = document.getElementById("formTitle");
var statusBox = document.getElementById("status");
var savedNote = document.getElementById("savedNote");
var notesCount = document.getElementById("notesCount");
var clearBtn = document.getElementById("clearBtn");
var submitBtn = document.getElementById("submitBtn");

var editing = null;

function collectData() {
  return {
    fullName: form.fullName.value.trim().replace(/\s+/g, " "),
    group: form.group.value.trim().toUpperCase(),
    isuId: form.isuId.value.trim(),
    dormitory: form.dormitory.value,
    room: form.room.value.trim(),
    dateFrom: form.dateFrom.value,
    dateTo: form.dateTo.value,
    isForeigner: form.isForeigner.checked,
    notes: form.notes.value.trim(),
  };
}

function fillForm(data) {
  if (!data) {
    return;
  }

  form.fullName.value = data.fullName || "";
  form.group.value = data.group || "";
  form.isuId.value = data.isuId || "";
  form.dormitory.value = data.dormitory || "";
  form.room.value = data.room || "";
  form.dateFrom.value = data.dateFrom || "";
  form.dateTo.value = data.dateTo || "";
  form.isForeigner.checked = Boolean(data.isForeigner);
  form.notes.value = data.notes || "";
}

function showStatus(text) {
  statusBox.textContent = text;
  statusBox.hidden = false;
}

function setFieldError(name, message) {
  var box = form.querySelector('[data-error-for="' + name + '"]');
  var input = form.elements[name];

  if (box) {
    box.textContent = message || "";
  }
  if (input) {
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }
}

function clearErrors() {
  var boxes = form.querySelectorAll("[data-error-for]");

  for (var i = 0; i < boxes.length; i++) {
    setFieldError(boxes[i].getAttribute("data-error-for"), "");
  }
}

var NAME_RE = /^[А-Яа-яЁёA-Za-z]+(?:[- ][А-Яа-яЁёA-Za-z]+)+$/;
var GROUP_RE = /^[А-ЯЁ][1-9]\d{3,4}$/;
var ISU_RE = /^[1-9]\d{5}$/;
var MIN_YEAR = 2000;
var MAX_YEAR = 2099;

function isDateInRange(value) {
  var year = Number(value.slice(0, 4));
  return year >= MIN_YEAR && year <= MAX_YEAR;
}

function validate(data) { // TODO !!!!!!!!!!!!!
  var errors = {};

  if (data.fullName.length < 5) {
    errors.fullName = "Укажите фамилию, имя и отчество";
  } else if (!NAME_RE.test(data.fullName)) {
    errors.fullName = "Только буквы: хотя бы фамилия и имя";
  }
  if (!data.group) {
    errors.group = "Укажите группу";
  } else if (!GROUP_RE.test(data.group)) {
    errors.group = "Русская буква и номер не с нуля, например Р3110";
  }
  if (!ISU_RE.test(data.isuId)) {
    errors.isuId = "ID состоит из 6 цифр и не начинается с нуля";
  }
  if (!data.dormitory) {
    errors.dormitory = "Выберите общежитие";
  }
  if (!/^\d{1,5}$/.test(data.room)) {
    errors.room = "Номер комнаты";
  }
  if (!data.dateFrom) {
    errors.dateFrom = "Укажите дату заселения";
  } else if (!isDateInRange(data.dateFrom)) {
    errors.dateFrom = "Год должен быть от " + MIN_YEAR + " до " + MAX_YEAR;
  }
  if (!data.dateTo) {
    errors.dateTo = "Укажите дату выселения";
  } else if (!isDateInRange(data.dateTo)) {
    errors.dateTo = "Год должен быть от " + MIN_YEAR + " до " + MAX_YEAR;
  }
  if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
    errors.dateTo = "Дата окончания раньше даты начала";
  }

  return errors;
}

function saveDraft() {
  if (editing) {
    return;
  }

  setCookieJSON(DRAFT_COOKIE, collectData(), DRAFT_DAYS);
  savedNote.textContent =
    "Черновик сохранён в cookie: " + new Date().toLocaleTimeString("ru-RU");
}

function updateNotesCount() {
  notesCount.textContent = String(form.notes.value.length);
}

function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id") || "";
}

var requestedId = getIdFromUrl();

if (requestedId) {
  editing = getStudent(requestedId);

  if (editing) {
    formTitle.textContent = "Редактирование записи";
    submitBtn.textContent = "Сохранить изменения";
    fillForm(editing);
  } else {
    showStatus("Запись не найдена " + "Заполните форму.");
  }
} else {
  var draft = getCookieJSON(DRAFT_COOKIE);

  if (draft) {
    fillForm(draft);
    savedNote.textContent = "Загружен cookie";
  }
}

updateNotesCount();

form.addEventListener("input", function (event) {
  if (event.target === form.isuId || event.target === form.room) {
    event.target.value = event.target.value.replace(/\D/g, "");
  }

  saveDraft();

  if (event.target === form.notes) {
    updateNotesCount();
  }
  if (event.target.name) {
    setFieldError(event.target.name, "");
  }
});

form.addEventListener("change", saveDraft);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  var data = collectData();
  var errors = validate(data);
  var names = Object.keys(errors);

  if (names.length > 0) {
    for (var i = 0; i < names.length; i++) {
      setFieldError(names[i], errors[names[i]]);
    }
    showStatus("Проверьте заполнение полей: " + names.length + ".");
    form.elements[names[0]].focus();
    return;
  }

  if (editing) {
    data.id = editing.id;
  }

  saveStudent(data);
  deleteCookie(DRAFT_COOKIE);

  window.location.href = "../table/index.html";
});

clearBtn.addEventListener("click", function () {
  if (editing) {
    fillForm(editing);
    showStatus("Значения восстановлены из сохранённой записи");
  } else {
    form.reset();
    deleteCookie(DRAFT_COOKIE);
    savedNote.textContent = "";
    showStatus("Форма очищена, черновик удалён");
  }

  clearErrors();
  updateNotesCount();
});
