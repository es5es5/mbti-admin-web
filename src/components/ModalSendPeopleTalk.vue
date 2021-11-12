<template>
  <modal
    name="ModalSendPeopleTalk"
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
      <h3 class="header">피플톡 전송</h3>
      <div class="closeButton" @click="$modal.hide('ModalSendPeopleTalk')"></div>
    </div>

    <div class="content_wrap">
      <div class="modalForm_wrap">
        <form action="" class="form">
          <fieldset>
            <div class="modalRow">
              <div class="column">
                <label for="">발신그룹</label>
                <select class="full" v-model="messageForm.messageSenderId">
                  <option value="">선택</option>
                  <option v-for="(item, index) in messageSenders" :key="index" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </div>

            <div class="modalRow">
              <div class="column">
                <label for="">발신자소속</label>
                <input type="text" v-model="senderDept" disabled>
              </div>
            </div>

            <div class="modalRow">
              <div class="column small_list">
                <label>발신대상자</label>
                <div class="list_item">
                  <ul class="">
                    <li v-for="(item, index) in sendPeopleTalk.attendeeList" :key="index">{{item.employeeInfo.nameBase}}[{{item.employeeNumber}}]</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="modalRow">
              <div class="column">
                <label>내용</label>
                <textarea v-model="messageForm.text"></textarea>
              </div>
            </div>

          </fieldset>
        </form>
      </div>
      <div class="action_wrap">
        <button class="btn primary" @click="postMessage()">전송</button>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: 'ModalSendPeopleTalk',
  created () {
  },
  props: {
    sendPeopleTalk: {
      type: Object
    }
  },
  computed: {
    _sendEmployees () { return this.sendPeopleTalk.attendeeList },
    _detailId () { return this.$route.params.detailId }
  },
  data () {
    return {
      // rem 으로 작성
      width: '80',
      height: '43',
      senderDept: '',
      messageSenders: [],
      messageForm: {
        messageSenderId: '',
        type: 'gcm',
        text: '영상 회의에 참여하세요.',
        selectFileName: '',
        uploadFileIds: '',
        reservation: '0',
        reservationTime: ''
      },
      detailInfo: []
    }
  },
  methods: {
    openEvent () {
      this.getMessageSenders()
      this.getRoom()
      this.senderDept = this.mixinUser.nameBase + ' / ' + this.mixinUser.deptName
    },
    closeEvent () {
      this.$emit('callback')
      this.sendPeopleTalk = {}
    },
    setMessage () {
      if (this._sendType === 'all') {
        this.messageForm.text = `*화상회의*\n시작시간:${this.detailInfo.conferenceStartTime}\n회의제목:${this.detailInfo.title}\n화상회의 참석하세요.`
      } else {
        this.messageForm.text = `*화상회의*\n시작시간:${this.detailInfo.conferenceStartTime}\n회의제목:${this.detailInfo.title}\n화상회의 참석하세요.`
      }
    },
    getRoom () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/detail/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.detailInfo = result.data.contents
        this.setMessage()
      }).catch(error => {
        console.log(error)
      })
    },
    getMessageSenders () {
      const data = {}

      const apiURL = `${this.ENV_PINES}/message/messageSender?sort=createtime,desc`

      this.$http({
        method: 'get',
        url: apiURL,
        data: data
      }).then(result => {
        this.messageSenders = result.data.contents
        this.getSenderUser()
      }).catch(error => {
        console.error(error)
      })
    },
    getSenderUser () {
      const data = {
        employeeNumber: this._user.employeeNumber
      }

      const apiURL = `${this.ENV_PINES}/message/messageSenderUser?employeeNumber=${data.employeeNumber}`
      this.$http({
        method: 'get',
        url: apiURL,
        data: data
      }).then(result => {
        this.messageForm.messageSenderId = result.data.contents[0].senderId
      })
    },
    postMessage () {
      if (!this.messageForm.messageSenderId | this.messageForm.text) {
        this.$toast.warning(
          '필수입력을 확인해주세요.',
          this.ToastSettings
        )
        return
      }
      const data = {
        messageSenderId: this.messageForm.messageSenderId,
        type: this.messageForm.type,
        text: this.messageForm.text,
        // messageReceiverGroupIdList: this.selectedMessageReceiverGroup.map(item => item.id).join(','),
        // messageReceiverGroupNameList: this.selectedMessageReceiverGroup.map(item => item.name).join(','),
        // messageReceiverEmployeeIdList: this.selectedMessageReceiverEmployee.map(item => item.employeeNumber).join(','),
        // messageReceiverEmployeeNameList: this.selectedMessageReceiverEmployee.map(item => item.nameBase).join(','),
        messageReceiverEmployeeIdList: this._sendEmployees.map(item => item.employeeNumber).join(','),
        messageReceiverEmployeeNameList: this._sendEmployees.map(item => item.nameBase).join(','),
        uploadFileIds: this.messageForm.uploadFileIds,
        program: '피플알림톡',
        programType: '1',
        reservation: this.messageForm.reservation === '1',
        reservationTime: new Date(this.messageForm.reservationTime)
      }

      // let apiURL = `${this.ENV_PINES}/message/message/new`
      const apiURL = `${this.ENV_PINES}/message/message`

      this.$http({
        method: 'post',
        url: apiURL,
        data: data
      }).then(result => {
        const message = data.reservation ? '메세지 전송이 예약되었습니다' : '전송되었습니다'
        this.$toast.success(
          message,
          this.ToastSettings
        )
        this.$modal.hide('ModalSendPeopleTalk')
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
