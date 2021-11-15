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
                <label for="MBTI">MBTI</label>
                <select name="MBTI" id="MBTI" v-model="idolForm.mbti">
                  <option value="ISTJ">ISTJ</option>
                  <option value="ISTP">ISTP</option>
                  <option value="ISFJ">ISFJ</option>
                  <option value="ISFP">ISFP</option>
                  <option value="INTJ">INTJ</option>
                  <option value="INTP">INTP</option>
                  <option value="INFJ">INFJ</option>
                  <option value="INFP">INFP</option>
                  <option value="ESTJ">ESTJ</option>
                  <option value="ESTP">ESTP</option>
                  <option value="ESFJ">ESFJ</option>
                  <option value="ESFP">ESFP</option>
                  <option value="ENTJ">ENTJ</option>
                  <option value="ENTP">ENTP</option>
                  <option value="ENFJ">ENFJ</option>
                  <option value="ENFP">ENFP</option>
                </select>
              </div>
            </div>

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
                <label for="그룹">그룹</label>
                <input type="text" id="그룹" v-model="idolForm.group">
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="action_wrap">
        <button class="btn primary" @click="doCreate">등록</button>
      </div>
    </div>
  </modal>
</template>

<script>
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/plugins/firebase'

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
        mbti: 'ENTP',
        history: '',
        keyword: [],
        position: '',
      }
    }
  },
  methods: {
    openEvent () {},
    closeEvent () { this.$emit('callback') },
    initData () {
      this.idolForm = {
        name: '',
        nick: '',
        company: '',
        gender: '',
        age: '',
        birthday: moment().format('1999-MM-DD'),
        country: '',
        religion: '',
        natalArea: '',
        group: '',
        mbti: 'ENTP',
        history: '',
        keyword: [],
        position: '',
      }
    },
    async doCreate () {
      await setDoc(doc(firestore, process.env.VUE_APP_FIRESTORE_COLLECTION, this.COMMON.UUID()), this.idolForm)
      this.initData()
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
