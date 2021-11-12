<template>
  <modal
    name="ModalIdolCreate"
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
      <h3 class="header">아이돌 MBTI 등록</h3>
      <div class="closeButton" @click="$modal.hide('ModalIdolCreate')"></div>
    </div>

    <div class="content_wrap">
      <div class="modalForm_wrap">
        <form action="" class="form">
          <fieldset>
            <div class="modalRow row-2">
              <div class="column column-1">
                <label for="본명">본명</label>
                <input type="text" id="본명" v-model="idolForm.name">
              </div>
              <div class="column column-1">
                <label for="예명">예명</label>
                <input type="text" id="예명" v-model="idolForm.nick">
              </div>
            </div>

            <div class="modalRow row-2">
              <div class="column column-1">
                <label for="생년월일">생년월일</label>
                <input type="date" id="생년월일" v-model="idolForm.birthday">
              </div>
              <div class="column column-1">
                <label for="성별">성별</label>
                <select name="성별" id="성별" v-model="idolForm.gender">
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                </select>
              </div>
            </div>

            <div class="modalRow row-2">
              <div class="column column-1">
                <label for="회사">회사</label>
                <input type="text" id="회사" v-model="idolForm.company">
              </div>
              <div class="column column-1">
                <label for="회사">회사</label>
                <input type="text" id="회사">
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="action_wrap">
        <button class="btn primary">등록</button>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: 'ModalIdolCreate',
  created () {
  },
  computed: {
  },
  data () {
    return {
      // rem 으로 작성
      width: '80',
      height: '43',
      idolForm: {
        name: '',
        nick: '',
        company: '',
        gender: '',
        age: '',
        birthday: moment().format('YYYY-MM-DD'),
        country: '',
        religion: '',
        natalArea: '',
        group: '',
        mbti: '',
        history: '',
        keyword: [],
        position: '',
      }
    }
  },
  methods: {
    openEvent () {},
    closeEvent () { this.$emit('callback') }
  }
}
</script>

<style lang="scss" scoped>
</style>
