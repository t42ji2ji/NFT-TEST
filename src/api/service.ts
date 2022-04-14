import axios from "axios" // 引入axios

// const BASE_URL = process.env.VUE_APP_BASE_URL
const service = axios.create({
  // baseURL: BASE_URL,
  timeout: 99999,
})

service.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {}
    }
    if (!config.headers["Content-Type"]) {
      config.headers["X-Forwarded-For"] = "127.0.0.1"
      config.headers["Content-Type"] = "application/json"
      config.data = JSON.stringify(config.data)
    }

    return config
  },
  (error) => {
    console.log("request error", error)
    return error
  }
)

service.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 403: {
          const originalRequest = err.config
          console.log("Token失效, 請重新登錄")
          break
        }
        case 404:
          console.log("找不到該頁面")
          break
        case 500:
          console.log("伺服器出錯")
          break
        case 503:
          console.log("服務失效")
          break
        default:
          console.log(`連接錯誤${err.response.status}`)
      }
    } else {
      console.log("連接到服務器失敗")
    }
    console.log(err)
    return Promise.resolve(err.response)
  }
)

export default service
