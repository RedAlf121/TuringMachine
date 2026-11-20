import Tape from './tape.js'
import TapeView from './tapeview.js'
import compile, { clear } from './compile.js'
const tape = new Tape()
const view = new TapeView(tape)
view.render()
const editor = document.querySelector('#text-editor')
const allowedCharacters = /^[+\-<>.,\[\]]*$/
const invalidCharacters = /[^+\-<>.,\[\]]/g
const speedControl = document.querySelector('#execution-speed')
const speedValue = document.querySelector('#speed-value')
const pauseButton = document.querySelector('#pause-button')
const stepButton = document.querySelector('#step-button')
const backButton = document.querySelector('#back-button')
const executionStatus = document.querySelector('#execution-status')
const MAX_SPEED = 1000
let execution = null

function getExecutionDelay() {
  return MAX_SPEED - Number(speedControl.value) + 1
}

function updateSpeedLabel() {
  const speed = Number(speedControl.value)
  speedValue.value = `${Math.round((speed / MAX_SPEED) * 100)}%`
}

function updateExecutionControls(state, statusOverride) {
  const isRunning = state?.status === 'running'
  const isStepping = state?.isStepping ?? false
  pauseButton.textContent = isRunning || isStepping ? 'Pausar' : 'Continuar'
  pauseButton.disabled = !isRunning && !isStepping && state?.status !== 'paused'
  stepButton.disabled = !state?.canStep
  backButton.disabled = !state?.canGoBack

  const statusLabels = {
    ready: 'Listo',
    running: 'Ejecutando',
    paused: 'Pausado',
    completed: 'Completado',
    stopped: 'Detenido',
  }
  executionStatus.textContent =
    statusOverride || (isStepping ? 'Avanzando un paso…' : statusLabels[state?.status] || 'Listo')
}

document.querySelector('#compiler-button').addEventListener('click', () => {
  execution?.stop()
  execution = compile(tape, {
    delayMs: getExecutionDelay(),
    onStateChange: updateExecutionControls,
  })

  if (!execution) {
    updateExecutionControls(null, 'Revisa el programa')
    return
  }
  execution.start()
})

pauseButton.addEventListener('click', () => {
  if (!execution) return
  const state = execution.getState()
  if (state.status === 'running' || state.isStepping) {
    execution.pause()
  } else {
    execution.resume()
  }
})

stepButton.addEventListener('click', () => execution?.step())
backButton.addEventListener('click', () => execution?.back())

speedControl.addEventListener('input', () => {
  updateSpeedLabel()
  if (execution) execution.setDelay(getExecutionDelay())
})

document.querySelector('#clear-button').addEventListener('click', () => {
  execution?.stop()
  execution = null
  editor.value = ''
  clear(tape)
  updateExecutionControls(null)
})

editor.addEventListener('beforeinput', (event) => {
  if (event.inputType === 'insertLineBreak' || event.inputType === 'insertParagraph') {
    event.preventDefault()
    return
  }

  if (event.inputType !== 'insertFromPaste' && event.data !== null && !allowedCharacters.test(event.data)) {
    event.preventDefault()
  }
})

editor.addEventListener('paste', (event) => {
  const pastedText = event.clipboardData?.getData('text/plain')
  if (pastedText === undefined) return

  event.preventDefault()
  const cleanText = pastedText.replace(invalidCharacters, '')
  editor.setRangeText(cleanText, editor.selectionStart, editor.selectionEnd, 'end')
  editor.dispatchEvent(new Event('input', { bubbles: true }))
})

editor.addEventListener('input', () => {
  const start = editor.selectionStart
  const end = editor.selectionEnd
  const cleanPrefix = editor.value.slice(0, start).replace(invalidCharacters, '')
  const cleanSelection = editor.value.slice(start, end).replace(invalidCharacters, '')
  const cleanValue = editor.value.replace(invalidCharacters, '')

  if (cleanValue !== editor.value) {
    editor.value = cleanValue
    editor.setSelectionRange(cleanPrefix.length, cleanPrefix.length + cleanSelection.length)
  }
})
