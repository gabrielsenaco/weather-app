export function convertDayUTCToDate (utc) {
  return new Date(utc * 1000)
}

export function isDay (date) {
  const hour = date.getHours()
  return hour > 6 && hour < 18
}

export function getDateByTimezoneOffset (offset, date = new Date()) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000
  return new Date(utc + 1000 * offset)
}
