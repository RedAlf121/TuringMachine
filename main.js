import Tape from './tape.js'
import TapeView from './tapeview.js'
const tape = new Tape()
const view = new TapeView(tape)

view.render(".tape")