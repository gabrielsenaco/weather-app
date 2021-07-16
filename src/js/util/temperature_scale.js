import { setting, TEMPERATURE_SCALE } from './../controller'

function convertKelvinTo (type, kelvin) {
  let converted = 0
  if (type === TEMPERATURE_SCALE.CELSIUS) {
    converted = kelvin - 273
  } else if (type === TEMPERATURE_SCALE.FAHRENHEIT) {
    converted = (kelvin - 273) * 1.8 + 32
  }
  return Math.round(converted)
}

export function convertKelvinToCelsius (kelvin) {
  return convertKelvinTo(TEMPERATURE_SCALE.CELSIUS, kelvin)
}

export function convertKelvinToFahrenheit (kelvin) {
  return convertKelvinTo(TEMPERATURE_SCALE.FAHRENHEIT, kelvin)
}

export function getConvertedTemperature (value) {
  if (setting.temperature_scale === TEMPERATURE_SCALE.CELSIUS) {
    return convertKelvinToCelsius(value)
  } else if (setting.temperature_scale === TEMPERATURE_SCALE.FAHRENHEIT) {
    return convertKelvinToFahrenheit(value)
  }
}
