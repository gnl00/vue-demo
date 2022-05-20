// according to window, create a canvas for draw
export const createCanvas = (option = {}) => {
  const width = option.width || window.outerWidth
  const height = option.height || window.outerHeight

  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  // 移动画布原点到屏幕中心
  ctx.translate(width / 2, height / 2)

  ctx.strokeStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(110, 100)
  ctx.stroke()
  ctx.closePath()

  return canvas
}