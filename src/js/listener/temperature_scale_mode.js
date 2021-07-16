import { setting, TEMPERATURE_SCALE } from './../controller'
import PubSub from 'pubsub-js'
import TOPIC from './../topics'

function getValidButtonModeTarget (target) {
  if (!target.className.includes('temp-select')) {
    target = target.parentNode
  }
  return target
}

function changeTemperatureScale (event) {
  const target = getValidButtonModeTarget(event.target)
  const type = target.getAttribute('data-config-temperature')
  if (
    type.toUpperCase() !== TEMPERATURE_SCALE.CELSIUS &&
    type.toUpperCase() !== TEMPERATURE_SCALE.FAHRENHEIT
  ) {
    return
  }

  if (setting.temperature_scale === type.toUpperCase()) {
    return
  }

  setting.temperature_scale = type.toUpperCase()

  Array.from(buttons)
    .filter(button => button !== target)
    .forEach(button => button.removeAttribute('selected'))
  target.setAttribute('selected', '')

  if (setting.basicWeather) {
    PubSub.publish(TOPIC.BUILD_CURRENT_WEATHER, setting.basicWeather)
  }

  if (setting.nextDaysWeather) {
    PubSub.publish(TOPIC.BUILD_NEXT_DAYS, setting.nextDaysWeather)
  }
}

const buttons = document.querySelectorAll('.temp-select.btn')
buttons.forEach(button =>
  button.addEventListener('click', changeTemperatureScale)
)
