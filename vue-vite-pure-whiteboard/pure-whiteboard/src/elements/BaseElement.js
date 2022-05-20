export default class BaseElement {

  constructor(canvas, option = {}) {
    canvas._this = this
    this.canvas = canvas

    this.init(option)
  }

  init(option) {
    const { type, color, lineWidth } = option

    this.type = type
    this.color = color
    this.lineWidth = lineWidth

    this.points = []
    this.isMouseDown = false

    // 鼠标事件绑定
    this.bindMouseEvent(this.canvas)
  }

  bindMouseEvent(canvas) {
    canvas.addEventListener('mousedown', this.onmousedown)
    canvas.addEventListener('mouseup', this.onmouseup)
    canvas.addEventListener('mousemove', this.onmousemove)
  }

  onmousedown(evt) {
    const _this = this._this

    _this.isMouseDown = true
  }

  onmouseup(evt) {
    const _this = this._this

    _this.isMouseDown = false
  }

  onmousemove(evt) {
    const _this = this._this

    if (!_this.isMouseDown) return

    const point = {
      x: evt.offsetX,
      y: evt.offsetY
    }
    console.log(point)

    _this.points.push(point)
  }

}