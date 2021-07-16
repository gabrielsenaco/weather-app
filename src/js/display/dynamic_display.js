import {
  setDOMTemperature,
  createElement,
  removeAllChildren,
  createTemperatureWithIcon
} from './display_util'
import { getWeatherIconURL } from './../weather/weather'
import { convertDayUTCToDate } from './../util/date'
import dayjs from 'dayjs'

const daysListDOM = document.getElementById('next-days')

const createWeatherDescription = (description, parentNode) => {
  createElement('p', 'next-day-weather-desc', description, parentNode)
}

const createWeatherImage = (icon, description, parentNode) => {
  const weatherImage = createElement(
    'img',
    'next-day-weather-image',
    null,
    parentNode
  )
  weatherImage.src = getWeatherIconURL(icon)
  weatherImage.alt = description
}

const createTemperature = (value, tempClass, iconClass, parentNode) => {
  const temp = createElement('p', tempClass, null, parentNode)
  if (iconClass) {
    createTemperatureWithIcon(value, iconClass, temp)
    return
  }
  setDOMTemperature(value, temp)
}

const createDayName = (dayUTC, parentNode) => {
  const date = convertDayUTCToDate(dayUTC)
  const dateFormatted = dayjs(date).format('dddd')
  createElement('p', 'next-day-name', dateFormatted, parentNode)
}

const createNextDay = dayObject => {
  const _createTempMinMaxContainer = parentNode => {
    const tempContainer = createElement(
      'div',
      'next-day-temp-container',
      null,
      parentNode
    )
    createTemperature(
      dayObject.main.temp_min,
      'next-day-temp-min',
      'ti ti-temperature-minus',
      tempContainer
    )
    createTemperature(
      dayObject.main.temp_max,
      'next-day-temp-max',
      'ti ti-temperature-plus',
      tempContainer
    )
  }

  const _createResumeContainer = parentNode => {
    const resumeContainer = createElement(
      'div',
      'next-day-resume-container',
      null,
      parentNode
    )
    createTemperature(
      dayObject.main.temp,
      'next-day-temp',
      null,
      resumeContainer
    )
    createWeatherImage(
      dayObject.weather.icon,
      dayObject.weather.description,
      resumeContainer
    )
    createWeatherDescription(dayObject.weather.description, resumeContainer)
  }

  const item = createElement('li', 'next-day', null, daysListDOM)
  _createResumeContainer(item)
  _createTempMinMaxContainer(item)
  createDayName(dayObject.dayUTC, item)
  return item
}

const createNextDays = days => {
  for (const day of days) {
    createNextDay(day)
  }
}

function removeAllNextDays () {
  removeAllChildren(daysListDOM)
}
export { createNextDay, createNextDays, removeAllNextDays }
