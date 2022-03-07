const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SECONDS_PER_MS = 1 / MS_PER_SECOND;
const SECONDS_PER_HOUR = MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = HOURS_PER_DAY * SECONDS_PER_HOUR;

function calculateComponent(duration: number, divisor: number, modulus?: number) {
    const value = Math.floor(duration / divisor);
    return (modulus === undefined ? value : value % modulus);
}

export default class TimeSpan {
    readonly duration: number;

    constructor(durationInSeconds: number) {
        this.duration = durationInSeconds;
    }

    get days() {
        return calculateComponent(this.duration, SECONDS_PER_DAY);
    }

    get hours() {
        return calculateComponent(this.duration, SECONDS_PER_HOUR, HOURS_PER_DAY);
    }

    get minutes() {
        return calculateComponent(this.duration, SECONDS_PER_MINUTE, MINUTES_PER_HOUR);
    }

    get seconds() {
        return calculateComponent(this.duration, 1, SECONDS_PER_MINUTE);
    }

    get milliseconds() {
        return calculateComponent(this.duration, SECONDS_PER_MS, MS_PER_SECOND);
    }

    format(options?: { withDays?: boolean, withMillis?: boolean }) {
        console.log('toString');
        const pretty = Intl.NumberFormat('en-us', { useGrouping: true });
        const zeroPad = Intl.NumberFormat('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let parts: string[] = [];
        if (options && options.withDays && this.days > 0) {
            parts = parts.concat([pretty.format(this.days), 'd ', zeroPad.format(this.hours)]);
            console.log('days hours', parts);
        } else {
            parts.push(zeroPad.format(this.hours + this.days * HOURS_PER_DAY));
            console.log('hours', parts);
        }
        parts = parts.concat([':', zeroPad.format(this.minutes), ':', zeroPad.format(this.seconds)]);
        console.log('minutes seconds', parts);
        if (options && options.withMillis && this.milliseconds > 0) {
            parts = parts.concat(['.' + String(this.milliseconds)]);
            console.log('milliseconds', parts);
        }
        return parts.join('');
    }

    add(value: number | TimeSpan) {
        const seconds = (value instanceof TimeSpan ? value.duration : value);
        return new TimeSpan(this.duration + seconds);
    }

    multiply(value: number) {
        return new TimeSpan(this.duration * value);
    }

    subtract(value: number | TimeSpan) {
        const seconds = (value instanceof TimeSpan ? value.duration : value);
        return this.add(-seconds);
    }

    divide(value: number) {
        return this.multiply(1 / value);
    }
}
