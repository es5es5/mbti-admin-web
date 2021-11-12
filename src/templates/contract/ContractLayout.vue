<template>
  <main>
    <transition name="fade" mode="out-in">
      <TitleTab>
        <template v-slot:title><h1 class="title">{{ mixinRouteMetaTitle }}</h1></template>
        <template v-slot:tab>
          <router-link tag="a" :to="{name: '계약_신계약_리스트'}" class="tab-item">ContractList</router-link>
          <router-link tag="a" :to="{name: '계약_신계약_리스트2'}" class="tab-item">ContractList2</router-link>
        </template>
      </TitleTab>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </main>
</template>

<script>
export default {
  name: 'ContractLayout'
}
</script>

<style>

</style>
