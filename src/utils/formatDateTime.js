import { utcToZonedTime, format } from 'date-fns-tz';
import fromUnixTime from 'date-fns/fromUnixTime'
import { minTwoDigits } from "@/utils/util";

/**
 * @param {*} timeStamp is the unix timestamp(sec)
 * @param {*} format format of the return date time value (sample: "yyyy-MM-dd hh:mm:ss a") 
 * @returns new Date(timestamp) formatted value
 */
const formatUnixToDate = (timeStamp, fmt) => {
    if ([timeStamp, fmt].some(x => !x)) {
        console.log('Invalid Date Format')
        return "";
    }
    return format(fromUnixTime(timeStamp), fmt);
}

/**
 * @param {*} timeStamp is the unix timestamp
 * @param {*} timeZone 
 * @param {*} dateFormat format of the return date time value 
 * @returns the time zone date time value
 */
const timeStampToDate = (timeStamp, timeZone, dateFormat) => {
    const date = new Date(timeStamp * 1000);
    const zonedDate = utcToZonedTime(date, timeZone);
    const pattern = dateFormat;
    const output = format(zonedDate, pattern, { timeZone });
    return output;
}
/**
 * @param {*} datetime is the iso format // 2022-01-15T01:39:33.030Z
 * @param {*} timeZone 
 * @param {*} dateFormat format of the return date time value 
 * @returns the time zone date time value
 */
const utcToDate = (datetime, timeZone, dateFormat) => {
    const date = new Date(datetime);
    const zonedDate = utcToZonedTime(date, timeZone);
    const pattern = dateFormat;
    const output = format(zonedDate, pattern, { timeZone });
    return output;
}

/**
 * @param {*} date sample - new Date()
 * @param {*} timeZone 
 * @param {*} format format of the return date time value 
 * @returns the time zone date value
 */
const dateToTimeZoneDate = (date, timezone) => {
    return utcToZonedTime(date, timezone)
}

/**
     * @method secondsToHms returns the duration (sec) in hrs and min.
     * @param timeDifference duration in seconds
     */
const secondsToHms = (timeDifference) => {
    var d = Number(timeDifference);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var hDisplay = h > 0 ? h + " h " : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min") : " 0 min";
    return hDisplay + mDisplay;

}
/**
     * @method secondsToDHms returns the duration (sec) in hrs and min.
     * @param timeDifference duration in seconds
     */
const secondsToDHms = (timeDifference) => {
    var td = Number(timeDifference);
    var d = Math.floor(td / (3600 * 24));
    var h = Math.floor(td / 3600);
    var m = Math.floor((td % 3600) / 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    h = d > 0 ? Math.floor(td / 3600) % 24 : h;
    var hDisplay = h > 0 ? h + " h " : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins") : " 0 min";
    return dDisplay + hDisplay + mDisplay;
}

const secondsToDateHrMnts = (timeDifference) => {
    var value = Number(timeDifference);
    var d = Math.floor(Number(value / 86400))
    var h = Math.floor(Number(value % 86400) / 3600);
    var m = Math.floor(Number(value % 3600) / 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    h = d > 0 ? Math.floor(value / 3600) % 24 : h;
    var hDisplay = h > 0 ? h + " h " : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min") : " 0 min";
    return dDisplay + hDisplay + mDisplay;

}
/**
 * 
 * @param {*} date date time in UTC format
 * @param {*} fmt return datetime in fmt format
 * @param {*} tz time zone of the datetime
 * @returns 
 */
const formatUTC = (date, fmt, tz) => {
    if ([date, fmt, tz].some(x => !x)) {
        console.log('Invalid Date Format')
        return "";
    }
    return format(utcToZonedTime(date, tz),
        fmt,
        { timeZone: tz });
}

const formatAMPMTo24Time = (time12h) => {
    if (!time12h) return null;
    if (time12h.split(" ")[0] == "undefined" || time12h.split(" ")[1] == "undefined") return ""
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes, seconds] = time.split(":");
    if (hours === "12") {
        hours = "00";
    }
    if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
    }
    if (!seconds) {
        seconds = "00"
    }
    return hours + ":" + minutes + ":" + seconds;
}

const format24TimeToAMPM = (time24h) => {
    if (!time24h) return null;
    let timeMeridian;
    let [hours, minutes] = time24h.split(":");
    if (Number(hours) > 12) {
        timeMeridian = "PM";
    } else {
        timeMeridian = "AM"
    }

    return Number(hours) > 12 ? Number(hours) - 12 : hours + ":" + minutes + " " + timeMeridian;
}

/**date format - year-month-day. returns date in month/day/year format */
const formatDateToAPIFormat = (date) => {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
}
/**date format - month/day/year. returns date in year-month-day format */
const formatDateToStandardStr = (date) => {
    if (!date) return "";
    if (date.split("-").length > 1) return date;
    const [month, day, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day}`;
}

const formatDateTimeToAMPM = (dateTime) => {
    let [date, time] = dateTime.split(" ");
    let timeMeridian;
    let [hr, min] = time.split(":");
    timeMeridian = Number(hr) > 12 ? "PM" : "AM";
    return formatDateToAPIFormat(date) + " " + (Number(hr) > 12 ? minTwoDigits(Number(hr)) - 12 : minTwoDigits(Number(hr))) + ":" + min + " " + timeMeridian;
}
const formatDateTime = (time, val) => {
    if (time !== null && time !== undefined && time != '') {
        let utcDate = new Date(time * 1000).toUTCString(); //"Wed, 27 Jan 2021 13:59:04 GMT"
        let month = utcDate.split(",")[1].split(" ")[2]; // Jan
        let date = utcDate.split(",")[1].split(" ")[1]; // 27
        let year = utcDate.split(",")[1].split(" ")[3];
        let hr = utcDate.split(",")[1].split(" ")[4].split(":")[0]; // 13
        let min = utcDate.split(",")[1].split(" ")[4].split(":")[1]; //59
        let formatHr = Number(hr) > 12 ? Number(hr) - 12 : Number(hr); // 1
        formatHr = Number(hr) == 0 ? 12 : formatHr;

        formatHr = Number(formatHr) >= 10 ? Number(formatHr) : '0' + formatHr; //01
        let amOrpm = Number(hr) >= 12 ? "p" : "a"; //PM
        let ampm = Number(hr) >= 12 ? "PM" : "AM";
        switch (val) {
            case 'hour': {
                return formatHr + amOrpm;
            }
            case 'mins': {
                return min
            }
            case 'date': {
                return month + " " + date + ", " + year + " " + formatHr + ":" + min + " " + ampm;
            }
            case 'expire': {
                return formatHr + ":" + min + " " + ampm + ' on ' + month + " " + date
            }
            case 'checkin': {
                return formatHr + ":" + min + " " + ampm + ' on ' + month + " " + date
            }
            case 'booking_content':{
                return [formatHr + ":" + min + " " + ampm, month, date];
            }
            default: {
                return [formatHr + ":" + min + " " + ampm, month, date];
            }
        }
    }
    //Jan 27, 01:59 PM
}

export { timeStampToDate, secondsToHms, secondsToDHms, formatUTC, formatAMPMTo24Time, format24TimeToAMPM, formatDateToAPIFormat, dateToTimeZoneDate, formatUnixToDate, utcToDate, formatDateTimeToAMPM, formatDateToStandardStr, secondsToDateHrMnts, formatDateTime }

