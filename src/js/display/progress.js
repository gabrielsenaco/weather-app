import TOPIC from './../topics'
import PubSub from 'pubsub-js'

const progressDOM = document.getElementById('load-progress')
let pendingProgress = []

function setNewProgress (value) {
  progressDOM.setAttribute('value', value)
  progressDOM.textContent = `${value}%`
}

function enableProgress () {
  clearAllProgress()
  setNewProgress(0)
  progressDOM.classList.add('show')
}

function finishProgress (fail) {
  setNewProgress(100)
  if (fail) {
    progressDOM.classList.add('error')
  }
  const progressLoading = setTimeout(() => {
    setNewProgress(0)
    progressDOM.classList.remove('show')
    progressDOM.classList.remove('error')
  }, 500)
  pendingProgress.push(progressLoading)
}

function clearAllProgress () {
  pendingProgress.forEach((progress) => clearTimeout(progress))
  pendingProgress = []
}

function progressLoader (topic, data) {
  switch (topic) {
    case TOPIC.ENABLE_PROGRESS:
      enableProgress()
      break
    case TOPIC.FINISH_PROGRESS:
      setTimeout(() => finishProgress(data.fail), 200)
      break
    case TOPIC.INSERT_NEW_PROGRESS:
      setTimeout(() => setNewProgress(data.value), 200)
      break
  }
}

PubSub.subscribe(TOPIC.ENABLE_PROGRESS, progressLoader)
PubSub.subscribe(TOPIC.FINISH_PROGRESS, progressLoader)
PubSub.subscribe(TOPIC.INSERT_NEW_PROGRESS, progressLoader)
