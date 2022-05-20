class CanvasHelper {

  constructor(canvas, { drawCallback, stopCallback }) {
    // 保存当前 this 指向
    canvas.that = this
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height

    this.drawCallback = drawCallback || function () {}
    this.stopCallback = stopCallback || function () {}

    // 鼠标时间绑定
    canvas.addEventListener('mousedown', this.onmousedown)
    canvas.addEventListener('mouseup', this.onmouseup)
    canvas.addEventListener('mousemove', this.onmousemove)
    canvas.addEventListener('mouseout', this.onmouseout)

    // 初始化
    this.init()
  }

  init() {
    this.LINE = 'line'
    this.RECT = 'rect'
    this.ARC = 'arc'

    // 默认绘制类型
    this.drawType = this.LINE
    // 默认颜色
    this.color = 'black'
    // 默认线条粗细
    this.lineWidth = 3
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'

    this.drawStart = false
    // 记录鼠标移动过的坐标数据
    this.points = []
  }

  onmousedown(evt) {
    const that = this.that

    that.drawStart = true
  }

  onmousemove(evt) {
    const that = this.that
    if (!that.drawStart) return

    const x = evt.offsetX
    const y = evt.offsetY

    that.points.push({
      x,
      y
    })

    // 绘制类型为线条，onmousemove 时立即绘制
    if (that.drawType === that.LINE) {
      that.draw()
      // 收集 drawCallback 数据
      that.getDrawData()
    }
  }

  onmouseup(evt) {
    const that = this.that
    if (!that.drawStart) return
    that.stop()
  }

  onmouseout(evt) {
    const that = this.that
    if (!that.drawStart) return
    that.stop()
  }

  draw() {
    if (!this.drawStart) return

    // 绘画之前统一修改样式
    const ctx = this.ctx
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth

    switch (this.drawType) {
      case "line":
        this.line()
        break
      case 'rect':
        this.rect()
        break
      case 'arc':
        this.arc()
        break
      default :
        break
    }
  }

  remoteDraw( { drawType, drawColor, lineWidth, points } ) {
    // 为避免远程样式污染本地样式，可以将本地样式先保存，远程绘制结束再恢复
    const localType = this.drawType
    const localColor = this.color
    const localLineWidth = this.lineWidth

    this.drawType = drawType || this.drawType
    this.color = drawColor || this.color
    this.lineWidth = lineWidth || this.lineWidth
    this.points = points || this.points

    // 开始远程绘制
    this.drawStart = true

    this.draw()

    // 远程绘制结束
    this.drawStart = false

    // 样式恢复
    this.drawType = localType
    this.color = localColor
    this.lineWidth = localLineWidth

    // 清空坐标
    this.points = []
  }

  // 绘画/移动停止
  stop() {
    // 圆形和矩形在鼠标停止移动的时候才绘制
    if (this.drawType !== this.LINE && this.drawStart) {
      this.draw()
      // 收集 drawCallback 数据
      this.getDrawData()
    }

    this.points = []

    if (this.drawStart) {
      this.drawStart = false
      this.stopCallback()
    }
  }

  getDrawData() {
    const paintData = {
      drawType: this.drawType,
      color: this.color,
      lineWidth: this.lineWidth,
      points: this.drawType === this.LINE ? this.points : [this.points[0], this.points[this.points.length - 1]],
    }

    this.drawCallback(paintData)
  }

  // 绘制线条
  line() {
    const ctx = this.ctx
    // 起始、控制和结束点
    let spx = 0
    let spy = 0
    let cpx = 0
    let cpy = 0
    let epx = 0
    let epy = 0
    if (this.points.length >= 2) {
      const lastTowPoints = this.points.slice(-2)
      spx = lastTowPoints[0].x
      spy = lastTowPoints[0].y

      epx = lastTowPoints[1].x
      epy = lastTowPoints[1].y
    }
    const {x: midX, y: midY} = this.getMidPoint(spx, spy, epx, epy)
    cpx = midX
    cpy = midY

    ctx.beginPath()
    ctx.moveTo(spx, spy)
    ctx.quadraticCurveTo(cpx, cpy, epx, epy)
    ctx.stroke()
    ctx.closePath()
  }

  // 获取两个点的中间点
  getMidPoint(x1, y1, x2, y2) {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    }
  }

  // 绘制矩形
  rect() {
    const ctx = this.ctx

    let sp = this.points[0]
    let ep = this.points[this.points.length - 1]

    if (sp && ep) {
      const width = ep.x - sp.x
      const height = ep.y - sp.y

      ctx.beginPath()
      ctx.rect(sp.x, sp.y, width, height)
      ctx.stroke()
      ctx.closePath()
    }
  }

  // 绘制圆形
  arc() {
    const ctx = this.ctx

    // 利用 movePoints 数组中的第一个和最后一个坐标位置，计算圆心和半径，画圆
    let sp = this.points[0]
    let ep = this.points[this.points.length - 1]

    if (sp && ep) {
      // 圆心
      let mp = this.getMidPoint(sp.x, sp.y, ep.x, ep.y)

      // 半径
      const radius = this.calcRadius(mp.x, mp.y, sp.x, sp.y)

      // 画圆
      ctx.beginPath()
      // ctx.moveTo(mp.x, mp.y)
      ctx.arc(mp.x, mp.y, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.closePath()
    }
  }

  // 计算半径
  calcRadius(x1, y1, x2, y2) {
    return Math.sqrt( ((x1 - x2) ** 2) + ((y1 - y2) ** 2))
  }

  // 修改样式
  change( {drawType, drawColor, lineWidth} ) {
    console.log({drawType, drawColor, lineWidth})
    this.drawType = drawType || this.drawType
    this.color = drawColor || this.color
    this.lineWidth = lineWidth || this.lineWidth
  }

  // 清除画布内容
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  // 保存画布内容
  save() {
    const url = this.canvas.toDataURL()
    return url
  }
}

export default CanvasHelper