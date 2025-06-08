import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(isLeapYear);
dayjs.extend(duration);
