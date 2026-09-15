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
    fullName: form.fullName.value.trim(),
    group: form.group.value.trim(),
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

function validate(data) { // TODO !!!!!!!!!!!!!
  var errors = {};

  if (data.fullName.length < 5) {
    errors.fullName = "Укажите фамилию, имя и отчество";
  } else if (data.fullName.split(" ").length < 2) {
    errors.fullName = "Укажите хотя бы фамилию и имя";
  }
  if (!data.group) {
    errors.group = "Укажите группу";
  }
  if (!/^\d{5,10}$/.test(data.isuId)) {
    errors.isuId = "ID состоит из 5-10 цифр";
  }
  if (!data.dormitory) {
    errors.dormitory = "Выберите общежитие";
  }
  if (!/^\d{1,5}$/.test(data.room)) {
    errors.room = "Номер комнаты";
  }
  if (!data.dateFrom) {
    errors.dateFrom = "Укажите дату заселения";
  }
  if (!data.dateTo) {
    errors.dateTo = "Укажите дату выселения";
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
    showStatus("Форма очищена, чернвик удалён");
  }

  clearErrors();
  updateNotesCount();
});
