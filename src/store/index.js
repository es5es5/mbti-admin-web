import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    companies: [],
    auth_roles: [],
    show_loader: false,
    customerId: '',
    planId: '',
    saveYn: false,
    leftTab: '',
    productId: '',
    contractId: '',
    commonCodes: [],
    historyId: 0
  },
  mutations: {
    setAuthRoles (state, value) { state.auth_roles = value },
    setUser (state, value) { state.user = value },
    setCompanies (state, value) { state.companies = value },
    showLoader (state) {
      if (state.show_loader) {
        return
      }
      state.show_loader = true
    },
    hideLoader (state) {
      if (!state.show_loader) {
        return
      }
      state.show_loader = false
    },
    setCustomerId (state, value) { state.customerId = value },
    setSaveYn (state, value) { state.saveYn = value },
    setPlanId (state, value) { state.planId = value },
    setLeftTab (state, value) { state.leftTab = value },
    setProductId (state, value) { state.productId = value },
    setContractId (state, value) { state.contractId = value },
    setCommonCodes (state, value) {
      state.commonCodes = value
    },
    setHistoryId (state, value) { state.historyId = value }
  },
  getters: {
    getUser: state => state.user,
    getCompanies: state => state.companies,
    getRoles: state => state.auth_roles,
    getShowLoader: state => state.show_loader,
    getCustomerId: state => state.customerId,
    getSaveYn: state => state.saveYn,
    getPlanId: state => state.planId,
    getLeftTab: state => state.leftTab,
    getProductId: state => state.productId,
    getContractId: state => state.contractId,
    getHistoryId: state => state.historyId,
    getCommonCodes: state => parentCodeId => {
      return state.commonCodes.filter(item => item.parentCodeId === parentCodeId)
    }
  },
  actions: {
    hideLoader ({ commit }) {
      commit('hideLoader')
    }
  },
  modules: {
  }
})
