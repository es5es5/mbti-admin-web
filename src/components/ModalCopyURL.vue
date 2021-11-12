<template>
  <modal
    name="ModalCopyURL"
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
      <h3 class="header">{{copy.category}} 주소복사</h3>
      <div class="closeButton" @click="$modal.hide('ModalCopyURL')"></div>
    </div>

    <div class="content_wrap">
      <div class="modalForm_wrap">
        <form action="" class="form">
          <fieldset>
            <div class="modalRow row-4">
              <div class="column column-3">
                <label for="">주소</label>
                <input type="text" :value="copy.url" disabled>
              </div>
              <div class="column">
                <button type="button" class="btn search" @click="copyURL(copy.url)">복사</button>
              </div>
              <!-- <div class="column">
                <select name="" id="" class="full"></select>
              </div>
              <div class="column">
                <select name="" id="" class="full"></select>
              </div> -->
            </div>
            <template v-if="copy.category !== '영상회의'">
              <div class="modalRow row-4">
                <div class="column column-2">
                  <label for="">SMS전송</label>
                  <input type="text" placeholder="휴대폰 번호">
                </div>
                <div class="column">
                  <button type="button" class="btn search">전송</button>
                </div>
              </div>
            </template>
          </fieldset>
        </form>
      </div>
      <!-- <div class="action_wrap">
        <button class="btn primary">등록</button>
      </div> -->
    </div>
  </modal>
</template>

<script>
export default {
  name: 'ModalCopyURL',
  created () {
  },
  props: {
    copy: {
      type: Object,
      default: function () {
        return {
          url: '',
          category: ''
        }
      }
    }
  },
  computed: {
  },
  data () {
    return {
      // rem 으로 작성
      width: '80',
      height: '43'
    }
  },
  methods: {
    openEvent () {},
    closeEvent () { this.$emit('callback') },
    copyURL (url) {
      this.COMMON.copyClipboard(url)
      this.$toast.success(
        '클립보드에 주소를 복사하였습니다',
        this.ToastSettings
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
