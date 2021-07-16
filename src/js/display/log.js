import PubSub from 'pubsub-js'
import TOPIC from './../topics'

const log = document.getElementById('log')

let lastLogTimeout

function addTemporaryLog (text, seconds = 6) {
  log.className = 'show'
  log.textContent = text
  if (lastLogTimeout) {
    clearTimeout(lastLogTimeout)
  }
  lastLogTimeout = setTimeout(() => {
    log.className = ''
    log.textContent = ''
  }, seconds * 1000)
}

function logLoader (topic, data) {
  addTemporaryLog(data.message, data.seconds)
}

PubSub.subscribe(TOPIC.LOG, logLoader)
