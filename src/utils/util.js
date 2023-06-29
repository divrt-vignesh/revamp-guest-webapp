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
const genPass = () =>{
      let c = "abcdefghijklmnopqrstuvwxyz";
      c += c.toUpperCase() + 1234567890;
      return [...Array(6)].map(() => c[~~(Math.random() * 62)]).join("");
}
export { convertToDecimal, minTwoDigits, isKeyDataEmpty,genPass }