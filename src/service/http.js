import axios from 'axios';
import message from "../assets/lib/resetMessage"
import urlPrefix from "./url"
import cache from "../assets/lib/cache"
import router from "../router"
const app = {
    $message: message
}
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();  //实例化
let cancelToken = axios.CancelToken;//取消api
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let removePending = config => {
    pending.find((item, i) => {
        //判断当前请求数组中是否存在相同请求地址的接口
        if (item.u === config.url + "&" + config.method) {
            pending[i].c(); //执行取消方法
            pending.splice(i, 1); //把这条记录从数组中移除
            return true;
        }
    })
};
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
const service = axios.create({
    baseURL: urlPrefix.apiUrl,
    timeout: 50000,
    withCredentials: true,
    // responseType: "json",
    // headers: {
    //     "Content-Type": "application/json;charset=utf-8",
    //     "Cache-Control": "no-cache",
    // }
});
console.log(service.defaults)
// service.defaults.xsrfCookieName = 'csrftoken'
// service.defaults.xsrfHeaderName = 'X-CSRFToken'
service.interceptors.request.use(
    async config => {
        removePending(config); //在一个ajax发送前执行一下取消操作
        config.cancelToken = new cancelToken(c => {
            // 传入对比参数 和 取消方法
            pending.push({ u: config.url + "&" + config.method, c });
        });
        const token = cache.get("token")
        token && (config.headers.Authorization = "Bearer " + token)
        // config.headers["X-CSRFToken"] = token;
        return config;
    },
    error => {
        return Promise.reject();
    }
);
const dealBulkData = responseBody => {
    const ctx = { ready: true, data: null }
    if (responseBody && responseBody.hasOwnProperty("data")) {
        ctx.data = responseBody.data
    } else {
        ctx.data = responseBody
    }
    return ctx;
};
service.interceptors.response.use(
    async response => {
        if (response.status > 199 && response.status < 300) {
            // IE 8-9
            if (response.data == null && response.config.responseType === 'json' && response.request.responseText != null) {
                try {
                    // eslint-disable-next-line no-param-reassign
                    response.data = JSON.parse(response.request.responseText);
                } catch (e) {
                    // ignored
                }
            }
            if (response.data) {
                return dealBulkData(response.data);
            }
            const headers = response.headers;
            if (headers['content-disposition']) {
                // 文件下载
                const filename = headers['content-disposition'].split(';')[1].split('=')[1];
                const contentType = headers['content-type'];
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([response.data], {
                        type: contentType
                    });
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);
                    if (typeof (MouseEvent) == 'function') {
                        var event = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(event);
                    } else if (navigator.appVersion.toString().indexOf('.NET') > 0) {
                        window.navigator.msSaveBlob(blob, filename);
                    }

                } catch (err) {
                    Promise.reject();
                }
            }
            return dealBulkData(null);
        } else {
<<<<<<< HEAD:src/service/http.js
            window.hideLoading()
            if (response.status === 403) {
                cache.clear()
                router.push({ path: '/' })
            }
=======
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/service/http.js
            return Promise.reject();
        }
    },
    err => {
<<<<<<< HEAD:src/service/http.js
        hideLoading();
        console.log(err)
=======
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/service/http.js
        // 请求被取消了，响应器也会走错误流程，这里返回一下自定义格式
        if (err) {
            // if(err.config && err.config.headers.showLoading !== false) {
            //   hideLoading();
            // }
            if (err.code === "ECONNABORTED") {
                app.$message.error(`接口：${err.config.url} ，请求超时！`);
            }
            else if (err.response) {
                let errorMsg = ''
                const msgData = err.response.data || {}
                if (Object.prototype.toString.call(msgData) === '[object Object]') {
                    const keys = Object.keys(msgData)
                    const values = Object.values(msgData)
                    if (values.length > 0) {
                        values.map((msgArr, index) => {
                            if (Array.isArray(msgArr)) {
                                errorMsg = keys[index] + ": " + JSON.stringify(msgArr[0])
                            } else {
                                errorMsg = keys[index] + ": " + JSON.stringify(msgArr)
                            }
                        })
                    }
                }
                if (errorMsg) {
                    // window.hideLoading()
                    app.$message.error(errorMsg)
                    if ([401, 403].includes(err.response.status)) {
                        cache.clear()
                        router.push({ path: '/' })
                    }
                    return Promise.reject(errorMsg);
                } else {
                    switch (err.response.status) {
                        case 400: app.$message.error(`error 400 !`); break;
                        case 401:
                            app.$message.error('未授权，请登录');
                            cache.clear()
                            router.push({ path: '/' })
                            break;
                        case 403: app.$message.error('拒绝访问'); break;
                        case 404: app.$message.error(`请求地址出错`); break;
                        case 408: app.$message.error('请求超时'); break;
                        case 500: app.$message.error(err.response.statusText); break;
                        case 501: app.$message.error('服务未实现'); break;
                        case 502: app.$message.error('网关错误'); break;
                        case 503: app.$message.error('系统异常'); break;
                        case 504: app.$message.error('网关超时'); break;
                        case 505: app.$message.error('HTTP版本不受支持'); break;
                        default:
                            app.$message.error('未知错误'); break;
                    }
                }

            } else {
                // console.log(err.message, JSON.stringify(err))
                // message.error(err.message)
            }
        } else {
            message.error("error 500")
        }
    }
);

const errorHandler = (error) => {
    window.hideLoading()
    return Promise.reject('error,' + error);
};
/**
 * @param url$
 * @param params
 * @param config
 */
export const get = async (url, config = {}) => {
<<<<<<< HEAD:src/service/http.js
    return service.get(url, config.headers ? config : { params: config }).then((res) => res, (err) => errorHandler(err));
=======
    return  service.get(url, config.headers ? config : { params: config }).then((res) => res, (err) => errorHandler(err));
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/service/http.js
};
export const post = (url, data, config) => {
    return service.post(url, data, config).then((res) => res, (err) => errorHandler(err));
};
export const del = (url, config) => {
    return service.delete(url, config).then((res) => res, (err) => errorHandler(err));
};
export const put = (url, data, config) => {
    return service.put(url, data, config).then((res) => res, (err) => errorHandler(err));
};

export const patch = (url, data, config) => {
    return service.patch(url, data, config).then((res) => res, (err) => errorHandler(err));
};
