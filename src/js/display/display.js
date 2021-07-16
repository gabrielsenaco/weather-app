import { getConvertedTemperature } from './../util/temperature_scale'
import { setDOMTemperature, createTemperatureWithIcon } from './display_util'
import { getWeatherIconURL } from './../weather/weather'
import { setting } from './../controller'

const cityDOM = (() => {
  const name = document.getElementById('city-name')
  const lat = document.getElementById('city-lat')
  const lon = document.getElementById('city-lon')
  function setName (value) {
    name.textContent = value
  }

  function setLat (value) {
    lat.textContent = `LAT: ${value}`
  }

  function setLon (value) {
    lon.textContent = `LON: ${value}`
  }

  return { setName, setLat, setLon }
})()

const todayTemperature = (() => {
  const now = document.getElementById('today-temp')
  const min = document.getElementById('today-temp-min')
  const max = document.getElementById('today-temp-max')

  function setNowTemperature (value) {
    setDOMTemperature(value, now)
  }

  function setMaxTemperature (value) {
    createTemperatureWithIcon(value, 'ti ti-temperature-plus', max)
  }

  function setMinTemperature (value) {
    createTemperatureWithIcon(value, 'ti ti-temperature-minus', min)
  }

  return { setNowTemperature, setMaxTemperature, setMinTemperature }
})()

const todayWeather = (() => {
  const weatherDOM = document.getElementById('weather-today')
  const imageDOM = weatherDOM.querySelector('img')
  const descriptionDOM = weatherDOM.querySelector('figcaption')

  function setImage (iconID, description) {
    imageDOM.src = getWeatherIconURL(iconID)
    imageDOM.alt = description
  }

  function setDescription (description) {
    descriptionDOM.textContent = description
  }

  return { setImage, setDescription }
})()

const todayMoreInfo = (() => {
  const tempDOM = document.getElementById('more-info-temp-value')
  const feelsLikeDOM = document.getElementById('more-info-feels-like-value')
  const tempMinMaxDOM = document.getElementById(
    'more-info-tempmin-tempmax-value'
  )
  const humidityDOM = document.getElementById('more-info-humidity-value')
  const pressureDOM = document.getElementById('more-info-pressure-value')
  const windSpeedDOM = document.getElementById('more-info-wind-speed-value')
  const cloudinessDOM = document.getElementById('more-info-cloudiness-value')

  function setTemperature (value) {
    setDOMTemperature(value, tempDOM)
  }

  function setFeelsLike (value) {
    setDOMTemperature(value, feelsLikeDOM)
  }

  function setTempMinMax (valueMin, valueMax) {
    const min = getConvertedTemperature(valueMin)
    const max = getConvertedTemperature(valueMax)
    tempMinMaxDOM.textContent = `${min}/${max} ${setting.temperature_scale}`
  }

  function setHumidity (value) {
    humidityDOM.textContent = `${value}%`
  }

  function setPressure (value) {
    pressureDOM.textContent = `${value} hPa`
  }

  function setWindSpeed (value) {
    windSpeedDOM.textContent = `${value} m/s`
  }

  function setCloudiness (value) {
    cloudinessDOM.textContent = `${value}%`
  }

  return {
    setTemperature,
    setFeelsLike,
    setTempMinMax,
    setHumidity,
    setPressure,
    setWindSpeed,
    setCloudiness
  }
})()

export { cityDOM, todayTemperature, todayWeather, todayMoreInfo }
