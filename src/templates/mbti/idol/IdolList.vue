<template>
  <main>
    <div class="search_wrap">
      <label for="">계약자</label>
      <input type="text" placeholder="계약자명">
      <span class="separator">|</span>

      <button type="button" class="btn-search" @click="getIdolList">검색</button>
    </div>
    <div class="action_wrap">
      <button type="button" class="btn primary" @click="showModalIdolCreate">등록</button>
      <!-- <button type="button" class="btn">엑셀다운로드</button> -->
    </div>
    <div class="table_wrap table-hover">
      <table>
        <caption>아이돌 리스트</caption>
        <colgroup>
          <col style="width: 10rem;">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Nick</th>
            <th scope="col">Company</th>
            <th scope="col">Gender</th>
            <th scope="col">Birthday</th>
            <th scope="col">Country</th>
            <th scope="col">Religion</th>
            <th scope="col">natalArea</th>
            <th scope="col">Group</th>
            <th scope="col">Mbti</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in idol" :key="index" @click="showModalIdolUpdate(item.id)">
            <td>{{ item.name }}</td>
            <td>{{ item.nick }}</td>
            <td>{{ item.company }}</td>
            <td>{{ item.gender }}</td>
            <td>{{ item.birthday }} ({{ getManAge(item.birthday) }})</td>
            <td>{{ item.country }}</td>
            <td>{{ item.religion }}</td>
            <td>{{ item.natalArea }}</td>
            <td>{{ item.group }}</td>
            <td>{{ item.mbti }}</td>
          </tr>
          <!-- <no-data-message :list="docList.contents" :colspan="24"></no-data-message> -->
        </tbody>
      </table>
      <!-- <Pagination
        :totalElement="parseInt(docList.totalElements)"
        :totalPages="searchForm.size"
        :activePage="searchForm.page"
        :callback="searchDocList">
      </Pagination> -->
      <span class="total">Total: {{ (idol.length || 0) | numberWithComma}}</span>
      <ModalIdolCreate @callback="getIdolList" />
      <ModalIdolUpdate :id="idolId" @callback="getIdolList" />
    </div>
  </main>
</template>

<script>
/* eslint-disable */
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '@/plugins/firebase'
import ModalIdolCreate from './ModalIdolCreate'
import ModalIdolUpdate from './ModalIdolUpdate'

export default {
  name: 'IdolList',
  created () {
    this.getIdolList()
  },
  components: {
    ModalIdolCreate,
    ModalIdolUpdate,
  },
  data () {
    return {
      idolId: '',
      idol: [],
      searchForm: {
        page: 0,
        size: 15,
      },
    }
  },
  computed: {
  },
  methods: {
    searchDocList (options) {
      const option = Object.assign({
        route: this.$route,
        router: this.$router,
        form: this.searchForm,
        callback: this.getDocList
      }, options)

      this.COMMON.searchPagination(option)
    },
    showModalIdolCreate() {
      this.$modal.show('ModalIdolCreate')
    },
    showModalIdolUpdate(idolId) {
      this.idolId = idolId
      this.$modal.show('ModalIdolUpdate')
    },
    goCreate () {
      this.$router.push({
        name: '계약_신계약_등록',
      })
    },
    goDetail (detailId) {
      this.$router.push({
        name: '계약_신계약_상세',
        params: {
          detailId
        }
      })
    },
    async getIdolList () {
      const list = []
      const querySnapshot = await getDocs(collection(firestore, process.env.VUE_APP_FIRESTORE_COLLECTION))
      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        })
      })
      this.idol = list
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
