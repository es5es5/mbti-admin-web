<template>
  <header id="header">
    <div class="header_wrap">
      <div class="right">
        <!-- <img src="@/assets/images/header/bell.svg" alt="bell" class="headerImg bell" @click="toggleSetting" /> -->
        <img src="@/assets/images/header/user.svg" alt="user" class="headerImg user" @click="toggleSetting" />
        <span class="employeeName" @click="toggleSetting">{{ mixinUser.nameBase }} ({{ mixinUser.deptName }}) 님</span>
        <img src="@/assets/images/header/3dots.svg" alt="3dots" class="headerImg 3dots" @click="toggleSetting" />
      </div>

      <div class="setting_wrap" :class="isSettingOpen ? 'open' : ''">
        <ul class="setting">
          <!-- <li class="setting-item" @click="showModalEmptySample">
            명세서
          </li> -->
          <li class="setting-item" @click="signout">
            로그아웃
          </li>
        </ul>
      </div>
    </div>
    <ModalEmptySample />
  </header>
</template>

<script>
import ModalEmptySample from './ModalEmptySample'

export default {
  name: 'Header',
  data () {
    return {
      isSettingOpen: false
    }
  },
  components: {
    ModalEmptySample
  },
  methods: {
    toggleSetting () {
      this.isSettingOpen = !this.isSettingOpen
    },
    showModalEmptySample () {
      this.$modal.show('ModalEmptySample')
    },
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

<style lang="scss" scoped>
#header {
  float: left;
  width: calc(100% - 180px);
  height: 50px;
  background-color: #fff;
}

.header_wrap {
  position: relative;
  padding: 14px 8px;

  .right {
    text-align: right;
    -ms-user-select: none; -moz-user-select: -moz-none; -webkit-user-select: none; -khtml-user-select: none; user-select:none;
  }

  .headerImg {
    @include hover;
    &.bell { margin-right: 15px; }
    &.user { margin: 0 5px; }
    vertical-align: middle;
    line-height: 25px;
  }

  .employeeName {
    @include hover;
    display: inline-block;
    text-align: left;
    min-width: 100px;
    line-height: 25px;
    font-size: 12px;
    vertical-align: middle;
    margin: 0 10px;
  }

  .setting_wrap {
    display: none;
    z-index: 5000;
    padding: 3px;
    position: absolute;
    right: 10px;
    width: 190px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);

    transition: all .5s;
    top: 40px;
    opacity: 0;
    &.open {
      display: block;
      opacity: 1;
      top: 60px;
    }

    .setting {
      .setting-item {
        text-align: left;
        padding: 12px 16px;
        font-size: 12px;
        border-bottom: 1px solid rgba($border, .25);

        &:hover {
          cursor: pointer;
          color: $primary;
          background-color: $primary-hover;
        }
      }
      :last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
