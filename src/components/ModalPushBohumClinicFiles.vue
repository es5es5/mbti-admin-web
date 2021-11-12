<template>
  <modal
    :name="'ModalPushBohumClinicFiles'"
    class="modal"
    adaptive
    reset
    draggable=".header_wrap"
    @opened="openEvent"
    @closed="closeEvent"
    :clickToClose="false"
    :width="600"
    :height="'auto'"
    >

    <div class="header_wrap">
      <h3 class="header">보험클리닉 PUSH 보내기</h3>
      <div class="closeButton" @click="$modal.hide('ModalPushBohumClinicFiles')"></div>
    </div>
    <div class="content_wrap">
      <div class="modalForm_wrap">
        <form class="form" action="post" @submit.prevent>
          <fieldset>
            <Legend>
              <template v-slot:title>고객 검색</template>
              <template v-slot:action>
                <button type="button" class="btn small" @click="getClinicCustomers">검색</button>
              </template>
            </Legend>

            <div class="modalRow row-2">
              <div class="column">
                <label for="이름">이름</label>
                <input type="text" id="이름" v-model="searchForm.name" @keyup.enter="getClinicCustomers">
              </div>
              <div class="column">
                <label for="전화번호">전화번호</label>
                <input type="text" id="전화번호" placeholder="( - ) 제외하고 입력" v-model="searchForm.phone" @keyup.enter="getClinicCustomers">
              </div>
            </div>

            <div class="modalRow row">
              <div class="table_wrap table-hover">
                <table>
                  <caption>고객 리스트</caption>
                  <colgroup>
                    <col style="width: 50px;">
                    <col style="width: 250px;">
                    <col style="width: 500px;">
                    <col style="width: 500px;">
                    <col style="width: 500px;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col"><span></span></th>
                      <th scope="col"><span>고객명</span></th>
                      <th scope="col"><span>전화번호</span></th>
                      <th scope="col"><span>User ID</span></th>
                      <th scope="col"><span>생년월일</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in customers" :key="index" class="text-center" @click="check(index)">
                      <td><input type="radio" name="customer" :id="`radio_${index}`" :value="index" v-model="checkCustomer"></td>
                      <td><span>{{ item.name }}</span></td>
                      <td><span>{{ item.phone }}</span></td>
                      <td><span>{{ item.userId }}</span></td>
                      <td><span>{{ item.birthday }}</span></td>
                    </tr>
                    <no-data-message :list="customers" :colspan="5" message="보험클리닉 APP 고객리스트에 없습니다"></no-data-message>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="modalRow row">
              <div class="column">
                <label for="title">내용</label>
                <textarea id="title" v-model="pushForm.title" />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="action_wrap">
        <button type="button" class="btn primary" @click="postSendPush">보내기</button>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: 'ModalPushBohumClinicFiles',
  created () {
  },
  mounted () {
  },
  components: {
  },
  props: {
    customerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    _width () { return parseFloat(this.width * 15) },
    _height () { return parseFloat(this.height * 15) },
    _customerId () { return this.customerId },
    _detailId () { return this.$route.params.detailId }
  },
  data () {
    return {
      // rem 으로 작성
      width: '50',
      height: '30',
      detail: {},
      videoConsult: {},
      searchForm: {
        page: 0,
        size: 1000000,
        name: '',
        phone: '',
      },
      checkCustomer: null,
      pushForm: {
        userId: 0,
        title: '',
        content: '',
        roomId: ''
      },
      customers: []
    }
  },
  methods: {
    openEvent () {
      this.getCustomerDetail()
      this.getVideoConsult()
      this.pushForm.title = `보험전문가 ${this.mixinUser.nameBase} 입니다.\n상담파일을 전송했습니다. 확인해주세요!`
      this.pushForm.content = `보험전문가 ${this.mixinUser.nameBase} 입니다.\n상담파일을 전송했습니다. 확인해주세요!`
    },
    closeEvent () { this.$emit('callback') },
    check (index) { this.checkCustomer = index },
    getCustomerDetail () {
      const apiURL = `${this.ENV_OTCSUPPORT}/customer/lists/${this._customerId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.detail = result.data.contents
        this.searchForm.name = this.detail.customerName
        this.searchForm.phone = this.detail.phone
      }).catch(error => {
        console.error(error)
      })
    },
    getVideoConsult () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/customer/${this._customerId}?searchDate=${this.COMMON.getToDate()}`
      this.$Progress.start()
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.videoConsult = result.data
        this.$Progress.finish()
      }).catch(error => {
        console.error(error)
        this.$Progress.fail()
      })
    },
    getClinicCustomers () {
      if (!this.searchForm.name && !this.searchForm.phone) {
        this.$toast.warning(
          '이름 또는 핸드폰 번호를 입력해주세요.',
          this.ToastSettings
        )
        return
      }
      const phone = this.searchForm.phone.replace(/-/g, '')
      const apiURL = `${this.ENV_PANC}/register/search`
      const apiSearch = `?name=${this.searchForm.name}&phone=${phone}&page=${this.searchForm.page}&size=${this.searchForm.size}&sort=writetime,desc&able=Y`
      this.$Progress.start()
      this.$http({
        method: 'get',
        url: apiURL + apiSearch,
        headers: {
          'auth-token': '72622bcd-46bd-4e30-a759-0b7197052fb4'
        }
      }).then(result => {
        this.customers = result.data.content
        this.checkCustomer = null
        this.$Progress.finish()
      }).catch(error => {
        console.error(error)
        this.$Progress.fail()
      })
    },
    postSendPush () {
      if (this.checkCustomer === null) {
        this.$toast.warning(
          '알림을 전송할 고객를 선택해주세요.',
          this.ToastSettings
        )
        return
      }
      const data = {
        userId: this.customers[this.checkCustomer].id,
        title: this.pushForm.title,
        content: this.pushForm.content,
        roomId: this._detailId
      }
      if (!data.userId) {
        this.$toast.warning(
          '알림을 전송할 고객를 선택해주세요.',
          this.ToastSettings
        )
        return
      } else if (!data.title) {
        this.$toast.warning(
          '전송 내용을 입력하세요.',
          this.ToastSettings
        )
        return
      }
      const apiURL = `${this.ENV_PANC}/register/send-consult-file`
      this.$Progress.start()
      this.$http({
        method: 'post',
        url: apiURL,
        data,
        headers: {
          'auth-token': '72622bcd-46bd-4e30-a759-0b7197052fb4'
        }
      }).then(result => {
        this.$toast.success(
          '전송되었습니다.',
          this.ToastSettings
        )
        this.$modal.hide('ModalPushBohumClinicFiles')
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
 .right {
   margin-top: 15px;
   float: right;
 }
//  label {
//    float: right;
//    margin-right: 1rem
//  }
</style>
