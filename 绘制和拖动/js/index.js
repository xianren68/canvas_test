const cvs = document.querySelector("canvas")
const ctx = cvs.getContext("2d")
const color = document.querySelector('input')
// 初始化画布
!function () {
    // 样式大小
    const w = 500, h = 300
    cvs.style.height = h + "px"
    cvs.style.width = w + "px"
    cvs.style.backgroundColor = "#ccc"
    // 真实大小(canvas就是图片)
    cvs.height = h * devicePixelRatio
    cvs.width = w * devicePixelRatio
}()
// 用于存储绘制的图形
const shapes = []
// 矩形类
class Rectangle {
    constructor(color, x, y) {
        this.color = color
        this.startX = x
        this.startY = y
        this.endX = x
        this.endY = y
    }
    get MinX() {
        return Math.min(this.startX, this.endX)
    }
    get MaxX() {
        return Math.max(this.startX, this.endX)
    }
    get MinY() {
        return Math.min(this.startY, this.endY)
    }
    get MaxY() {
        return Math.max(this.startY, this.endY)
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = '#008c8c'
        ctx.moveTo(this.MinX * devicePixelRatio, this.MinY * devicePixelRatio)
        ctx.lineTo(this.MinX * devicePixelRatio, this.MaxY * devicePixelRatio)
        ctx.lineTo(this.MaxX * devicePixelRatio, this.MaxY * devicePixelRatio)
        ctx.lineTo(this.MaxX * devicePixelRatio, this.MinY * devicePixelRatio)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
    // 判断点击的点是否在当前图形内
    isInside(x, y) {
        return x >= this.MinX && x <= this.MaxX && y >= this.MinY && y <= this.MaxY
    }
}
// 获取点所在的图形
function getShape(x, y) {
    // 倒循环，优先后面画的图形
    for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].isInside(x, y)) {
            return shapes[i]
        }
    }
}
// 点击画布
cvs.onmousedown = e => {
    const rect = cvs.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    let shape = getShape(clickX, clickY)
    
    if (shape) {
        // 存在图形，拖动
        // 当前图形的位置，在这里保存，不然在事件里随时变化
        const {startX,endX,startY,endY} = shape
        window.onmousemove=e=>{
            // 鼠标移动的距离
            const disx = e.clientX - rect.left - clickX
            const disy = e.clientY - rect.top - clickY
            shape.startX = disx + startX
            shape.endX = disx + endX
            shape.startY = disy + startY
            shape.endY = disy + endY
        }

    } else { 
        // 新建图形
        shape = new Rectangle(color.value, clickX, clickY)
        shapes.push(shape)
        // 鼠标移动
        window.onmousemove = e => {
            shape.endX = e.clientX - rect.left
            shape.endY = e.clientY - rect.top
        }
    }
    // 鼠标抬起
    window.onmouseup = () => {
        window.onmousemove = null
        window.onmouseup = null
    }

}
// 绘画图形
function draw() {
    requestAnimationFrame(draw)
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    // 依次绘制每个形状
    for (let i of shapes) {
        i.draw()
    }
}
draw()
