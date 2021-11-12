export default {
  install (Vue) {
    Vue.component('Pagination', () => import('./_element/Pagination'))
    Vue.component('NoDataMessage', () => import('./_element/NoDataMessage'))

    Vue.component('TitleTab', () => import('./_element/TitleTab'))
    Vue.component('DetailTab', () => import('./_element/DetailTab'))
    Vue.component('SubTab', () => import('./_element/SubTab'))
    Vue.component('Tooltip', () => import('./_element/Tooltip'))
    Vue.component('Confirm', () => import('./_element/Confirm'))
    Vue.component('Legend', () => import('./_element/Legend'))
  }
}
