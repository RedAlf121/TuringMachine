export default class Tape{
    _list = []
    _pointer = null

    constructor(){
        this._list = new Array(1e6+5)
        this._pointer = Math.floor(this._list.length/2)
    }

    list(){return this._list}
    pointer(){return this._pointer}

    setPointer(pointer){this._pointer=pointer}
    editList(value){this._list[this._pointer]=value}
}

