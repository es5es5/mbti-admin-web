import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'

import './plugins'

import { } from '@/../colony-vue/src/js/env'

import GlobalFilters from '@/../colony-vue/src/js/index'
import MIXSINS from './js/mixins'
import GlobalComponents from './components'
import COMMON from '@/../colony-vue/src/js/common'

Vue.use(MIXSINS)
Vue.use(GlobalComponents)
Vue.use(GlobalFilters)

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.COMMON = COMMON
Vue.prototype.$eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
