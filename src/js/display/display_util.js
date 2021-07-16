import { setting } from './../controller'
import { getConvertedTemperature } from './../util/temperature_scale'

function getDOMStrTemperature (value) {
  const temperature = getConvertedTemperature(value)
  return `${temperature}${setting.temperature_scale}`
}

function setDOMTemperature (value, dom) {
  dom.textContent = getDOMStrTemperature(value)
}

const createElement = (tag, className, textContent, parentNode = null) => {
  const element = document.createElement(tag)
  element.className = className
  element.textContent = textContent
  if (parentNode) {
    parentNode.appendChild(element)
  }
  return element
}

function removeAllChildren (dom) {
  while (dom.firstChild) {
    dom.firstChild.remove()
  }
}

const createTemperatureWithIcon = (value, iconClass, parentNode) => {
  removeAllChildren(parentNode)
  const domTemperature = getDOMStrTemperature(value)
  createElement('i', iconClass, null, parentNode)
  const text = document.createTextNode(domTemperature)
  parentNode.appendChild(text)
  return parentNode
}

export {
  createElement,
  setDOMTemperature,
  getDOMStrTemperature,
  removeAllChildren,
  createTemperatureWithIcon
}
