/**
 * 重置message，防止重复点击重复弹出message弹框
 */
import { ElMessage } from "element-plus"
const $Message = ElMessage
const showMessage = Symbol("showMessage")
let messageInstance = null
class DoneMessage {
  [showMessage](type, options, single) {
    if (messageInstance && single) {
      messageInstance.close()
    }
    messageInstance = $Message[type](options)
  }
  info(options, single = true) {
    this[showMessage]("info", options, single)
  }
  warning(options, single = true) {
    this[showMessage]("warning", options, single)
  }
  error(options, single = true) {
    this[showMessage]("error", options, single)
  }
  success(options, single = true) {
    this[showMessage]("success", options, single)
  }
}
export default new DoneMessage()
