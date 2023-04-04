// import url from "../service/url"
// import Stomp from "stompjs";
import message from "../assets/lib/resetMessage"
export default class SocketService {
    static instance = null;
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance;
    }
    // 和服务端连接的socket对象
    ws = null;
    // 存储回调函数
    callBackMapping = {};
    // 标识是否连接成功
    connected = false;
    // 记录重试的次数
    sendRetryCount = 0;
    // 重新连接尝试的次数
    connectRetryCount = 0;
    connect(webSocketUrl, callBack) {
        console.log(webSocketUrl)
        // 连接服务器
        if (!window.WebSocket) {
            return console.log('您的浏览器不支持WebSocket');
        }
        // 实例化socket
        const socket = new WebSocket(webSocketUrl)
        // 监听socket连接
        socket.onopen = (open) => {
            console.log("WebSocket ->>>>>>>>>>>>>>>>>>  open")
        }
        // 监听socket错误信息
        socket.onerror = (err) => {
            console.log(err)
        }
        // 监听socket消息
        socket.onmessage = callBack
    }
    close() {
        this.ws.close()
        this.connected = false
    }
}

