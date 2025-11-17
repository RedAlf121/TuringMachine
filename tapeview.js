export default class TapeView {
  _tape = null;
  constructor(tape) {
    this._tape = tape;
    this._tape.onChange(()=>this.render())
  }

  render() {
    const parent = document.querySelector(".tape");
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
    return 40 + index * 90;
  }
}
