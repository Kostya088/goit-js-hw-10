import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  timerStartBtn: document.querySelector('.timer-start-btn'),
  timeInput: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

refs.timerStartBtn.disabled = true;

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (!selected) return;

    if (selected < options.defaultDate) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        color: '#ff3838ff',
        iconUrl: '../img/cross.svg',
      });
    } else {
      refs.timerStartBtn.disabled = false;
      userSelectedDate = selected.getTime();
    }
  },
};

flatpickr('#datetime-picker', options);

function timerStarter() {
  refs.timeInput.disabled = true;
  refs.timerStartBtn.disabled = true;

  const intervalId = setInterval(() => {
    const time = convertMs(userSelectedDate - new Date().getTime());
    if (
      time.days === 0 &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0
    ) {
      clearInterval(intervalId);
      refs.timeInput.disabled = false;
    }

    refs.days.textContent = String(time.days).padStart(2, '0');
    refs.hours.textContent = String(time.hours).padStart(2, '0');
    refs.minutes.textContent = String(time.minutes).padStart(2, '0');
    refs.seconds.textContent = String(time.seconds).padStart(2, '0');
  }, 1000);
}

refs.timerStartBtn.addEventListener('click', timerStarter);
