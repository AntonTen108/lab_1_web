function setCookie(name, value, days) {
  var parts = [
    encodeURIComponent(name) + "=" + encodeURIComponent(value),
    "path=/",
    "SameSite=Lax",
  ];

  if (typeof days === "number") {
    var expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    parts.push("expires=" + expires.toUTCString());
  }

  document.cookie = parts.join("; ");
}

function getCookie(name) {
  var key = encodeURIComponent(name) + "=";
  var items = document.cookie ? document.cookie.split("; ") : [];

  for (var i = 0; i < items.length; i++) {
    if (items[i].indexOf(key) === 0) {
      return decodeURIComponent(items[i].slice(key.length));
    }
  }

  return null;
}

function getCookieNames() {
  var items = document.cookie ? document.cookie.split("; ") : [];
  var names = [];

  for (var i = 0; i < items.length; i++) {
    var eq = items[i].indexOf("=");

    if (eq > 0) {
      names.push(decodeURIComponent(items[i].slice(0, eq)));
    }
  }

  return names;
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}

function setCookieJSON(name, data, days) {
  setCookie(name, JSON.stringify(data), days);
}

function getCookieJSON(name) {
  var raw = getCookie(name);

  if (!raw) {
    return null;
  }

  try {
    var data = JSON.parse(raw);
    return data && typeof data === "object" ? data : null;
  } catch (e) {
    return null;
  }
}
