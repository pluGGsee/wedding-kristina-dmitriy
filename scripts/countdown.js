const TARGET = new Date('2026-06-06T00:00:00+03:00').getTime();

const root = document.querySelector('[data-countdown]');
if (root) {
  const nums = {
    days: root.querySelector('[data-cd="days"]'),
    hours: root.querySelector('[data-cd="hours"]'),
    minutes: root.querySelector('[data-cd="minutes"]'),
    seconds: root.querySelector('[data-cd="seconds"]'),
  };

  const previous = { days: null, hours: null, minutes: null, seconds: null };

  const pad = (n) => String(n).padStart(2, '0');

  const update = () => {
    const diff = TARGET - Date.now();

    if (diff <= 0) {
      root.classList.add('is-done');
      return false;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const next = {
      days: String(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };

    for (const key of Object.keys(next)) {
      if (next[key] !== previous[key] && nums[key]) {
        nums[key].textContent = next[key];
        nums[key].classList.add('is-flipping');
        setTimeout(() => nums[key].classList.remove('is-flipping'), 180);
        previous[key] = next[key];
      }
    }
    return true;
  };

  if (update()) {
    setInterval(() => {
      if (!update()) clearInterval();
    }, 1000);
  }
}
