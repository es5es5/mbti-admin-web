export default {
  install (Vue) {
    Vue.mixin({
      mounted () {
      },
      data () {
        return {
          searchLabel: 'close'
        }
      },
      computed: {
        mixinRouteMetaGoList () { return this.$route.meta ? this.$route.meta.goList : false },
        mixinRouteMetaGoBack () { return this.$route.meta ? this.$route.meta.goBack : false },
        mixinRouteMetaTitle () { return this.$route.meta ? this.$route.meta.title : '' },
        mixinUser () { return this.$store.getters.getUser },
        mixinUserRoles () { return this.$store.getters.getRoles }
      },
      methods: {
        getJitsiENV (service) {
          if (service === '상담') {
            switch (process.env.NODE_ENV) {
              case 'development':
                return {
                  domain: 'conference-test-0.peoplelife.co.kr',
                  API: 'https://conference-test-0.peoplelife.co.kr/external_api.js'
                }
              case 'production':
                return {
                  domain: 'conference1.peoplelife.co.kr',
                  API: 'https://conference1.peoplelife.co.kr/external_api.js'
                }
            }
          } else if (service === '회의') {
            switch (process.env.NODE_ENV) {
              case 'development':
                return {
                  domain: 'conference-test-0.peoplelife.co.kr',
                  API: 'https://conference-test-0.peoplelife.co.kr/external_api.js'
                }
              case 'production':
                return {
                  domain: 'conference2.peoplelife.co.kr',
                  API: 'https://conference2.peoplelife.co.kr/external_api.js'
                }
            }
          }
        },
        toggleLabel () {
          switch (this.searchLabel) {
            case 'open':
              this.searchLabel = 'close'
              break
            case 'close':
              this.searchLabel = 'open'
              break
          }
        },
        /**
         * 숫자를 입력받았을때 공백/undefined/null/Nan 을 0으로 반환
         * @param {number} value 공백 처리할 숫자
         * @return {number} 공백/undefined/null/Nan 일 경우 0으로 반환
         */
        nanException (value) {
          if (value === '' || value === undefined || value === null || isNaN(value)) {
            return 0
          } else if (value >= 0 || value <= 0) {
            return value
          } else {
            return 0
          }
        },
        /**
         * 현재 페이지 관리자 권한 조회
         * @param { String } urlName
         */
        $getAuthAdmin (urlName) {
          return new Promise((resolve, reject) => {
            const data = {}

            const apiURL = `${this.ENV_PINES}/settings/authority-menu/menu-list`
            const apiSearch = `?urlName=${urlName}`

            this.$http({
              method: 'get',
              url: apiURL + apiSearch,
              data: data
            }).then(result => {
              const menu = {
                admin: result.data.contents[0].menuAdmins
              }
              resolve(menu)
            }).catch(error => {
              console.error(error)
            })
          })
        },
        /**
         * 생년월일 포맷
         */
        $getBirthdayFormat (birthdayObject) {
          let value = birthdayObject.value.replace(/-/g, '')
          value = value.replace(/\D/gi, '')
          var result = value
          if (!result || isNaN(result)) {
            birthdayObject.value = ''
            return ''
          }

          if (value.length > 4) {
            result = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8)
          }

          if (value.length > 9) {
            result = value.substring(0, 8)
          }

          return result
        },
        /**
         * 콤마 포맷
         */
        $getComma (CommaObject) {
          let value = CommaObject.value

          if (!value) { return '' }

          const patten = /[^\d,-]/g

          if (patten.test(value)) {
            value = value.replace(patten, '')
            CommaObject.value = value
            return value
          }

          if (value.substr(0, 1) === '-') {
            value = '-' + Number(value.replace(/[,-]/g, ''))
          } else {
            value = Number(value.replace(/[,-]/g, ''))
          }

          const result = value.toLocaleString('en').split('.')[0]
          return result
        },
        sortField (field) {
          if (!field) {
            console.warn('field is not found')
            return false
          }
          if (!this.sortForm) {
            console.warn('sortForm is not found')
            return false
          }

          if (this.sortForm[field] === 'asc' || (this.sortForm[field] !== 'desc' && this.sortForm[field] !== 'asc')) {
            this.sortTableData.sort(function (a, b) { return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0 })
            for (const key in this.sortForm) { this.sortForm[key] = '' }
            this.sortForm[field] = 'desc'
          } else {
            this.sortTableData.sort(function (a, b) { return a[field] > b[field] ? -1 : a[field] < b[field] ? 1 : 0 })
            for (const key in this.sortForm) { this.sortForm[key] = '' }
            this.sortForm[field] = 'asc'
          }
        },
        filterField (filterName) {
          if (!filterName) {
            console.warn('filterName is not found')
            return false
          }
          if (!this.filterList) {
            console.warn('filterList is not found')
            return false
          }

          const filteringArray = this.filterList.filter(item => item.value === true).map(item => item.label)
          let found, td, i, j
          const table = document.getElementById('myTable')
          const tr = table.getElementsByTagName('tr')
          if (!filteringArray || filteringArray === [] || filteringArray.length < 1) {
            for (i = 0; i < tr.length; i++) { tr[i].style.display = 'table-row' }
            return false
          } else {
            for (i = 0; i < tr.length; i++) {
              td = tr[i].getElementsByTagName('td')

              for (j = 0; j < td.length; j++) {
                found = filteringArray.every(filter => td[j].innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1)
                if (found) break
              }

              if (found) {
                tr[i].style.display = 'table-row'
                found = false
              } else {
                tr[i].style.display = 'none'
                found = false
              }
            }
          }
        },
        filterField1 (filterName) {
          if (!filterName) {
            console.warn('filterName is not found')
            return false
          }
          if (!this.filterList) {
            console.warn('filterList is not found')
            return false
          }

          const filteringArray = this.filterList.filter(item => item.value === true).map(item => item.label)
          console.log('filteringArray', filteringArray)
          // let temp = []

          // filteringArray.forEach(filter => {
          //   temp = this.filterTableData.filter(item => {
          //     console.log(item[filterName])
          //     // return item[filterName] === filter
          //     return item[filterName].indexOf(filter) > -1
          //   })
          //   console.log('temp', temp)
          // })
          // this.filterTableData = temp
        },
        goBack () {
          this.$router.go(-1)
        }
      }
    })
  }
}
