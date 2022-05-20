import { createCanvas } from "./utils/index";
import Line from "./elements/Line";

export default class WhiteBoard {

  /**
   * @container The container for canvas to render
   * @option WhiteBoard and canvas style option
   */
  constructor(container, option = {}) {
    console.log('WhiteBoard')

    // 设置 canvas 的容器
    this.container = container
    this.option = option

    // 初始化 WhiteBoard
    this.init(option)
  }

  init(option) {
    // set default value
    this.drawStyle = {
      type: option.type || 'line',
      color: option.color || 'black',
      lineWidth: option.lineWidth || 3
    }

    // 初始化 canvas，并渲染
    this.initCanvas()
  }

  initCanvas() {
    // check if container had defined width and height
    const width = this.container.width
    const height = this.container.height

    // create canvas
    this.canvas = createCanvas({
      width,
      height
    })

    // render canvas to parent container
    this.container.appendChild(this.canvas)

    // 创建默认绘画工具：鼠标选择/线条/矩形/圆形
    this.createElement()
  }

  createElement() {
    let el = null
    switch (this.drawStyle.type) {
      case "line":
        el = new Line(this.canvas, this.drawStyle)
        break
      default:
        break
    }
  }

}