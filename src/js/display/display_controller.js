import {
  cityDOM,
  todayTemperature,
  todayWeather,
  todayMoreInfo
} from './display'
import { createNextDays, removeAllNextDays } from './dynamic_display'
import { isDay, getDateByTimezoneOffset } from './../util/date'
import PubSub from 'pubsub-js'
import TOPIC from './../topics'

function changeCity (response) {
  cityDOM.setName(response.coord.name)
  cityDOM.setLat(response.coord.lat)
  cityDOM.setLon(response.coord.lon)
}

function changeMainContent (response) {
  todayTemperature.setNowTemperature(response.main.temp)
  todayTemperature.setMaxTemperature(response.main.temp_max)
  todayTemperature.setMinTemperature(response.main.temp_min)

  todayWeather.setImage(response.weather.icon, response.weather.description)
  todayWeather.setDescription(response.weather.description)
}

function changeMoreInfo (response) {
  todayMoreInfo.setTemperature(response.main.temp)
  todayMoreInfo.setFeelsLike(response.main.feels_like)
  todayMoreInfo.setTempMinMax(response.main.temp_min, response.main.temp_max)
  todayMoreInfo.setHumidity(response.main.humidity)
  todayMoreInfo.setPressure(response.main.pressure)
  todayMoreInfo.setWindSpeed(response.wind_speed)
  todayMoreInfo.setCloudiness(response.cloudiness)
}

function updateTheme (response) {
  const date = getDateByTimezoneOffset(response.timezone)
  const theme = isDay(date) ? 'day' : 'night'
  document.body.setAttribute('theme', theme)
}

function buildCurrentWeahter (topic, response) {
  updateTheme(response)
  changeCity(response)
  changeMainContent(response)
  changeMoreInfo(response)
}

function buildNextDays (topic, response) {
  removeAllNextDays()
  createNextDays(response)
}

PubSub.subscribe(TOPIC.BUILD_CURRENT_WEATHER, buildCurrentWeahter)
PubSub.subscribe(TOPIC.BUILD_NEXT_DAYS, buildNextDays)
