<script setup>
import {onMounted, ref} from "vue";

const drawFirstCanvas = (canvas) => {
  // 获取 2d 画布
  // <canvas> 元素有一个叫做 getContext() 的方法，这个方法是用来获得渲染上下文和它的绘画功能。getContext() 接受一个参数，即上下文的类型
  const ctx = canvas.getContext('2d')
  // console.log(ctx)

  // canvas 画布栅格以及坐标空间
  // canvas 元素默认被网格所覆盖。通常来说网格中的一个单元相当于 canvas 元素中的一像素。栅格的起点为左上角，坐标为（0, 0）。所有元素的位置都相对于原点定位。
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes

  /**
   * 线条和填充颜色
   *
   * fillStyle = color
   * 设置图形的填充颜色
   *
   * strokeStyle = color
   * 设置图形轮廓的颜色
   *
   * 上面的 color 可以是表示 CSS 颜色值的字符串，渐变对象或者图案对象。默认为黑色
   *
   * 一旦设置了 strokeStyle 或者 fillStyle 的值，那么这个新值就会成为新绘制的图形的默认值。如果要给每个图形上不同的颜色，需要重新设置 fillStyle 或 strokeStyle 的值。
   */

  // fillStyle 属性填充画布颜色
  // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillStyle
  ctx.fillStyle = 'rgb(200, 0, 0)'

  /**
   * 绘制矩形 Rectangular
   * <canvas> 只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）。所有其他类型的图形都是通过一条或者多条路径组合而成的
   * canvas 提供了三种方法绘制矩形：
   * 1、fillRect(x, y, width, height) 绘制一个填充的矩形
   * 2、strokeRect(x, y, width, height) 绘制一个矩形的边框
   * 3、clearRect(x, y, width, height) 清除指定矩形区域，让清除部分完全透明。
   */

  // fillRect 绘制填充矩形。fillRect(x, y, width, height)，分别表示矩形的坐标和宽高
  // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillRect
  ctx.fillRect (10, 10, 55, 50)

  ctx.fillStyle = 'rgb(0, 0, 200, 0.5)'
  ctx.fillRect (30, 30, 55, 50)
  // 上面绘制了两个矩形

  ctx.fillStyle = '#000'
  ctx.fillRect(100, 0, 100, 100) // *1
  ctx.clearRect(120, 10, 40, 60) // *2
  ctx.strokeRect(130, 20, 20, 30) // *3
  // 上面绘制了三个相互嵌套的矩形。*1 绘制一个黑色的矩形，*2 在 *1 中清除出一个 40*60 的矩形，*3 在清除区域内生成一个 20*30的矩形边框


  /**
   * 绘制路径
   * 图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。一个路径，甚至一个子路径，都是闭合的
   *
   * 路径绘图步骤如下：
   * 1、创建路径起始点
   * 2、使用画图命令去画出路径。画图命令：https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#paths
   * 3、封闭路径
   * 4、路径生成，可以通过描边或填充路径区域来渲染图形
   *
   *
   * 绘制路径需要用到的方法：
   * beginPath()，新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
   *
   * moveTo()，移动笔触，这个函数实际上并不能画出任何东西，仅仅是移动笔触到指定坐标位置
   *
   * closePath()，闭合路径之后图形绘制命令又重新指向到上下文中。
   *
   * stroke()，通过线条来绘制图形轮廓。
   *
   * fill()，通过填充路径的内容区域生成实心的图形。
   *
   * 生成路径的第一步叫做 beginPath()。
   * 本质上，路径是由很多子路径构成，这些子路径都是在一个列表中，所有的子路径（线、弧形、等等）构成图形。
   * 而每次这个方法调用之后，列表清空重置，然后我们就可以重新绘制新的图形。
   * 当前路径为空，即调用 beginPath() 之后，或者 canvas 刚建的时候，第一条路径构造命令通常被视为是 moveTo()，
   * 无论实际上是什么。出于这个原因，你几乎总是要在设置路径之后专门指定你的起始位置。
   *
   * 第二步就是调用函数指定绘制路径
   *
   * 第三，就是闭合路径 closePath()，不是必需的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。
   * 当你调用 fill() 函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用 closePath() 函数。但是调用 stroke() 时不会自动闭合。
   */


  // 绘制直线
  // 绘制直线，需要用到的方法 lineTo()。绘制一条从当前位置到指定 (x, y) 位置的直线。
  // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineTo


  // 绘制一个三角形
  ctx.beginPath()
  ctx.moveTo(300, 50)
  ctx.lineTo(400, 100)
  ctx.lineTo(400, 25)
  ctx.fill()
  // translate() 方法, 将 canvas 按原始 x 点的水平方向、原始的 y 点垂直方向进行平移变换
  // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/translate
  // ctx.translate(300, 300)


  // arc 绘制弧形
  // (圆心心 x, 圆心 y, 半径, 起始角度，结束角度, anticlockwise) anticlockwise 为一个布尔值。为true时，是逆时针方向，否则顺时针方向。
  // arc() 函数中表示角的单位是弧度，不是角度。角度与弧度的 js 表达式: 弧度 = ( Math.PI / 180 ) * 角度
  // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc
  // ctx.arc(0, 0, 100, 0, 2 * Math.PI)
  ctx.beginPath()

  // let i = 0.2, start = 0, end = 0
  //
  // let count = 0, interval = null
  // interval = setInterval(() => {
  //   end += i * Math.PI
  //   ctx.arc(250, 250, 100, start, end)
  //
  //   start = end
  //   console.log(count++)
  //
  //   if (end === 2 * Math.PI) {
  //     ctx.moveTo(250, 250)
  //     ctx.arc(250, 250, 50, 0, Math.PI)
  //   }
  //
  //
  //   ctx.stroke()
  // }, 1000)


  ctx.arc(250, 250, 100, 0, 2 * Math.PI)

  ctx.moveTo(325, 250)
  ctx.arc(250, 250, 75, 0, Math.PI) // (225, 250)
  ctx.moveTo(235, 225)
  ctx.arc(225, 225, 10, 0, 2 * Math.PI) // (235, 225)
  ctx.moveTo(275, 225)
  ctx.arc(265, 225, 10, 0, 2 * Math.PI) // (235, 225)


  // 执行画线操作
  ctx.stroke()
  ctx.closePath()

  /**
   * 贝塞尔曲线
   * 绘制复杂而有规律的图形
   * https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#%E4%BA%8C%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF%E5%8F%8A%E4%B8%89%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF
   */


  /**
   * Path2D
   * 为了简化代码和提高性能，Path2D 对象已可以在较新版本的浏览器中使用，还可以用来缓存或记录绘画命令
   * https://developer.mozilla.org/zh-CN/docs/web/api/path2d/path2d
   *
   * 创建 Path2D 对象
   * new Path2D() 空的 Path 对象
   * new Path2D(path) 克隆 Path 对象
   * new Path2D(d) 从 SVG 建立 Path 对象
   *
   * 所有的路径方法比如 moveTo, rect, arc 或 quadraticCurveTo 等，都可以在Path2D中使用
   */

      // Path2D 绘制矩形
  const rectangle = new Path2D()
  rectangle.rect(10, 400, 50, 50)

  // Path2D 绘制圆形
  const circle = new Path2D()
  circle.arc(150, 400, 50, 0, 2 * Math.PI)

  ctx.beginPath()
  ctx.stroke(rectangle)
  ctx.fill(circle)
}

const drawSecCanvas = (canvas) => {
  const ctx = canvas.getContext('2d')
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      // 仅修改红色和绿色通道的值，而保持蓝色通道的值不变
      ctx.fillStyle = 'rgb'.concat('(', Math.floor(255 - 42.5 * i), ',', Math.floor(255 - 42.5 * j), ',', '0')
      ctx.fillRect(25 * i, 25 * j, 25, 25)
    }
  }

  /**
   * 透明度
   */

  // 移动
  ctx.translate(175, 0)

  // 画背景
  ctx.fillStyle = '#FD0';
  ctx.fillRect(0,0,75,75);
  ctx.fillStyle = '#6C0';
  ctx.fillRect(75,0,75,75);
  ctx.fillStyle = '#09F';
  ctx.fillRect(0,75,75,75);
  ctx.fillStyle = '#F30';
  ctx.fillRect(75,75,75,75);
  ctx.fillStyle = '#FFF';

  // 设置透明度值
  ctx.globalAlpha = 0.2;

  // 画半透明圆
  for (let i = 0; i < 7; i++){
    ctx.beginPath();
    ctx.arc(75, 75, 10 + 10 * i, 0, Math.PI * 2, true);
    ctx.fill();
  }

  // 设置透明度值
  ctx.globalAlpha = 1;

  /**
   * rgba
   * rgba() 可以分别设置轮廓和填充样式，因而具有更好的可操作性和使用灵活性。
   */

  // 移动
  ctx.translate(225, 0)

  // 画背景
  ctx.fillStyle = 'rgb(255,221,0)';
  ctx.fillRect(0,0,150,37.5);
  ctx.fillStyle = 'rgb(102,204,0)';
  ctx.fillRect(0,37.5,150,37.5);
  ctx.fillStyle = 'rgb(0,153,255)';
  ctx.fillRect(0,75,150,37.5);
  ctx.fillStyle = 'rgb(255,51,0)';
  ctx.fillRect(0,112.5,150,37.5);

  // 画半透明矩形
  for (let i = 0; i < 10; i++){
    ctx.fillStyle = 'rgba(255,255,255,' + ( i + 1 ) / 10 + ')';
    for (let j = 0; j < 4; j++){
      ctx.fillRect(5 + i * 14,5 + j * 37.5,14,27.5)
    }
  }

  // 线条样式
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#line_styles

  // 渐变
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#gradients

  // 阴影
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#%E9%98%B4%E5%BD%B1_shadows

  // 绘制文字
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_text

  // 绘制图片
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Using_images

  /**
   * 形态转换
   * https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Transformations
   * translate() 移动
   * rotate() 旋转，只接受一个参数：旋转的角度(angle)，它是顺时针方向的，以弧度为单位的值。
   * scale() 缩放
   * transform() 变形
   *
   * 画布状态保存与恢复
   * save() 保存画布的所有状态。每当 save() 方法被调用后，当前的状态就被推送到栈中保存
   * https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/save
   *
   * restore() 恢复 canvas 状态
   * https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/restore
   */


}

// ref: https://juejin.cn/post/6986785259966857247
const drawThirdCanvas = (canvas) => {
  const ctx = canvas.getContext('2d')

  // 每秒清除一次 canvas ，然后重新绘制所有的元素
  setInterval(() => {
    // 将当前的移动，旋转和缩放状态保存
    ctx.clearRect(0, 0, 600, 600)
    // 保存 canvas 初始状态
    ctx.save()

    ctx.translate(300, 300)

    // 画外圈
    ctx.beginPath()
    ctx.arc(0, 0, 150, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()

    // 画转动原点
    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    // 画刻度
    for (let i = 0; i < 60; i++) {
      ctx.beginPath()
      if (i % 5 === 0) {
        ctx.lineWidth = 5
        ctx.moveTo(135, 0)
      } else {
        ctx.lineWidth = 1
        ctx.moveTo(140, 0)
      }
      ctx.lineTo(150, 0)
      ctx.stroke()
      ctx.closePath()
      ctx.rotate(2 * Math.PI / 60)
    }

    // 将角度转 180° ，让时针、分针、秒针初始位置指向 12
    ctx.rotate(Math.PI)
    // 将角度状态保存
    ctx.save()

    // 获取当前时分秒
    const date = new Date()
    const hour = date.getHours() % 12
    const min = date.getMinutes()
    const sec = date.getSeconds()
    // console.log(`${hour} - ${min} - ${sec}`)

    // 时针
    ctx.lineWidth = 8
    // 时针角度
    ctx.rotate(2 * Math.PI / 12 * hour)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, 60)
    ctx.stroke()
    ctx.closePath()
    ctx.lineWidth = 1

    // 角度恢复
    ctx.restore()
    // 为下一次恢复保存角度状态
    ctx.save()

    // 分针
    ctx.rotate(2 * Math.PI / 60 * min)
    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.moveTo(0, 0)
    ctx.lineTo(0, 90)
    ctx.stroke()
    ctx.lineWidth = 1
    ctx.closePath()

    // 角度恢复
    ctx.restore()

    // 秒针
    // setInterval 延迟 1s 执行，为当前 sec + 1
    ctx.rotate(2 * Math.PI / 60 * sec)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, 110)
    ctx.stroke()
    ctx.closePath()

    // 恢复 canvas 初始状态
    ctx.restore()
  }, 1000)
}

const draw31Canvas = (canvas) => {
  const ctx = canvas.getContext('2d')

  ctx.beginPath()
  ctx.fillStyle = 'red'
  ctx.arc(50, 50, 40, 0, 2 * Math.PI)
  ctx.fill()


  ctx.beginPath()
  ctx.fillStyle = 'green'
  ctx.arc(90, 50, 40, 0, 2 * Math.PI)
  ctx.fill()

  // globalCompositeOperation 设置多个图像的合成效果
  // MDN解释的比较复杂，一个比较直观的例子看这里：
  // https://www.runoob.com/tags/canvas-globalcompositeoperation.html

  // 此处【目标图像】指的是上方的红色和绿色圆，【源图像】指的是下方绘制的蓝色的圆

  // source-over 默认，在目标图像上显示源图像
  // ctx.globalCompositeOperation = 'source-over'

  // source-atop 在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的
  // ctx.globalCompositeOperation = 'source-atop'

  // source-in 在目标图像中显示源图像。只有目标图像之内的源图像部分会显示，目标图像是透明的。
  // ctx.globalCompositeOperation = 'source-in'

  // source-out 在目标图像之外显示源图像。只有目标图像之外的源图像部分会显示，目标图像是透明的
  // ctx.globalCompositeOperation = 'source-out'

  // destination-over 在源图像上显示目标图像
  // ctx.globalCompositeOperation = 'destination-over'

  // destination-atop 在源图像顶部显示目标图像。目标图像位于源图像之外的部分是不可见的。
  // ctx.globalCompositeOperation = 'destination-atop'

  // destination-in 在源图像中显示目标图像。只有源图像之内的目标图像部分会被显示，源图像是透明的。
  // ctx.globalCompositeOperation = 'destination-in'

  // destination-out 在源图像之外显示目标图像。只有源图像之外的目标图像部分会被显示，源图像是透明的。
  // ctx.globalCompositeOperation = 'destination-out'

  // lighter 显示源图像 + 目标图像
  // ctx.globalCompositeOperation = 'lighter'

  // copy 显示源图像。忽略目标图像。
  // ctx.globalCompositeOperation = 'copy'

  // xor 使用异或操作对源图像与目标图像进行组合
  ctx.globalCompositeOperation = 'xor'

  ctx.beginPath()
  ctx.fillStyle = 'blue'
  ctx.arc(70, 90, 40, 0, 2 * Math.PI)
  ctx.fill()
}

const draw32Canvas = (canvas) => {
  const ctx = canvas.getContext('2d')

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(40, 150)
  ctx.stroke()
  ctx.closePath()

  // 二阶贝塞尔曲线
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(25, 40, 50, 50)
  ctx.stroke()
  ctx.closePath()

  // 三阶贝塞尔曲线
  // ctx.bezierCurveTo(cp1x, cp1y, cp2x, xp2y, x, y)

  // ctx.strokeStyle = 'red'
  // ctx.beginPath()
  // ctx.moveTo(0, 0)
  // ctx.lineTo(50, 30)
  // ctx.stroke()
  // ctx.closePath()
}

// ref: https://juejin.cn/post/6986785259966857247
const drawFourthCanvas = (canvas) => {
  const ctx = canvas.getContext('2d')

  /**
   * 刮刮乐
   * 原理是下层一个 <div>，上层一个 <canvas>，将其覆盖
   */

  // 覆盖
  ctx.fillStyle = 'lightgray'
  ctx.fillRect(0, 0, 200, 200)

  // 填充文字
  ctx.fillStyle = '#fff'
  ctx.font = '24px serif'
  ctx.fillText('刮刮乐', 65, 100)

  let drawStart = false
  canvas.onmousedown = () => {
    drawStart = true
  }

  canvas.onmousemove = (evt) => {
    if (!drawStart) return

    // 计算鼠标在 canvas 中的位置
    const x = evt.offsetX
    const y = evt.offsetY

    // 设置 globalCompositeOperation
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing
    // 设置在画新图形时采用的遮盖策略
    // 不仅可以在已有图形后面再画新图形，还可以用来遮盖指定区域，清除画布中的某些部分（清除区域不仅限于矩形，像 clearRect()）以及更多其他操作
    ctx.globalCompositeOperation = 'destination-out'

    ctx.beginPath()
    // 画圆
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    // 填充圆
    ctx.fill()
  }

  canvas.onmouseup = () => {
    drawStart = false
  }

  // 一个可以优化的点：判断鼠标移动是否超出 canvas 区域，超出的话设置 drawStart = false
}

// ==============================================
let colorValue = ref('black')
let currentDraw = ref('line')

let draw = null
let drawLine = null
let drawRect = null
let drawArc = null
let clearCanvas = null
let saveCanvas = null
const draw5thCanvas = (canvas) => {
  const ctx = canvas.getContext('2d')

  let drawState = false
  let movePoints = []
  let index = 0

  // 绘制线条
  drawLine = () => {
    // console.log(movePoints)

    // 两种绘画方式1、利用 ctx.arc()；2、利用 ctx.lineTo。lineTo 需要设置一定的 offset，才能画出线条

    // 利用 ctx.arc()
    // ctx.beginPath()
    // ctx.arc(x, y, 3, 0, Math.PI * 2)
    // ctx.fill()

    // 利用 ctx.lineTo()
    // ctx.beginPath()
    // ctx.moveTo(x - 1, y - 1)
    // ctx.lineTo(x, y)
    // ctx.stroke()
    // ctx.closePath()

    // 测试发现，若是鼠标移动速度过快，画出来的线条会断断续续。因为 onmousemove 获取到的鼠标 x 和 y 点坐标是不连续的。

    // 利用二阶贝塞尔曲线画出连续线条
    // 绘画二阶贝塞尔曲线需要三个点：开始点，结束点和控制点
    // quadraticCurveTo(控制点x，控制点y，结束点x，结束点y)

    // 两点法
    // ref: https://blog.csdn.net/KlausLily/article/details/119258700
    // 如果存在两个点 A 和 B，我们可以计算出点 A 和点 B 的中间点作为控制点，A 作为起始点，B 作为结束点，绘制贝塞尔曲线
    // 需要注意的是每次开始绘画之前需要 moveTo 起始点，再开始绘画

    // 起始、控制和结束点
    let spx = 0
    let spy = 0
    let cpx = 0
    let cpy = 0
    let epx = 0
    let epy = 0
    let moveOffset = 0.00000001
    if (movePoints.length < 2) {
      spx = movePoints[index].x
      spy = movePoints[index].y

      epx = spx + moveOffset
      epy = spy
    } else {
      spx = movePoints[index - 1].x
      spy = movePoints[index - 1].y

      epx = movePoints[index].x
      epy = movePoints[index].y
    }
    const {x: midX, y: midY} = getMidPoint(spx, spy, epx, epy)
    cpx = midX
    cpy = midY
    index++

    // console.log(`spx ${spx} spy ${spy} cpx ${cpx} cpy ${cpy} epx ${epx} epy ${epy}`)

    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(spx, spy)
    ctx.quadraticCurveTo(cpx, cpy, epx, epy)
    ctx.stroke()
    ctx.closePath()

    // 三点法
    // ref: https://zhuanlan.zhihu.com/p/46676386
    // 取前面的 A, B, C 三点，计算出 B 和 C 的中点 B1，以 A 为起点，B 为控制点，B1 为终点，绘制一条二次贝塞尔曲线线段
    // if (movePoints.length >= 3) {
    //   // 取最后三个点
    //   let points = movePoints.slice(-3)
    //   spx = points[0].x
    //   spy = points[0].y
    //
    //   cpx = points[1].x
    //   cpy = points[1].y
    //
    //   const {x: eX, y: eY} = getMidPoint(cpx, cpy, points[2].x, points[2].y)
    //   epx = eX
    //   epy = eY
    //
    //   console.log(`spx ${spx} spy ${spy} cpx ${cpx} cpy ${cpy} epx ${epx} epy ${epy}`)
    //
    //   ctx.lineJoin = 'round'
    //   ctx.lineCap = 'round'
    //   ctx.beginPath()
    //   ctx.moveTo(spx, spy)
    //   ctx.quadraticCurveTo(cpx, cpy, epx, epy)
    //   ctx.stroke()
    //   ctx.closePath()
    // }

    // 可自行对比，采用最佳的方法
  }
  // 获取两个点的中间点
  const getMidPoint = (x1, y1, x2, y2) => {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    }
  }

  // 绘制圆形
  drawArc = () => {
    // 利用 movePoints 数组中的第一个和最后一个坐标位置，计算圆心和半径，画圆
    let sp = movePoints[0]
    let ep = movePoints[movePoints.length - 1]

    if (sp && ep) {
      // console.log(`sp ${sp} ep ${ep}`)

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

  // 绘制矩形
  drawRect = () => {
    let sp = movePoints[0]
    let ep = movePoints[movePoints.length - 1]

    if (sp && ep) {
      const width = ep.x - sp.x
      const height = ep.y - sp.y

      ctx.beginPath()
      ctx.globalAlpha = 0
      ctx.rect(sp.x, sp.y, width, height)
      ctx.stroke()
      ctx.closePath()
    }
  }

  // 默认绘画方式为线条绘制
  draw = drawLine

  // start draw
  canvas.onmousedown = () => {
    drawState = true
    ctx.strokeStyle = colorValue.value
  }

  canvas.onmousemove = evt => {
    if (!drawState) return

    const x = evt.offsetX
    const y = evt.offsetY
    // console.log(`x ${x} - y ${y}`)

    // 记录下鼠标移动过的坐标点
    movePoints.push({
      x,
      y
    })

    draw()

    // 线条需要当下绘制，其他图形如圆形和矩形需要等到 onmouseup 才开始绘制
    // if (draw === drawLine) {
    //
    // }
  }

  // stop draw
  const drawStop = () => {

    // if (draw !== drawLine && drawState) {
    //   draw()
    // }

    drawState = false
    movePoints = []
    index = 0
  }
  canvas.onmouseup = drawStop
  canvas.onmouseout = drawStop

  clearCanvas = () => {
    ctx.clearRect(0, 0, 800, 600)
  }

  // 撤销和恢复思路：将每一帧 canvas 保存到数组，为了避免数组过大，可设置大小，只允许恢复 x 步的内容
}
const onColorSelectorChange = (evt) => {
  console.log(evt.target.value)
  colorValue.value = evt.target.value
}
const onPenClick = () => {
  draw = drawLine
  currentDraw.value = 'line'
}
const onRectClick = () => {
  draw = drawRect
  currentDraw.value = 'rect'
}
const onArcClick = () => {
  draw = drawArc
  currentDraw.value = 'arc'
}
const clear = () => {
  clearCanvas()
}
const save = () => {}

const draw6thCanvas = () => {}

onMounted(() => {
  // canvas 起初是空白的。首先需要找到渲染上下文，然后在它的上面绘制
  const canvas = document.getElementById('canvas')
  // console.log(canvas)
  drawFirstCanvas(canvas)

  // 颜色和样式
  const canvas2 = document.getElementById('canvas2')
  drawSecCanvas(canvas2)

  const canvas3 = document.getElementById('canvas3')
  drawThirdCanvas(canvas3)

  const canvas31 = document.getElementById('canvas31')
  draw31Canvas(canvas31)

  const canvas32 = document.getElementById('canvas32')
  draw32Canvas(canvas32)

  const canvas4 = document.getElementById('canvas4')
  drawFourthCanvas(canvas4)

  // 实现 canvas 画板
  const canvas5 = document.getElementById('canvas5')
  draw5thCanvas(canvas5)
})
</script>

<template>
  <div class="m-2 w-full h-full flex flex-wrap space-x-2 space-y-2">
    <!--  </canvas> 标签不可省  -->
    <canvas id="canvas" class="bg-gray-100" height="600" width="600" ></canvas>
    <canvas id="canvas2" class="bg-gray-100" height="600" width="600" ></canvas>
    <!--  canvas 时钟  -->
    <canvas id="canvas3" class="bg-gray-100" height="600" width="600" ></canvas>
    <!--  canvas Compositing  -->
    <canvas id="canvas31" class="bg-gray-100" height="200" width="200" ></canvas>
    <canvas id="canvas32" class="bg-gray-100" height="200" width="200" ></canvas>
    <!--  canvas 刮刮乐  -->
    <div class="relative">
      <canvas id="canvas4" height="200" width="200" ></canvas>
      <div class="-z-1 absolute top-0 right-0 left-0 bottom-0">Something Here</div>
    </div>
  </div>

  <div class="flex flex-col justify-center items-center space-y-1">
    <div class="bg-indigo-100 w-full flex justify-center items-center space-x-2">
      <select class="outline-none p-1 rounded" :value="colorValue" @change="onColorSelectorChange">
        <option value="black" label="黑色" class="bg-black" />
        <option value="white" label="白色" class="bg-white text-white" />
        <option value="red" label="红色" class="bg-red-500 text-red-500" />
        <option value="green" label="绿色" class="bg-green-500 text-green-500" />
        <option value="yellow" label="黄色" class="bg-yellow-500 text-yellow-500" />
        <option value="blue" label="蓝色" class="bg-blue-500 text-blue-500" />
      </select>
      <div :class="['btn btn-success', currentDraw === 'line' ? 'ring-inset ring-blue-500 ring-4' : '']" @click="onPenClick">画笔</div>
      <div :class="['btn btn-warning', currentDraw === 'rect' ? 'ring-inset ring-blue-500 ring-4' : '']" @click="onRectClick">矩形</div>
      <div :class="['btn', currentDraw === 'arc' ? 'ring-inset ring-blue-500 ring-4' : '']" @click="onArcClick">圆</div>
      <div class="btn btn-danger" @click="clear">清空</div>
      <div class="btn btn-primary" @click="save">保存</div>
    </div>
    <!--  canvas 实现画板  -->
    <canvas id="canvas5" class="bg-gray-100" width="800" height="600" ></canvas>
  </div>
</template>

<style scoped>
</style>