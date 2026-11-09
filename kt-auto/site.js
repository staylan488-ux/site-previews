// Live "open now" badge and today's row in the hours table, using shop time (Los Angeles).
(function () {
  // [opens, closes] in minutes after midnight, by weekday (0 = Sunday). null = closed.
  var M = function (h, m) { return h * 60 + (m || 0); };
  var HOURS = [null, [M(7, 30), M(17)], [M(7, 30), M(17)], [M(7, 30), M(17)], [M(7, 30), M(17)], [M(7, 30), M(17)], [M(8), M(12)]];
  var NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function laNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var h = parseInt(get('hour'), 10) % 24;
    return { day: day, mins: h * 60 + parseInt(get('minute'), 10) };
  }
  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var s = h >= 12 ? 'pm' : 'am', x = h % 12 || 12;
    if (h === 12 && m === 0) return 'noon';
    return x + (m ? ':' + (m < 10 ? '0' : '') + m : '') + s;
  }

  var now = laNow();
  var today = HOURS[now.day];
  var label, cls;
  if (today && now.mins >= today[0] && now.mins < today[1]) {
    cls = 'open';
    label = today[1] - now.mins <= 60 ? 'Open · closes soon (' + fmt(today[1]) + ')' : 'Open now · until ' + fmt(today[1]);
  } else {
    cls = 'closed';
    if (today && now.mins < today[0]) {
      label = 'Closed · opens ' + fmt(today[0]) + ' today';
    } else {
      var d = now.day, i = 0;
      do { d = (d + 1) % 7; i++; } while (!HOURS[d] && i < 7);
      label = 'Closed · opens ' + (i === 1 ? 'tomorrow' : NAMES[d]) + ' ' + fmt(HOURS[d][0]);
    }
  }
  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.classList.add(cls);
    el.querySelector('span').textContent = label;
  });
  var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
  if (row) row.classList.add('today');

  var more = document.querySelector('[data-more]');
  if (more) more.addEventListener('click', function () {
    var box = document.querySelector('.more-reviews');
    var on = box.classList.toggle('show');
    more.textContent = on ? 'Show fewer reviews' : more.getAttribute('data-more');
  });

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
