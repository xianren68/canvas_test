const cvs = document.querySelector("canvas")
const ctx = cvs.getContext("2d", {
    willReadFrequently: true
})
// 初始化画布
!function () {
    const img = new Image()
    img.src = './huge.png'
    img.onload = () => {
        cvs.width = img.width
        cvs.height = img.height
        // 绘制图片到画布右上角
        ctx.drawImage(img, 0, 0)
    }
}()

cvs.addEventListener('click', e => {
    // 获取点击坐标
    const x = e.offsetX, y = e.offsetY
    // 获取画布所有像素点信息
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height)
    const whiteColor = [255, 255, 255, 255]
    const clickColor = getColor(x, y, imgData)
    //修改颜色(递归版，容易栈溢出)
    // function _changeColor(x,y){
    //     if (x<0||x>cvs.width||y<0||y>cvs.height){
    //         return
    //     }
    //     // 对比颜色
    //     const color = getColor(x,y,imgData)
    //     // 颜色不相近
    //     if (diff(color,clickColor)>100){
    //         return
    //     }
    //     if (diff(color,whiteColor) == 0){
    //         return
    //     }
    //     const i = getIndex(x,y)
    //     // 从对应坐标开始修改四个值
    //     imgData.data.set(whiteColor,i)
    //     // 向四周扩散
    //     _changeColor(x+1,y)
    //     _changeColor(x-1,y)
    //     _changeColor(x,y+1)
    //     _changeColor(x,y-1)

    // }
    // 模拟栈
    function _changeColor(x, y) {
        const stack = []
        stack.push({ x, y })
        // 是否合理可以入栈
        function is_reasonable(x, y) {
            if (x < 0 || x > cvs.width || y < 0 || y > cvs.height) {
                return false
            }
            // 对比颜色
            const color = getColor(x, y, imgData)
            // 颜色不相近
            if (diff(color, clickColor) > 100) {
                return false
            }
            if (diff(color, whiteColor) == 0) {
                return false
            }
            return true
        }
        while (stack.length > 0) {
            const {x,y} = stack.pop()
            // 获取当前索引，染色
            const index = getIndex(x,y)
            imgData.data.set(whiteColor,index)
            // 向四面扩散
            if (is_reasonable(x-1,y)){
                stack.push({x:x-1,y})
            }
            if (is_reasonable(x+1,y)){
                stack.push({x:x+1,y})
            }
            if (is_reasonable(x,y+1)){
                stack.push({x,y:y+1})
            }
            if (is_reasonable(x,y-1)){
                stack.push({x,y:y-1})
            }

        }
    }

    _changeColor(x, y)
    // 将修改应用到页面
    ctx.putImageData(imgData, 0, 0)

})

// 获取所在点在数组中的坐标
function getIndex(x, y) {
    return (y * cvs.width + x) * 4
}
// 获取某个像素点的颜色
function getColor(x, y, imgData) {
    const index = getIndex(x, y)
    return [
        imgData.data[index],
        imgData.data[index + 1],
        imgData.data[index + 2],
        imgData.data[index + 3]
    ]
}
// 判断两个颜色是否相近
function diff(color1, color2) {
    return Math.abs(color1[0] - color2[0]) +
        Math.abs(color1[1] - color2[1]) +
        Math.abs(color1[2] - color2[2]) +
        Math.abs(color1[3] - color2[3])
}