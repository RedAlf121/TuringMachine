export default class TapeView{
    _tape = null
    constructor(tape){
        this._tape(tape)
    }

    render(path){
        const parent = document.querySelector(path)
        parent.innerHTML = this._definition
    }

    _definition(){
        return ``
    }
}