/**
 * canvas：canvas 对象
 * drawType： 绘画类型
 * color：绘画颜色
 * lineWidth：笔迹粗细
 */
function Painter(canvas, type = 'line', color = 'black', lWidth = 3) {

  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  let drawType = type || 'line'
  let drawColor = color || 'black'
  let lineWidth = lWidth || 3

  // 鼠标动作绑定

  // 需要注意：由于 addEventListener 的时候已经将 onmousedown、onmouseup、onmousemove、onmouseover 这几个方法绑定给了 canvas
  // 所以在这几个方法中的 this 指向的是外部的 canvas，而不是 Painter
  canvas.addEventListener('mousedown', onmousedown)
  canvas.addEventListener('mouseup', onmouseup)
  canvas.addEventListener('mousemove', onmousemove)
  canvas.addEventListener('mouseout', onmouseout)

  // 设置初始状态
  let points = [] // 收集鼠标经过的坐标点
  let drawStart = false // 是否开始绘画标志位
  let lineIndex = 0 // 记录线条绘制的数组下标

  function onmousedown(evt) {
    drawStart = true
  }

  function onmousemove(evt) {
    if (!drawStart) return

    const x = evt.offsetX
    const y = evt.offsetY

    // 将点位保存
    points.push({
      x,
      y
    })

    if (drawType === 'line') {
      // 如果是线条，移动鼠标的同时就绘制
      draw(drawType, points, drawColor, lineWidth)
    }
  }

  function onmouseup(evt) {
    drawStop()
  }

  function onmouseout(evt) {
    drawStop()
  }

  /**
   * 绘制线条
   */
  function drawLine() {
    // 起始、控制和结束点
    let spx = 0
    let spy = 0
    let cpx = 0
    let cpy = 0
    let epx = 0
    let epy = 0
    let offset = 0.00000001
    if (points.length < 2) {
      spx = points[lineIndex].x
      spy = points[lineIndex].y

      epx = spx + offset
      epy = spy
    } else {
      spx = points[lineIndex - 1].x
      spy = points[lineIndex - 1].y

      epx = points[lineIndex].x
      epy = points[lineIndex].y
    }
    const {x: midX, y: midY} = getMidPoint(spx, spy, epx, epy)
    cpx = midX
    cpy = midY
    lineIndex++

    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(spx, spy)
    ctx.quadraticCurveTo(cpx, cpy, epx, epy)
    ctx.stroke()
    ctx.closePath()
  }
  // 获取两个点的中间点
  const getMidPoint = (x1, y1, x2, y2) => {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    }
  }

  /**
   * 绘制矩形
   */
  function drawRect() {
    let sp = points[0]
    let ep = points[points.length - 1]

    if (sp && ep) {
      const width = ep.x - sp.x
      const height = ep.y - sp.y

      ctx.beginPath()
      ctx.rect(sp.x, sp.y, width, height)
      ctx.stroke()
      ctx.closePath()
    }
  }

  /**
   * 绘制圆形
   */
  function drawArc() {
    // 利用 movePoints 数组中的第一个和最后一个坐标位置，计算圆心和半径，画圆
    let sp = points[0]
    let ep = points[points.length - 1]

    if (sp && ep) {
      // 圆心
      let mp = getMidPoint(sp.x, sp.y, ep.x, ep.y)

      // 半径
      const radius = calcRadius(mp.x, mp.y, sp.x, sp.y)

      // 画圆
      ctx.beginPath()
      // ctx.moveTo(mp.x, mp.y)
      ctx.arc(mp.x, mp.y, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.closePath()
    }
  }
  // 计算圆的半径
  const calcRadius = (x1, y1, x2, y2) => Math.sqrt( ((x1 - x2) ** 2) + ((y1 - y2) ** 2))

  function draw(type, pts, color, width) {
    // console.log('function local === >')
    // console.log(type)
    // console.log(pts)
    // console.log(color)
    // console.log(width)

    // set to function inner
    points = pts

    switch (drawType) {
      case 'line':
        drawLine()
        break
      case 'rect':
        drawRect()
        break
      case 'arc':
        drawArc()
        break
      default:
        break
    }
  }

  function drawStop() {
    // 如果是矩形或者圆形，延迟到鼠标动作结束才开始绘制
    if (drawType === 'rect' || drawType === 'arc') {
      draw(drawType, points, drawColor, lineWidth)
    }

    drawStart = false
    points = []
    lineIndex = 0
  }

  function clear() {
    ctx.clearRect(0, 0, width, height)
  }

}

export default Painter