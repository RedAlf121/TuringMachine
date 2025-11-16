export default class Tape{
    _list = []
    _pointer = null

    constructor(){
        this._list = new Array(1e2+5).fill(0)
        this._pointer = 0
    }

    list(){return this._list}
    pointer(){return this._pointer}

    setPointer(pointer){this._pointer=pointer}
    editList(value){this._list[this._pointer]=value}
}

