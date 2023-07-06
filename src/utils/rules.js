/* eslint-disable */

const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const hexRegex = /^[0-9A-F]+$/
const alphaNumericRegex = /^[a-z0-9]+$/i

export default {
  maxSize: size =>  (value => !value || value.size < size || `Image size should be less than ${size/1000} KB!`),
  isRequired: v => !!v || 'Field cannot be empty',
  maxSize: size =>  (value => !value || value.size < size || `Image size should be less than ${size/1000} KB!`),
  isEmail: v => emailRegex.test(v) || 'Invalid Email',
  minCharacters: count => (v => !!v && v.length >= count || 
  `Must be at least ${count} characters`),
  exactCharacters: count => (v => !!v && v.length === count || 
  `Must be exactly ${count} characters`),
  isNumeric: v => /^[0-9]+$/.test(v) || 'Must be numbers only',
  isInteger: v => !isNaN(parseInt(v)) || 'Must be an integer only',
  isFloat: v => !isNaN(parseFloat(v)) || 'Must be a decimal number',
  isNonZero: v => (!isNaN(parseInt(v)) && parseInt(v) > 0) || 'Must be a number > 0',
  isPositive: v => (!isNaN(parseInt(v)) && parseInt(v) >= 0) || 'Must be a number >= 0',
  isHour: v => /^[0-2]\d\:[0-2]\d\:[0-5]\d$/.test(v) || 'Must be in HH:MM:SS format',
  isHourMinutes: v => /^[0-2]\d\:[0-2]\d\$/.test(v) || 'Must be in HH:MM format',
  isURL: v => urlRegex.test(v) || 'Invalid URL',
  isRank: v => !isNaN(parseInt(v)) && parseInt(v) >= 1 || 'Must be an integer > 1',
  maxNumber: max => (v => !isNaN(parseFloat(v)) && parseFloat(v)<= max ||
  `Must be maximum ${max}`),
  minNumber: min => (v => !isNaN(parseFloat(v)) && parseFloat(v)>= min ||
  `Must be minimum ${min}`),
  validTime: t => /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(t) || "Not a valid time  ",
  isHex: v => hexRegex.test(v) || 'Must be a hexadecimal string',
  alphaNumeric : v => alphaNumericRegex.test(v) || 'Must be alphanumeric without spaces',
}