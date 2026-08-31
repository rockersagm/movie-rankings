// Shared helpers used by index.html, rank.html, reveal.html.

const PERSON_KEY = 'movieRankingsPerson';

function getPerson() {
  return localStorage.getItem(PERSON_KEY);
}

function setPerson(person) {
  localStorage.setItem(PERSON_KEY, person);
}

function requirePerson() {
  const person = getPerson();
  if (!person) {
    window.location.href = 'index.html';
    return null;
  }
  return person;
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s == null ? '' : s;
  return div.innerHTML;
}

// GET actions are plain query params — no CORS preflight risk.
async function apiGet(action, params) {
  const url = new URL(WEB_APP_URL);
  url.searchParams.set('action', action);
  if (params) {
    Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  }
  const res = await fetch(url.toString());
  return res.json();
}

// POST bodies are sent as text/plain JSON (not application/json) and the
// token rides in the payload, not a header — both avoid CORS preflight,
// which Apps Script Web Apps don't handle. See SPEC.md section 3.
async function apiPost(action, body) {
  const res = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ action, token: ACCESS_TOKEN }, body))
  });
  return res.json();
}
