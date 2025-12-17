import { monthNames } from '../utils/helpers.js';

export function renderCalendar(events = []) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push('<div class="calendar__cell"></div>');
  for (let date = 1; date <= daysInMonth; date++) {
    const eventList = events.filter((event) => {
      const eventDate = new Date(event.dateStart);
      return eventDate.getDate() === date && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
    cells.push(`
      <div class="calendar__cell ${eventList.length ? 'has-event' : ''}">
        <div>${date}</div>
        ${eventList.map((ev) => `<div class="calendar__event">${ev.title}</div>`).join('')}
      </div>
    `);
  }

  return `
    <div class="calendar">
      <div class="calendar__header">
        <span>${monthNames[month]} ${year}</span>
        <span>${events.length} agenda</span>
      </div>
      <div class="calendar__grid">${cells.join('')}</div>
    </div>
  `;
}
