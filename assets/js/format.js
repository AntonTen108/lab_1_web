function formatDate(value) {
  if (!value) {
    return "";
  }

  const parts = value.split("-");

  return parts.length === 3
    ? parts[2] + "." + parts[1] + "." + parts[0]
    : value;
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return isNaN(date.getTime()) ? value : date.toLocaleString("ru-RU");
}

function formatTerm(from, to) {
  return formatDate(from) + " — " + formatDate(to);
}

function formatYesNo(flag) {
  return flag ? "да" : "нет";
}

function formatDormitory(value) {
  return value ? "№ " + value : "";
}

function countDays(from, to) {
  const start = new Date(from);
  const end = new Date(to);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 0;
  }

  return Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1;
}

function describeTermState(from, to) {
  const today = new Date();
  const iso =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  if (!from || !to) {
    return "срок не указан";
  }
  if (iso < from) {
    return "заселение ещё не началось";
  }
  if (iso > to) {
    return "срок проживания истёк";
  }

  return "проживает сейчас";
}
