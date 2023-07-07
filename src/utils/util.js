import { format } from "date-fns";
import rules from "@/utils/rules";
const convertToDecimal = (data) => {
    if (Number.isInteger(Number(data)) || Number(data) == 0) {
        return data
    } else {
        return Number.parseFloat(Number(data)).toFixed(2)
    }
}
/** if the number is less that 10 => add '0' to the number */
const minTwoDigits = (n) => {
    return (n < 10 ? '0' : '') + n;
}


/** Check if the data[key] is empty for all rows  */
const isKeyDataEmpty = (key, data) => {
    if (data.length == 0) {
        return true;
    }
    let keyData = [
        ...new Set(data.map((item) => item[key])),
    ]
    return keyData.filter((m) => m).length == 0 ? true : false;
}
const genPass = () => {
    let c = "abcdefghijklmnopqrstuvwxyz";
    c += c.toUpperCase() + 1234567890;
    return [...Array(6)].map(() => c[~~(Math.random() * 62)]).join("");
}

const round = (time) => {
    let exitdate = time !== null && time !== '' ? format(time, 'yyyy/MM/dd') : new Date();
    let selectedMins = time !== null && time !== '' ? format(time, 'mm') : new Date();
    let selectedHours = time !== null && time !== '' ? format(time, 'hh') : new Date();
    let selectedAMPM = time !== null && time !== '' ? format(time, 'a') : new Date();
    if (exitdate != null && selectedMins != '15' && selectedMins != '30' && selectedMins != '45' && selectedMins != '00' && selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "") {
        let intervalMilliseconds = 900000
        let datetime = new Date(exitdate + " " + selectedHours + ":" + selectedMins + " " + selectedAMPM)
        let interval = datetime.getTime() % intervalMilliseconds;
        let delta = interval === 0 ? 0 : datetime.getTime() - interval;
        delta += intervalMilliseconds;
        // this.exitTimeSelected = Object.assign(this.exitTimeSelected, { hh: format(new Date(delta), 'hh'), mm: format(new Date(delta), 'mm'), a: format(new Date(delta), 'a'), })
        return new Date(delta)
    }
}
const uppercase = (licencePlate) => {
    if (rules.alphaNumeric(licencePlate) === "Must be alphanumeric") {
        licencePlate = licencePlate.replace(/[^\w\s]/gi, '')
    }
    licencePlate = licencePlate.trim()
    licencePlate = licencePlate.toUpperCase();
    return licencePlate
}
const getPaymentType = (type) => {
    switch (type) {
        case 'APPLE_PAY': {
            return 'Apple Pay';
        }
        case 'GOOGLE_PAY': {
            return 'Google Pay'
        }
        case 'Card': {
            return 'Card'
        }
    }
}
export { convertToDecimal, minTwoDigits, isKeyDataEmpty, genPass, round, uppercase, getPaymentType }