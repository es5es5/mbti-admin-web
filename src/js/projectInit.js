/**
 * Project Init Setting
 * wrtie date: 2019-03-02
 */
import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import { NODE_ENV, ENV_PINES } from '@/../colony-vue/src/js/env'

const project = {
  token: Vue.cookie.get('auth-token'),
  axiosStatus: true,
  init () {
    return new Promise((resolve, reject) => {
      this.setAxios().then(() => {
        this.getUser()
          .then(this.getAuthRoles)
          .then(() => {
            return resolve()
          }).catch((error) => {
            return reject(new Error(error))
          })
      })
    })
  },
  /**
   * http request setting
   *
   * @returns
   */
  setAxios () {
    return new Promise((resolve, reject) => {
      if (this.token) {
        axios.defaults.headers.common.Authorization = this.token

        axios.interceptors.request.use(config => {
          const httpToken = config.headers.common.Authorization || this.token

          if (!httpToken) {
            this.goLogin()
            return
          }

          return config
        }, error => {
          return reject(error)
        })

        axios.interceptors.response.use(config => {
          if (this.axiosStatus) {
            this.axiosStatus = true
          }

          return config
        }, error => {
          const errors = error.response
          if (!errors && this.axiosStatus) {
            alert('Network Error : 잠시 후 다시 시도해주세요')
            this.axiosStatus = false
          } else {
            const status = errors.status
            switch (status) {
              case 500:
                if (NODE_ENV === 'development') {
                  alert('Server Error : console을 확인해주세요')
                  console.log(`### ERROR :: ${errors.data.error}`)
                  console.log(`### STATUS :: ${errors.data.status}`)
                  console.log(`### PATH :: ${errors.data.path}`)
                  console.log(`### EXCEPTION :: ${errors.data.exception}`)
                  console.log(`### MESSAGE :: ${errors.data.message}`)
                }
                break
              case 401:
                this.$http.defaults.headers.common.Authorization = ''
                this.$http.defaults.headers.common['Authorization-v2'] = ''
                // this.$nextTick(() => {
                //   this.goLogin()
                // })
                break
            }
          }
          return reject(error)
        })
      } else {
        this.goLogin()
      }
      return resolve()
    })
  },
  goLogin () {
    if (NODE_ENV === 'development') {
      alert('테스트서버는 http://test.inplat.kr:10014 \n로그인하신 후 이용가능합니다.')
      location.href = 'http://test.inplat.kr:10014/login'
    } else {
      alert('인증 정보가 유효하지 않거나 만료되었습니다.\n해당 경고문구가 계속 나타날 경우, 로그인 화면에서 \'Ctrl + F5\' 키를 눌러\n새로고침 후 다시 시도해주세요')
      location.href = 'https://otc.peoplelife.co.kr/login'
    }
  },
  /**
   * 유저 정보 조회
   *
   * @returns
   */
  getUser () {
    return new Promise((resolve, reject) => {
      if (!store.getters.getUser.employeeNumber) {
        const data = {}

        const apiURL = `${ENV_PINES}/auth/user`

        axios({
          method: 'get',
          url: apiURL,
          data: data
        }).then(result => {
          store.commit('setUser', result.data.contents)
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

      const apiURL = `${ENV_PINES}/auth/roles`

      axios({
        method: 'get',
        url: apiURL,
        data: data
      }).then(result => {
        store.commit('setAuthRoles', result.data.contents)
        return resolve()
      })
    })
  }
}

export default project
