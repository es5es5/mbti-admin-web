<template>
  <main>
    <div class="search_wrap">
      <label for="">계약자</label>
      <input type="text" v-model="searchForm.contractor" placeholder="계약자명">
      <span class="separator">|</span>

      <button type="button" class="btn-search" @click="searchRequest()">검색</button>
    </div>
    <div class="action_wrap">
      <button type="button" class="btn primary" @click="goCreate">등록</button>
      <!-- <button type="button" class="btn">엑셀다운로드</button> -->
    </div>
    <div class="table_wrap table-hover">
      <table>
        <caption>계약체결확인서 리스트</caption>
        <colgroup>
          <col style="width: 10rem;">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">담당자</th>
            <th scope="col">계약자</th>
            <th scope="col">피보험자</th>
            <th scope="col">법인여부</th>
            <th scope="col">완료여부</th>
            <th scope="col">URL만료시간</th>
            <th scope="col">생성일</th>
            <th scope="col">비교설명서</th>
            <th scope="col">개인정보 처리 동의서</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in docList.contents" :key="index" @click="goDetail(item.id)">
            <td>{{ item.writer ? item.writer.nameBase : '' }}</td>
            <td>{{ item.contractor }}</td>
            <td>{{ item.insurant }}</td>
            <td>{{ item.isCorp =='T' ? '개인' : '법인'}}</td>
            <td>{{ item.finishFlag == false ? '진행중' : '완료' }}</td>
            <td>{{ item.enableTime | dateFormat('YYYY-MM-DD HH:mm') }}</td>
            <td>{{ item.createDate | dateFormat('YYYY-MM-DD HH:mm') }}</td>
            <td v-if="item.contractPrdt ? item.contractPrdt.classCd === '5' : false || item.contractPrdt ? item.contractPrdt.classCd === '4' : false">
              <button class="btn">미생성</button>
            </td>
            <td v-else-if="item.doc.finishFlag == false">진행중</td>
            <td @click.stop v-else>
              <button class="btn" >완료</button>
            </td>
            <td v-if="item.agreementFiles.finishFlag == false">진행중</td>
            <td @click.stop v-else>
              <button class="btn" >완료</button>
            </td>
          </tr>
          <no-data-message :list="docList.contents" :colspan="24"></no-data-message>
        </tbody>
      </table>
      <Pagination
        :totalElement="parseInt(docList.totalElements)"
        :totalPages="searchForm.size"
        :activePage="searchForm.page"
        :callback="searchDocList">
      </Pagination>
      <span class="total">Total: {{docList.totalElements | numberWithComma}}</span>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ContractList',
  created () {
    // this.searchDocList({ type: 'init' })
  },
  components: {
  },
  data () {
    return {
      searchForm: {
        page: 0,
        size: 15,
        sort: '',
        insureIds: '',
        contractor: '',
        class_id: '',
        type1: '',
        type2: '',
        startDate: '',
        endDate: '',
        finishFlag: ''
      },
      modal: {
        ModalDocCreate: {
          init: false
        },
        ModalDocUpdate: {
          id: ''
        }
      },
      docList: {},
      selectedDocId: ''
    }
  },
  computed: {
    // // 보험종목
    // _productClass () { return this.$store.getters.getCommonCodes('ProductClass') },
    // // 구분1
    // _productType1 () { return this.$store.getters.getCommonCodes('ProductType1') },
    // // 구분2
    // _productType2 () { return this.$store.getters.getCommonCodes('ProductType2') },
    // companies () { return this.$store.getters.getCompanies }
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
    getDocList () {
      const data = {}

      const apiURL = `${this.ENV_PINES}/compareProduct/doc`
      const apiSearch = location.search
      this.$Progress.start()

      this.$http({
        method: 'get',
        url: apiURL + apiSearch,
        data: data
      }).then(result => {
        this.docList = result.data
        this.$Progress.finish()
      }).catch(error => {
        console.error(error)
        this.$Progress.fail()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
