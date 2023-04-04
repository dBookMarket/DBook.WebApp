// 先将图片链接、本地图片转为Base64
export function imageUrlToBase64(imageUrl, callback) {
  let image = new Image() // 一定要设置为let，不然图片不显示
  image.setAttribute('crossOrigin', 'anonymous') // 解决跨域问题
  image.src = imageUrl  // 如果是本地图片替换为 image.src = imageUrl
  image.onload = () => {
    var canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    var quality = 0.8
    var dataURL = canvas.toDataURL("image/jpeg", quality) // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
    callback(base64toFile(dataURL))
  }
}
//   再将base64转为文件流
function base64toFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  let file = new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
  console.log(file)
  return file
}
<<<<<<< HEAD:src/assets/lib/util.js
=======

>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/assets/lib/util.js
// 校验大于等于0 的整数
export function validateNumber(num) {
  var regNumber = /^\+?[1-9][0-9]*$/;
  return regNumber.test(num)
  if (regNumber.test(num) == false) {
    alert("充值金额必须大于0");
    return false;
  }
}
<<<<<<< HEAD:src/assets/lib/util.js
export function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}
=======

>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/assets/lib/util.js
