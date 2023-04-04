// louis 的配置
const config = {
    apiUrl: "https://dbookmarket.com:56789/api/v1/", // 接口地址
    websocketUrl: (token) => `wss://dbookmarket.com:56789/ws/notifications?token=${token}`, // 接口地址
}

export default config