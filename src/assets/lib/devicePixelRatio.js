class DevicePixelRatio {
    constructor() {
        // this.flag = false;
    }
    // 获取系统类型
    _getSystem() {
        let flag = false;
        var agent = navigator.userAgent.toLowerCase();
        //		var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
        //		if(isMac) {
        //			return false;
        //		}
        // 现只针对windows处理，其它系统暂无该情况，如有，继续在此添加
        if (agent.indexOf('windows') >= 0) {
            return true;
        }
    }
    // 获取页面缩放比例
    //	_getDevicePixelRatio() {
    //		let t = this;
    //	}
    // 监听方法兼容写法
    _addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }
    // 校正浏览器缩放比例
    _correct() {
        let t = this;
        // 页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
        // document.getElementsByTagName('body')[0].style.zoom = 1 / window.devicePixelRatio;
        // const scrollHeight = 100 * (1 + 1 / window.devicePixelRatio)
        // document.getElementById("app").style.height = `${100 * window.devicePixelRatio}vh`
        // document.getElementsByTagName('body')[0].style.setProperty('--scrollHeight', `${100 * window.devicePixelRatio}vh`)
        // document.getElementsByTagName('body')[0].style.setProperty('--scrollHeight', `${scrollHeight}vh`)
    }
    // 监听页面缩放
    _watch() {
        let t = this;
        t._addHandler(window, 'resize', function () { // 注意这个方法是解决全局有两个window.resize
            // 重新校正
            t._correct()
        })
    }
    // 初始化页面比例
    init() {
        let t = this;
        if (t._getSystem()) { // 判断设备，目前只在windows系统下校正浏览器缩放比例
            // 初始化页面校正浏览器缩放比例
            t._correct();
            // 开启监听页面缩放
            t._watch();
        } else {
            // mac 系统
            const baseSize = 16
            // 设置 rem 函数
            function setRem() {
                // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
                // const scale = document.documentElement.clientWidth / 750
                const scale = document.documentElement.clientWidth / 1920
                // 设置页面根节点字体大小
                document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
            }
            // 初始化
            setRem()
            // 改变窗口大小时重新设置 rem
            window.onresize = function () {
                setRem()
            }
        }
    }
}
export default DevicePixelRatio;

