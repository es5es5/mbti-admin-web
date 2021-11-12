<template>
  <aside id="sideBar">
    <!-- <div class="bookmark_wrap"></div> -->
    <router-link tag="h1" class="logo_wrap" to="/">
      <img src="@/assets/logo.svg" alt="logo" class="logoImg">
      <span class="logoTxt">MBTI</span>
    </router-link>
    <div class="menu_wrap">
      <ul class="menu">
        <template v-for="(menu, menuIndex) in menus">
          <template v-if="checkRoles(menu.roles)">
            <router-link v-if="menu.route" tag="a" class="menu-item" :to="{name: menu.route}" :key="`m_link_${menuIndex}`">
            <p class="menuTitle">
              <!-- <img :src="`@/assets/images/menu/${menu.icon}.svg`" :alt="menu.icon"> -->
              <img src="@/assets/images/menu/Distribution.svg" :alt="menu.icon" class="menuIcon">
              {{ menu.name }}
            </p>
            <ul class="subMenu" v-if="menu.subMenus && checkRoles(menu.roles)">
              <template v-for="(subMenu, subMenuIndex) in menu.subMenus" >
                <li v-if="checkRoles(subMenu.roles)" :key="`s_${subMenuIndex}`">
                  <router-link v-if="subMenu.route" tag="a" class="subMenu-item" :to="{name: subMenu.route}" :key="`ss_link_${subMenuIndex}`">
                    <p class="subMenuTitle">
                      <i class="fa" :class="`fa-${subMenu.icon}`"></i>
                      {{ subMenu.name }}
                    </p>
                  </router-link>
                </li>
              </template>
            </ul>
            </router-link>
            <li v-else class="menu-item" :key="`m_none_link_${menuIndex}`">
              <span>{{ menu.name }}</span>
            </li>
          </template>
        </template>
      </ul>
    </div>
  </aside>
</template>

<script>
import MENUS from '@/data/menus.js'

export default {
  name: 'SideBar',
  created () {
    console.log(this.menus)
  },
  data () {
    return {
      menus: MENUS
    }
  },
  computed: {
    _user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    checkRoles (value) {
      if (value === null || value === undefined || value === []) return true
      else {
        for (var vaArr of value) {
          if (this.mixinUserRoles.indexOf(vaArr) > -1) return true
        }
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#sideBar {
  float: left;
  width: 180px;
  min-height: 100vh;
  background-color: $theme;
}

.logo_wrap {
  cursor: pointer;
  padding: 10px 0;
  height: 50px;
  text-align: center;
  // max-height: 66px;

  .logoImg {
    display: inline-block;
    vertical-align: middle;
    height: 25px;
    margin: 0 7px;
  }

  .logoTxt {
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
  }
}

.menu_wrap {
  padding: 0 15px 50px 15px;
  overflow-y: scroll;
  max-height: calc(100vh - 80px);
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;

  .menuTitle {
    color: #fff;
    font-size: 14px;
    padding: 10px 0;
    margin: 5px 0;
    &.active { color: #00B3EC; }
    &:hover { color: #00B3EC; }
    border-bottom: 1px solid rgba(#fff, .1);
  }

  .menuIcon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: bottom;
  }

  .subMenu-item {
    &.active {
      .subMenuTitle {
        color: #00B3EC;
      }
    }
  }

  .subMenuTitle {
    color: #B9B9B9;
    font-size: 14px;
    padding: 5px 0 5px 30px;
    &:hover { color: #00B3EC; }
  }
}
</style>
