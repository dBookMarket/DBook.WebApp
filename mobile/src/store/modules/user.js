const state = {
  user: {},
  cartsNumber: 0
}
const mutations = {
  SET_USER_INFO (state, resp) {
    state.user = resp
  },
  SET_CART_NUMBER (state, num) {
    state.cartsNumber = num
  }

}
const actions = {
  // 登陆
  login ({ commit }, params) {
    commit('SET_USER_INFO', params)
    commit('SET_CART_NUMBER', 88)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
