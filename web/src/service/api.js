import { get, post } from "./http"
import moment from "moment"
import urlPrefix from "./url"

// 获取构建筑物信息
export const getBuildings = async () => {
    return await get('/business/buildmapping/getList')
}
// 获取scenetree.json 文件
export const getScenetree = async () => {
    return await get('/business/scene/getScenetree')
}
// 获取首页logo等信息
export const getProjectDetail = async () => {
    return await get('/system/dict/data/getProjectDetail')
}
// 获取报警信息
export const getAlarmInfo = async () => {
    return await get('/socket/pushAlarmInfo')
}

// 获取菜单列表
export const getMenuList = async () => {
    return await get('/business/loginmenu/getMean')
}

// 获取视角列表
export const getVisualData = async () => {
    return await get('/business/angle/getVisualData')
}

// 获取厂区定位信息
export const getPlantData = async () => {
    return await get('/business/location/getPlantData')
}

// 获取人员列表
export const getAllPeoplePostions = async (data) => {
    return await get(urlPrefix.poepleListUrl, data)
}
// 获取人员鸟瞰参数
export const getPersonData = async () => {
    return await get("/business/personparam/getPersonData")
}
// 获取视频列表
export const getVideoList = async () => {
    return await get("/business/info/getVideoData")
}
// 获取视频流
export const getVideoStream = async (cameraIp) => {
    return await post("/tool/video/cameras", { cameraIp })
}
// 获取煤流动画
export const getCoalLayerData = async () => {
    return await get("/business/coallayer/getCoalLayerData")
}
// 获取煤流水动画
export const getSlimeWaterData = async () => {
    return await get("/business/slimewater/getSlimeWaterData")
}
// 获取设备列表
export const getDeviceList = async () => {
    return await get("/business/equipinfo/getEquipData")
}
//根据编号-》获取设备实时数据
export const getRealTimeByNo = async (equipNo) => {
    return await get('business/equiptag/getDynamicInfo', { equipNo, starttime: moment().subtract(1, 'days').format("YYYY-MM-DD"), endtime: moment().format("YYYY-MM-DD") })
}
//根据编号-》获取设备历史数据
export const getHistoryByNo = async (equipNo, days = 7) => {
    return await get('business/equiptag/getDynamicHistoryInfo', { equipNo, starttime: moment().subtract(days, 'days').format("YYYY-MM-DD"), endtime: moment().format("YYYY-MM-DD") })
}
//根据tag标签-》 获取历史设备状态列表
export const getRealTimeDevice = async (tagstr) => {
    return await get('interface/call/getEquipHistoryData', { tagstr, starttime: moment().subtract(1, 'days').format("YYYY-MM-DD"), endtime: moment().format("YYYY-MM-DD") })
}
// 获取实时设备详情
export const getDeviceDetail = async (devno) => {
    return await get('/interface/call/getEquipDetailData', { devno })
}

// 模拟巡检接口 菜单id =12
export const getManyouList = async (meanId) => {
    return await get("/business/line/getInspectionLine", { meanId })
}

// 工艺系统接口 菜单id =19
export const getGongYiList = async (meanId) => {
    return await get("/business/system/getProcessData", { meanId })
}

// 仓储配煤接口 菜单id =21
export const getStorageList = async (meanId) => {
    return await get("/business/storage/getStorageData", { meanId })
}

// 系统安全接口 
export const getSafeList = async () => {
    return await get("/business/systemsafety/getSafetyData")
}