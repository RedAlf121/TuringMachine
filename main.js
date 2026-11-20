import Tape from './tape.js'
import TapeView from './tapeview.js'
import compile, { clear } from './compile.js'
const tape = new Tape()
const view = new TapeView(tape)
view.render()
const editor = document.querySelector('#text-editor')
const allowedCharacters = /^[+\-<>.,\[\]]*$/
const invalidCharacters = /[^+\-<>.,\[\]]/g

document.querySelector('#compiler-button').addEventListener('click', () => compile(tape))
document.querySelector('#clear-button').addEventListener('click', () => {
  editor.value = ''
  clear(tape)
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
