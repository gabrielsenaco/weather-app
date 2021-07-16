import {
  getConvertedWeather,
  getConvertedDailyWeather,
  getConvertedWeatherByCoords
} from './weather/weather'
import './display/display_controller'
import './display/log'
import './listener/temperature_scale_mode'
import './listener/search'
import './listener/reload_weather'

import PubSub from 'pubsub-js'
import TOPIC from './topics'

const TEMPERATURE_SCALE = {
  CELSIUS: 'ºC',
  FAHRENHEIT: 'ºF'
}

const setting = {
  temperature_scale: TEMPERATURE_SCALE.CELSIUS,
  lang: 'en_us',
  city: null,
  basicWeather: null,
  nextDaysWeather: null
}

async function setupWeather (basicWeather) {
  PubSub.publish(TOPIC.BUILD_CURRENT_WEATHER, basicWeather)
  PubSub.publish(TOPIC.LOG, { message: 'Weather loaded.' })
  setting.basicWeather = basicWeather
  setting.city = basicWeather.coord.name
  getConvertedDailyWeather(basicWeather.coord.lat, basicWeather.coord.lon)
    .then(response => {
      PubSub.publish(TOPIC.BUILD_NEXT_DAYS, response)
      setting.nextDaysWeather = response
    })
    .catch(err => {
      console.error(err)
      PubSub.publish(TOPIC.LOG, {
        message: 'We cannot load weather for the next days. Sorry!'
      })
    })
  return true
}

function canAccessGeolocation () {
  return 'geolocation' in navigator
}

async function loadWeatherByLocation () {
  function accept (position) {
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }
    PubSub.publish(TOPIC.SETUP_WEATHER, data)
  }

  function error (err) {
    PubSub.publish(TOPIC.LOG, {
      message: `We cannot load your location, try find the weather searching by city name. Error code: ${err.code}`
    })
  }

  await navigator.geolocation.getCurrentPosition(accept, error)
}

function init () {
  PubSub.subscribe(TOPIC.SETUP_WEATHER, loadSetupWeather)
  PubSub.publish(TOPIC.SETUP_WEATHER, { name: 'Brasilia' })

  if (canAccessGeolocation()) {
    setTimeout(
      () =>
        PubSub.publish(TOPIC.LOG, {
          message: 'Accept Location prompt to we find your local weather'
        }),
      1000
    )
    return loadWeatherByLocation()
  }
}

async function loadSetupWeather (topic, data) {
  let basicWeather
  try {
    if (data.lat) {
      basicWeather = await getConvertedWeatherByCoords(data.lat, data.lon)
    } else {
      basicWeather = await getConvertedWeather(data.name)
    }
  } catch (err) {
    console.error(err)
    PubSub.publish(TOPIC.LOG, {
      message:
        'We cannot load your city request. Make sure that this city exists.'
    })
    return
  }
  return setupWeather(basicWeather)
}

init()

export { TEMPERATURE_SCALE, setting, TOPIC }
