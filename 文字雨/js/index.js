const cvs = document.querySelector("canvas")
const ctx = cvs.getContext("2d")
// 初始化画布
!function(){
    cvs.width = innerWidth*devicePixelRatio
    cvs.height = innerHeight*devicePixelRatio
}()

// 返回一个随机字符
function getChar(){
    const str = "0123456789abcdefghigklmnopqrstuvwxyz"
    return str[Math.floor(Math.random()*str.length)]
}
const fontSize = 40*devicePixelRatio
ctx.font=`${fontSize}px`
// 列数
const columnCount = Math.floor(cvs.width/fontSize)
// 声明一个数组用来装每一列应该绘制的位置
const charIndex = new Array(columnCount).fill(0)
function draw(){
    // 添加一层蒙版
    ctx.fillStyle="rgba(0,0,0,0.1)"
    ctx.fillRect(0,0,cvs.width,cvs.height)
    ctx.fillStyle="#6BE445"
    // 设置文字对齐方式(纵向，默认基线对齐)
    ctx.textBaseline = "top"
    for(let i=0;i<columnCount;i++){
        let y = charIndex[i]*fontSize
        if (y > cvs.height && Math.random()>0.5 ){
            charIndex[i] = 0
            y = charIndex[i]*fontSize
        }
        ctx.fillText(getChar(),i*fontSize,y)
        charIndex[i]++
    }
}
setInterval(() => {
    draw()
}, 50);
