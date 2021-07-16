const API_KEY = 'fb9915cc52c6a75d11cc9ffd60bcb1e1'

function getWeatherURL (city) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
}

function getWeatherURLByCoords (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
}

export async function getWeather (city, lat, lon) {
  let url

  if (lat != null) {
    url = getWeatherURLByCoords(lat, lon)
  } else {
    url = getWeatherURL(city)
  }

  const response = await fetch(encodeURI(url), { mode: 'cors' })
  const json = await response.json()

  if (json.cod !== 200) {
    throw new Error(json.message)
  }
  return json
}

export async function getDailyWeather (lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}`
  const response = await fetch(encodeURI(url), { mode: 'cors' })
  const json = await response.json()
  return json
}

export async function getConvertedWeather (city) {
  const json = await getWeather(city)
  return convertWeatherToSimpleObject(json)
}

export async function getConvertedWeatherByCoords (lat, lon) {
  const json = await getWeather(null, lat, lon)
  return convertWeatherToSimpleObject(json)
}

export function getWeatherIconURL (iconID) {
  return `http://openweathermap.org/img/wn/${iconID}@2x.png`
}

export function convertWeatherToSimpleObject (json) {
  const object = {}
  object.timezone = json.timezone
  object.dayUTC = json.dt
  object.coord = json.coord
  object.coord.name = json.name
  object.main = json.main
  object.wind_speed = json.wind.speed
  object.cloudiness = json.clouds.all
  object.weather = json.weather[0]
  return object
}

export async function getConvertedDailyWeather (lat, lon) {
  const json = await getDailyWeather(lat, lon)
  return convertDailyWeatherToSimpleObject(json)
}

export function convertDailyWeatherToSimpleObject (json) {
  const days = []
  for (const day of json.daily) {
    days.push(convertWeatherDayToSimpleObject(day))
  }
  return days
}

export function convertWeatherDayToSimpleObject (json) {
  const object = {}
  object.dayUTC = json.dt
  object.main = {}
  object.main.temp = json.temp.day
  object.main.temp_min = json.temp.min
  object.main.temp_max = json.temp.max
  object.weather = json.weather[0]
  return object
}
