/** 
 * 获取min~max之间的随机数
*/
function getRandom(min,max){
    return Math.floor(Math.random()*(max+1-min)+min)
}

let cvs = document.querySelector("canvas")
// 获取上下文对象
let ctx = cvs.getContext("2d")
function init(){
    cvs.width = window.innerWidth * devicePixelRatio
    cvs.height = window.innerHeight * devicePixelRatio
}
init()
// 点
class Point {
    constructor(){
        this.r = 4
        this.x = getRandom(this.r/2,cvs.width-this.r/2)
        this.y = getRandom(this.r/2,cvs.height-this.r/2)
        this.xSpeed = getRandom(-50,50)
        this.ySpeed = getRandom(-50,50)
        this.lastTime = null
    }
    draw(){
        // 已经绘制过了
        if(this.lastTime != null){
            // 计算新坐标
            const duration = (Date.now()-this.lastTime)/1000
            this.x += this.xSpeed * duration
            this.y += this.ySpeed * duration
            // 过界回弹
            if (this.x < this.r/2){
                this.x = this.r/2
                this.xSpeed = -this.xSpeed
            }
            if (this.x > cvs.width - this.r/2){
                this.x = cvs.width - this.r/2
                this.xSpeed = -this.xSpeed
            }
            if (this.y<this.r/2){
                this.y = this.r/2
                this.ySpeed = -this.ySpeed
            }
            if (this.y > cvs.height - this.r/2){
                this.y = cvs.height - this.r/2
                this.ySpeed = -this.ySpeed
            }
        }
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI)
        ctx.fillStyle = "#fff"
        ctx.fill()
        this.lastTime = Date.now()
    }
}
// 图
class Graph{
    constructor(pointNumber=30,maxDis=200){
        this.points = new Array(pointNumber).fill(0).map(()=>new Point())
        this.maxDis = maxDis
    }
    draw(){
        requestAnimationFrame(()=>{
            this.draw()
        })
        // 清空画布
        ctx.clearRect(0,0,cvs.width,cvs.height)
        // 绘制出每个点
        for(let i=0;i<this.points.length;i++){
            const p1 = this.points[i]
            p1.draw()
            // 与后面每个点相连
            for(let j = i+1;j<this.points.length;j++){
                const p2 = this.points[j]
                // 两点间距离
                const d = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2)
                // 超出距离不显示
                if(d > this.maxDis){
                    continue
                }
                ctx.beginPath()
                ctx.moveTo(p1.x,p1.y)
                ctx.lineTo(p2.x,p2.y)
                console.log(d);
                ctx.strokeStyle = `rgba(200,200,200,${1-d/this.maxDis})`
                ctx.stroke()
            }
        }
    }
}
const graph = new Graph(20)
graph.draw()