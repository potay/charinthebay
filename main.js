const DateTime = luxon.DateTime;

const START_DATE = DateTime.fromObject({
  year: 2021,
  month: 1,
  day: 4,
  zone: 'Asia/Singapore',
});
const TARGET_DATE = DateTime.fromObject({
  year: 2021,
  month: 1,
  day: 17,
  hour: 8,
  minute: 10,
  zone: 'Asia/Singapore',
});

const COUNTDOWN_CONTAINER = '#countdown';
const COUNTDOWN_FORMAT = '%-D day%!D %H hour%!H %M minute%!M %S second%!S';

const CHAR_PIC = '#main-container #graphic .char';
const CHAR_BORDER = '#main-container #graphic .char-border';


function main() {
  const $countdown = $(COUNTDOWN_CONTAINER);
  const $char = $(CHAR_PIC);
  const $char_border = $(CHAR_BORDER);

  const total_duration = TARGET_DATE.diff(START_DATE).as('seconds');
  $countdown.countdown(TARGET_DATE.toJSDate()).on('update.countdown', (event) => {
    $countdown.html(event.strftime(COUNTDOWN_FORMAT));
    const offset_percentage = 1 - event.offset.totalSeconds/total_duration;
    $char.css('motion-offset', `${offset_percentage*100}%`);
    $char.css('offset-distance', `${offset_percentage*100}%`);
    $char_border.css('motion-offset', `${offset_percentage*100}%`);
    $char_border.css('offset-distance', `${offset_percentage*100}%`);
  });
}
