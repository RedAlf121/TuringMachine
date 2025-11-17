import Tape from './tape.js'
import TapeView from './tapeview.js'
import compile from './compile.js'
const tape = new Tape()
const view = new TapeView(tape)
view.render()
document.querySelector('button.ide__compile-button').addEventListener("click",()=>compile(tape))
