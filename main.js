const DateTime = luxon.DateTime;

const START_DATE = DateTime.fromObject({
  year: 2021,
  month: 1,
  day: 4,
  zone: 'Asia/Singapore',
});
const FLY_DATE = DateTime.fromObject({
  year: 2021,
  month: 1,
  day: 17,
  hour: 8,
  minute: 10,
  zone: 'Asia/Singapore',
});
const LAND_DATE = DateTime.fromObject({
  year: 2021,
  month: 1,
  day: 17,
  hour: 9,
  minute: 10,
  zone: 'America/Los_Angeles',
});

const FLY_PORTION = 0.45;

const COUNTDOWN_CONTAINER = '#countdown';
const COUNTDOWN_FORMAT = '%-D day%!D %-H hour%!H %-M minute%!M %-S second%!S';
const TAGLINE_CONTAINER = '#tagline';

const MESSAGES = {
  pre_flying: 'Char\'s time left in Msia',
  flying: 'Char\'s flying to SFO!',
  arrived: 'Arrived!',
}

const TRACK_CONTAINER = '#main-container #graphic .track-container';
const CHAR_PIC = '#main-container #graphic .char';
const CHAR_BORDER = '#main-container #graphic .char-border';
const PLANE_PIC = '#main-container #graphic .plane';
const KL_PIC = '#main-container #graphic .kl';
const CHAR_ARRIVED_PIC = '#main-container #graphic .char-arrived';

function set_message(msg) {
  document.title = msg;
  $(TAGLINE_CONTAINER)
    .text(msg);
}

function get_char_offset(event) {
  const now = DateTime.local();
  const total_fly_duration = FLY_DATE.diff(START_DATE)
    .as('seconds');
  const total_land_duration = LAND_DATE.diff(FLY_DATE)
    .as('seconds');
  const offset = 1 - FLY_PORTION;
  if (now < FLY_DATE) {
    return (1 - event.offset.totalSeconds / total_fly_duration) * (1 - FLY_PORTION);
  }
  return offset + (1 - event.offset.totalSeconds / total_land_duration) * (1 - offset);
}

function get_plane_offset(event) {
  const now = DateTime.local();
  const total_fly_duration = FLY_DATE.diff(START_DATE)
    .as('seconds');
  const total_land_duration = LAND_DATE.diff(FLY_DATE)
    .as('seconds');
  const offset = 1 - FLY_PORTION;
  if (now < FLY_DATE) {
    return offset;
  }
  return offset + (1 - event.offset.totalSeconds / total_land_duration) * (1 - offset);
}

function update_countdown($countdown, event) {
  const $char = $(CHAR_PIC);
  const $char_border = $(CHAR_BORDER);
  const char_offset_percentage = get_char_offset(event);
  for (const $this of [$char, $char_border]) {
    $this.css('motion-offset', `${char_offset_percentage*100}%`);
    $this.css('offset-distance', `${char_offset_percentage*100}%`);
  }

  const $plane = $(PLANE_PIC);
  const plane_offset_percentage = get_plane_offset(event);
  $plane.css('motion-offset', `${plane_offset_percentage*100}%`);
  $plane.css('offset-distance', `${plane_offset_percentage*100}%`);

  $countdown.html(event.strftime(COUNTDOWN_FORMAT));
}

function finish_countdown($countdown) {
  $(TRACK_CONTAINER)
    .hide();
  $(KL_PIC)
    .hide();
  $(TAGLINE_CONTAINER)
    .hide();
  $(CHAR_ARRIVED_PIC)
    .show();
  set_message(MESSAGES.arrived);
  $countdown.text(MESSAGES.arrived);
}

function flying($countdown) {
  set_message(MESSAGES.flying);
  $countdown.countdown(LAND_DATE.toJSDate())
    .on('update.countdown', (event) => update_countdown($countdown, event))
    .on('finish.countdown', (event) => finish_countdown($countdown));
}

function register_service_worker() {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("./service_worker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}

function main() {
  if ("serviceWorker" in navigator) {
    register_service_worker();
  }

  const $countdown = $(COUNTDOWN_CONTAINER);
  const now = DateTime.local();
  if (now >= LAND_DATE) {
    finish_countdown($countdown);
    return;
  }

  set_message(MESSAGES.pre_flying);
  $countdown.countdown(FLY_DATE.toJSDate())
    .on('update.countdown', (event) => update_countdown($countdown, event))
    .on('finish.countdown', (event) => flying($countdown));
}