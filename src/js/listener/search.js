import { setting } from './../controller'
import PubSub from 'pubsub-js'
import TOPIC from './../topics'

const search = document.getElementById('search')
const searchForm = document
  .getElementById('search-form')
function requestNewWeather (event) {
  event.preventDefault()
  if (search.value.length === 0) {
    return
  }

  if (
    setting.city &&
    search.value.toLowerCase() === setting.city.toLowerCase()
  ) {
    PubSub.publish(TOPIC.LOG, { message: 'Sorry, same city already is open.' })
    return
  }
  PubSub.publish(TOPIC.LOG, { message: 'Loading city...' })
  PubSub.publish(TOPIC.SETUP_WEATHER, { name: search.value })
  searchForm.reset()
}

searchForm.addEventListener('submit', requestNewWeather)
