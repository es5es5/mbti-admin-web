<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <vue-progress-bar />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.commit('setUser', {
      employeeNumber: '1104899',
      deptName: 'IT지원본부',
      nameBase: '김루이',
    })
    this.$store.commit('setAuthRoles', ['ROLE_ADMIN'])
    // this.initProtocalPlugins()
    // // 쿠키 체크 후, 로그인 정보 없으면 router에 의해 login으로 보내짐
    // if (!this.$cookie.get('auth-token') && !this.$cookie.get('Authorization-v2')) {
    //   this.init = true
    //   return false
    // }

    // this.setAxios()
    //   .then(this.getUser)
    //   .then(this.getAuthRoles)
    // this.getCommonCodes()
  },
  methods: {
    loadScripts (plugins) {
      return new Promise((resolve, reject) => {
        if (window[plugins.name] && window[plugins.name]) {
          return resolve()
        }

        const script = document.createElement('script')
        script.async = true
        script.charset = 'utf-8'
        if (location.protocol === 'https:') {
          script.src = plugins.https
        } else {
          script.src = plugins.http
        }

        const dom = document.head ||
          document.getElementsByTagName('head')[0] ||
          document.body ||
          document.getElementsByTagName('body')[0]

        dom.appendChild(script)

        return resolve()
      })
    },
    initProtocalPlugins () {
      const protocolPluginList = [{
        name: 'daum',
        https: 'https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js?autoload=false',
        http: 'http://dmaps.daum.net/map_js_init/postcode.v2.js?autoload=false'
      }]
      protocolPluginList.forEach(item => {
        this.loadScripts(item)
      })
    },
    setAxios () {
      return new Promise((resolve, reject) => {
        const COOKIE_TOKEN_V1 = this.$cookie.get('auth-token')
        const COOKIE_TOKEN_V2 = this.$cookie.get('Authorization-v2')

        if (COOKIE_TOKEN_V1) {
          this.$http.defaults.headers.common.Authorization = COOKIE_TOKEN_V1
        }
        if (COOKIE_TOKEN_V2) {
          this.$http.defaults.headers.common['Authorization-v2'] = COOKIE_TOKEN_V2
        }

        this.$http.interceptors.request.use(config => {
          return config
        }, error => {
          return reject(error)
        })

        this.$http.interceptors.response.use(config => {
          return config
        }, error => {
          const errors = error.response

          if (this.axiosStatus) {
            this.axiosStatus = false

            if (!errors) {
              alert('Network Error : 잠시 후 새로고침 한 뒤 다시 시도해주세요')
            } else {
              switch (errors.status) {
                case 400:
                  alert('잘못된 요청입니다. 관리자에게 문의해주세요.')
                  return reject(new Error(errors))
                case 401:
                  alert('인증 정보가 유효하지 않거나 만료되었습니다.')
                  this.signout()
                  return reject(new Error(errors))
                case 403:
                  // alert('T시스템은 피플라이프 직원만 사용 가능합니다')
                  this.init = true
                  this.$nextTick(() => {
                    this.$router.replace('/deny')
                  })
                  return reject(new Error(errors))
                case 500:
                  if (!this.COMMON.projectEnvOps()) {
                    alert('Server Error : console을 확인해주세요')
                    console.error(`### ERROR :: ${errors.data.error}`)
                    console.error(`### STATUS :: ${errors.data.status}`)
                    console.error(`### PATH :: ${errors.data.path}`)
                    console.error(`### EXCEPTION :: ${errors.data.exception}`)
                    console.error(`### MESSAGE :: ${errors.data.message}`)
                  }
                  return reject(new Error(errors))
              }
            }
          }

          return reject(new Error(errors))
        })

        return resolve()
      })
    },
    /**
     * 공통 코드 조회
     */
    getCommonCodes () {
      const data = {}

      const apiURL = `${this.ENV_PINES}/pines/commons/codes`

      this.$http({
        method: 'get',
        url: apiURL,
        data: data
      }).then(result => {
        this.$store.commit('setCommonCodes', result.data.contents)
      })
    },
    /**
     * 유저 정보 조회
     *
     * @returns
     */
    getUser () {
      return new Promise((resolve, reject) => {
        if (!this.$store.getters.getUser.employeeNumber) {
          const data = {}

          const apiURL = `${this.ENV_PINES}/auth/user`

          this.$http({
            method: 'get',
            url: apiURL,
            data: data
          }).then(result => {
            this.$store.commit('setUser', result.data.contents)
            return resolve()
          }).catch(error => {
            console.error(error)
          })
        } else {
          return resolve()
        }
      })
    },
    /**
     * 유저 권한(role) 조회
     *
     * @returns
     */
    getAuthRoles () {
      return new Promise((resolve, reject) => {
        const data = {}

        const apiURL = `${this.ENV_PINES}/auth/roles`

        this.$http({
          method: 'get',
          url: apiURL,
          data: data
        }).then(result => {
          this.$store.commit('setAuthRoles', result.data.contents)
          return resolve()
        }).catch(error => {
          console.error(error)
        })
      })
    },
    // 로그아웃
    signout () {
      const apiURL = `${this.ENV_AUTH}/auth/sign-out`

      const data = {}

      this.$http({
        method: 'post',
        url: apiURL,
        withCredentials: true,
        data
      }).then(result => {
        this.$http.defaults.headers.common.Authorization = ''
        this.$http.defaults.headers.common['Authorization-v2'] = ''

        location.href = '/login'
      }).catch(error => {
        console.error(new Error(error))
      })
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active { transition: opacity 1s }

.fade-enter,
.fade-leave-to { opacity: 0 }

@import '@/../colony-vue/src/assets/scss/reset.scss';
@import '@/../colony-vue/src/assets/scss/common.scss';
// @import '@/../colony-vue/src/assets/scss/grid.scss';
@import '@/assets/scss/reset.scss';
@import '@/assets/scss/contents.scss';
@import '@/assets/scss/search.scss';
@import '@/assets/scss/form.scss';
@import '@/assets/scss/table.scss';
@import '@/assets/scss/button.scss';
@import '@/assets/scss/modal.scss';
@import '@/assets/scss/tree.scss';
@import '@/assets/scss/tooltip.scss';
</style>
