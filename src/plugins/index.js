import Vue from 'vue'

import './toast'
import './loader'
import './veeValidate'

import VueCookie from 'vue-cookie'

// https://github.com/euvl/vue-js-modal
import VModal from 'vue-js-modal'

// https://chronotruck.github.io/vue-ctk-date-time-picker/
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

Vue.use(VModal)
Vue.use(VueCookie)
Vue.component('DatePicker', VueCtkDateTimePicker)
