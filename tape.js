export default class Tape {
  _list = [];
  _pointer = null;
  _observer = null;
  constructor() {
    this._list = new Array(1e2 + 5).fill(0);
    this._pointer = 0;
  }

  list() {
    return this._list;
  }
  pointer() {
    return this._pointer;
  }
  clear(){
    this._list.fill(0);
    this.setPointer(0);
  }
  setPointer(pointer) {
    this._pointer = pointer;
    this._notify();
  }

  editList(value) {
    this._list[this._pointer] = value;
    this._notify();
  }

  current() {
    return this._list[this._pointer];
  }

  size(){
    return this._list.length
  }

  onChange(callback) {
    this._observer = callback;
  }

  _notify() {
    this._observer();
  }
}
