export default class TapeView {
  _tape = null;
  constructor(tape) {
    this._tape = tape;
  }

  render(path) {
    const parent = document.querySelector(path);
    parent.innerHTML = this._definition();
  }

  _definition() {
    return `
        ${this._tape
          .list()
          .map((value) => {
            return this._square(value);
          })
          .join("")}
        ${this._pointer()}
        `;
  }

  _pointer() {
    /*
        remember 
        left(0) = 25
        left(x) = 25+60x
    */
    return `
        <div class="pointer" style="left:${this._left(this._tape._pointer)}px">

        </div>
        `;
  }

  _square(value) {
    return `
        <div class="square">
            <span>${value}</span>
        </div>
        `;
  }

  _left(index) {
    return 25 + index * 60;
  }
}
