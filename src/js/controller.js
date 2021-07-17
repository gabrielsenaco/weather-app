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
import './display/progress'

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
  PubSub.publish(TOPIC.INSERT_NEW_PROGRESS, {value: 80})
  setting.basicWeather = basicWeather
  setting.city = basicWeather.coord.name
  getConvertedDailyWeather(basicWeather.coord.lat, basicWeather.coord.lon)
    .then(response => {
      PubSub.publish(TOPIC.BUILD_NEXT_DAYS, response)
      setting.nextDaysWeather = response
      PubSub.publish(TOPIC.INSERT_NEW_PROGRESS, {value: 100})
      PubSub.publish(TOPIC.FINISH_PROGRESS, {fail: false})
    })
    .catch(err => {
      PubSub.publish(TOPIC.FINISH_PROGRESS, {fail: true})
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
    PubSub.publish(TOPIC.INSERT_NEW_PROGRESS, {value: 50})
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }
    PubSub.publish(TOPIC.SETUP_WEATHER, data)
  }

  function error (err) {
    PubSub.publish(TOPIC.FINISH_PROGRESS, {fail: true})
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
    PubSub.publish(TOPIC.ENABLE_PROGRESS, {})
    PubSub.publish(TOPIC.INSERT_NEW_PROGRESS, {value: 10})
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
  PubSub.publish(TOPIC.ENABLE_PROGRESS, {})
  let basicWeather
  try {
    if (data.lat) {
      basicWeather = await getConvertedWeatherByCoords(data.lat, data.lon)
    } else {
      basicWeather = await getConvertedWeather(data.name)
    }
    PubSub.publish(TOPIC.INSERT_NEW_PROGRESS, {value: 50})
  } catch (err) {
    PubSub.publish(TOPIC.FINISH_PROGRESS, {fail: true})
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
