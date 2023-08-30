import DurationFormat from './duration-format-ponyfill.js';
const durationRe = /^[-+]?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
export const unitNames = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];
export const isDuration = (str) => durationRe.test(str);
export class Duration {
    constructor(years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
        this.years = years;
        this.months = months;
        this.weeks = weeks;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.milliseconds = milliseconds;
        this.years || (this.years = 0);
        this.sign || (this.sign = Math.sign(this.years));
        this.months || (this.months = 0);
        this.sign || (this.sign = Math.sign(this.months));
        this.weeks || (this.weeks = 0);
        this.sign || (this.sign = Math.sign(this.weeks));
        this.days || (this.days = 0);
        this.sign || (this.sign = Math.sign(this.days));
        this.hours || (this.hours = 0);
        this.sign || (this.sign = Math.sign(this.hours));
        this.minutes || (this.minutes = 0);
        this.sign || (this.sign = Math.sign(this.minutes));
        this.seconds || (this.seconds = 0);
        this.sign || (this.sign = Math.sign(this.seconds));
        this.milliseconds || (this.milliseconds = 0);
        this.sign || (this.sign = Math.sign(this.milliseconds));
        this.blank = this.sign === 0;
    }
    abs() {
        return new Duration(Math.abs(this.years), Math.abs(this.months), Math.abs(this.weeks), Math.abs(this.days), Math.abs(this.hours), Math.abs(this.minutes), Math.abs(this.seconds), Math.abs(this.milliseconds));
    }
    static from(durationLike) {
        var _a;
        if (typeof durationLike === 'string') {
            const str = String(durationLike).trim();
            const factor = str.startsWith('-') ? -1 : 1;
            const parsed = (_a = str
                .match(durationRe)) === null || _a === void 0 ? void 0 : _a.slice(1).map(x => (Number(x) || 0) * factor);
            if (!parsed)
                return new Duration();
            return new Duration(...parsed);
        }
        else if (typeof durationLike === 'object') {
            const { years, months, weeks, days, hours, minutes, seconds, milliseconds } = durationLike;
            return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds);
        }
        throw new RangeError('invalid duration');
    }
    static compare(one, two) {
        const now = Date.now();
        const oneApplied = Math.abs(applyDuration(now, Duration.from(one)).getTime() - now);
        const twoApplied = Math.abs(applyDuration(now, Duration.from(two)).getTime() - now);
        return oneApplied > twoApplied ? -1 : oneApplied < twoApplied ? 1 : 0;
    }
    toLocaleString(locale, opts) {
        return new DurationFormat(locale, opts).format(this);
    }
}
export function applyDuration(date, duration) {
    const r = new Date(date);
    r.setFullYear(r.getFullYear() + duration.years);
    r.setMonth(r.getMonth() + duration.months);
    r.setDate(r.getDate() + duration.weeks * 7 + duration.days);
    r.setHours(r.getHours() + duration.hours);
    r.setMinutes(r.getMinutes() + duration.minutes);
    r.setSeconds(r.getSeconds() + duration.seconds);
    return r;
}
export function elapsedTime(date, precision = 'second', now = Date.now()) {
    const delta = date.getTime() - now;
    if (delta === 0)
        return new Duration();
    const sign = Math.sign(delta);
    const ms = Math.abs(delta);
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const month = Math.floor(day / 30);
    const year = Math.floor(month / 12);
    const i = unitNames.indexOf(precision) || unitNames.length;
    return new Duration(i >= 0 ? year * sign : 0, i >= 1 ? (month - year * 12) * sign : 0, 0, i >= 3 ? (day - month * 30) * sign : 0, i >= 4 ? (hr - day * 24) * sign : 0, i >= 5 ? (min - hr * 60) * sign : 0, i >= 6 ? (sec - min * 60) * sign : 0, i >= 7 ? (ms - sec * 1000) * sign : 0);
}
export function roundToSingleUnit(duration, { relativeTo = Date.now() } = {}) {
    relativeTo = new Date(relativeTo);
    if (duration.blank)
        return duration;
    const sign = duration.sign;
    let years = Math.abs(duration.years);
    let months = Math.abs(duration.months);
    let weeks = Math.abs(duration.weeks);
    let days = Math.abs(duration.days);
    let hours = Math.abs(duration.hours);
    let minutes = Math.abs(duration.minutes);
    let seconds = Math.abs(duration.seconds);
    let milliseconds = Math.abs(duration.milliseconds);
    if (milliseconds >= 900)
        seconds += Math.round(milliseconds / 1000);
    if (seconds || minutes || hours || days || weeks || months || years) {
        milliseconds = 0;
    }
    if (seconds >= 55)
        minutes += Math.round(seconds / 60);
    if (minutes || hours || days || weeks || months || years)
        seconds = 0;
    if (minutes >= 55)
        hours += Math.round(minutes / 60);
    if (hours || days || weeks || months || years)
        minutes = 0;
    if (days && hours >= 12)
        days += Math.round(hours / 24);
    if (!days && hours >= 21)
        days += Math.round(hours / 24);
    if (days || weeks || months || years)
        hours = 0;
    const currentYear = relativeTo.getFullYear();
    let currentMonth = relativeTo.getMonth();
    const currentDate = relativeTo.getDate();
    if (days >= 27 || (years + months && days)) {
        relativeTo.setDate(currentDate + days * sign);
        months += Math.abs(relativeTo.getFullYear() >= currentYear
            ? relativeTo.getMonth() - currentMonth
            : relativeTo.getMonth() - currentMonth - 12);
        if (months) {
            days = 0;
        }
        currentMonth = relativeTo.getMonth();
    }
    if (days >= 6)
        weeks += Math.round(days / 7);
    if (weeks || months || years)
        days = 0;
    if (weeks >= 4)
        months += Math.round(weeks / 4);
    if (months || years)
        weeks = 0;
    if (months >= 11 || (years && months)) {
        relativeTo.setMonth(relativeTo.getMonth() + months * sign);
        years += Math.abs(currentYear - relativeTo.getFullYear());
    }
    if (years)
        months = 0;
    return new Duration(years * sign, months * sign, weeks * sign, days * sign, hours * sign, minutes * sign, seconds * sign, milliseconds * sign);
}
export function getRelativeTimeUnit(duration, opts) {
    const rounded = roundToSingleUnit(duration, opts);
    if (rounded.blank)
        return [0, 'second'];
    for (const unit of unitNames) {
        if (unit === 'millisecond')
            continue;
        const val = rounded[`${unit}s`];
        if (val)
            return [val, unit];
    }
    return [0, 'second'];
}
