import { setting } from './../controller'
import PubSub from 'pubsub-js'
import TOPIC from './../topics'

let lastReloadClick = 0

function reloadWeather () {
  if (!setting.city) {
    PubSub.publish(TOPIC.LOG, {
      message: 'You need to choose one city first to reload.'
    })
    return
  }
  if (!validTimeToReload()) {
    PubSub.publish(TOPIC.LOG, {
      message: 'Too quickly, wait a moment and try again.'
    })
    return
  }
  lastReloadClick = Date.now()

  PubSub.publish(TOPIC.LOG, { message: 'Updating weather data...' })
  PubSub.publish(TOPIC.SETUP_WEATHER, { name: setting.city })
}

function validTimeToReload () {
  if ((Date.now() - lastReloadClick) / 1000 < 30) {
    return false
  }
  return true
}

document
  .getElementById('config-reload')
  .addEventListener('click', reloadWeather)
