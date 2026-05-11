const EVENT = {
  title: 'Свадьба Кристины и Дмитрия',
  description:
    'Торжественная регистрация — 12:30, Бежицкий ЗАГС (ул. Комсомольская, 14).\n' +
    'Свадебный банкет — 18:00, ресторан «Леонс» (ул. Олеко Дундича, 5).',
  location:
    'Брянск, Бежицкий ЗАГС (ул. Комсомольская, 14) → ресторан «Леонс» (ул. Олеко Дундича, 5)',
  startMSK: { y: 2026, m: 6, d: 6, hh: 12, mm: 30 },
  endMSK: { y: 2026, m: 6, d: 6, hh: 23, mm: 0 },
};

const trigger = document.querySelector('[data-add-to-calendar]');
const modal = document.querySelector('[data-cal-modal]');

if (trigger && modal) {
  const closers = modal.querySelectorAll('[data-cal-close]');
  const options = modal.querySelectorAll('[data-cal-action]');
  let lastFocused = null;

  const openModal = () => {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstOption = modal.querySelector('.cal-option');
    if (firstOption) firstOption.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  trigger.addEventListener('click', openModal);
  closers.forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  options.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.calAction;
      switch (action) {
        case 'google':
          openInNewTab(googleUrl());
          break;
        case 'outlook':
          openInNewTab(outlookUrl());
          break;
        case 'yandex':
          openInNewTab(yandexUrl());
          break;
        case 'apple':
        case 'ics':
        default:
          downloadIcs();
          break;
      }
      flashSaved();
      setTimeout(closeModal, 350);
    });
  });

  const flashSaved = () => {
    const label = trigger.querySelector('span');
    if (!label) return;
    const original = label.textContent;
    label.textContent = 'Готово ✓';
    setTimeout(() => { label.textContent = original; }, 2500);
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

function toUtcStamp(d) {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function mskToUtcDate({ y, m, d, hh, mm }) {
  // MSK = UTC+3, без сезонного перехода
  return new Date(Date.UTC(y, m - 1, d, hh - 3, mm, 0));
}

function isoLocal({ y, m, d, hh, mm }) {
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00`;
}

function googleUrl() {
  const start = toUtcStamp(mskToUtcDate(EVENT.startMSK));
  const end = toUtcStamp(mskToUtcDate(EVENT.endMSK));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: EVENT.title,
    dates: `${start}/${end}`,
    details: EVENT.description,
    location: EVENT.location,
    ctz: 'Europe/Moscow',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function outlookUrl() {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: isoLocal(EVENT.startMSK),
    enddt: isoLocal(EVENT.endMSK),
    subject: EVENT.title,
    body: EVENT.description,
    location: EVENT.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function yandexUrl() {
  const params = new URLSearchParams({
    name: EVENT.title,
    descr: EVENT.description,
    location: EVENT.location,
    start_date: isoLocal(EVENT.startMSK),
    end_date: isoLocal(EVENT.endMSK),
    tz: 'Europe/Moscow',
  });
  return `https://calendar.yandex.ru/event?${params.toString()}`;
}

function buildIcs() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kristina & Dmitriy Wedding//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Moscow',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0300',
    'TZOFFSETTO:+0300',
    'TZNAME:MSK',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'UID:wedding-kristina-dmitriy-2026-06-06@invite.local',
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART;TZID=Europe/Moscow:${formatLocalIcs(EVENT.startMSK)}`,
    `DTEND;TZID=Europe/Moscow:${formatLocalIcs(EVENT.endMSK)}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:${EVENT.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${EVENT.location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Завтра свадьба Кристины и Дмитрия',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

function formatLocalIcs({ y, m, d, hh, mm }) {
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kristina-dmitriy-wedding.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function openInNewTab(url) {
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) downloadIcs();
}
